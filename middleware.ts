import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

async function adminGuard(req: NextRequest): Promise<NextResponse> {
  const path = req.nextUrl.pathname;
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (path.startsWith("/admin/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // /api/* is excluded via matcher — never hits locale routing
  // Иначе next-intl ломает payload, и страница остаётся пустой.
  // Detect RSC (React Server Component) requests. Header name may vary
  // across Next.js versions / environments, so check several variants.
  function isRscRequest(r: NextRequest) {
    const h = r.headers;
    const candidates = ["RSC", "rsc", "x-rsc", "x-nextjs-rsc"];
    for (const name of candidates) {
      const v = h.get(name);
      if (v === "1" || v === "true") return true;
    }
    return false;
  }

  if (isRscRequest(req)) {
    if (process.env.NODE_ENV === "development") {
      // eslint-disable-next-line no-console
      console.log("middleware: skipping intl for RSC request", {
        path: req.nextUrl.pathname,
        headers: {
          RSC: req.headers.get("RSC"),
          rsc: req.headers.get("rsc"),
          x_rsc: req.headers.get("x-rsc"),
          x_nextjs_rsc: req.headers.get("x-nextjs-rsc"),
        },
      });
    }
    return NextResponse.next();
  }

  if (path.startsWith("/admin")) {
    return adminGuard(req);
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
