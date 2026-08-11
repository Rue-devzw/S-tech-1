import { RoleName } from "@prisma/client";
import { currentUser } from "@/server/auth";
import { prisma } from "@/server/db";

export const permissionsByRole: Record<RoleName, string[]> = {
  SUPER_ADMIN: ["*"],
  MANAGER: [
    "dashboard:view",
    "users:manage",
    "customers:view",
    "requests:manage",
    "jobs:manage",
    "quotes:manage",
    "invoices:manage",
    "payments:record",
    "inventory:view",
    "products:manage",
    "field_visits:manage",
    "reports:view",
    "notifications:manage",
    "ai:use",
    "ai:approve",
    "audit:view"
  ],
  ADMIN_ASSISTANT: [
    "dashboard:view",
    "users:manage",
    "customers:manage",
    "requests:manage",
    "jobs:manage",
    "quotes:manage",
    "invoices:manage",
    "inventory:manage",
    "products:manage",
    "content:manage",
    "notifications:manage",
    "field_visits:manage",
    "ai:approve"
  ],
  TECHNICIAN: ["dashboard:view", "jobs:update_assigned", "inventory:view", "ai:use"],
  FIELD_INSTALLER: ["dashboard:view", "jobs:update_assigned", "field_visits:manage", "ai:use"],
  SALES_MARKETING: ["dashboard:view", "customers:manage", "requests:manage", "quotes:manage", "promotions:manage", "products:manage", "content:manage", "field_visits:manage", "notifications:manage", "ai:use", "ai:approve"],
  CUSTOMER: ["portal:view", "requests:create", "own_records:view"],
  VIEWER_AUDITOR: ["dashboard:view", "reports:view", "audit:view", "customers:view"]
};

export function roleHasPermission(role: RoleName, permission: string) {
  const permissions = permissionsByRole[role] ?? [];
  return permissions.includes("*") || permissions.includes(permission);
}

export async function userHasPermission(userId: string, permission: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              permissions: { include: { permission: true } }
            }
          }
        }
      }
    }
  });

  if (!user || user.deletedAt || user.accountStatus !== "ACTIVE" || !user.isActive) return false;
  if (roleHasPermission(user.role, permission)) return true;

  return user.userRoles.some((userRole) =>
    userRole.role.permissions.some((rolePermission) => rolePermission.permission.key === permission)
  );
}

export async function requirePermission(permission: string) {
  const user = await currentUser();
  if (!user) return null;
  if (!(await userHasPermission(user.id, permission))) return null;
  return user;
}

export async function requireAnyPermission(permissions: string[]) {
  const user = await currentUser();
  if (!user) return null;
  for (const permission of permissions) {
    if (await userHasPermission(user.id, permission)) return user;
  }
  return null;
}

export function dashboardPathForRole(role: RoleName) {
  if (role === "CUSTOMER") return "/customer";
  if (role === "TECHNICIAN" || role === "FIELD_INSTALLER") return "/technician";
  return "/admin";
}
