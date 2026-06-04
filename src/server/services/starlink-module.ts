import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { queueNotification } from "@/server/providers/notifications";
import {
  starlinkAppointmentSchema,
  starlinkDisclaimer,
  starlinkEnquirySchema,
  starlinkHandoverSchema,
  starlinkInstallationPlanSchema,
  starlinkServiceRecordSchema,
  starlinkSiteSurveySchema,
  starlinkSupportResolutionSchema,
  starlinkSupportTicketSchema
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

export async function createStarlinkEnquiry(input: unknown, actorId?: string) {
  const parsed = starlinkEnquirySchema.parse(input);
  if (!parsed.officialDisclaimerAccepted) {
    throw new Error("Starlink service disclaimer must be acknowledged.");
  }

  const enquiry = await prisma.starlinkEnquiry.create({
    data: {
      enquiryNumber: nextNumber("STQ"),
      customerId: parsed.customerId,
      serviceRequestId: parsed.serviceRequestId,
      jobCardId: parsed.jobCardId,
      enquiryType: parsed.enquiryType,
      kitStatus: parsed.kitStatus,
      siteAddress: parsed.siteAddress,
      siteContact: parsed.siteContact,
      sitePhone: parsed.sitePhone,
      usageGoal: parsed.usageGoal,
      notes: `${parsed.notes ?? ""}\n\nDisclaimer: ${starlinkDisclaimer}`.trim(),
      officialDisclaimerAccepted: parsed.officialDisclaimerAccepted
    }
  });

  await audit("STARLINK_ENQUIRY_CREATED", "StarlinkEnquiry", enquiry.id, actorId, { enquiryType: enquiry.enquiryType });
  await notifyCustomer(parsed.customerId, `Starlink enquiry received: ${enquiry.enquiryNumber}`, "OmniTech received your Starlink-related enquiry and will follow up with next steps.");
  return enquiry;
}

export async function createStarlinkSiteSurvey(input: unknown, actorId: string) {
  const parsed = starlinkSiteSurveySchema.parse(input);
  const survey = await prisma.starlinkSiteSurvey.create({
    data: {
      surveyNumber: nextNumber("STS"),
      customerId: parsed.customerId,
      jobCardId: parsed.jobCardId,
      fieldVisitId: parsed.fieldVisitId,
      obstructionLevel: parsed.obstructionLevel,
      obstructionNotes: parsed.obstructionNotes,
      recommendedMounting: parsed.recommendedMounting,
      roofAccessNotes: parsed.roofAccessNotes,
      cableRouteNotes: parsed.cableRouteNotes,
      powerLocationNotes: parsed.powerLocationNotes,
      photos: parsed.photos,
      completedById: parsed.completed ? actorId : undefined,
      completedAt: parsed.completed ? new Date() : undefined
    }
  });

  await audit("STARLINK_SITE_SURVEY_CREATED", "StarlinkSiteSurvey", survey.id, actorId, {
    obstructionLevel: parsed.obstructionLevel,
    recommendedMounting: parsed.recommendedMounting
  });
  return survey;
}

export async function createStarlinkInstallationPlan(input: unknown, actorId: string) {
  const parsed = starlinkInstallationPlanSchema.parse(input);
  const plan = await prisma.starlinkInstallationPlan.create({
    data: {
      planNumber: nextNumber("STP"),
      customerId: parsed.customerId,
      jobCardId: parsed.jobCardId,
      fieldVisitId: parsed.fieldVisitId,
      mountingType: parsed.mountingType,
      accessoriesRequired: parsed.accessoriesRequired,
      wifiCoveragePlan: parsed.wifiCoveragePlan,
      routerConfigNotes: parsed.routerConfigNotes,
      meshExtenderPlan: parsed.meshExtenderPlan,
      setupChecklist: parsed.setupChecklist
    }
  });

  await audit("STARLINK_INSTALLATION_PLAN_CREATED", "StarlinkInstallationPlan", plan.id, actorId, {
    mountingType: parsed.mountingType,
    accessoriesRequired: parsed.accessoriesRequired
  });
  return plan;
}

export async function bookStarlinkAppointment(input: unknown, actorId: string) {
  const parsed = starlinkAppointmentSchema.parse(input);
  const appointment = await prisma.$transaction(async (tx) => {
    const booking = await tx.appointment.create({
      data: {
        customerId: parsed.customerId,
        serviceRequestId: parsed.serviceRequestId,
        jobCardId: parsed.jobCardId,
        assignedToId: parsed.assignedToId,
        title: "Starlink-related service appointment",
        status: "CONFIRMED",
        startsAt: new Date(parsed.startsAt),
        endsAt: new Date(parsed.endsAt),
        location: parsed.location,
        notes: `${parsed.notes ?? ""}\n\n${starlinkDisclaimer}`.trim()
      }
    });

    await tx.fieldVisit.create({
      data: {
        visitNumber: nextNumber("VIS"),
        appointmentId: booking.id,
        customerId: parsed.customerId,
        jobCardId: parsed.jobCardId,
        technicianId: parsed.assignedToId,
        status: "PLANNED",
        address: parsed.location
      }
    });

    return booking;
  });

  await audit("STARLINK_APPOINTMENT_BOOKED", "Appointment", appointment.id, actorId, { location: parsed.location });
  await notifyCustomer(parsed.customerId, "Starlink-related appointment booked", `Your OmniTech appointment is booked for ${new Date(parsed.startsAt).toLocaleString()}.`);
  return appointment;
}

export async function recordStarlinkHandover(planId: string, input: unknown, actorId: string) {
  const parsed = starlinkHandoverSchema.parse(input);
  const plan = await prisma.starlinkInstallationPlan.update({
    where: { id: planId },
    data: {
      handoverNotes: parsed.handoverNotes,
      handoverAcceptedBy: parsed.handoverAcceptedBy,
      handoverAcceptedAt: new Date()
    }
  });
  await audit("STARLINK_HANDOVER_RECORDED", "StarlinkInstallationPlan", plan.id, actorId, { acceptedBy: parsed.handoverAcceptedBy });
  return plan;
}

export async function createStarlinkSupportTicket(input: unknown, actorId?: string) {
  const parsed = starlinkSupportTicketSchema.parse(input);
  const ticket = await prisma.starlinkSupportTicket.create({
    data: {
      ticketNumber: nextNumber("STT"),
      customerId: parsed.customerId,
      jobCardId: parsed.jobCardId,
      issue: parsed.issue
    }
  });
  await audit("STARLINK_SUPPORT_TICKET_CREATED", "StarlinkSupportTicket", ticket.id, actorId, { jobCardId: parsed.jobCardId });
  await notifyCustomer(parsed.customerId, `Support ticket opened: ${ticket.ticketNumber}`, "OmniTech opened your Starlink-related support ticket.");
  return ticket;
}

export async function updateStarlinkSupportTicket(ticketId: string, input: unknown, actorId: string) {
  const parsed = starlinkSupportResolutionSchema.parse(input);
  const ticket = await prisma.starlinkSupportTicket.update({
    where: { id: ticketId },
    data: {
      status: parsed.status,
      resolution: parsed.resolution,
      resolvedAt: ["RESOLVED", "CLOSED"].includes(parsed.status) ? new Date() : undefined
    }
  });
  await audit("STARLINK_SUPPORT_TICKET_UPDATED", "StarlinkSupportTicket", ticket.id, actorId, { status: parsed.status });
  return ticket;
}

export async function createStarlinkServiceRecord(input: unknown, actorId: string) {
  const parsed = starlinkServiceRecordSchema.parse(input);
  const record = await prisma.starlinkServiceRecord.create({
    data: {
      recordNumber: nextNumber("STR"),
      customerId: parsed.customerId,
      jobCardId: parsed.jobCardId,
      type: parsed.type,
      previousAddress: parsed.previousAddress,
      newAddress: parsed.newAddress,
      issueSummary: parsed.issueSummary,
      actionsTaken: parsed.actionsTaken,
      outcome: parsed.outcome,
      createdById: actorId
    }
  });
  await audit("STARLINK_SERVICE_RECORD_CREATED", "StarlinkServiceRecord", record.id, actorId, { type: parsed.type });
  return record;
}

export { starlinkDisclaimer };
