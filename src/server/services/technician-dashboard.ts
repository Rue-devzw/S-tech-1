import { JobStatus, RoleName } from "@prisma/client";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { repairChecklistSchema, repairNoteSchema, workflowTransitionSchema } from "@/server/validation";

const privilegedRoles: RoleName[] = ["SUPER_ADMIN", "MANAGER", "ADMIN_ASSISTANT"];
const technicianStatuses: JobStatus[] = ["ASSIGNED", "DIAGNOSING", "IN_PROGRESS", "WAITING_PARTS", "QUALITY_CHECK", "READY_FOR_COLLECTION"];

function photosFromJson(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const photo = item as { filename?: unknown; url?: unknown };
      return {
        filename: typeof photo.filename === "string" ? photo.filename : "Device photo",
        url: typeof photo.url === "string" ? photo.url : ""
      };
    })
    .filter((item): item is { filename: string; url: string } => Boolean(item));
}

function canAccessAssignedJob(role: RoleName, assignedToId: string | null, userId: string) {
  return privilegedRoles.includes(role) || assignedToId === userId;
}

async function assertTechnicianJobAccess(jobId: string, user: { id: string; role: RoleName }) {
  const job = await prisma.jobCard.findUnique({
    where: { id: jobId },
    select: { id: true, assignedToId: true, status: true }
  });
  if (!job || !canAccessAssignedJob(user.role, job.assignedToId, user.id)) {
    throw new Error("You can only update jobs assigned to you.");
  }
  return job;
}

export async function getTechnicianDashboard(user: { id: string; role: RoleName }) {
  const where = {
    deletedAt: null,
    ...(privilegedRoles.includes(user.role) ? {} : { assignedToId: user.id })
  };

  const jobs = await prisma.jobCard.findMany({
    where,
    orderBy: [{ scheduledFor: "asc" }, { updatedAt: "desc" }],
    take: 60,
    include: {
      customer: { select: { name: true, phone: true } },
      device: { select: { type: true, make: true, model: true, serialNumber: true, conditionNotes: true, accessories: true } },
      assignedTo: { select: { id: true, name: true } },
      repairIntake: true,
      repairChecklists: { orderBy: { createdAt: "desc" } },
      repairPartNeeds: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          partName: true,
          quantity: true,
          isRequired: true,
          notes: true,
          inventoryItem: { select: { name: true, sku: true, quantityOnHand: true, quantityReserved: true } }
        }
      },
      repairNotes: { orderBy: { createdAt: "desc" }, take: 6 },
      diagnoses: { orderBy: { createdAt: "desc" }, take: 3, select: { status: true, symptoms: true, findings: true, recommendation: true, createdAt: true } }
    }
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const assignedJobs = jobs.filter((job) => technicianStatuses.includes(job.status));
  const diagnosisQueue = jobs.filter((job) => job.status === "ASSIGNED" || job.status === "DIAGNOSING" || job.repairIntake?.repairStatus === "DIAGNOSING");
  const overdueJobs = jobs.filter((job) => job.scheduledFor && job.scheduledFor < today && !["COMPLETED", "CANCELLED", "DELIVERED"].includes(job.status));

  return {
    stats: {
      assigned: assignedJobs.length,
      diagnosisQueue: diagnosisQueue.length,
      overdue: overdueJobs.length,
      testing: jobs.filter((job) => job.status === "QUALITY_CHECK").length,
      waitingParts: jobs.filter((job) => job.status === "WAITING_PARTS").length
    },
    jobs: jobs.map((job) => ({
      id: job.id,
      jobNumber: job.jobNumber,
      type: job.type,
      status: job.status,
      priority: job.priority,
      scheduledFor: job.scheduledFor?.toISOString() ?? null,
      dueLabel: job.scheduledFor ? job.scheduledFor.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" }) : "No due date",
      assignedTo: job.assignedTo?.name ?? "Unassigned",
      customer: job.customer,
      faultDescription: job.repairIntake?.faultDescription ?? job.faultReported,
      device: job.device,
      repairStatus: job.repairIntake?.repairStatus ?? null,
      faultCategory: job.repairIntake?.faultCategory ?? null,
      accessoriesReceived: job.repairIntake?.accessoriesReceived ?? [],
      devicePhotos: photosFromJson(job.repairIntake?.conditionPhotos),
      requiredParts: job.repairPartNeeds,
      repairNotes: job.repairNotes.map((note) => ({
        id: note.id,
        note: note.note,
        author: note.authorId === user.id ? "You" : "Technician",
        createdAt: note.createdAt.toISOString()
      })),
      testingChecklists: job.repairChecklists.filter((checklist) => checklist.type === "TEST"),
      diagnosticChecklists: job.repairChecklists.filter((checklist) => checklist.type === "DIAGNOSTIC"),
      diagnoses: job.diagnoses.map((diagnosis) => ({
        ...diagnosis,
        createdAt: diagnosis.createdAt.toISOString()
      }))
    }))
  };
}

export async function updateAssignedJobStatus(jobId: string, input: unknown, user: { id: string; role: RoleName }) {
  const parsed = workflowTransitionSchema.parse(input);
  const job = await assertTechnicianJobAccess(jobId, user);
  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.jobCard.update({ where: { id: jobId }, data: { status: parsed.toStatus } });
    await tx.jobStatusHistory.create({
      data: {
        jobCardId: jobId,
        fromStatus: job.status,
        toStatus: parsed.toStatus,
        changedById: user.id,
        note: parsed.note ?? "Technician status update."
      }
    });
    return next;
  });
  await audit("TECHNICIAN_JOB_STATUS_UPDATED", "JobCard", jobId, user.id, { toStatus: parsed.toStatus });
  return updated;
}

export async function addAssignedRepairNote(jobId: string, input: unknown, user: { id: string; role: RoleName }) {
  await assertTechnicianJobAccess(jobId, user);
  const parsed = repairNoteSchema.parse(input);
  const note = await prisma.repairNote.create({ data: { jobCardId: jobId, authorId: user.id, note: parsed.note } });
  await audit("TECHNICIAN_REPAIR_NOTE_ADDED", "RepairNote", note.id, user.id, { jobId });
  return note;
}

export async function saveAssignedTestingChecklist(jobId: string, input: unknown, user: { id: string; role: RoleName }) {
  await assertTechnicianJobAccess(jobId, user);
  const parsed = repairChecklistSchema.parse(input);
  const checklist = await prisma.repairChecklist.create({
    data: {
      jobCardId: jobId,
      type: parsed.type,
      title: parsed.title,
      items: parsed.items,
      completedById: parsed.completed ? user.id : undefined,
      completedAt: parsed.completed ? new Date() : undefined,
      notes: parsed.notes
    }
  });
  await audit("TECHNICIAN_CHECKLIST_SAVED", "RepairChecklist", checklist.id, user.id, { jobId, type: parsed.type });
  return checklist;
}
