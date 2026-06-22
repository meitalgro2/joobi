import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";
import { deleteResumeFile } from "@/lib/storage";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;
  const { id } = await params;

  const resume = await prisma.resumeVersion.findFirst({ where: { id, userId } });
  if (!resume) {
    return NextResponse.json({ error: "Resume not found." }, { status: 404 });
  }

  await prisma.resumeVersion.delete({ where: { id } });
  await deleteResumeFile(resume.filePath);

  return NextResponse.json({ ok: true });
}
