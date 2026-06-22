import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";
import { PREP_STATUSES } from "@/lib/constants";

const updateSchema = z.object({
  status: z.enum(PREP_STATUSES),
  deliveryNote: z.string().trim().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;
  const { id } = await params;

  const existing = await prisma.interviewPrepRequest.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const prepRequest = await prisma.interviewPrepRequest.update({
    where: { id },
    data: {
      status: parsed.data.status,
      deliveryNote: parsed.data.deliveryNote || null,
    },
  });

  return NextResponse.json({ prepRequest });
}
