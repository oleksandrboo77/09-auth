import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkServerSession } from "@/lib/api/serverApi";

const PRIVATE = ["/profile", "/notes"];
const PUBLIC = ["/sign-in", "/sign-up"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPrivate = PRIVATE.some((p) => pathname.startsWith(p));
  const isPublic = PUBLIC.includes(pathname);

  const store = await cookies();
  const access = store.get("accessToken")?.value;
  const refresh = store.get("refreshToken")?.value;

  if (isPrivate && !access && refresh) {
    try {
      await checkServerSession();
    } catch {}
  }

  const store2 = await cookies();
  const access2 = store2.get("accessToken")?.value;
  const refresh2 = store2.get("refreshToken")?.value;
  const authed = Boolean(access2 && refresh2);

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
