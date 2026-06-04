import { NotificationChannel, NotificationTrigger } from "@prisma/client";
import { prisma } from "@/server/db";

export type NotificationPayload = {
  channel: NotificationChannel;
  recipient: string;
  subject?: string;
  body: string;
  serviceRequestId?: string;
  userId?: string;
  templateId?: string;
  trigger?: NotificationTrigger;
  manualMessageId?: string;
};

export async function queueNotification(payload: NotificationPayload) {
  return prisma.notificationLog.create({
    data: {
      ...payload,
      status: "QUEUED"
    }
  });
}

export async function dispatchNotification(id: string) {
  const notification = await prisma.notificationLog.findUnique({ where: { id } });
  if (!notification) return null;

  try {
    const provider =
      notification.channel === "EMAIL"
        ? process.env.EMAIL_PROVIDER || "log"
        : notification.channel === "WHATSAPP"
          ? process.env.WHATSAPP_PROVIDER || "log"
          : notification.channel === "SMS"
            ? process.env.SMS_PROVIDER || "log"
            : "in-app";

    console.info(`[notification:${notification.channel}:${provider}] ${notification.recipient} ${notification.subject ?? ""}`);
    return prisma.notificationLog.update({
      where: { id },
      data: {
        status: "SENT",
        sentAt: new Date(),
        provider,
        providerMessageId: `${provider}_${id}`
      }
    });
  } catch (error) {
    return prisma.notificationLog.update({
      where: { id },
      data: { status: "FAILED", error: error instanceof Error ? error.message : "Unknown notification error" }
    });
  }
}
