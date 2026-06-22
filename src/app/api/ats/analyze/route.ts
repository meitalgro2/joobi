import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";
import { extractResumeText } from "@/lib/file-text";
import { analyzeAts } from "@/lib/ats";
import {
  MAX_RESUME_SIZE_BYTES,
  SUPPORTED_RESUME_EXTENSIONS,
} from "@/lib/constants";

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const file = formData.get("file");
  const resumeVersionId = formData.get("resumeVersionId");
  const jobDescription = formData.get("jobDescription");

  if (typeof jobDescription !== "string" || !jobDescription.trim()) {
    return NextResponse.json(
      { error: "Please provide a job description before continuing." },
      { status: 400 }
    );
  }

  let buffer: Buffer;
  let fileName: string;
  let extractionName: string;

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
    buffer = Buffer.from(await file.arrayBuffer());
    fileName = file.name;
    extractionName = file.name;
  } else if (typeof resumeVersionId === "string" && resumeVersionId) {
    const resume = await prisma.resumeVersion.findFirst({
      where: { id: resumeVersionId, userId },
    });
    if (!resume) {
      return NextResponse.json(
        { error: "Selected resume version was not found." },
        { status: 404 }
      );
    }
    try {
      buffer = await readFile(path.join(process.cwd(), resume.filePath));
    } catch {
      return NextResponse.json(
        {
          error:
            "This saved resume's file is missing from storage. Please re-upload it and try again.",
        },
        { status: 404 }
      );
    }
    fileName = resume.fileName;
    extractionName = resume.filePath;
  } else {
    return NextResponse.json(
      { error: "Please upload a resume before continuing." },
      { status: 400 }
    );
  }

  let resumeText: string;
  try {
    resumeText = await extractResumeText(buffer, extractionName);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Could not read this resume file.";
    return NextResponse.json({ error: message }, { status: 422 });
  }

  if (!resumeText.trim()) {
    return NextResponse.json(
      {
        error:
          "We couldn't extract any text from this resume. Try a different file.",
      },
      { status: 422 }
    );
  }

  let result;
  try {
    result = analyzeAts(resumeText, jobDescription);
  } catch {
    return NextResponse.json(
      { error: "Could not analyze this resume against the job description. Please try again." },
      { status: 500 }
    );
  }

  const analysis = await prisma.atsAnalysis.create({
    data: {
      userId,
      resumeFileName: fileName,
      jobDescription,
      score: result.score,
      explanation: result.explanation,
      strengths: JSON.stringify(result.strengths),
      gaps: JSON.stringify(result.gaps),
    },
  });

  return NextResponse.json({
    analysis: {
      id: analysis.id,
      resumeFileName: analysis.resumeFileName,
      score: result.score,
      explanation: result.explanation,
      strengths: result.strengths,
      gaps: result.gaps,
    },
  });
}
