import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { issueVerificationToken } from "@/lib/verification-token";

const schema = z.object({ email: z.string().trim().email() });

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // Don't reveal whether the account exists.
  if (user && !user.emailVerified && user.authProvider === "credentials") {
    await issueVerificationToken(user.id, user.email);
  }

  return NextResponse.json({ ok: true });
}
