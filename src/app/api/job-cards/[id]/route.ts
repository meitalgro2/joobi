import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";
import { STAGES } from "@/lib/constants";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;
  const { id } = await params;

  const jobCard = await prisma.jobCard.findFirst({
    where: { id, userId },
    include: {
      resumeVersion: true,
      prepRequests: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!jobCard) {
    return NextResponse.json({ error: "Job card not found." }, { status: 404 });
  }

  return NextResponse.json({ jobCard });
}

const updateSchema = z.object({
  title: z.string().trim().min(1).optional(),
  company: z.string().trim().min(1).optional(),
  link: z.string().trim().url().optional().or(z.literal("")),
  stage: z.enum(STAGES).optional(),
  notes: z.string().optional(),
  resumeVersionId: z.string().nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;
  const { id } = await params;

  const existing = await prisma.jobCard.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Job card not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { resumeVersionId, link, ...rest } = parsed.data;

  if (resumeVersionId) {
    const resume = await prisma.resumeVersion.findFirst({
      where: { id: resumeVersionId, userId },
    });
    if (!resume) {
      return NextResponse.json(
        { error: "Resume version not found." },
        { status: 404 }
      );
    }
  }

  const jobCard = await prisma.jobCard.update({
    where: { id },
    data: {
      ...rest,
      ...(link !== undefined ? { link: link || null } : {}),
      ...(resumeVersionId !== undefined ? { resumeVersionId } : {}),
    },
    include: {
      resumeVersion: true,
      prepRequests: { orderBy: { createdAt: "desc" } },
    },
  });

  return NextResponse.json({ jobCard });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;
  const { id } = await params;

  const existing = await prisma.jobCard.findFirst({ where: { id, userId } });
  if (!existing) {
    return NextResponse.json({ error: "Job card not found." }, { status: 404 });
  }

  await prisma.jobCard.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
