import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";

export async function GET() {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  const prepRequests = await prisma.interviewPrepRequest.findMany({
    where: { userId },
    include: { jobCard: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ prepRequests });
}

const createSchema = z.object({
  jobCardId: z.string().min(1),
  interviewStage: z.string().trim().optional(),
  interviewDate: z.string().trim().optional(),
  concerns: z.string().trim().optional(),
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

  const { jobCardId, interviewStage, interviewDate, concerns } = parsed.data;

  const jobCard = await prisma.jobCard.findFirst({
    where: { id: jobCardId, userId },
  });
  if (!jobCard) {
    return NextResponse.json({ error: "Job card not found." }, { status: 404 });
  }

  const prepRequest = await prisma.interviewPrepRequest.create({
    data: {
      userId,
      jobCardId,
      interviewStage: interviewStage || null,
      interviewDate: interviewDate ? new Date(interviewDate) : null,
      concerns: concerns || null,
    },
  });

  return NextResponse.json({ prepRequest }, { status: 201 });
}
