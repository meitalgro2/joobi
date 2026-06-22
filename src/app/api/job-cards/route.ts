import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";
import { STAGES } from "@/lib/constants";

export async function GET() {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  const jobCards = await prisma.jobCard.findMany({
    where: { userId },
    include: { resumeVersion: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ jobCards });
}

const createSchema = z.object({
  title: z.string().trim().min(1, "Job title is required."),
  company: z.string().trim().min(1, "Company name is required."),
  link: z.string().trim().url().optional().or(z.literal("")),
  stage: z.enum(STAGES).optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { title, company, link, stage, notes } = parsed.data;

  const jobCard = await prisma.jobCard.create({
    data: {
      userId,
      title,
      company,
      link: link || null,
      stage: stage ?? "TO_APPLY",
      notes: notes || null,
    },
  });

  return NextResponse.json({ jobCard }, { status: 201 });
}
