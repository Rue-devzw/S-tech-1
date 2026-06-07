import { RequestStatus } from "@prisma/client";
import { prisma } from "@/server/db";
import { audit } from "@/server/audit";
import { queueNotification } from "@/server/providers/notifications";
import { serviceRequestSchema } from "@/server/validation";

function nextNumber(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createServiceRequest(input: unknown) {
  const parsed = serviceRequestSchema.parse(input);

  const customer = await prisma.customer.upsert({
    where: { phone: parsed.phone },
    update: {
      name: parsed.name,
      email: parsed.email || undefined,
      organization: parsed.organization || undefined
    },
    create: {
      name: parsed.name,
      email: parsed.email || undefined,
      phone: parsed.phone,
      organization: parsed.organization || undefined
    }
  });

  const request = await prisma.serviceRequest.create({
    data: {
      requestNumber: nextNumber("REQ"),
      customerId: customer.id,
      serviceId: parsed.serviceId,
      title: parsed.title,
      description: parsed.description,
      locationNote: parsed.location || undefined,
      priority: parsed.urgency,
      preferredDate: parsed.preferredDate ? new Date(parsed.preferredDate) : undefined
    },
    include: { customer: true, service: true }
  });

  await audit("SERVICE_REQUEST_CREATED", "ServiceRequest", request.id, undefined, {
    requestNumber: request.requestNumber,
    service: request.service.name
  });

  await queueNotification({
    channel: "EMAIL",
    recipient: customer.email ?? "admin@omnitech.io",
    subject: `Request received: ${request.requestNumber}`,
    body: `OmniTech Solutions received your request for ${request.service.name}.`,
    serviceRequestId: request.id
  });

  return request;
}

export async function listOperationalSnapshot() {
  const [requests, jobs, quotes, invoices, lowStock, auditLogs] = await Promise.all([
    prisma.serviceRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { customer: true, service: true }
    }),
    prisma.jobCard.findMany({
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { customer: true, assignedTo: true }
    }),
    prisma.quotation.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { customer: true } }),
    prisma.invoice.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { customer: true } }),
    prisma.inventoryItem.findMany({ orderBy: { quantityOnHand: "asc" }, take: 24 }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 8, include: { actor: true } })
  ]);

  return { requests, jobs, quotes, invoices, lowStock: lowStock.filter((item) => item.quantityOnHand <= item.reorderLevel).slice(0, 8), auditLogs };
}

export async function updateRequestStatus(id: string, status: RequestStatus, actorId?: string) {
  const request = await prisma.serviceRequest.update({ where: { id }, data: { status } });
  await audit("SERVICE_REQUEST_STATUS_UPDATED", "ServiceRequest", id, actorId, { status });
  return request;
}
