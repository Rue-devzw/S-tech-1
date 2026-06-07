import { AccountStatus, RoleName } from "@prisma/client";
import { audit } from "@/server/audit";
import { hashPassword, hashToken, randomToken } from "@/server/auth";
import { prisma } from "@/server/db";
import { managedUserCreateSchema, managedUserRoleUpdateSchema } from "@/server/validation";

const inviteHours = 72;
const resetMinutes = 30;
const technicianRoles: RoleName[] = ["TECHNICIAN", "FIELD_INSTALLER"];

function parseSkills(value?: string) {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 20);
}

async function syncPrimaryRole(userId: string, roleName: RoleName) {
  const role = await prisma.role.upsert({
    where: { name: roleName },
    update: {},
    create: { name: roleName, label: roleName.replaceAll("_", " "), isSystem: true }
  });

  await prisma.userRole.deleteMany({ where: { userId } });
  await prisma.userRole.create({ data: { userId, roleId: role.id } });
}

async function syncTechnicianProfile(userId: string, role: RoleName, input?: { serviceArea?: string; skills?: string }) {
  if (technicianRoles.includes(role)) {
    await prisma.technician.upsert({
      where: { userId },
      update: {
        skills: parseSkills(input?.skills),
        serviceArea: input?.serviceArea || null,
        isActive: true,
        deletedAt: null
      },
      create: {
        userId,
        skills: parseSkills(input?.skills),
        serviceArea: input?.serviceArea || null,
        isActive: true
      }
    });
    return;
  }

  await prisma.technician.updateMany({
    where: { userId, deletedAt: null },
    data: { isActive: false, deletedAt: new Date() }
  });
}

export async function createInvitation(input: { name: string; email: string; role: RoleName; actorId: string }) {
  const token = randomToken(36);
  const invitation = await prisma.userInvitation.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      role: input.role,
      invitedById: input.actorId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + inviteHours * 60 * 60 * 1000)
    }
  });

  await audit("USER_INVITED", "UserInvitation", invitation.id, input.actorId, {
    email: input.email,
    role: input.role
  });

  return { invitation, token };
}

export async function listManagedUsers() {
  const [users, pendingInvitations] = await Promise.all([
    prisma.user.findMany({
      where: { deletedAt: null, role: { not: "CUSTOMER" } },
      orderBy: [{ role: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        accountStatus: true,
        isActive: true,
        emailVerifiedAt: true,
        lastLoginAt: true,
        createdAt: true,
        technician: {
          select: {
            skills: true,
            serviceArea: true,
            isActive: true
          }
        }
      }
    }),
    prisma.userInvitation.findMany({
      where: { acceptedAt: null, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        expiresAt: true,
        createdAt: true
      }
    })
  ]);

  return { users, pendingInvitations };
}

export async function createManagedUser(input: unknown, actorId: string) {
  const parsed = managedUserCreateSchema.parse(input);
  const email = parsed.email.toLowerCase();

  const user = await prisma.user.create({
    data: {
      name: parsed.name,
      email,
      phone: parsed.phone || null,
      passwordHash: await hashPassword(parsed.password),
      role: parsed.role,
      accountStatus: "ACTIVE",
      isActive: true,
      emailVerifiedAt: new Date()
    }
  });

  await syncPrimaryRole(user.id, parsed.role);
  await syncTechnicianProfile(user.id, parsed.role, parsed);

  await audit("MANAGED_USER_CREATED", "User", user.id, actorId, {
    email,
    role: parsed.role
  });

  return user;
}

export async function updateManagedUserRole(userId: string, input: unknown, actorId: string) {
  if (userId === actorId) throw new Error("You cannot change your own role.");
  const parsed = managedUserRoleUpdateSchema.parse(input);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.role }
  });

  await syncPrimaryRole(user.id, parsed.role);
  await syncTechnicianProfile(user.id, parsed.role, parsed);

  await audit("USER_ROLE_UPDATED", "User", user.id, actorId, {
    role: parsed.role
  });

  return user;
}

export async function acceptInvitation(input: { token: string; password: string }) {
  const invitation = await prisma.userInvitation.findFirst({
    where: {
      tokenHash: hashToken(input.token),
      acceptedAt: null,
      expiresAt: { gt: new Date() }
    }
  });
  if (!invitation) throw new Error("Invitation is invalid or expired.");

  const role = await prisma.role.upsert({
    where: { name: invitation.role },
    update: {},
    create: { name: invitation.role, label: invitation.role.replaceAll("_", " "), isSystem: true }
  });

  const user = await prisma.user.upsert({
    where: { email: invitation.email },
    update: {
      name: invitation.name,
      passwordHash: await hashPassword(input.password),
      role: invitation.role,
      accountStatus: "ACTIVE",
      isActive: true,
      emailVerifiedAt: new Date()
    },
    create: {
      name: invitation.name,
      email: invitation.email,
      passwordHash: await hashPassword(input.password),
      role: invitation.role,
      accountStatus: "ACTIVE",
      emailVerifiedAt: new Date()
    }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id }
  });

  await prisma.userInvitation.update({ where: { id: invitation.id }, data: { acceptedAt: new Date() } });
  await audit("USER_INVITATION_ACCEPTED", "User", user.id, user.id, { invitationId: invitation.id });
  return user;
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  const token = randomToken(36);
  if (!user || user.deletedAt) return { token: null };

  const reset = await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + resetMinutes * 60 * 1000)
    }
  });

  await audit("PASSWORD_RESET_REQUESTED", "User", user.id, user.id, { resetId: reset.id });
  return { token };
}

export async function confirmPasswordReset(input: { token: string; password: string }) {
  const reset = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash: hashToken(input.token),
      usedAt: null,
      expiresAt: { gt: new Date() }
    },
    include: { user: true }
  });
  if (!reset || reset.user.deletedAt) throw new Error("Password reset token is invalid or expired.");

  await prisma.$transaction([
    prisma.user.update({
      where: { id: reset.userId },
      data: {
        passwordHash: await hashPassword(input.password),
        accountStatus: reset.user.accountStatus === "LOCKED" ? "ACTIVE" : reset.user.accountStatus
      }
    }),
    prisma.passwordResetToken.update({ where: { id: reset.id }, data: { usedAt: new Date() } }),
    prisma.userSession.updateMany({ where: { userId: reset.userId, revokedAt: null }, data: { revokedAt: new Date() } })
  ]);

  await audit("PASSWORD_RESET_COMPLETED", "User", reset.userId, reset.userId, { resetId: reset.id });
}

export async function updateAccountStatus(input: { userId: string; status: AccountStatus; isActive?: boolean; actorId: string }) {
  if (input.userId === input.actorId && (input.status !== "ACTIVE" || input.isActive === false)) {
    throw new Error("You cannot deactivate or lock your own account.");
  }

  const user = await prisma.user.update({
    where: { id: input.userId },
    data: {
      accountStatus: input.status,
      isActive: input.isActive ?? !["DISABLED", "SUSPENDED", "LOCKED"].includes(input.status)
    }
  });

  if (user.accountStatus !== "ACTIVE" || !user.isActive) {
    await prisma.userSession.updateMany({ where: { userId: user.id, revokedAt: null }, data: { revokedAt: new Date() } });
  }

  await audit("USER_STATUS_UPDATED", "User", user.id, input.actorId, {
    status: input.status,
    isActive: user.isActive
  });
  return user;
}
