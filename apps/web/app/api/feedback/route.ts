/* eslint-disable turbo/no-undeclared-env-vars */
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { getServerSession } from "@/lib/auth/server-session";

export const runtime = "nodejs";

const FEEDBACK_MIN_LENGTH = 10;
const FEEDBACK_MAX_LENGTH = 2000;
const ANONYMOUS_LIMIT = 3;
const ANONYMOUS_WINDOW_MS = 15 * 60 * 1000;

const resendApiKey = process.env.RESEND_API_KEY;
const feedbackFromEmail = process.env.FEEDBACK_FROM_EMAIL;
const feedbackToEmail = process.env.FEEDBACK_TO_EMAIL;

const resend = resendApiKey ? new Resend(resendApiKey) : null;

const feedbackSchema = z.object({
  message: z.string().trim().min(FEEDBACK_MIN_LENGTH).max(FEEDBACK_MAX_LENGTH),
  pageUrl: z.string().url(),
});

const anonymousSubmissions = new Map<string, number[]>();

type FeedbackSession = {
  user?: {
    name?: string | null;
    email?: string | null;
  };
  session?: {
    userId?: string;
  };
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function getClientIp(req: NextRequest) {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

// Checks if the given IP address has exceeded the allowed number of anonymous feedback submissions
// within a specified time window. If the IP is rate limited, returns true; otherwise, updates the tracking
// data structure and returns false. This is an in-memory, per-process implementation.
function isAnonymousRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - ANONYMOUS_WINDOW_MS;
  const existingTimestamps = anonymousSubmissions.get(ip) ?? [];
  const recentTimestamps = existingTimestamps.filter((timestamp) => timestamp > windowStart);

  if (recentTimestamps.length >= ANONYMOUS_LIMIT) {
    anonymousSubmissions.set(ip, recentTimestamps);
    return true;
  }

  recentTimestamps.push(now);
  anonymousSubmissions.set(ip, recentTimestamps);
  return false;
}

function buildFeedbackEmailHtml({
  message,
  pageUrl,
  pathname,
  timestamp,
  environment,
  authState,
  userId,
  userName,
  userEmail,
  ipAddress,
  userAgent,
}: {
  message: string;
  pageUrl: string;
  pathname: string;
  timestamp: string;
  environment: string;
  authState: "signed-in" | "anonymous";
  userId: string;
  userName: string;
  userEmail: string;
  ipAddress: string;
  userAgent: string;
}) {
  const metadataRows: Array<[string, string]> = [
    ["Timestamp", timestamp],
    ["Page", pageUrl],
    ["Path", pathname],
    ["Environment", environment],
    ["Auth state", authState],
    ["User ID", userId],
    ["User name", userName],
    ["User email", userEmail],
    ["IP address", ipAddress],
    ["User-Agent", userAgent],
  ];

  const rows = metadataRows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #d9e1ec;font-weight:600;vertical-align:top;">${escapeHtml(
          label
        )}</td><td style="padding:8px 12px;border:1px solid #d9e1ec;">${escapeHtml(value)}</td></tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#0f172a;line-height:1.5;">
      <h2 style="margin:0 0 16px;">LiteCode Feedback</h2>
      <p style="margin:0 0 12px;">A new feedback submission was received.</p>
      <div style="margin:0 0 20px;padding:16px;border:1px solid #d9e1ec;border-radius:12px;background:#f8fafc;">
        <div style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#475569;">
          Feedback message
        </div>
        <pre style="margin:0;white-space:pre-wrap;word-break:break-word;font-family:Arial,sans-serif;">${escapeHtml(
          message
        )}</pre>
      </div>
      <table style="width:100%;border-collapse:collapse;border-spacing:0;">
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

export async function POST(req: NextRequest) {
  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const websiteValue =
    typeof body === "object" && body !== null && "website" in body && typeof body.website === "string"
      ? body.website.trim()
      : "";

  if (websiteValue) {
    return NextResponse.json({ ok: true });
  }

  const parsedBody = feedbackSchema.safeParse(body);

  if (!parsedBody.success) {
    const issueMessage = parsedBody.error.issues[0]?.message;

    return NextResponse.json(
      {
        error:
          issueMessage === "Invalid url"
            ? "A valid page URL is required."
            : `Feedback must be between ${FEEDBACK_MIN_LENGTH} and ${FEEDBACK_MAX_LENGTH} characters.`,
      },
      { status: 400 }
    );
  }

  const { message, pageUrl } = parsedBody.data;
  const page = new URL(pageUrl);
  const pathname = page.pathname || "/";
  const ipAddress = getClientIp(req);
  const userAgent = req.headers.get("user-agent") || "unknown";

  let session: FeedbackSession | null = null;

  try {
    session = (await getServerSession(req)) as FeedbackSession | null;
  } catch (error) {
    console.error("Failed to load feedback session context", error);
  }

  const sessionUserId = session?.session?.userId ?? null;
  const sessionUserName = session?.user?.name ?? null;
  const sessionUserEmail = session?.user?.email ?? null;
  const userId = sessionUserId ?? "anonymous";
  const userName = sessionUserName ?? "anonymous";
  const userEmail = sessionUserEmail ?? "anonymous";
  const isSignedIn = Boolean(sessionUserId);

  if (!isSignedIn && isAnonymousRateLimited(ipAddress)) {
    return NextResponse.json(
      { error: "Too many feedback submissions. Please try again later." },
      { status: 429 }
    );
  }

  if (!resend || !feedbackFromEmail || !feedbackToEmail) {
    console.error("Feedback service is not configured.");
    return NextResponse.json({ error: "Feedback service is not configured." }, { status: 500 });
  }

  const timestamp = new Date().toISOString();
  const html = buildFeedbackEmailHtml({
    message,
    pageUrl,
    pathname,
    timestamp,
    environment: process.env.NODE_ENV || "unknown",
    authState: isSignedIn ? "signed-in" : "anonymous",
    userId,
    userName,
    userEmail,
    ipAddress,
    userAgent,
  });

  try {
    const { error } = await resend.emails.send({
      from: feedbackFromEmail,
      to: [feedbackToEmail],
      subject: `[LiteCode Feedback] ${isSignedIn ? "Signed-in" : "Anonymous"} - ${pathname}`,
      html,
      ...(sessionUserEmail ? { replyTo: sessionUserEmail } : {}),
    });

    if (error) {
      console.error("Resend feedback send failed", error);
      return NextResponse.json({ error: "Failed to send feedback." }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Feedback email request failed", error);
    return NextResponse.json({ error: "Failed to send feedback." }, { status: 500 });
  }
}
