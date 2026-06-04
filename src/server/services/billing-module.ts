import { Invoice, Payment, Quotation, Receipt } from "@prisma/client";
import { brand } from "@/lib/constants";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { queueNotification } from "@/server/providers/notifications";
import {
  invoiceConversionSchema,
  paymentRecordSchema,
  quotationApprovalSchema,
  quoteSchema,
  shareDocumentSchema
} from "@/server/validation";

function nextNumber(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function currency(value: unknown) {
  return `USD ${Number(value).toFixed(2)}`;
}

function appUrl() {
  return process.env.APP_URL ?? "http://localhost:3000";
}

export async function createQuotationDraft(input: unknown, actorId: string) {
  const parsed = quoteSchema.parse(input);
  const subtotal = parsed.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const total = Math.max(subtotal - parsed.discount + parsed.tax, 0);

  const quotation = await prisma.quotation.create({
    data: {
      quotationNumber: nextNumber("QTE"),
      customerId: parsed.customerId,
      jobCardId: parsed.jobCardId,
      status: parsed.status,
      subtotal,
      discount: parsed.discount,
      tax: parsed.tax,
      total,
      validUntil: parsed.validUntil ? new Date(parsed.validUntil) : undefined,
      notes: parsed.notes,
      items: {
        create: parsed.lineItems.map((item, index) => ({
          itemType: item.itemType,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          sortOrder: index + 1
        }))
      }
    },
    include: { customer: true, items: true, jobCard: true }
  });

  await audit("QUOTATION_DRAFT_CREATED", "Quotation", quotation.id, actorId, { total });
  return quotation;
}

export async function sendQuotation(quotationId: string, actorId: string) {
  const quotation = await prisma.quotation.update({
    where: { id: quotationId },
    data: { status: "SENT" },
    include: { customer: true, items: true, jobCard: true }
  });

  if (quotation.jobCardId) {
    await prisma.jobCard.update({ where: { id: quotation.jobCardId }, data: { status: "QUOTED" } });
  }

  const recipient = quotation.customer.email || quotation.customer.phone;
  if (recipient) {
    await queueNotification({
      channel: quotation.customer.email ? "EMAIL" : "SMS",
      recipient,
      subject: `Quotation ${quotation.quotationNumber} from ${brand.name}`,
      body: `Your OmniTech quotation is ready. Total: ${currency(quotation.total)}. View: ${appUrl()}/api/billing/documents/quotation/${quotation.id}/pdf`
    });
  }

  await audit("QUOTATION_SENT", "Quotation", quotation.id, actorId, { total: quotation.total });
  return quotation;
}

export async function decideQuotationForBilling(quotationId: string, input: unknown, actorId: string) {
  const parsed = quotationApprovalSchema.parse(input);
  const quotation = await prisma.quotation.update({
    where: { id: quotationId },
    data: {
      status: parsed.decision,
      acceptedAt: parsed.decision === "ACCEPTED" ? new Date() : undefined,
      declinedAt: parsed.decision === "DECLINED" ? new Date() : undefined,
      notes: parsed.note
    },
    include: { jobCard: true }
  });

  if (quotation.jobCardId) {
    await prisma.jobCard.update({
      where: { id: quotation.jobCardId },
      data: { status: parsed.decision === "ACCEPTED" ? "APPROVED" : "WAITING_CUSTOMER" }
    });
  }

  await audit("QUOTATION_CUSTOMER_DECISION", "Quotation", quotation.id, actorId, { decision: parsed.decision });
  return quotation;
}

export async function convertQuotationToInvoice(quotationId: string, input: unknown, actorId: string) {
  const parsed = invoiceConversionSchema.parse(input);
  const quotation = await prisma.quotation.findUnique({
    where: { id: quotationId },
    include: { invoices: true }
  });
  if (!quotation) throw new Error("Quotation not found.");
  if (quotation.status !== "ACCEPTED") throw new Error("Only accepted quotations can be converted to invoices.");
  if (quotation.invoices.length) throw new Error("This quotation already has an invoice.");

  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber: nextNumber("INV"),
      customerId: quotation.customerId,
      jobCardId: quotation.jobCardId,
      quotationId: quotation.id,
      status: "SENT",
      subtotal: quotation.subtotal,
      discount: quotation.discount,
      tax: quotation.tax,
      total: quotation.total,
      paidAmount: 0,
      balanceDue: quotation.total,
      issuedAt: parsed.issuedAt ? new Date(parsed.issuedAt) : new Date(),
      dueAt: parsed.dueAt ? new Date(parsed.dueAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    include: { customer: true, quotation: { include: { items: true } } }
  });

  if (quotation.jobCardId) {
    await prisma.jobCard.update({ where: { id: quotation.jobCardId }, data: { status: "PAYMENT_PENDING" } });
  }

  await audit("QUOTATION_CONVERTED_TO_INVOICE", "Invoice", invoice.id, actorId, { quotationId });
  return invoice;
}

