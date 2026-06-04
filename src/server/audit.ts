import { prisma } from "@/server/db";

export async function audit(action: string, entity: string, entityId?: string, actorId?: string, metadata?: object) {
  await prisma.auditLog.create({
    data: {
      action,
      entity,
      entityId,
      actorId,
      metadata: metadata ?? undefined
    }
  });
}
