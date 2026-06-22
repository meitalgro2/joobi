import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";
import { saveResumeFile } from "@/lib/storage";
import {
  MAX_RESUME_SIZE_BYTES,
  SUPPORTED_RESUME_EXTENSIONS,
} from "@/lib/constants";

export async function GET() {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  const resumes = await prisma.resumeVersion.findMany({
    where: { userId },
    orderBy: { uploadedAt: "desc" },
  });

  return NextResponse.json({ resumes });
}

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const name = formData.get("name");
  const roleCategory = formData.get("roleCategory");
  const notes = formData.get("notes");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Please choose a resume file to upload." },
      { status: 400 }
    );
  }

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json(
      { error: "Resume name is required." },
      { status: 400 }
    );
  }

  if (typeof roleCategory !== "string" || !roleCategory.trim()) {
    return NextResponse.json(
      { error: "Role/category is required." },
      { status: 400 }
    );
  }

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

  const resume = await prisma.resumeVersion.create({
    data: {
      userId,
      fileName: name.trim(),
      filePath,
      roleCategory: roleCategory.trim(),
      notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
    },
  });

  return NextResponse.json({ resume }, { status: 201 });
}
