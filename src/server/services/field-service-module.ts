import { brand } from "@/lib/constants";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { queueNotification } from "@/server/providers/notifications";
import {
  fieldAppointmentSchema,
  fieldChecklistSchema,
  fieldVisitEvidenceSchema,
  fieldVisitStatusSchema,
  followUpTaskSchema,
  followUpTaskStatusSchema,
  serviceReportSchema
} from "@/server/validation";

function nextNumber(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

async function notifyCustomer(customerId: string, subject: string, body: string) {
  const customer = await prisma.customer.findUnique({ where: { id: customerId } });
  const recipient = customer?.email || customer?.phone;
  if (!recipient || !customer?.consentToNotify) return;
  await queueNotification({ channel: customer.email ? "EMAIL" : "SMS", recipient, subject, body });
}

export async function listFieldSchedule() {
  return prisma.fieldVisit.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    take: 80,
    include: {
      customer: true,
      technician: true,
      appointment: true,
      jobCard: true,
      checklists: true,
      followUpTasks: true,
      serviceReport: true
    }
  });
}

export async function bookFieldAppointment(input: unknown, actorId: string) {
  const parsed = fieldAppointmentSchema.parse(input);
  const result = await prisma.$transaction(async (tx) => {
    const appointment = await tx.appointment.create({
      data: {
        customerId: parsed.customerId,
        serviceRequestId: parsed.serviceRequestId,
        jobCardId: parsed.jobCardId,
        assignedToId: parsed.technicianId,
        title: parsed.title,
        status: "CONFIRMED",
        startsAt: new Date(parsed.startsAt),
        endsAt: new Date(parsed.endsAt),
        location: parsed.address,
        notes: parsed.notes
      }
    });

    const visit = await tx.fieldVisit.create({
      data: {
        visitNumber: nextNumber("VIS"),
        appointmentId: appointment.id,
        customerId: parsed.customerId,
        jobCardId: parsed.jobCardId,
        technicianId: parsed.technicianId,
        serviceType: parsed.serviceType,
        status: "PLANNED",
        siteContact: parsed.siteContact,
        sitePhone: parsed.sitePhone,
        address: parsed.address,
        latitude: parsed.latitude,
        longitude: parsed.longitude,
        travelNotes: parsed.travelNotes,
        notes: parsed.notes
      }
    });

    return { appointment, visit };
  });

  await audit("FIELD_APPOINTMENT_BOOKED", "FieldVisit", result.visit.id, actorId, {
    serviceType: parsed.serviceType,
    technicianId: parsed.technicianId
  });
  await notifyCustomer(parsed.customerId, `Field visit booked: ${result.visit.visitNumber}`, `${brand.name} booked your ${parsed.serviceType.replaceAll("_", " ").toLowerCase()} visit.`);
  return result;
}

export async function updateFieldVisitStatus(fieldVisitId: string, input: unknown, actorId: string) {
  const parsed = fieldVisitStatusSchema.parse(input);
  const visit = await prisma.fieldVisit.update({
    where: { id: fieldVisitId },
    data: {
      status: parsed.status,
      arrivalAt: parsed.arrivalAt ? new Date(parsed.arrivalAt) : undefined,
      departureAt: parsed.departureAt ? new Date(parsed.departureAt) : undefined,
      notes: parsed.note
    }
  });
  await audit("FIELD_VISIT_STATUS_UPDATED", "FieldVisit", visit.id, actorId, { status: parsed.status });
  return visit;
}

export async function saveFieldChecklist(fieldVisitId: string, input: unknown, actorId: string) {
  const parsed = fieldChecklistSchema.parse(input);
  const checklist = await prisma.installationChecklist.create({
    data: {
      fieldVisitId,
      type: parsed.type,
      name: parsed.name,
      items: parsed.items,
      completedBy: parsed.completed ? actorId : undefined,
      completedAt: parsed.completed ? new Date() : undefined,
      notes: parsed.notes
    }
  });
  await audit("FIELD_CHECKLIST_SAVED", "InstallationChecklist", checklist.id, actorId, { fieldVisitId, type: parsed.type });
  return checklist;
}

export async function saveFieldEvidence(fieldVisitId: string, input: unknown, actorId: string) {
  const parsed = fieldVisitEvidenceSchema.parse(input);
  const visit = await prisma.fieldVisit.update({
    where: { id: fieldVisitId },
    data: {
      fieldPhotos: parsed.fieldPhotos,
      customerSignatureName: parsed.customerSignatureName,
      customerSignatureData: parsed.customerSignatureData,
      customerSignedAt: parsed.customerSignatureName || parsed.customerSignatureData ? new Date() : undefined,
      outcome: parsed.outcome,
      notes: parsed.notes
    }
  });
  await audit("FIELD_EVIDENCE_SAVED", "FieldVisit", visit.id, actorId, {
    photos: parsed.fieldPhotos.length,
    signed: Boolean(parsed.customerSignatureName || parsed.customerSignatureData)
  });
  return visit;
}

