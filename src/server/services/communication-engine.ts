import { NotificationChannel, NotificationTrigger } from "@prisma/client";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { dispatchNotification, queueNotification } from "@/server/providers/notifications";
import {
  dispatchNotificationsSchema,
  manualMessageSchema,
  messageTemplateSchema,
  triggerNotificationSchema
} from "@/server/validation";

const defaultTemplates: Record<NotificationTrigger, { subject: string; body: string }> = {
  REQUEST_RECEIVED: {
    subject: "Request received: {{requestNumber}}",
    body: "Hello {{customerName}}, OmniTech received your request {{requestNumber}}. We will review it and contact you shortly."
  },
  JOB_CREATED: {
    subject: "Job created: {{jobNumber}}",
    body: "Hello {{customerName}}, OmniTech created job card {{jobNumber}} for your service request."
  },
  DIAGNOSIS_COMPLETE: {
    subject: "Diagnosis complete: {{jobNumber}}",
    body: "Your diagnosis for {{jobNumber}} is complete. Recommendation: {{recommendation}}"
  },
  QUOTATION_SENT: {
    subject: "Quotation ready: {{quotationNumber}}",
    body: "Your OmniTech quotation {{quotationNumber}} is ready. Total: {{total}}."
  },
  QUOTATION_APPROVED: {
    subject: "Quotation approved: {{quotationNumber}}",
    body: "Quotation {{quotationNumber}} has been approved. OmniTech will continue with the next step."
  },
  PARTS_ORDERED: {
    subject: "Parts update: {{jobNumber}}",
    body: "Parts for {{jobNumber}} have been ordered or reserved. We will update you when work continues."
  },
  REPAIR_IN_PROGRESS: {
    subject: "Work in progress: {{jobNumber}}",
    body: "OmniTech has started work on {{jobNumber}}."
  },
  READY_FOR_COLLECTION: {
    subject: "Ready for collection: {{jobNumber}}",
    body: "{{jobNumber}} is ready for collection. Please contact OmniTech before coming through."
  },
  INVOICE_ISSUED: {
    subject: "Invoice issued: {{invoiceNumber}}",
    body: "Invoice {{invoiceNumber}} has been issued. Amount due: {{total}}."
  },
  PAYMENT_RECEIVED: {
    subject: "Payment received: {{receiptNumber}}",
    body: "Thank you. Payment for {{invoiceNumber}} was received. Receipt: {{receiptNumber}}."
  },
  WARRANTY_EXPIRING: {
    subject: "Warranty reminder: {{warrantyNumber}}",
    body: "Your OmniTech warranty {{warrantyNumber}} expires on {{expiryDate}}."
  },
  FOLLOW_UP_REMINDER: {
    subject: "Follow-up reminder: {{taskTitle}}",
    body: "Reminder: {{taskTitle}} is due on {{dueDate}}."
  },
  MANUAL_MESSAGE: {
    subject: "Message from OmniTech Solutions",
    body: "{{message}}"
  }
};

function render(template: string | null | undefined, data: Record<string, unknown>) {
  return (template ?? "").replace(/\{\{(\w+)\}\}/g, (_match, key) => String(data[key] ?? ""));
}

async function resolveRecipient(input: { customerId?: string; userId?: string; channel: NotificationChannel; fallback?: string }) {
  if (input.fallback) return input.fallback;
  if (input.customerId) {
    const customer = await prisma.customer.findUnique({ where: { id: input.customerId } });
    if (!customer?.consentToNotify) return null;
    if (input.channel === "EMAIL") return customer.email;
    return customer.phone;
  }
  if (input.userId) {
    const user = await prisma.user.findUnique({ where: { id: input.userId } });
    if (input.channel === "EMAIL") return user?.email;
    return user?.phone;
  }
  return null;
}

export async function upsertMessageTemplate(input: unknown, actorId: string) {
  const parsed = messageTemplateSchema.parse(input);
  const template = await prisma.messageTemplate.upsert({
    where: { key: parsed.key },
    update: parsed,
    create: parsed
  });
  await audit("MESSAGE_TEMPLATE_UPSERTED", "MessageTemplate", template.id, actorId, {
    key: template.key,
    trigger: template.trigger,
    channel: template.channel
  });
  return template;
}

export async function listMessageTemplates() {
  return prisma.messageTemplate.findMany({ where: { deletedAt: null }, orderBy: [{ trigger: "asc" }, { channel: "asc" }, { name: "asc" }] });
}

export async function triggerNotification(input: unknown, actorId?: string) {
  const parsed = triggerNotificationSchema.parse(input);
  const channels = parsed.channels?.length ? parsed.channels : (["EMAIL"] as NotificationChannel[]);
  const queued = [];

  for (const channel of channels) {
    const template =
      (await prisma.messageTemplate.findFirst({
        where: { trigger: parsed.trigger, channel, isActive: true, deletedAt: null }
      })) ?? null;
    const fallback = defaultTemplates[parsed.trigger];
    const recipient = await resolveRecipient({ customerId: parsed.customerId, userId: parsed.userId, channel });
    if (!recipient) continue;

    queued.push(
      await queueNotification({
        channel,
        recipient,
        subject: render(template?.subject ?? fallback.subject, parsed.data),
        body: render(template?.body ?? fallback.body, parsed.data),
        serviceRequestId: parsed.serviceRequestId,
        userId: parsed.userId,
        templateId: template?.id,
        trigger: parsed.trigger
      })
    );
  }

  await audit("NOTIFICATION_TRIGGERED", "NotificationLog", queued[0]?.id, actorId, {
    trigger: parsed.trigger,
    count: queued.length
  });
  return queued;
}

export async function sendManualMessage(input: unknown, actorId: string) {
  const parsed = manualMessageSchema.parse(input);
  const message = await prisma.manualMessage.create({
    data: {
      customerId: parsed.customerId,
      sentById: actorId,
      channel: parsed.channel,
      recipient: parsed.recipient,
      subject: parsed.subject,
      body: parsed.body
    }
  });

  const log = await queueNotification({
    channel: parsed.channel,
    recipient: parsed.recipient,
    subject: parsed.subject,
    body: parsed.body,
    manualMessageId: message.id,
    trigger: "MANUAL_MESSAGE"
  });

  await audit("MANUAL_MESSAGE_QUEUED", "ManualMessage", message.id, actorId, { channel: parsed.channel });
  return { message, log };
}

export async function listDeliveryLogs() {
  return prisma.notificationLog.findMany({
    orderBy: { queuedAt: "desc" },
    take: 100,
    include: { template: true, manualMessage: true, serviceRequest: true }
  });
}

export async function dispatchQueuedNotifications(input: unknown, actorId?: string) {
  const parsed = dispatchNotificationsSchema.parse(input ?? {});
  const queued = await prisma.notificationLog.findMany({
    where: { status: "QUEUED" },
    orderBy: { queuedAt: "asc" },
    take: parsed.limit
  });
  const results = [];
  for (const item of queued) {
    results.push(await dispatchNotification(item.id));
  }
  await audit("NOTIFICATION_DISPATCH_BATCH", "NotificationLog", results[0]?.id, actorId, { count: results.length });
  return results;
}

export { defaultTemplates };
