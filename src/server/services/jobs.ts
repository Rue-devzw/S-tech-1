import { JobType } from "@prisma/client";
import { prisma } from "@/server/db";
import { audit } from "@/server/audit";
import { jobStatusSchema } from "@/server/validation";

function nextJobNumber() {
  return `JOB-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export async function createJobFromRequest(requestId: string, type: JobType, actorId?: string) {
  const request = await prisma.serviceRequest.findUnique({
    where: { id: requestId },
    include: { customer: true, service: true }
  });
  if (!request) throw new Error("Service request not found.");

  const job = await prisma.jobCard.create({
    data: {
      jobNumber: nextJobNumber(),
      requestId: request.id,
      customerId: request.customerId,
      type,
      priority: request.priority,
      faultReported: request.description,
      status: "CREATED"
    }
  });

  await prisma.serviceRequest.update({ where: { id: requestId }, data: { status: "TRIAGED" } });
  await audit("JOB_CARD_CREATED", "JobCard", job.id, actorId, { requestNumber: request.requestNumber });
  return job;
}

export async function updateJobCard(id: string, input: unknown, actorId?: string) {
  const parsed = jobStatusSchema.parse(input);
  const job = await prisma.jobCard.update({
    where: { id },
    data: {
      status: parsed.status,
      workDone: parsed.workDone,
      scheduledFor: parsed.scheduledFor ? new Date(parsed.scheduledFor) : undefined
    }
  });
  await audit("JOB_CARD_UPDATED", "JobCard", id, actorId, parsed);
  return job;
}