export async function recordInvoicePayment(input: unknown, actorId: string) {
  const parsed = paymentRecordSchema.parse(input);
  const invoice = await prisma.invoice.findUnique({ where: { id: parsed.invoiceId } });
  if (!invoice) throw new Error("Invoice not found.");

  const paidAmount = Number(invoice.paidAmount) + parsed.amount;
  const total = Number(invoice.total);
  const balanceDue = Math.max(total - paidAmount, 0);

  const result = await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.create({
      data: {
        paymentNumber: nextNumber("PAY"),
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        recordedById: actorId,
        method: parsed.method,
        status: "CONFIRMED",
        amount: parsed.amount,
        providerReference: parsed.providerReference,
        paidAt: new Date()
      }
    });

    const updatedInvoice = await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount,
        balanceDue,
        status: balanceDue === 0 ? "PAID" : "PARTIALLY_PAID"
      }
    });

    const receipt = await tx.receipt.create({
      data: {
        receiptNumber: nextNumber("RCT"),
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        paymentId: payment.id,
        amount: parsed.amount
      }
    });

    return { payment, invoice: updatedInvoice, receipt };
  });

  await audit("PAYMENT_RECORDED_RECEIPT_GENERATED", "Payment", result.payment.id, actorId, {
    invoiceId: invoice.id,
    receiptId: result.receipt.id,
    amount: parsed.amount
  });
  return result;
}

export async function shareBillingDocument(type: "quotation" | "invoice" | "receipt", id: string, input: unknown, actorId: string) {
  const parsed = shareDocumentSchema.parse(input);
  const url = `${appUrl()}/api/billing/documents/${type}/${id}/pdf`;
  const subject = `${brand.name} ${type}`;
  const body = `${parsed.message ?? `Please view your ${type} from ${brand.name}.`}\n\n${url}`;

  await queueNotification({
    channel: parsed.channel,
    recipient: parsed.recipient,
    subject,
    body
  });

  await audit("BILLING_DOCUMENT_SHARED", type, id, actorId, { channel: parsed.channel, recipient: parsed.recipient });
  return { url, channel: parsed.channel, recipient: parsed.recipient };
}

type DocumentType = "quotation" | "invoice" | "receipt";

export async function getBillingDocument(type: DocumentType, id: string) {
  if (type === "quotation") {
    return prisma.quotation.findUnique({ where: { id }, include: { customer: true, items: true, jobCard: true } });
  }
  if (type === "invoice") {
    return prisma.invoice.findUnique({
      where: { id },
      include: { customer: true, quotation: { include: { items: true } }, payments: true, receipts: true }
    });
  }
  return prisma.receipt.findUnique({
    where: { id },
    include: { customer: true, invoice: { include: { quotation: { include: { items: true } } } }, payment: true }
  });
}

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function documentNumber(type: DocumentType, document: Quotation | Invoice | Receipt) {
  if (type === "quotation") return (document as Quotation).quotationNumber;
  if (type === "invoice") return (document as Invoice).invoiceNumber;
  return (document as Receipt).receiptNumber;
}

