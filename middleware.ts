import { NextRequest, NextResponse } from "next/server";

const PRIVATE = ["/profile", "/notes"];
const PUBLIC = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE.some((p) => pathname.startsWith(p));
  const isPublic = PUBLIC.includes(pathname);

  const authed = Boolean(
    req.cookies.get("accessToken")?.value ||
      req.cookies.get("refreshToken")?.value
  );

  if (!authed && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (authed && isPublic) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
