import {
  Prisma,
  PrismaClient,
  SubmissionResult,
} from "@prisma/client";
import { MongoClient, ObjectId } from "mongodb";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

type CollectionName =
  | "users"
  | "sessions"
  | "accounts"
  | "verifications"
  | "problems"
  | "submissions";

type SourceCounts = Record<CollectionName, number>;
type SourceChecksums = Record<CollectionName, string>;

interface CliOptions {
  execute: boolean;
  batchSize: number;
  snapshotDir: string;
  requireEmptyTarget: boolean;
}

interface MongoUser {
  _id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  name: string;
  type?: string;
  email: string;
  emailVerified: boolean;
  image?: string;
}

interface MongoSession {
  _id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  expiresAt: Date;
  token: string;
  ipAddress?: string;
  userAgent?: string;
  impersonatedBy?: string;
  userId: ObjectId;
}

interface MongoAccount {
  _id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  accountId: string;
  providerId: string;
  accessToken?: string;
  refreshToken?: string;
  idToken?: string;
  accessTokenExpiresAt?: Date;
  refreshTokenExpiresAt?: Date;
  scope?: string;
  password?: string;
  userId: ObjectId;
}

interface MongoVerification {
  _id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  identifier: string;
  value: string;
  expiresAt: Date;
}

interface MongoProblem {
  _id: ObjectId;
  tags?: string[];
  title: string;
  difficulty: string;
  constraints?: string[];
  description: string;
  testCases?: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  slug: string;
  type?: string;
  solved?: number;
  visibleTestCases?: Array<{ input: string; output: string }>;
  hiddenTestCases?: Array<{ input: string; output: string }>;
  functionCode?: Array<{ language: string; code: string }>;
  completeCode?: Array<{ language: string; code: string }>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface MongoSubmission {
  _id: ObjectId;
  code: string;
  languageId: number;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
  judgetokens?: string[];
  max_cpu_time?: number | null;
  max_memory?: number | null;
  problemId: ObjectId;
  userId: ObjectId;
}

interface SourceData {
  users: MongoUser[];
  sessions: MongoSession[];
  accounts: MongoAccount[];
  verifications: MongoVerification[];
  problems: MongoProblem[];
  submissions: MongoSubmission[];
}

const DEFAULT_BATCH_SIZE = 200;
const DEFAULT_SNAPSHOT_DIR = "./migration-artifacts/mongo-to-postgres";
const COLLECTIONS: CollectionName[] = [
  "users",
  "sessions",
  "accounts",
  "verifications",
  "problems",
  "submissions",
];

const requiredEnv = (name: string) => {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const parseBooleanFlag = (value: string, flagName: string) => {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error(`Invalid value for ${flagName}: ${value}. Use true or false.`);
};

const parseArgs = (argv: string[]): CliOptions => {
  let execute = false;
  let batchSize = DEFAULT_BATCH_SIZE;
  let snapshotDir = DEFAULT_SNAPSHOT_DIR;
  let requireEmptyTarget = true;

  for (const arg of argv) {
    if (arg === "--execute") {
      execute = true;
      continue;
    }
    if (arg === "--dry-run") {
      execute = false;
      continue;
    }
    if (arg.startsWith("--batch-size=")) {
      const parsed = Number(arg.split("=")[1]);
      if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error("Invalid --batch-size. It must be a positive integer.");
      }
      batchSize = parsed;
      continue;
    }
    if (arg.startsWith("--snapshot-dir=")) {
      const value = arg.split("=")[1];
      if (!value) {
        throw new Error("Invalid --snapshot-dir. It cannot be empty.");
      }
      snapshotDir = value;
      continue;
    }
    if (arg.startsWith("--require-empty-target=")) {
      requireEmptyTarget = parseBooleanFlag(
        arg.split("=")[1] ?? "",
        "--require-empty-target"
      );
      continue;
    }
    if (arg === "--help") {
      console.log(`MongoDB -> PostgreSQL migration

Usage:
  bun run scripts/migrate-mongo-to-postgres.ts [--dry-run] [--execute]
    [--batch-size=200]
    [--snapshot-dir=./migration-artifacts/mongo-to-postgres]
    [--require-empty-target=true]

Required environment variables:
  MIGRATION_SOURCE_MONGODB_URI
  MIGRATION_SOURCE_MONGODB_DB
  DATABASE_URL
`);
      process.exit(0);
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  return { execute, batchSize, snapshotDir, requireEmptyTarget };
};

const stringifyStable = (value: unknown): string => {
  const normalize = (input: unknown): unknown => {
    if (input instanceof Date) return input.toISOString();
    if (input instanceof ObjectId) return input.toHexString();
    if (Array.isArray(input)) return input.map(normalize);
    if (input && typeof input === "object") {
      const entries = Object.entries(input as Record<string, unknown>).sort(
        ([a], [b]) => a.localeCompare(b)
      );
      return Object.fromEntries(entries.map(([k, v]) => [k, normalize(v)]));
    }
    return input;
  };

  return JSON.stringify(normalize(value), null, 2);
};

const sha256 = (value: string) =>
  createHash("sha256").update(value).digest("hex");

const deterministicUuid = (namespace: string, rawValue: string): string => {
  const bytes = createHash("sha256")
    .update(`${namespace}:${rawValue}`)
    .digest()
    .subarray(0, 16);

  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  const hex = Buffer.from(bytes).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16
  )}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
};

const normalizeMongoUri = (uri: string, dbName: string): string => {
  const parsed = new URL(uri);
  if (!parsed.pathname || parsed.pathname === "/") {
    parsed.pathname = `/${dbName}`;
  }
  return parsed.toString();
};

const nowOr = (value: Date | undefined) => value ?? new Date();
const asNullableJson = (
  value: Prisma.InputJsonValue | null | undefined
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput =>
  value == null ? Prisma.JsonNull : value;

const validateUnique = (
  values: string[],
  label: string,
  transform?: (v: string) => string
) => {
  const seen = new Set<string>();
  for (const raw of values) {
    const value = transform ? transform(raw) : raw;
    if (seen.has(value)) {
      throw new Error(`Duplicate ${label} found in source data: ${value}`);
    }
    seen.add(value);
  }
};

const accountKey = (providerId: string, accountId: string) =>
  `${providerId}:${accountId}`;

const verificationKey = (
  identifier: string,
  value: string,
  expiresAt: Date
) => `${identifier}:${value}:${expiresAt.toISOString()}`;

const validateSourceData = (source: SourceData) => {
  const userIds = new Set(source.users.map((u) => u._id.toHexString()));
  const problemIds = new Set(source.problems.map((p) => p._id.toHexString()));

  validateUnique(source.users.map((u) => u.email), "user.email", (v) =>
    v.toLowerCase()
  );
  validateUnique(source.problems.map((p) => p.slug), "problem.slug");
  validateUnique(source.sessions.map((s) => s.token), "session.token");
  validateUnique(
    source.accounts.map((a) => `${a.providerId}:${a.accountId}`),
    "account(providerId,accountId)"
  );

  const danglingSessions = source.sessions.filter(
    (s) => !userIds.has(s.userId.toHexString())
  );
  const danglingAccounts = source.accounts.filter(
    (a) => !userIds.has(a.userId.toHexString())
  );
  const danglingSubmissionUsers = source.submissions.filter(
    (s) => !userIds.has(s.userId.toHexString())
  );
  const danglingSubmissionProblems = source.submissions.filter(
    (s) => !problemIds.has(s.problemId.toHexString())
  );

  if (
    danglingSessions.length > 0 ||
    danglingAccounts.length > 0 ||
    danglingSubmissionUsers.length > 0 ||
    danglingSubmissionProblems.length > 0
  ) {
    throw new Error(
      `Source integrity check failed (dangling references): sessions=${danglingSessions.length}, accounts=${danglingAccounts.length}, submissionUsers=${danglingSubmissionUsers.length}, submissionProblems=${danglingSubmissionProblems.length}`
    );
  }
};

const resolveCollectionName = async (
  mongoDb: ReturnType<MongoClient["db"]>,
  candidates: string[]
) => {
  const existing = new Set(
    (await mongoDb.listCollections({}, { nameOnly: true }).toArray()).map(
      (collection) => collection.name
    )
  );

  for (const candidate of candidates) {
    if (existing.has(candidate)) return candidate;
  }

  return candidates[0]!;
};

const loadSourceData = async (mongoDb: ReturnType<MongoClient["db"]>) => {
  const [usersCollection, sessionsCollection, accountsCollection, verificationsCollection, problemsCollection, submissionsCollection] =
    await Promise.all([
      resolveCollectionName(mongoDb, ["users", "User"]),
      resolveCollectionName(mongoDb, ["sessions", "Session"]),
      resolveCollectionName(mongoDb, ["accounts", "Account"]),
      resolveCollectionName(mongoDb, ["verifications", "Verification"]),
      resolveCollectionName(mongoDb, ["problems", "Problem"]),
      resolveCollectionName(mongoDb, ["submissions", "Submission"]),
    ]);

  console.log("Resolved Mongo collections:", {
    usersCollection,
    sessionsCollection,
    accountsCollection,
    verificationsCollection,
    problemsCollection,
    submissionsCollection,
  });

  const users = (await mongoDb
    .collection<MongoUser>(usersCollection)
    .find({})
    .sort({ _id: 1 })
    .toArray()) as MongoUser[];
  const sessions = (await mongoDb
    .collection<MongoSession>(sessionsCollection)
    .find({})
    .sort({ _id: 1 })
    .toArray()) as MongoSession[];
  const accounts = (await mongoDb
    .collection<MongoAccount>(accountsCollection)
    .find({})
    .sort({ _id: 1 })
    .toArray()) as MongoAccount[];
  const verifications = (await mongoDb
    .collection<MongoVerification>(verificationsCollection)
    .find({})
    .sort({ _id: 1 })
    .toArray()) as MongoVerification[];
  const problems = (await mongoDb
    .collection<MongoProblem>(problemsCollection)
    .find({})
    .sort({ _id: 1 })
    .toArray()) as MongoProblem[];
  const submissions = (await mongoDb
    .collection<MongoSubmission>(submissionsCollection)
    .find({})
    .sort({ _id: 1 })
    .toArray()) as MongoSubmission[];

  const source: SourceData = {
    users,
    sessions,
    accounts,
    verifications,
    problems,
    submissions,
  };

  const counts: SourceCounts = {
    users: users.length,
    sessions: sessions.length,
    accounts: accounts.length,
    verifications: verifications.length,
    problems: problems.length,
    submissions: submissions.length,
  };

  return { source, counts };
};

const writeSnapshot = async (
  source: SourceData,
  counts: SourceCounts,
  snapshotDir: string
) => {
  const absoluteSnapshotDir = resolve(snapshotDir);
  await mkdir(absoluteSnapshotDir, { recursive: true });

  const checksums = {} as SourceChecksums;

  for (const collection of COLLECTIONS) {
    const serialized = stringifyStable(source[collection]);
    checksums[collection] = sha256(serialized);
    await writeFile(
      resolve(absoluteSnapshotDir, `${collection}.json`),
      `${serialized}\n`,
      "utf8"
    );
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    counts,
    checksums,
  };

  await writeFile(
    resolve(absoluteSnapshotDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
    "utf8"
  );

  return { checksums, absoluteSnapshotDir };
};

const getTargetCounts = async (prisma: PrismaClient): Promise<SourceCounts> => {
  const [users, sessions, accounts, verifications, problems, submissions] =
    await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
      prisma.account.count(),
      prisma.verification.count(),
      prisma.problem.count(),
      prisma.submission.count(),
    ]);

  return {
    users,
    sessions,
    accounts,
    verifications,
    problems,
    submissions,
  };
};

const assertTargetEmpty = async (prisma: PrismaClient) => {
  const counts = await getTargetCounts(prisma);
  const nonEmpty = Object.entries(counts).filter(([, count]) => count > 0);
  if (nonEmpty.length > 0) {
    const formatted = nonEmpty.map(([name, count]) => `${name}=${count}`).join(", ");
    throw new Error(
      `Target database is not empty. Refusing to run migration: ${formatted}`
    );
  }
};

const mapSubmissionStatus = (value: string | undefined): SubmissionResult => {
  if (!value) return SubmissionResult.PENDING;
  const normalized = value.toUpperCase().replace(/\s+/g, "");
  const map: Record<string, SubmissionResult> = {
    ACCEPTED: SubmissionResult.ACCEPTED,
    REJECTED: SubmissionResult.REJECTED,
    PENDING: SubmissionResult.PENDING,
    TLE: SubmissionResult.TLE,
    COMPILATIONERROR: SubmissionResult.COMPILATIONERROR,
    RUNTIMEERROR: SubmissionResult.RUNTIMEERROR,
    INTERNALERROR: SubmissionResult.INTERNALERROR,
    WRONGANSWER: SubmissionResult.REJECTED,
    TIMELIMITEXCEEDED: SubmissionResult.TLE,
  };
  return map[normalized] ?? SubmissionResult.INTERNALERROR;
};

const createManyInBatches = async <T>(
  label: string,
  rows: T[],
  batchSize: number,
  writer: (batch: T[]) => Promise<unknown>
) => {
  if (rows.length === 0) {
    console.log(`${label}: 0`);
    return;
  }

  console.log(`${label}: ${rows.length}`);
  for (let index = 0; index < rows.length; index += batchSize) {
    const batch = rows.slice(index, index + batchSize);
    await writer(batch);
  }
};

const parseSqlCount = (row: { count: unknown } | undefined): number => {
  if (!row) return 0;
  if (typeof row.count === "number") return row.count;
  if (typeof row.count === "bigint") return Number(row.count);
  if (typeof row.count === "string") return Number(row.count);
  return 0;
};

const verifyTargetIntegrity = async (prisma: PrismaClient) => {
  const [
    submissionUserOrphans,
    submissionProblemOrphans,
    sessionUserOrphans,
    accountUserOrphans,
  ] = await Promise.all([
    prisma.$queryRaw<{ count: unknown }[]>`
      SELECT COUNT(*)::int AS count
      FROM "Submission" s
      LEFT JOIN "users" u ON s."userId" = u."id"
      WHERE u."id" IS NULL
    `,
    prisma.$queryRaw<{ count: unknown }[]>`
      SELECT COUNT(*)::int AS count
      FROM "Submission" s
      LEFT JOIN "Problem" p ON s."problemId" = p."id"
      WHERE p."id" IS NULL
    `,
    prisma.$queryRaw<{ count: unknown }[]>`
      SELECT COUNT(*)::int AS count
      FROM "sessions" s
      LEFT JOIN "users" u ON s."userId" = u."id"
      WHERE u."id" IS NULL
    `,
    prisma.$queryRaw<{ count: unknown }[]>`
      SELECT COUNT(*)::int AS count
      FROM "accounts" a
      LEFT JOIN "users" u ON a."userId" = u."id"
      WHERE u."id" IS NULL
    `,
  ]);

  const orphanSummary = {
    submissionUser: parseSqlCount(submissionUserOrphans[0]),
    submissionProblem: parseSqlCount(submissionProblemOrphans[0]),
    sessionUser: parseSqlCount(sessionUserOrphans[0]),
    accountUser: parseSqlCount(accountUserOrphans[0]),
  };

  const totalOrphans = Object.values(orphanSummary).reduce(
    (sum, value) => sum + value,
    0
  );

  if (totalOrphans > 0) {
    throw new Error(
      `Target integrity check failed: ${JSON.stringify(orphanSummary)}`
    );
  }
};

const ensureCountsMatch = (source: SourceCounts, target: SourceCounts) => {
  const mismatches = COLLECTIONS.filter(
    (collection) => source[collection] !== target[collection]
  );

  if (mismatches.length === 0) return;

  const details = mismatches
    .map(
      (collection) =>
        `${collection}: source=${source[collection]}, target=${target[collection]}`
    )
    .join(", ");
  throw new Error(`Count verification failed: ${details}`);
};

const ensureCountsNotLowerThanSource = (
  source: SourceCounts,
  target: SourceCounts
) => {
  const mismatches = COLLECTIONS.filter(
    (collection) => target[collection] < source[collection]
  );
  if (mismatches.length === 0) return;

  const details = mismatches
    .map(
      (collection) =>
        `${collection}: source=${source[collection]}, target=${target[collection]}`
    )
    .join(", ");
  throw new Error(`Target has fewer rows than source: ${details}`);
};

const countExistingIds = async (
  ids: string[],
  counter: (batch: string[]) => Promise<number>,
  batchSize: number
) => {
  let total = 0;
  for (let index = 0; index < ids.length; index += batchSize) {
    total += await counter(ids.slice(index, index + batchSize));
  }
  return total;
};

const verifySourceIdsPresent = async (
  prisma: PrismaClient,
  ids: Record<CollectionName, string[]>,
  batchSize: number
) => {
  const [users, sessions, accounts, verifications, problems, submissions] =
    await Promise.all([
      countExistingIds(
        ids.users,
        (batch) => prisma.user.count({ where: { id: { in: batch } } }),
        batchSize
      ),
      countExistingIds(
        ids.sessions,
        (batch) => prisma.session.count({ where: { id: { in: batch } } }),
        batchSize
      ),
      countExistingIds(
        ids.accounts,
        (batch) => prisma.account.count({ where: { id: { in: batch } } }),
        batchSize
      ),
      countExistingIds(
        ids.verifications,
        (batch) => prisma.verification.count({ where: { id: { in: batch } } }),
        batchSize
      ),
      countExistingIds(
        ids.problems,
        (batch) => prisma.problem.count({ where: { id: { in: batch } } }),
        batchSize
      ),
      countExistingIds(
        ids.submissions,
        (batch) => prisma.submission.count({ where: { id: { in: batch } } }),
        batchSize
      ),
    ]);

  const found: SourceCounts = {
    users,
    sessions,
    accounts,
    verifications,
    problems,
    submissions,
  };

  ensureCountsMatch(
    {
      users: ids.users.length,
      sessions: ids.sessions.length,
      accounts: ids.accounts.length,
      verifications: ids.verifications.length,
      problems: ids.problems.length,
      submissions: ids.submissions.length,
    },
    found
  );
};

const unique = (items: string[]) => Array.from(new Set(items));

const run = async () => {
  const options = parseArgs(process.argv.slice(2));
  const sourceMongoDb = requiredEnv("MIGRATION_SOURCE_MONGODB_DB");
  const sourceMongoUri = normalizeMongoUri(
    requiredEnv("MIGRATION_SOURCE_MONGODB_URI"),
    sourceMongoDb
  );
  requiredEnv("DATABASE_URL");

  console.log("Migration mode:", options.execute ? "EXECUTE" : "DRY-RUN");
  console.log("Snapshot directory:", resolve(options.snapshotDir));
  console.log("Batch size:", options.batchSize);
  console.log("Require empty target:", options.requireEmptyTarget);

  const mongoClient = new MongoClient(sourceMongoUri);
  const prisma = new PrismaClient();

  try {
    await mongoClient.connect();
    const mongoDb = mongoClient.db(sourceMongoDb);

    const { source, counts } = await loadSourceData(mongoDb);
    validateSourceData(source);

    const { checksums, absoluteSnapshotDir } = await writeSnapshot(
      source,
      counts,
      options.snapshotDir
    );

    console.log("Source counts:", counts);
    console.log("Snapshot checksums:", checksums);
    console.log("Snapshot written to:", absoluteSnapshotDir);

    if (!options.execute) {
      console.log("Dry-run complete. No rows were written to PostgreSQL.");
      return;
    }

    if (options.requireEmptyTarget) {
      await assertTargetEmpty(prisma);
    }

    const existingUserIdByEmail = new Map<string, string>();
    const existingProblemIdBySlug = new Map<string, string>();
    const existingSessionIdByToken = new Map<string, string>();
    const existingAccountIdByKey = new Map<string, string>();
    const existingVerificationIdByKey = new Map<string, string>();

    if (!options.requireEmptyTarget) {
      const [
        existingUsers,
        existingProblems,
        existingSessions,
        existingAccounts,
        existingVerifications,
      ] = await Promise.all([
        prisma.user.findMany({ select: { id: true, email: true } }),
        prisma.problem.findMany({ select: { id: true, slug: true } }),
        prisma.session.findMany({ select: { id: true, token: true } }),
        prisma.account.findMany({
          select: { id: true, providerId: true, accountId: true },
        }),
        prisma.verification.findMany({
          select: { id: true, identifier: true, value: true, expiresAt: true },
        }),
      ]);

      for (const row of existingUsers) {
        existingUserIdByEmail.set(row.email.toLowerCase(), row.id);
      }
      for (const row of existingProblems) {
        existingProblemIdBySlug.set(row.slug, row.id);
      }
      for (const row of existingSessions) {
        existingSessionIdByToken.set(row.token, row.id);
      }
      for (const row of existingAccounts) {
        existingAccountIdByKey.set(
          accountKey(row.providerId, row.accountId),
          row.id
        );
      }
      for (const row of existingVerifications) {
        existingVerificationIdByKey.set(
          verificationKey(row.identifier, row.value, row.expiresAt),
          row.id
        );
      }
    }

    const userIdMap = new Map<string, string>();
    const problemIdMap = new Map<string, string>();
    const mappedSourceIds: Record<CollectionName, string[]> = {
      users: [],
      sessions: [],
      accounts: [],
      verifications: [],
      problems: [],
      submissions: [],
    };

    const usersData: Prisma.UserCreateManyInput[] = [];
    for (const user of source.users) {
      const mongoId = user._id.toHexString();
      const existingId = existingUserIdByEmail.get(user.email.toLowerCase());
      const mappedId = existingId ?? deterministicUuid("users", mongoId);
      userIdMap.set(mongoId, mappedId);
      mappedSourceIds.users.push(mappedId);

      if (existingId) {
        continue;
      }

      usersData.push({
        id: mappedId,
        createdAt: nowOr(user.createdAt),
        updatedAt: nowOr(user.updatedAt),
        name: user.name,
        type: user.type ?? "user",
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image ?? null,
      });
    }

    const problemsData: Prisma.ProblemCreateManyInput[] = [];
    for (const problem of source.problems) {
      const mongoId = problem._id.toHexString();
      const existingId = existingProblemIdBySlug.get(problem.slug);
      const mappedId = existingId ?? deterministicUuid("problems", mongoId);
      problemIdMap.set(mongoId, mappedId);
      mappedSourceIds.problems.push(mappedId);

      if (existingId) {
        continue;
      }

      problemsData.push({
        id: mappedId,
        tags: problem.tags ?? [],
        title: problem.title,
        difficulty: problem.difficulty,
        constraints: problem.constraints ?? [],
        description: problem.description,
        testCases: asNullableJson(
          (problem.testCases ?? null) as Prisma.InputJsonValue | null
        ),
        slug: problem.slug,
        type: problem.type ?? "None",
        solved: problem.solved ?? 0,
        visibleTestCases: asNullableJson(
          (problem.visibleTestCases ?? null) as Prisma.InputJsonValue | null
        ),
        hiddenTestCases: asNullableJson(
          (problem.hiddenTestCases ?? null) as Prisma.InputJsonValue | null
        ),
        functionCode: asNullableJson(
          (problem.functionCode ?? null) as Prisma.InputJsonValue | null
        ),
        completeCode: asNullableJson(
          (problem.completeCode ?? null) as Prisma.InputJsonValue | null
        ),
        createdAt: nowOr(problem.createdAt),
        updatedAt: nowOr(problem.updatedAt),
      });
    }

    const sessionsData: Prisma.SessionCreateManyInput[] = [];
    for (const session of source.sessions) {
      const userId = userIdMap.get(session.userId.toHexString());
      if (!userId) {
        throw new Error(`Session ${session._id.toHexString()} references missing user`);
      }

      const existingId = existingSessionIdByToken.get(session.token);
      const mappedId = existingId ?? deterministicUuid("sessions", session._id.toHexString());
      mappedSourceIds.sessions.push(mappedId);

      if (existingId) {
        continue;
      }

      sessionsData.push({
        id: mappedId,
        createdAt: nowOr(session.createdAt),
        updatedAt: nowOr(session.updatedAt),
        expiresAt: session.expiresAt,
        token: session.token,
        ipAddress: session.ipAddress ?? null,
        userAgent: session.userAgent ?? null,
        impersonatedBy: session.impersonatedBy ?? null,
        userId,
      });
    }

    const accountsData: Prisma.AccountCreateManyInput[] = [];
    for (const account of source.accounts) {
      const userId = userIdMap.get(account.userId.toHexString());
      if (!userId) {
        throw new Error(`Account ${account._id.toHexString()} references missing user`);
      }

      const existingId = existingAccountIdByKey.get(
        accountKey(account.providerId, account.accountId)
      );
      const mappedId = existingId ?? deterministicUuid("accounts", account._id.toHexString());
      mappedSourceIds.accounts.push(mappedId);

      if (existingId) {
        continue;
      }

      accountsData.push({
        id: mappedId,
        createdAt: nowOr(account.createdAt),
        updatedAt: nowOr(account.updatedAt),
        accountId: account.accountId,
        providerId: account.providerId,
        accessToken: account.accessToken ?? null,
        refreshToken: account.refreshToken ?? null,
        idToken: account.idToken ?? null,
        accessTokenExpiresAt: account.accessTokenExpiresAt ?? null,
        refreshTokenExpiresAt: account.refreshTokenExpiresAt ?? null,
        scope: account.scope ?? null,
        password: account.password ?? null,
        userId,
      });
    }

    const verificationsData: Prisma.VerificationCreateManyInput[] = [];
    for (const verification of source.verifications) {
      const existingId = existingVerificationIdByKey.get(
        verificationKey(
          verification.identifier,
          verification.value,
          verification.expiresAt
        )
      );
      const mappedId =
        existingId ?? deterministicUuid("verifications", verification._id.toHexString());
      mappedSourceIds.verifications.push(mappedId);

      if (existingId) {
        continue;
      }

      verificationsData.push({
        id: mappedId,
        createdAt: verification.createdAt ?? null,
        updatedAt: verification.updatedAt ?? null,
        identifier: verification.identifier,
        value: verification.value,
        expiresAt: verification.expiresAt,
      });
    }

    const submissionsData: Prisma.SubmissionCreateManyInput[] = [];
    for (const submission of source.submissions) {
      const userId = userIdMap.get(submission.userId.toHexString());
      const problemId = problemIdMap.get(submission.problemId.toHexString());
      if (!userId) {
        throw new Error(`Submission ${submission._id.toHexString()} references missing user`);
      }
      if (!problemId) {
        throw new Error(
          `Submission ${submission._id.toHexString()} references missing problem`
        );
      }

      const mappedId = deterministicUuid("submissions", submission._id.toHexString());
      mappedSourceIds.submissions.push(mappedId);

      submissionsData.push({
        id: mappedId,
        code: submission.code,
        languageId: submission.languageId,
        status: mapSubmissionStatus(submission.status),
        createdAt: nowOr(submission.createdAt),
        updatedAt: nowOr(submission.updatedAt),
        judgetokens: submission.judgetokens ?? [],
        max_cpu_time: submission.max_cpu_time ?? -1,
        max_memory: submission.max_memory ?? -1,
        userId,
        problemId,
      });
    }

    await createManyInBatches("Insert users", usersData, options.batchSize, (b) =>
      prisma.user.createMany({ data: b, skipDuplicates: true })
    );
    await createManyInBatches(
      "Insert problems",
      problemsData,
      options.batchSize,
      (b) => prisma.problem.createMany({ data: b, skipDuplicates: true })
    );
    await createManyInBatches(
      "Insert sessions",
      sessionsData,
      options.batchSize,
      (b) => prisma.session.createMany({ data: b, skipDuplicates: true })
    );
    await createManyInBatches(
      "Insert accounts",
      accountsData,
      options.batchSize,
      (b) => prisma.account.createMany({ data: b, skipDuplicates: true })
    );
    await createManyInBatches(
      "Insert verifications",
      verificationsData,
      options.batchSize,
      (b) => prisma.verification.createMany({ data: b, skipDuplicates: true })
    );
    await createManyInBatches(
      "Insert submissions",
      submissionsData,
      options.batchSize,
      (b) => prisma.submission.createMany({ data: b, skipDuplicates: true })
    );

    const targetCounts = await getTargetCounts(prisma);
    if (options.requireEmptyTarget) {
      ensureCountsMatch(counts, targetCounts);
    } else {
      ensureCountsNotLowerThanSource(counts, targetCounts);
    }
    await verifySourceIdsPresent(
      prisma,
      {
        users: unique(mappedSourceIds.users),
        sessions: unique(mappedSourceIds.sessions),
        accounts: unique(mappedSourceIds.accounts),
        verifications: unique(mappedSourceIds.verifications),
        problems: unique(mappedSourceIds.problems),
        submissions: unique(mappedSourceIds.submissions),
      },
      options.batchSize
    );
    await verifyTargetIntegrity(prisma);

    await writeFile(
      resolve(options.snapshotDir, "migration-result.json"),
      `${JSON.stringify(
        {
          executedAt: new Date().toISOString(),
          sourceCounts: counts,
          targetCounts,
          status: "success",
        },
        null,
        2
      )}\n`,
      "utf8"
    );

    console.log("Migration completed successfully.");
    console.log("Target counts:", targetCounts);
  } finally {
    await mongoClient.close();
    await prisma.$disconnect();
  }
};

run().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
