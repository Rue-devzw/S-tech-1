import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { departmentForHostname, departmentUrl, type PublicDepartmentSite } from "@/lib/site-domains";

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

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

function redirectToDepartment(request: NextRequest, department: PublicDepartmentSite, pathname: string) {
  const destination = new URL(departmentUrl(department, pathname));
  destination.search = request.nextUrl.search;
  return NextResponse.redirect(destination);
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const department = departmentForHostname(request.headers.get("host") || request.nextUrl.hostname);

  if (department !== "local") {
    if (pathname === "/shop" && department !== "shop") {
      return redirectToDepartment(request, "shop", "/");
    }

    if (matchesPrefix(pathname, "/customer") && department !== "portal") {
      const portalPath = pathname === "/customer" ? "/" : pathname === "/customer/register" ? "/register" : pathname;
      return redirectToDepartment(request, "portal", portalPath);
    }

    if ((matchesPrefix(pathname, "/admin") || matchesPrefix(pathname, "/technician")) && department !== "staff") {
      return redirectToDepartment(request, "staff", pathname);
    }
  }

  let effectivePathname = pathname;
  if (pathname === "/") {
    if (department === "shop") effectivePathname = "/shop";
    if (department === "portal") effectivePathname = "/customer";
    if (department === "staff") effectivePathname = "/admin";
  } else if (pathname === "/register" && department === "portal") {
    effectivePathname = "/customer/register";
  }

  const rewrittenResponse = () => {
    if (effectivePathname === pathname) return NextResponse.next();
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = effectivePathname;
    return NextResponse.rewrite(rewriteUrl);
  };

  if (effectivePathname === "/customer/register") return rewrittenResponse();

  const rule = protectedRoutes.find((item) => matchesPrefix(effectivePathname, item.prefix));
  if (!rule) return rewrittenResponse();

  const key = secret();
  const token = request.cookies.get(sessionCookieName)?.value;
  if (!key || !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(loginUrl);
  }

  try {
    const verified = await jwtVerify(token, key);
    const role = verified.payload.role;
    if (typeof role !== "string" || !rule.roles.includes(role)) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("reason", "forbidden");
      return NextResponse.redirect(loginUrl);
    }
    return rewrittenResponse();
  } catch {
    return pathname.startsWith("/api/")
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/", "/register", "/shop", "/admin/:path*", "/technician/:path*", "/customer/:path*", "/api/admin/:path*", "/api/technician/:path*"]
};