export async function createFollowUpTask(fieldVisitId: string, input: unknown, actorId: string) {
  const parsed = followUpTaskSchema.parse(input);
  const visit = await prisma.fieldVisit.findUnique({ where: { id: fieldVisitId } });
  if (!visit) throw new Error("Field visit not found.");

  const task = await prisma.followUpTask.create({
    data: {
      fieldVisitId,
      jobCardId: visit.jobCardId,
      assignedToId: parsed.assignedToId,
      title: parsed.title,
      description: parsed.description,
      dueAt: parsed.dueAt ? new Date(parsed.dueAt) : undefined
    }
  });
  await audit("FIELD_FOLLOW_UP_CREATED", "FollowUpTask", task.id, actorId, { fieldVisitId });
  return task;
}

export async function updateFollowUpTaskStatus(taskId: string, input: unknown, actorId: string) {
  const parsed = followUpTaskStatusSchema.parse(input);
  const task = await prisma.followUpTask.update({ where: { id: taskId }, data: { status: parsed.status } });
  await audit("FIELD_FOLLOW_UP_UPDATED", "FollowUpTask", task.id, actorId, { status: parsed.status });
  return task;
}

export async function generateServiceReport(fieldVisitId: string, input: unknown, actorId: string) {
  const parsed = serviceReportSchema.parse(input);
  const visit = await prisma.fieldVisit.findUnique({
    where: { id: fieldVisitId },
    include: { customer: true, technician: true, appointment: true, checklists: true, followUpTasks: true, jobCard: true }
  });
  if (!visit) throw new Error("Field visit not found.");

  const summary =
    parsed.summary ||
    `${visit.serviceType.replaceAll("_", " ")} visit for ${visit.customer.name}. Outcome: ${visit.outcome || "Pending outcome notes."}`;
  const checklistHtml = visit.checklists
    .map((checklist) => `<li><strong>${checklist.name}</strong> (${checklist.type})</li>`)
    .join("");
  const followUpHtml = visit.followUpTasks.map((task) => `<li>${task.title} - ${task.status}</li>`).join("");
  const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${brand.name} Field Service Report ${visit.visitNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #18212f; background: #f5f7fb; }
          main { max-width: 880px; margin: 32px auto; background: #fff; border: 1px solid #dce3ee; padding: 36px; }
          h1 { margin: 0; }
          .tagline { color: #0f766e; font-weight: 700; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 24px; }
          section { border-top: 1px solid #dce3ee; padding-top: 20px; margin-top: 20px; }
          .label { color: #64748b; font-size: 12px; text-transform: uppercase; font-weight: 700; }
          @media print { body { background: #fff; } main { margin: 0; border: 0; } }
        </style>
      </head>
      <body>
        <main>
          <h1>${brand.name}</h1>
          <div class="tagline">${brand.tagline}</div>
          <h2>Field Service Report - ${visit.visitNumber}</h2>
          <div class="grid">
            <div><div class="label">Customer</div>${visit.customer.name}<br/>${visit.customer.phone}</div>
            <div><div class="label">Service</div>${visit.serviceType.replaceAll("_", " ")}<br/>${visit.status}</div>
            <div><div class="label">Location</div>${visit.address}</div>
            <div><div class="label">Technician</div>${visit.technician?.name ?? "Unassigned"}</div>
          </div>
          <section><h3>Summary</h3><p>${summary}</p></section>
          <section><h3>Travel and Site Notes</h3><p>${visit.travelNotes || visit.notes || "No notes recorded."}</p></section>
          <section><h3>Outcome</h3><p>${visit.outcome || "No outcome recorded."}</p></section>
          <section><h3>Checklists</h3><ul>${checklistHtml || "<li>No checklists recorded.</li>"}</ul></section>
          <section><h3>Follow-up Tasks</h3><ul>${followUpHtml || "<li>No follow-up tasks.</li>"}</ul></section>
          <section><h3>Customer Signature</h3><p>${visit.customerSignatureName || "Signature pending"}</p></section>
        </main>
      </body>
    </html>`;

  const report = await prisma.serviceReport.upsert({
    where: { fieldVisitId },
    update: { summary, html, generatedById: actorId, generatedAt: new Date() },
    create: {
      reportNumber: nextNumber("FSR"),
      fieldVisitId,
      jobCardId: visit.jobCardId,
      summary,
      html,
      generatedById: actorId
    }
  });
  await audit("FIELD_SERVICE_REPORT_GENERATED", "ServiceReport", report.id, actorId, { fieldVisitId });
  return report;
}

export async function getServiceReportHtml(reportId: string) {
  return prisma.serviceReport.findUnique({ where: { id: reportId } });
}
