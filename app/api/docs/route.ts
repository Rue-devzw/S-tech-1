import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    name: "OmniTech Solutions REST API",
    version: "0.1.0",
    auth: "Cookie session via /api/auth/login. Admin/customer/technician routes require RBAC permissions.",
    pagination: "Collection endpoints accept page, pageSize, q, status, sort, order, from and to where relevant.",
    endpoints: {
      auth: ["/api/auth/register", "/api/auth/login", "/api/auth/logout", "/api/auth/me", "/api/auth/invitations", "/api/auth/password-reset/request"],
      customers: ["/api/admin/customers"],
      services: ["/api/services", "/api/admin/services"],
      requests: ["/api/service-requests", "/api/admin/requests"],
      jobs: ["/api/admin/jobs", "/api/admin/jobs/{id}/transition", "/api/technician/jobs/{id}/status"],
      quotations: ["/api/admin/billing/quotations", "/api/customer/billing/quotations/{id}/decision"],
      invoices: ["/api/admin/billing/invoices", "/api/billing/documents/{type}/{id}/pdf"],
      inventory: ["/api/admin/inventory"],
      appointments: ["/api/admin/appointments", "/api/admin/field-service/schedule"],
      notifications: ["/api/admin/communications/templates", "/api/admin/communications/triggers", "/api/admin/communications/logs"],
      promotions: ["/api/admin/promotions"],
      portfolio: ["/api/admin/portfolio/projects", "/api/admin/portfolio/testimonials"],
      blog: ["/api/admin/blog/posts"],
      ai: ["/api/ai/assist", "/api/admin/ai/interactions"],
      reports: ["/api/admin/reports/operations"],
      settings: ["/api/admin/settings"]
    }
  });
}
