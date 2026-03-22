export type AdminRole = "owner" | "manager" | "support";
export type AdminStatus = "active" | "inactive";

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  email: string;
  role: AdminRole;
  status: AdminStatus;
  mfaEnabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface AdminSession {
  id: string;
  expiresAt: string;
  createdAt?: string;
  lastSeenAt?: string;
  user: AdminUser;
}

export interface AdminSessionRecord extends AdminSession {
  createdAt: string;
  lastSeenAt: string;
  isCurrent?: boolean;
}

export interface AdminPasswordResetRequest {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
  consumedAt: string | null;
  requestedBy: string;
}

export interface AdminMfaStatus {
  enabled: boolean;
  pending: boolean;
  enabledAt: string | null;
  recoveryCodesRemaining: number;
}
