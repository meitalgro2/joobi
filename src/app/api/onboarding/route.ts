import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";
import { saveResumeFile } from "@/lib/storage";
import {
  MAX_RESUME_SIZE_BYTES,
  SUPPORTED_RESUME_EXTENSIONS,
  SENIORITY_OPTIONS,
} from "@/lib/constants";

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const desiredRole = formData.get("desiredRole");
  const seniority = formData.get("seniority");
  const file = formData.get("file");

  if (typeof desiredRole !== "string" || !desiredRole.trim()) {
    return NextResponse.json(
      { error: "Please select your desired role." },
      { status: 400 }
    );
  }

  if (
    typeof seniority === "string" &&
    seniority &&
    !SENIORITY_OPTIONS.includes(seniority as (typeof SENIORITY_OPTIONS)[number])
  ) {
    return NextResponse.json({ error: "Invalid seniority value." }, { status: 400 });
  }

  if (file instanceof File && file.size > 0) {
    const ext = "." + (file.name.split(".").pop()?.toLowerCase() ?? "");
    if (!SUPPORTED_RESUME_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        {
          error: `Unsupported file format. Supported formats: ${SUPPORTED_RESUME_EXTENSIONS.join(
            ", "
          )}`,
        },
        { status: 400 }
      );
    }
    if (file.size > MAX_RESUME_SIZE_BYTES) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 5 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = await saveResumeFile(userId, file.name, buffer);

    await prisma.resumeVersion.create({
      data: {
        userId,
        fileName: file.name,
        filePath,
        roleCategory: desiredRole.trim(),
      },
    });
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      desiredRole: desiredRole.trim(),
      seniority: typeof seniority === "string" && seniority ? seniority : null,
      onboardingCompletedAt: new Date(),
    },
  });

  return NextResponse.json({ ok: true });
}
