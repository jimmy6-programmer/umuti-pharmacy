import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = ["/login", "/signup", "/"];
const roleAccess: Record<string, string[]> = {
  "/dashboard": ["admin", "pharmacist", "viewer"],
  "/dashboard/stock": ["admin", "pharmacist"],
  "/dashboard/requisitions": ["admin", "pharmacist"],
  "/dashboard/analysis": ["admin", "pharmacist", "viewer"],
  "/dashboard/orders": ["admin", "pharmacist"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  const userRole = request.cookies.get("umuti_role")?.value;

  if (!userRole && pathname.startsWith("/dashboard")) {
    // In production, redirect to login. For demo, set default role.
    const response = NextResponse.next();
    response.cookies.set("umuti_role", "admin", { path: "/" });
    return response;
  }

  if (userRole) {
    const matchedPath = Object.keys(roleAccess).find((p) =>
      pathname.startsWith(p)
    );
    if (matchedPath) {
      const allowed = roleAccess[matchedPath];
      if (!allowed.includes(userRole)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
