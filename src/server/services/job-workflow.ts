import { JobStatus, Prisma } from "@prisma/client";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { queueNotification } from "@/server/providers/notifications";
import {
  adminReviewSchema,
  deliverySchema,
  diagnosisCreateSchema,
  partsAllocationSchema,
  paymentRecordSchema,
  quotationDecisionSchema,
  quoteSchema,
  warrantyCreateSchema,
  workflowTransitionSchema
} from "@/server/validation";

function nextNumber(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const allowedTransitions: Record<JobStatus, JobStatus[]> = {
  CREATED: ["ASSIGNED", "DIAGNOSING", "CANCELLED"],
  ASSIGNED: ["DIAGNOSING", "IN_PROGRESS", "CANCELLED"],
  DIAGNOSING: ["QUOTED", "WAITING_CUSTOMER", "CANCELLED"],
  QUOTED: ["APPROVED", "WAITING_CUSTOMER", "CANCELLED"],
  APPROVED: ["WAITING_PARTS", "IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["WAITING_PARTS", "QUALITY_CHECK", "CANCELLED"],
  WAITING_PARTS: ["IN_PROGRESS", "CANCELLED"],
  WAITING_CUSTOMER: ["QUOTED", "APPROVED", "CANCELLED"],
  QUALITY_CHECK: ["READY_FOR_COLLECTION", "READY_FOR_DELIVERY", "IN_PROGRESS"],
  READY_FOR_COLLECTION: ["PAYMENT_PENDING", "READY_FOR_DELIVERY", "COMPLETED"],
  PAYMENT_PENDING: ["READY_FOR_DELIVERY", "DELIVERED", "COMPLETED"],
  READY_FOR_DELIVERY: ["DELIVERED", "COMPLETED"],
  DELIVERED: ["WARRANTY_ACTIVE", "COMPLETED"],
  WARRANTY_ACTIVE: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: []
};

function assertTransition(from: JobStatus, to: JobStatus) {
  if (from === to) return;
  if (!allowedTransitions[from]?.includes(to)) {
    throw new Error(`Invalid job transition from ${from} to ${to}.`);
  }
}

async function notifyCustomer(customerId: string, subject: string, body: string, serviceRequestId?: string | null) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  const recipient = customer?.email || customer?.phone;
  if (!recipient || !customer?.consentToNotify) return;
  await queueNotification({
    channel: customer.email ? "EMAIL" : "SMS",
    recipient,
    subject,
    body,
    serviceRequestId: serviceRequestId ?? undefined
  });
}

async function setJobStatus(tx: Prisma.TransactionClient, jobId: string, toStatus: JobStatus, actorId: string, note?: string) {
  const job = await tx.jobCard.findUnique({ where: { id: jobId }, include: { request: true } });
  if (!job) throw new Error("Job card not found.");
  assertTransition(job.status, toStatus);

  const updated = await tx.jobCard.update({
    where: { id: jobId },
    data: {
      status: toStatus,
      completedAt: toStatus === "COMPLETED" ? new Date() : undefined
    }
  });

  await tx.jobStatusHistory.create({
    data: {
      jobCardId: jobId,
      fromStatus: job.status,
      toStatus,
      changedById: actorId,
      note
    }
  });

  if (job.requestId) {
    const requestStatus =
      toStatus === "QUOTED"
        ? "QUOTED"
        : toStatus === "APPROVED"
          ? "APPROVED"
          : toStatus === "WAITING_PARTS"
            ? "WAITING_PARTS"
            : toStatus === "READY_FOR_COLLECTION" || toStatus === "READY_FOR_DELIVERY"
              ? "READY"
              : toStatus === "COMPLETED"
                ? "COMPLETED"
                : toStatus === "CANCELLED"
                  ? "CANCELLED"
                  : "IN_PROGRESS";
    await tx.serviceRequest.update({ where: { id: job.requestId }, data: { status: requestStatus } });
  }

  return updated;
}

export async function reviewRequestAndCreateJob(input: unknown, actorId: string) {
  const parsed = adminReviewSchema.parse(input);
  const request = await prisma.serviceRequest.findUnique({
    where: { id: parsed.requestId },
    include: { customer: true, service: true, jobCard: true }
  });
  if (!request) throw new Error("Service request not found.");
  if (request.jobCard) throw new Error("A job card already exists for this request.");

  const result = await prisma.$transaction(async (tx) => {
    const device = parsed.device
      ? await tx.device.create({
          data: {
            customerId: request.customerId,
            type: parsed.device.type,
            make: parsed.device.make,
            model: parsed.device.model,
            serialNumber: parsed.device.serialNumber,
            conditionNotes: parsed.device.conditionNotes,
            accessories: parsed.device.accessories
          }
        })
      : null;

    const job = await tx.jobCard.create({
      data: {
        jobNumber: nextNumber("JOB"),
        requestId: request.id,
        customerId: request.customerId,
        deviceId: device?.id,
        assignedToId: parsed.assignedToId,
        type: parsed.jobType,
        status: parsed.assignedToId ? "ASSIGNED" : "CREATED",
        priority: request.priority,
        faultReported: request.description,
        internalNotes: parsed.internalNotes,
        scheduledFor: parsed.appointment ? new Date(parsed.appointment.startsAt) : undefined
      }
    });

    await tx.serviceRequest.update({ where: { id: request.id }, data: { status: "TRIAGED", deviceId: device?.id } });
    await tx.jobStatusHistory.create({
      data: { jobCardId: job.id, toStatus: job.status, changedById: actorId, note: "Job card created from admin review." }
    });

    if (parsed.appointment) {
      const appointment = await tx.appointment.create({
        data: {
          customerId: request.customerId,
          serviceRequestId: request.id,
          jobCardId: job.id,
          assignedToId: parsed.assignedToId,
          title: `${request.service.name} appointment`,
          status: "CONFIRMED",
          startsAt: new Date(parsed.appointment.startsAt),
          endsAt: new Date(parsed.appointment.endsAt),
          location: parsed.appointment.location,
          notes: parsed.appointment.notes
        }
      });

      if (["FIELD_REPAIR", "STARLINK_INSTALLATION", "NETWORK_INSTALLATION"].includes(parsed.jobType)) {
        await tx.fieldVisit.create({
          data: {
            visitNumber: nextNumber("VIS"),
            appointmentId: appointment.id,
            customerId: request.customerId,
            jobCardId: job.id,
            technicianId: parsed.assignedToId,
            status: "PLANNED",
            siteContact: request.customer.name,
            sitePhone: request.customer.phone,
            address: parsed.appointment.location
          }
        });
      }
    }

    return job;
  });

  await audit("REQUEST_REVIEWED_JOB_CREATED", "JobCard", result.id, actorId, { requestId: request.id });
  await notifyCustomer(request.customerId, `Job created: ${result.jobNumber}`, `OmniTech created job card ${result.jobNumber} for your request.`, request.id);
  return result;
}

export async function transitionJob(input: unknown, actorId: string, jobId: string) {
  const parsed = workflowTransitionSchema.parse(input);
  const job = await prisma.$transaction((tx) => setJobStatus(tx, jobId, parsed.toStatus, actorId, parsed.note));
  await audit("JOB_STATUS_TRANSITIONED", "JobCard", job.id, actorId, { toStatus: parsed.toStatus, note: parsed.note });
  await notifyCustomer(job.customerId, `Job status updated: ${job.jobNumber}`, `Your OmniTech job is now ${job.status}.`, job.requestId);
  return job;
}

export async function createDiagnosisForJob(input: unknown, actorId: string, jobId: string) {
  const parsed = diagnosisCreateSchema.parse(input);
  const result = await prisma.$transaction(async (tx) => {
    const job = await setJobStatus(tx, jobId, "DIAGNOSING", actorId, "Diagnosis started.");
    const diagnosis = await tx.diagnosis.create({
      data: {
        jobCardId: jobId,
        technicianId: actorId,
        status: parsed.final ? "FINAL" : "DRAFT",
        symptoms: parsed.symptoms,
        findings: parsed.findings,
        recommendation: parsed.recommendation,
        estimatedCost: parsed.estimatedCost,
        estimatedHours: parsed.estimatedHours
      }
    });
    return { job, diagnosis };
  });
  await audit("DIAGNOSIS_CREATED", "Diagnosis", result.diagnosis.id, actorId, { jobId });
  return result;
}

export async function createQuotationForJob(input: unknown, actorId: string, jobId: string) {
  const parsed = quoteSchema.parse(input);
  const job = await prisma.jobCard.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job card not found.");
  const subtotal = parsed.lineItems.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  const result = await prisma.$transaction(async (tx) => {
    const quotation = await tx.quotation.create({
      data: {
        quotationNumber: nextNumber("QTE"),
        customerId: job.customerId,
        jobCardId: job.id,
        status: "SENT",
        subtotal,
        discount: 0,
        tax: 0,
        total: subtotal,
        validUntil: parsed.validUntil ? new Date(parsed.validUntil) : undefined,
        items: {
          create: parsed.lineItems.map((item, index) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.quantity * item.unitPrice,
            sortOrder: index + 1
          }))
        }
      },
      include: { items: true }
    });
    await setJobStatus(tx, job.id, "QUOTED", actorId, "Quotation sent to customer.");
    return quotation;
  });

  await audit("QUOTATION_SENT", "Quotation", result.id, actorId, { jobId, total: subtotal });
  await notifyCustomer(job.customerId, `Quotation ready: ${result.quotationNumber}`, `Your OmniTech quotation is ready for approval. Total: USD ${subtotal.toFixed(2)}.`, job.requestId);
  return result;
}

