import { NextResponse } from "next/server";
import { getBillingDocument, renderBillingDocumentHtml } from "@/server/services/billing-module";

const allowedTypes = ["quotation", "invoice", "receipt"] as const;

export async function GET(_request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  if (!allowedTypes.includes(type as never)) {
    return NextResponse.json({ error: "Unsupported document type." }, { status: 400 });
  }

  const document = await getBillingDocument(type as (typeof allowedTypes)[number], id);
  if (!document) return NextResponse.json({ error: "Document not found." }, { status: 404 });

  const html = renderBillingDocumentHtml(type as (typeof allowedTypes)[number], document);
  return new NextResponse(html, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "content-disposition": `inline; filename="${type}-${id}.html"`
    }
  });
}
