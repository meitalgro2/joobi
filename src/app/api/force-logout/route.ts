import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/auth-cookies";

export async function GET(req: Request) {
  const appUrl = process.env.APP_URL ?? new URL(req.url).origin;
  const res = NextResponse.redirect(`${appUrl}/login`);
  clearAuthCookies(res);
  return res;
}
