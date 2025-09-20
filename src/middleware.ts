import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { rules } from "./middleware/rules";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  for (const rule of rules) {
    if (rule.match(path)) {
      const redirectTo = rule.redirect(session);

      if (redirectTo && redirectTo !== path)
        return NextResponse.redirect(new URL(redirectTo, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
