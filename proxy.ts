import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // Protect admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!token || token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/login?error=unauthorized", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow all non-admin routes through
        if (!req.nextUrl.pathname.startsWith("/admin")) return true;
        // Admin routes require ADMIN role
        return token?.role === "ADMIN";
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
