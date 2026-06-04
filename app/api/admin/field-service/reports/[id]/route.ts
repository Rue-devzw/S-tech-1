import { NextResponse } from "next/server";
import { getServiceReportHtml } from "@/server/services/field-service-module";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getServiceReportHtml(id);
  if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });
  return new NextResponse(report.html, { headers: { "content-type": "text/html; charset=utf-8" } });
}
