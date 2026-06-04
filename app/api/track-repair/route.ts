import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function publicStatus(status: string) {
  const descriptions: Record<string, string> = {
    NEW: "Your request has been received and is awaiting admin review.",
    TRIAGED: "Your request has been reviewed and converted into an OmniTech job card.",
    QUOTED: "A quotation has been prepared or sent for approval.",
    APPROVED: "The work has been approved and is ready to continue.",
    IN_PROGRESS: "The OmniTech team is working on your repair or service.",
    WAITING_PARTS: "Work is waiting for required parts or materials.",
    READY: "Your job is ready for collection, delivery or handover.",
    COMPLETED: "This job has been completed.",
    CANCELLED: "This request or job has been cancelled.",
    CREATED: "A job card has been created.",
    ASSIGNED: "A technician has been assigned.",
    DIAGNOSING: "Diagnosis or assessment is in progress.",
    WAITING_CUSTOMER: "OmniTech is waiting for customer feedback or approval.",
    QUALITY_CHECK: "The job is in testing or quality check.",
    READY_FOR_COLLECTION: "Your item is ready for collection.",
    PAYMENT_PENDING: "An invoice has been issued and payment is pending.",
    READY_FOR_DELIVERY: "Your job is ready for delivery or handover.",
    DELIVERED: "The item or service has been delivered.",
    WARRANTY_ACTIVE: "Warranty cover is active."
  };
  return descriptions[status] ?? `Current status: ${label(status)}.`;
}

function statusSteps(status: string) {
  const steps = ["Received", "Reviewed", "Diagnosis", "Quotation", "Work in progress", "Testing", "Ready", "Closed"];
  const currentByStatus: Record<string, number> = {
    NEW: 0,
    TRIAGED: 1,
    CREATED: 1,
    ASSIGNED: 1,
    DIAGNOSING: 2,
    QUOTED: 3,
    WAITING_CUSTOMER: 3,
    APPROVED: 4,
    WAITING_PARTS: 4,
    IN_PROGRESS: 4,
    QUALITY_CHECK: 5,
    READY: 6,
    READY_FOR_COLLECTION: 6,
    PAYMENT_PENDING: 6,
    READY_FOR_DELIVERY: 6,
    DELIVERED: 7,
    WARRANTY_ACTIVE: 7,
    COMPLETED: 7,
    CANCELLED: 7
  };
  const current = currentByStatus[status] ?? 0;
  return steps.map((name, index) => ({ name, state: index < current ? "done" : index === current ? "current" : "pending" }));
}

export async function GET(request: Request) {
  const reference = new URL(request.url).searchParams.get("reference")?.trim().toUpperCase();
  if (!reference || reference.length < 6) {
    return NextResponse.json({ error: "Enter a valid request or job reference." }, { status: 400 });
  }

  const job = await prisma.jobCard.findFirst({
    where: { jobNumber: reference, deletedAt: null },
    include: {
      customer: true,
      assignedTo: { select: { name: true } },
      request: { include: { service: { include: { category: true } } } },
      device: true,
      statusHistory: { orderBy: { createdAt: "desc" }, take: 6 },
      diagnoses: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 1 },
      quotations: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 1 },
      invoices: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 1 },
      warranties: { where: { deletedAt: null }, orderBy: { createdAt: "desc" }, take: 1 }
    }
  });

  if (job) {
    return NextResponse.json({
      result: {
        type: "JOB",
        reference: job.jobNumber,
        status: job.status,
        statusLabel: label(job.status),
        summary: publicStatus(job.status),
        service: job.request?.service.name ?? label(job.type),
        category: job.request?.service.category.name ?? label(job.type),
        customerName: job.customer.name,
        technicianName: job.assignedTo?.name ?? null,
        device: job.device ? [job.device.make, job.device.model].filter(Boolean).join(" ") || job.device.type : null,
        fault: job.faultReported,
        scheduledFor: job.scheduledFor,
        updatedAt: job.updatedAt,
        steps: statusSteps(job.status),
        timeline: job.statusHistory.map((entry) => ({
          status: entry.toStatus,
          statusLabel: label(entry.toStatus),
          note: entry.note,
          createdAt: entry.createdAt
        })),
        diagnosis: job.diagnoses[0]
          ? {
              status: label(job.diagnoses[0].status),
              recommendation: job.diagnoses[0].recommendation
            }
          : null,
        quotation: job.quotations[0]
          ? {
              number: job.quotations[0].quotationNumber,
              status: label(job.quotations[0].status),
              total: Number(job.quotations[0].total)
            }
          : null,
        invoice: job.invoices[0]
          ? {
              number: job.invoices[0].invoiceNumber,
              status: label(job.invoices[0].status),
              total: Number(job.invoices[0].total),
              balanceDue: Number(job.invoices[0].balanceDue)
            }
          : null,
        warranty: job.warranties[0]
          ? {
              number: job.warranties[0].warrantyNumber,
              status: label(job.warranties[0].status),
              endsAt: job.warranties[0].endsAt
            }
          : null
      }
    });
  }

  const serviceRequest = await prisma.serviceRequest.findFirst({
    where: { requestNumber: reference, deletedAt: null },
    include: {
      customer: true,
      service: { include: { category: true } },
      jobCard: { select: { jobNumber: true, status: true, updatedAt: true } }
    }
  });

  if (!serviceRequest) {
    return NextResponse.json({ error: "No OmniTech request or job was found for that reference." }, { status: 404 });
  }

  const status = serviceRequest.jobCard?.status ?? serviceRequest.status;
  return NextResponse.json({
    result: {
      type: "REQUEST",
      reference: serviceRequest.requestNumber,
      linkedJobNumber: serviceRequest.jobCard?.jobNumber ?? null,
      status,
      statusLabel: label(status),
      summary: publicStatus(status),
      service: serviceRequest.service.name,
      category: serviceRequest.service.category.name,
      customerName: serviceRequest.customer.name,
      fault: serviceRequest.description,
      scheduledFor: null,
      updatedAt: serviceRequest.updatedAt,
      steps: statusSteps(status),
      timeline: [
        {
          status: serviceRequest.status,
          statusLabel: label(serviceRequest.status),
          note: serviceRequest.jobCard ? `Job card ${serviceRequest.jobCard.jobNumber} has been created.` : "Request received by OmniTech.",
          createdAt: serviceRequest.updatedAt
        }
      ],
      diagnosis: null,
      quotation: null,
      invoice: null,
      warranty: null
    }
  });
}