export function renderBillingDocumentHtml(type: DocumentType, document: any) {
  const number = documentNumber(type, document);
  const customer = document.customer;
  const items = type === "quotation" ? document.items : type === "invoice" ? document.quotation?.items ?? [] : document.invoice?.quotation?.items ?? [];
  const total = type === "receipt" ? document.amount : document.total;
  const paid = type === "invoice" ? document.paidAmount : type === "receipt" ? document.amount : 0;
  const balance = type === "invoice" ? document.balanceDue : 0;

  const itemRows = items
    .map(
      (item: any) => `<tr>
        <td>${escapeHtml(item.itemType ?? "SERVICE")}</td>
        <td>${escapeHtml(item.description)}</td>
        <td class="num">${escapeHtml(item.quantity)}</td>
        <td class="num">${currency(item.unitPrice)}</td>
        <td class="num">${currency(item.total)}</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${escapeHtml(brand.name)} ${escapeHtml(type)} ${escapeHtml(number)}</title>
      <style>
        body { font-family: Arial, sans-serif; color: #18212f; margin: 0; background: #f5f7fb; }
        .page { max-width: 900px; margin: 32px auto; background: #fff; padding: 40px; border: 1px solid #dce3ee; }
        .top { display: flex; justify-content: space-between; gap: 24px; border-bottom: 3px solid #18212f; padding-bottom: 24px; }
        .brand { font-size: 26px; font-weight: 800; }
        .tagline { color: #0f766e; font-weight: 700; margin-top: 4px; }
        .doc { text-transform: uppercase; color: #b86432; font-weight: 800; text-align: right; }
        .number { font-size: 20px; font-weight: 800; text-align: right; margin-top: 6px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 28px 0; }
        .label { color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 700; }
        table { width: 100%; border-collapse: collapse; margin-top: 24px; }
        th { background: #f5f7fb; text-align: left; font-size: 12px; text-transform: uppercase; color: #334155; }
        th, td { border-bottom: 1px solid #dce3ee; padding: 12px; font-size: 14px; }
        .num { text-align: right; }
        .totals { margin-left: auto; width: 320px; margin-top: 24px; }
        .totals div { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #dce3ee; }
        .total { font-weight: 800; font-size: 18px; }
        .terms { margin-top: 32px; background: #f5f7fb; padding: 16px; font-size: 13px; line-height: 1.6; }
        @media print { body { background: #fff; } .page { margin: 0; border: 0; } }
      </style>
    </head>
    <body>
      <main class="page">
        <section class="top">
          <div>
            <div class="brand">${escapeHtml(brand.name)}</div>
            <div class="tagline">${escapeHtml(brand.tagline)}</div>
            <p>${escapeHtml(brand.email)}<br/>${escapeHtml(brand.phone)}<br/>${escapeHtml(brand.location)}</p>
          </div>
          <div>
            <div class="doc">${escapeHtml(type)}</div>
            <div class="number">${escapeHtml(number)}</div>
            <p>${new Date(document.createdAt ?? document.issuedAt ?? Date.now()).toLocaleDateString()}</p>
          </div>
        </section>
        <section class="grid">
          <div>
            <div class="label">Bill to</div>
            <strong>${escapeHtml(customer?.name)}</strong><br/>
            ${escapeHtml(customer?.organization)}<br/>
            ${escapeHtml(customer?.email)}<br/>
            ${escapeHtml(customer?.phone)}
          </div>
          <div>
            <div class="label">Status</div>
            <strong>${escapeHtml(document.status ?? "ISSUED")}</strong><br/>
            ${type === "quotation" ? `Valid until: ${document.validUntil ? new Date(document.validUntil).toLocaleDateString() : "Not set"}` : ""}
            ${type === "invoice" ? `Due: ${document.dueAt ? new Date(document.dueAt).toLocaleDateString() : "On receipt"}` : ""}
          </div>
        </section>
        <table>
          <thead><tr><th>Type</th><th>Description</th><th class="num">Qty</th><th class="num">Unit</th><th class="num">Total</th></tr></thead>
          <tbody>${itemRows || `<tr><td colspan="5">Payment receipt for ${escapeHtml(document.invoice?.invoiceNumber ?? "")}</td></tr>`}</tbody>
        </table>
        <section class="totals">
          ${type !== "receipt" ? `<div><span>Subtotal</span><span>${currency(document.subtotal)}</span></div>` : ""}
          ${type !== "receipt" ? `<div><span>Discount</span><span>${currency(document.discount)}</span></div>` : ""}
          ${type !== "receipt" ? `<div><span>Tax</span><span>${currency(document.tax)}</span></div>` : ""}
          <div class="total"><span>Total</span><span>${currency(total)}</span></div>
          ${type === "invoice" ? `<div><span>Paid</span><span>${currency(paid)}</span></div><div><span>Balance</span><span>${currency(balance)}</span></div>` : ""}
        </section>
        <section class="terms">
          <strong>OmniTech terms:</strong> Quotes are subject to parts availability and inspection findings. Tax fields are included for tax readiness. Payment confirms acceptance of the listed work unless otherwise agreed in writing.
        </section>
      </main>
    </body>
  </html>`;
}