export async function decideQuotation(input: unknown, actorId: string, quotationId: string) {
  const parsed = quotationDecisionSchema.parse(input);
  const quotation = await prisma.quotation.findUnique({ where: { id: quotationId }, include: { jobCard: true } });
  if (!quotation || !quotation.jobCard) throw new Error("Quotation not found.");

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.quotation.update({
      where: { id: quotationId },
      data: {
        status: parsed.decision,
        acceptedAt: parsed.decision === "ACCEPTED" ? new Date() : undefined,
        declinedAt: parsed.decision === "DECLINED" ? new Date() : undefined,
        notes: parsed.note
      }
    });
    await setJobStatus(tx, quotation.jobCard!.id, parsed.decision === "ACCEPTED" ? "APPROVED" : "WAITING_CUSTOMER", actorId, parsed.note);
    return updated;
  });

  await audit("QUOTATION_DECISION_RECORDED", "Quotation", quotationId, actorId, { decision: parsed.decision });
  return result;
}

export async function allocatePartsToJob(input: unknown, actorId: string, jobId: string) {
  const parsed = partsAllocationSchema.parse(input);
  const job = await prisma.jobCard.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job card not found.");

  const result = await prisma.$transaction(async (tx) => {
    const movements = [];
    for (const item of parsed.items) {
      const inventory = await tx.inventoryItem.findUnique({ where: { id: item.inventoryItemId } });
      if (!inventory) throw new Error("Inventory item not found.");
      const available = inventory.quantityOnHand - inventory.quantityReserved;
      if (available < item.quantity) throw new Error(`Insufficient stock for ${inventory.name}.`);

      await tx.inventoryItem.update({
        where: { id: item.inventoryItemId },
        data: { quantityReserved: { increment: item.quantity } }
      });
      movements.push(
        await tx.stockMovement.create({
          data: {
            inventoryItemId: item.inventoryItemId,
            jobCardId: jobId,
            type: "RESERVATION",
            quantity: item.quantity,
            reference: job.jobNumber,
            notes: item.notes
          }
        })
      );
    }
    await setJobStatus(tx, jobId, "WAITING_PARTS", actorId, "Parts allocated or reserved.");
    return movements;
  });

  await audit("PARTS_ALLOCATED", "JobCard", jobId, actorId, { items: parsed.items });
  return result;
}

