import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const sessionCookieName = "omnitech_session";

const protectedRoutes = [
  { prefix: "/admin", roles: ["SUPER_ADMIN", "MANAGER", "ADMIN_ASSISTANT", "SALES_MARKETING", "VIEWER_AUDITOR"] },
  { prefix: "/technician", roles: ["SUPER_ADMIN", "MANAGER", "TECHNICIAN", "FIELD_INSTALLER"] },
  { prefix: "/customer", roles: ["CUSTOMER", "SUPER_ADMIN", "MANAGER", "ADMIN_ASSISTANT"] },
  { prefix: "/api/admin", roles: ["SUPER_ADMIN", "MANAGER", "ADMIN_ASSISTANT", "TECHNICIAN", "FIELD_INSTALLER", "SALES_MARKETING", "VIEWER_AUDITOR"] },
  { prefix: "/api/technician", roles: ["SUPER_ADMIN", "MANAGER", "TECHNICIAN", "FIELD_INSTALLER"] }
];

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 32) return null;
  return new TextEncoder().encode(value);
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/customer/register") return NextResponse.next();

  const rule = protectedRoutes.find((item) => request.nextUrl.pathname.startsWith(item.prefix));
  if (!rule) return NextResponse.next();

  const key = secret();
  const token = request.cookies.get(sessionCookieName)?.value;
  if (!key || !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return request.nextUrl.pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(loginUrl);
  }

  try {
    const verified = await jwtVerify(token, key);
    const role = verified.payload.role;
    if (typeof role !== "string" || !rule.roles.includes(role)) {
      return request.nextUrl.pathname.startsWith("/api/")
        ? NextResponse.json({ error: "Forbidden" }, { status: 403 })
        : NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } catch {
    return request.nextUrl.pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/technician/:path*", "/customer/:path*", "/api/admin/:path*", "/api/technician/:path*"]
};
