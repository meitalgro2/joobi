import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUserId, isErrorResponse } from "@/lib/api-helpers";
import { clearAuthCookies } from "@/lib/auth-cookies";
import { SENIORITY_OPTIONS } from "@/lib/constants";

const updateSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").optional(),
  desiredRole: z.string().trim().min(1, "Please select a role.").optional(),
  seniority: z.string().nullable().optional(),
});

export async function PATCH(req: Request) {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const { name, desiredRole, seniority } = parsed.data;

  if (
    seniority &&
    !SENIORITY_OPTIONS.includes(seniority as (typeof SENIORITY_OPTIONS)[number])
  ) {
    return NextResponse.json({ error: "Invalid seniority value." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(desiredRole !== undefined ? { desiredRole } : {}),
      ...(seniority !== undefined ? { seniority: seniority || null } : {}),
    },
  });

  return NextResponse.json({
    user: {
      name: user.name,
      email: user.email,
      authProvider: user.authProvider,
      desiredRole: user.desiredRole,
      seniority: user.seniority,
    },
  });
}

export async function DELETE() {
  const userId = await requireUserId();
  if (isErrorResponse(userId)) return userId;

  await prisma.user.delete({ where: { id: userId } });

  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}
