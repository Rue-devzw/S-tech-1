import { prisma } from "@/server/db";
import { audit } from "@/server/audit";
import { quoteSchema } from "@/server/validation";

function nextQuoteNumber() {
  return `QTE-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createQuote(input: unknown, actorId?: string) {
  const parsed = quoteSchema.parse(input);
  const subtotal = parsed.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const tax = 0;
  const total = subtotal + tax;

  const quote = await prisma.quotation.create({
    data: {
      quotationNumber: nextQuoteNumber(),
      customerId: parsed.customerId,
      jobCardId: parsed.jobCardId,
      subtotal,
      discount: 0,
      tax,
      total,
      validUntil: parsed.validUntil ? new Date(parsed.validUntil) : undefined,
      items: {
        create: parsed.lineItems.map((item, index) => ({
          ...item,
          quantity: item.quantity,
          total: item.quantity * item.unitPrice,
          sortOrder: index + 1
        }))
      }
    },
    include: { items: true, customer: true }
  });

  await audit("QUOTE_CREATED", "Quote", quote.id, actorId, { total });
  return quote;
}
