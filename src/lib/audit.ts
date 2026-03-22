export interface AuditEvent {
  id: string;
  actor: string;
  action: string;
  entityType:
    | "listing"
    | "inquiry"
    | "notification"
    | "security"
    | "settings"
    | "session"
    | "admin_user";
  entityId: string;
  summary: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}