export async function consumeReservedParts(jobId: string, actorId: string) {
  const reservations = await prisma.stockMovement.findMany({ where: { jobCardId: jobId, type: "RESERVATION" } });
  const job = await prisma.jobCard.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job card not found.");

  const result = await prisma.$transaction(async (tx) => {
    for (const reservation of reservations) {
      await tx.inventoryItem.update({
        where: { id: reservation.inventoryItemId },
        data: {
          quantityOnHand: { decrement: reservation.quantity },
          quantityReserved: { decrement: reservation.quantity }
        }
      });
      await tx.stockMovement.create({
        data: {
          inventoryItemId: reservation.inventoryItemId,
          jobCardId: jobId,
          type: "USED_ON_JOB",
          quantity: -reservation.quantity,
          reference: job.jobNumber,
          notes: "Reserved part consumed on job."
        }
      });
    }
    await setJobStatus(tx, jobId, "IN_PROGRESS", actorId, "Repair or installation started.");
    return reservations.length;
  });
  await audit("RESERVED_PARTS_CONSUMED", "JobCard", jobId, actorId, { count: result });
  return { consumed: result };
}

export async function recordPaymentForInvoice(input: unknown, actorId: string) {
  const parsed = paymentRecordSchema.parse(input);
  const invoice = await prisma.invoice.findUnique({ where: { id: parsed.invoiceId }, include: { jobCard: true } });
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
    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount,
        balanceDue,
        status: balanceDue === 0 ? "PAID" : "PARTIALLY_PAID"
      }
    });
    await tx.receipt.create({
      data: {
        receiptNumber: nextNumber("RCT"),
        customerId: invoice.customerId,
        invoiceId: invoice.id,
        paymentId: payment.id,
        amount: parsed.amount
      }
    });
    if (invoice.jobCardId && balanceDue === 0) {
      await setJobStatus(tx, invoice.jobCardId, "READY_FOR_DELIVERY", actorId, "Payment completed.");
    }
    return payment;
  });

  await audit("PAYMENT_RECORDED", "Payment", result.id, actorId, { invoiceId: invoice.id, amount: parsed.amount });
  return result;
}

