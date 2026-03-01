import { NextResponse } from "next/server";
import { db } from "@repo/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const title = (body?.title ?? "").toString().trim();
    const slug = (body?.slug ?? "").toString().trim();
    const description = (body?.description ?? "").toString().trim();
    const editorial = (body?.editorial ?? "").toString().trim();

    if (!title || !slug || !description || !editorial) {
      return NextResponse.json(
        { error: "title, slug, description, and editorial are required" },
        { status: 400 }
      );
    }

    const difficulty = (body?.difficulty ?? "Easy").toString();
    const type = (body?.type ?? "None").toString();

    const tags: string[] = Array.isArray(body?.tags)
      ? body.tags.map((t: unknown) => (t ?? "").toString()).filter(Boolean)
      : [];

    const constraints: string[] = Array.isArray(body?.constraints)
      ? body.constraints.map((c: unknown) => (c ?? "").toString()).filter(Boolean)
      : [];

    const testCases: { input: string; output: string; explanation: string }[] =
      Array.isArray(body?.testCases)
        ? body.testCases.map((tc: any) => ({
            input: (tc?.input ?? "").toString(),
            output: (tc?.output ?? "").toString(),
            explanation: (tc?.explanation ?? "").toString(),
          }))
        : [];

    const visibleTestCases: { input: string; output: string }[] =
      Array.isArray(body?.visibleTestCases)
        ? body.visibleTestCases.map((tc: any) => ({
            input: (tc?.input ?? "").toString(),
            output: (tc?.output ?? "").toString(),
          }))
        : [];

    const hiddenTestCases: { input: string; output: string }[] =
      Array.isArray(body?.hiddenTestCases)
        ? body.hiddenTestCases.map((tc: any) => ({
            input: (tc?.input ?? "").toString(),
            output: (tc?.output ?? "").toString(),
          }))
        : [];

    const functionCode: { language: string; code: string }[] =
      Array.isArray(body?.functionCode)
        ? body.functionCode.map((fc: any) => ({
            language: (fc?.language ?? "cpp").toString(),
            code: (fc?.code ?? "").toString(),
          }))
        : [];

    const completeCode: { language: string; code: string }[] =
      Array.isArray(body?.completeCode)
        ? body.completeCode.map((fc: any) => ({
            language: (fc?.language ?? "cpp").toString(),
            code: (fc?.code ?? "").toString(),
          }))
        : [];

    // Ensure unique slug
    const existing = await db.problem.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json(
        { error: "A problem with this slug already exists" },
        { status: 409 }
      );
    }

    const created = await db.problem.create({
      data: {
        title,
        slug,
        description,
        editorial,
        difficulty,
        type,
        tags,
        constraints,
        testCases,
        visibleTestCases,
        hiddenTestCases,
        functionCode,
        completeCode,
      },
      select: { id: true, slug: true, title: true },
    });

    return NextResponse.json({ ok: true, problem: created }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create problem", details: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
