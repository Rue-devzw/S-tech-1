import { JobStatus } from "@prisma/client";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { queueNotification } from "@/server/providers/notifications";
import {
  repairChecklistSchema,
  repairCollectionSchema,
  repairEstimateSchema,
  repairIntakeSchema,
  repairNoteSchema,
  repairPartNeedSchema,
  technicianAssignmentSchema
} from "@/server/validation";

function nextNumber(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

const repairJobStatusByRepairStatus: Record<string, JobStatus> = {
  INTAKE: "CREATED",
  AWAITING_DEVICE: "CREATED",
  RECEIVED: "ASSIGNED",
  DIAGNOSING: "DIAGNOSING",
  WAITING_QUOTE_APPROVAL: "QUOTED",
  WAITING_PARTS: "WAITING_PARTS",
  REPAIRING: "IN_PROGRESS",
  TESTING: "QUALITY_CHECK",
  READY_FOR_COLLECTION: "READY_FOR_COLLECTION",
  COLLECTED: "DELIVERED",
  WARRANTY_ACTIVE: "WARRANTY_ACTIVE",
  CANCELLED: "CANCELLED"
};

export const commonFaultCategories = [
  "SCREEN_DAMAGE",
  "BATTERY_POWER",
  "CHARGING_PORT",
  "WATER_LIQUID_DAMAGE",
  "NO_POWER",
  "OVERHEATING",
  "SOFTWARE_OS",
  "STORAGE_DATA",
  "NETWORK_CONNECTIVITY",
  "AUDIO_VIDEO",
  "KEYBOARD_INPUT",
  "BOARD_COMPONENT",
  "PHYSICAL_DAMAGE",
  "INTERMITTENT_FAULT",
  "OTHER"
];

export const commonRepairStatuses = Object.keys(repairJobStatusByRepairStatus);

async function notifyCustomer(customerId: string, subject: string, body: string) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  const recipient = customer?.email || customer?.phone;
  if (!recipient || !customer?.consentToNotify) return;
  await queueNotification({
    channel: customer.email ? "EMAIL" : "SMS",
    recipient,
    subject,
    body
  });
}

async function writeStatusHistory(jobCardId: string, fromStatus: JobStatus | null, toStatus: JobStatus, actorId?: string, note?: string) {
  await prisma.jobStatusHistory.create({
    data: {
      jobCardId,
      fromStatus,
      toStatus,
      changedById: actorId,
      note
    }
  });
}

export async function createRepairIntake(input: unknown, actorId: string) {
  const parsed = repairIntakeSchema.parse(input);
  const customer = await prisma.customer.findUnique({ where: { id: parsed.customerId } });
  if (!customer) throw new Error("Customer not found.");

  const result = await prisma.$transaction(async (tx) => {
    const device = await tx.device.create({
      data: {
        customerId: parsed.customerId,
        type: parsed.device.type,
        make: parsed.device.make,
        model: parsed.device.model,
        serialNumber: parsed.device.serialNumber,
        imei: parsed.device.imei,
        conditionNotes: parsed.device.conditionNotes,
        accessories: parsed.accessoriesReceived.join(", ")
      }
    });

    const job =
      parsed.jobCardId
        ? await tx.jobCard.update({
            where: { id: parsed.jobCardId },
            data: {
              deviceId: device.id,
              assignedToId: parsed.technicianId,
              status: parsed.technicianId ? "ASSIGNED" : "CREATED",
              faultReported: parsed.faultDescription
            }
          })
        : await tx.jobCard.create({
            data: {
              jobNumber: nextNumber("JOB"),
              customerId: parsed.customerId,
              deviceId: device.id,
              assignedToId: parsed.technicianId,
              type: "BENCH_REPAIR",
              status: parsed.technicianId ? "ASSIGNED" : "CREATED",
              priority: "NORMAL",
              faultReported: parsed.faultDescription
            }
          });

    const intake = await tx.repairIntake.create({
      data: {
        intakeNumber: nextNumber("RIN"),
        jobCardId: job.id,
        deviceId: device.id,
        deviceType: parsed.device.type,
        faultCategory: parsed.faultCategory,
        repairStatus: "RECEIVED",
        conditionPhotos: parsed.conditionPhotos,
        accessoriesReceived: parsed.accessoriesReceived,
        faultDescription: parsed.faultDescription,
        customerPasswordNote: parsed.customerPasswordNote,
        receivedById: actorId,
        technicianId: parsed.technicianId,
        labourEstimateHours: parsed.labourEstimateHours,
        labourEstimateAmount: parsed.labourEstimateAmount,
        warrantyTerms: parsed.warrantyTerms,
        receivedAt: new Date()
      }
    });

    await tx.jobStatusHistory.create({
      data: {
        jobCardId: job.id,
        toStatus: job.status,
        changedById: actorId,
        note: "Repair device intake completed."
      }
    });

    return { intake, job, device };
  });

  await audit("REPAIR_INTAKE_CREATED", "RepairIntake", result.intake.id, actorId, {
    jobCardId: result.job.id,
    deviceType: parsed.device.type,
    faultCategory: parsed.faultCategory
  });
  await notifyCustomer(parsed.customerId, `Repair intake received: ${result.intake.intakeNumber}`, `OmniTech received your ${parsed.device.type.toLowerCase().replace("_", " ")} for assessment.`);
  return result;
}