export async function markDeliveryOrCollection(input: unknown, actorId: string, jobId: string) {
  const parsed = deliverySchema.parse(input);
  const status = "DELIVERED";
  const job = await prisma.$transaction((tx) => setJobStatus(tx, jobId, status, actorId, parsed.note));
  await audit(parsed.mode === "DELIVERY" ? "JOB_DELIVERED" : "JOB_COLLECTED", "JobCard", jobId, actorId, parsed);
  await notifyCustomer(job.customerId, `Job ${parsed.mode.toLowerCase()} confirmed`, `OmniTech has marked ${job.jobNumber} as ${status}.`, job.requestId);
  return job;
}

export async function createInvoiceForJob(actorId: string, jobId: string) {
  const job = await prisma.jobCard.findUnique({
    where: { id: jobId },
    include: { quotations: { where: { status: "ACCEPTED" }, orderBy: { acceptedAt: "desc" }, take: 1 } }
  });
  if (!job) throw new Error("Job card not found.");
  const quotation = job.quotations[0];
  if (!quotation) throw new Error("An accepted quotation is required before invoicing.");

  const result = await prisma.$transaction(async (tx) => {
    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber: nextNumber("INV"),
        customerId: job.customerId,
        jobCardId: job.id,
        quotationId: quotation.id,
        status: "SENT",
        subtotal: quotation.subtotal,
        discount: quotation.discount,
        tax: quotation.tax,
        total: quotation.total,
        paidAmount: 0,
        balanceDue: quotation.total,
        issuedAt: new Date(),
        dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    await setJobStatus(tx, jobId, "PAYMENT_PENDING", actorId, "Invoice issued and payment pending.");
    return invoice;
  });

  await audit("INVOICE_CREATED", "Invoice", result.id, actorId, { jobId, quotationId: quotation.id });
  await notifyCustomer(job.customerId, `Invoice issued: ${result.invoiceNumber}`, "Your OmniTech invoice is ready for payment.", job.requestId);
  return result;
}

export async function createWarrantyForJob(input: unknown, actorId: string, jobId: string) {
  const parsed = warrantyCreateSchema.parse(input);
  const job = await prisma.jobCard.findUnique({ where: { id: jobId } });
  if (!job) throw new Error("Job card not found.");

  const result = await prisma.$transaction(async (tx) => {
    const warranty = await tx.warranty.create({
      data: {
        warrantyNumber: nextNumber("WAR"),
        customerId: job.customerId,
        jobCardId: job.id,
        deviceId: job.deviceId,
        coverage: parsed.coverage,
        terms: parsed.terms,
        startsAt: parsed.startsAt ? new Date(parsed.startsAt) : new Date(),
        endsAt: new Date(parsed.endsAt),
        status: "ACTIVE"
      }
    });
    await setJobStatus(tx, jobId, "WARRANTY_ACTIVE", actorId, "Warranty issued.");
    return warranty;
  });

  await audit("WARRANTY_CREATED", "Warranty", result.id, actorId, { jobId });
  await notifyCustomer(job.customerId, `Warranty issued: ${result.warrantyNumber}`, "Your OmniTech warranty record is now active.", job.requestId);
  return result;
}

export { allowedTransitions };
