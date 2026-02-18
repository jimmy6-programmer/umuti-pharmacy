import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/utils";
import { UserRole } from "@/lib/auth/types";

const publicPaths = ["/", "/signup", "/forgot-password", "/reset-password"];

const roleBasedPaths: Record<string, string[]> = {
  "/dashboard": ["ADMIN", "PHARMACY"],
  "/dashboard/analysis": ["ADMIN", "PHARMACY"],
  "/dashboard/stock": ["ADMIN", "PHARMACY"],
  "/dashboard/requisitions": ["ADMIN", "PHARMACY"],
  "/dashboard/orders": ["ADMIN", "PHARMACY"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Check for token
  const token = request.cookies.get("umuti_token")?.value;
  
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    // Check role-based access
    const matchingPattern = Object.keys(roleBasedPaths).find(pattern => 
      pathname.startsWith(pattern)
    );

    if (matchingPattern) {
      const allowedRoles = roleBasedPaths[matchingPattern];
      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    // Token is invalid or expired
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.delete("umuti_token");
    response.cookies.delete("umuti_role");
    return response;
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