export async function assignRepairTechnician(jobCardId: string, input: unknown, actorId: string) {
  const parsed = technicianAssignmentSchema.parse(input);
  const job = await prisma.jobCard.findUnique({ where: { id: jobCardId } });
  if (!job) throw new Error("Job card not found.");

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.jobCard.update({ where: { id: jobCardId }, data: { assignedToId: parsed.technicianId, status: "ASSIGNED" } });
    await tx.repairIntake.updateMany({ where: { jobCardId }, data: { technicianId: parsed.technicianId, repairStatus: "RECEIVED" } });
    await tx.jobStatusHistory.create({ data: { jobCardId, fromStatus: job.status, toStatus: "ASSIGNED", changedById: actorId, note: parsed.note ?? "Technician assigned." } });
    return next;
  });

  await audit("REPAIR_TECHNICIAN_ASSIGNED", "JobCard", jobCardId, actorId, { technicianId: parsed.technicianId });
  return updated;
}

export async function saveRepairChecklist(jobCardId: string, input: unknown, actorId: string) {
  const parsed = repairChecklistSchema.parse(input);
  const job = await prisma.jobCard.findUnique({ where: { id: jobCardId } });
  if (!job) throw new Error("Job card not found.");

  const checklist = await prisma.repairChecklist.create({
    data: {
      jobCardId,
      type: parsed.type,
      title: parsed.title,
      items: parsed.items,
      completedById: parsed.completed ? actorId : undefined,
      completedAt: parsed.completed ? new Date() : undefined,
      notes: parsed.notes
    }
  });

  const status: JobStatus = parsed.type === "DIAGNOSTIC" ? "DIAGNOSING" : "QUALITY_CHECK";
  await prisma.jobCard.update({ where: { id: jobCardId }, data: { status } });
  await prisma.repairIntake.updateMany({ where: { jobCardId }, data: { repairStatus: parsed.type === "DIAGNOSTIC" ? "DIAGNOSING" : "TESTING" } });
  await writeStatusHistory(jobCardId, job.status, status, actorId, `${parsed.type.toLowerCase()} checklist saved.`);
  await audit("REPAIR_CHECKLIST_SAVED", "RepairChecklist", checklist.id, actorId, { jobCardId, type: parsed.type });
  return checklist;
}

export async function saveRepairPartsNeeded(jobCardId: string, input: unknown, actorId: string) {
  const parsed = repairPartNeedSchema.parse(input);
  const job = await prisma.jobCard.findUnique({ where: { id: jobCardId } });
  if (!job) throw new Error("Job card not found.");

  const parts = await prisma.$transaction(
    parsed.parts.map((part) =>
      prisma.repairPartNeed.create({
        data: {
          jobCardId,
          inventoryItemId: part.inventoryItemId,
          partName: part.partName,
          quantity: part.quantity,
          estimatedUnitCost: part.estimatedUnitCost,
          isRequired: part.isRequired,
          notes: part.notes
        }
      })
    )
  );

  await prisma.repairIntake.updateMany({ where: { jobCardId }, data: { repairStatus: "WAITING_PARTS" } });
  await prisma.jobCard.update({ where: { id: jobCardId }, data: { status: "WAITING_PARTS" } });
  await writeStatusHistory(jobCardId, job.status, "WAITING_PARTS", actorId, "Repair parts needed recorded.");
  await audit("REPAIR_PARTS_NEEDED_RECORDED", "JobCard", jobCardId, actorId, { count: parts.length });
  return parts;
}

export async function saveRepairEstimate(jobCardId: string, input: unknown, actorId: string) {
  const parsed = repairEstimateSchema.parse(input);
  const intake = await prisma.repairIntake.update({
    where: { jobCardId },
    data: {
      labourEstimateHours: parsed.labourEstimateHours,
      labourEstimateAmount: parsed.labourEstimateAmount,
      warrantyTerms: parsed.warrantyTerms
    }
  });
  await audit("REPAIR_ESTIMATE_UPDATED", "RepairIntake", intake.id, actorId, { jobCardId });
  return intake;
}

export async function addRepairNote(jobCardId: string, input: unknown, actorId: string) {
  const parsed = repairNoteSchema.parse(input);
  const note = await prisma.repairNote.create({ data: { jobCardId, authorId: actorId, note: parsed.note } });
  await audit("REPAIR_NOTE_ADDED", "RepairNote", note.id, actorId, { jobCardId });
  return note;
}

export async function confirmCustomerCollection(jobCardId: string, input: unknown, actorId: string) {
  const parsed = repairCollectionSchema.parse(input);
  const job = await prisma.jobCard.findUnique({ where: { id: jobCardId } });
  if (!job) throw new Error("Job card not found.");

  const confirmation = await prisma.$transaction(async (tx) => {
    const record = await tx.customerCollectionConfirmation.upsert({
      where: { jobCardId },
      update: {
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        confirmationNote: parsed.confirmationNote,
        conditionAccepted: parsed.conditionAccepted,
        collectedAt: new Date()
      },
      create: {
        jobCardId,
        customerName: parsed.customerName,
        customerPhone: parsed.customerPhone,
        confirmationNote: parsed.confirmationNote,
        conditionAccepted: parsed.conditionAccepted
      }
    });
    await tx.repairIntake.updateMany({ where: { jobCardId }, data: { repairStatus: "COLLECTED" } });
    await tx.jobCard.update({ where: { id: jobCardId }, data: { status: "DELIVERED" } });
    await tx.jobStatusHistory.create({ data: { jobCardId, fromStatus: job.status, toStatus: "DELIVERED", changedById: actorId, note: "Customer collection confirmed." } });
    return record;
  });

  await audit("CUSTOMER_COLLECTION_CONFIRMED", "CustomerCollectionConfirmation", confirmation.id, actorId, { jobCardId });
  await notifyCustomer(job.customerId, `Collection confirmed: ${job.jobNumber}`, "OmniTech has recorded collection of your repaired device.");
  return confirmation;
}
