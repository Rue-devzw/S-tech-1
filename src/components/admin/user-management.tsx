"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingButtonContent } from "@/components/brand-loader";

type UserItem = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  accountStatus: string;
  isActive: boolean;
  emailVerifiedAt: string | Date | null;
  lastLoginAt: string | Date | null;
  createdAt: string | Date;
  technician: {
    skills: string[];
    serviceArea: string | null;
    isActive: boolean;
  } | null;
};

type PendingInvitation = {
  id: string;
  name: string;
  email: string;
  role: string;
  expiresAt: string | Date;
  createdAt: string | Date;
};

type Props = {
  users: UserItem[];
  pendingInvitations: PendingInvitation[];
};

const roles = [
  ["SUPER_ADMIN", "Super Admin"],
  ["MANAGER", "Manager"],
  ["ADMIN_ASSISTANT", "Admin Assistant"],
  ["TECHNICIAN", "Technician"],
  ["FIELD_INSTALLER", "Field Installer"],
  ["SALES_MARKETING", "Sales / Marketing"],
  ["VIEWER_AUDITOR", "Viewer / Auditor"]
];

const accountStatuses = [
  ["ACTIVE", "Active"],
  ["SUSPENDED", "Suspended"],
  ["DISABLED", "Disabled"],
  ["LOCKED", "Locked"]
];

function isTechnicianRole(role: string) {
  return role === "TECHNICIAN" || role === "FIELD_INSTALLER";
}

function label(value: string) {
  return value.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | Date | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error ?? "Request failed.");
  return body;
}

export function UserManagement({ users, pendingInvitations }: Props) {
  const router = useRouter();
  const [createRole, setCreateRole] = useState("TECHNICIAN");
  const [createState, setCreateState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [createMessage, setCreateMessage] = useState("");

  const stats = useMemo(() => {
    const active = users.filter((user) => user.isActive && user.accountStatus === "ACTIVE").length;
    const technicians = users.filter((user) => isTechnicianRole(user.role)).length;
    const admins = users.filter((user) => ["SUPER_ADMIN", "MANAGER", "ADMIN_ASSISTANT"].includes(user.role)).length;
    return { active, technicians, admins };
  }, [users]);

  async function createUser(formData: FormData) {
    setCreateState("saving");
    setCreateMessage("");
    try {
      await parseResponse(
        await fetch("/api/admin/users", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: String(formData.get("name") ?? ""),
            email: String(formData.get("email") ?? ""),
            phone: String(formData.get("phone") ?? ""),
            password: String(formData.get("password") ?? ""),
            role: String(formData.get("role") ?? "TECHNICIAN"),
            serviceArea: String(formData.get("serviceArea") ?? ""),
            skills: String(formData.get("skills") ?? "")
          })
        })
      );
      setCreateState("success");
      setCreateMessage("User created. Share the temporary password securely and ask them to change it after first login.");
      router.refresh();
    } catch (error) {
      setCreateState("error");
      setCreateMessage(error instanceof Error ? error.message : "Could not create user.");
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="rounded-lg bg-brand-band p-6 text-white shadow-glow">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-100">Settings</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Users and roles</h1>
            <p className="mt-2 max-w-3xl text-white/82">
              Create admins, technicians and staff accounts, assign roles, manage technician profiles and suspend access when needed.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center text-sm">
            <Metric label="Active" value={stats.active} />
            <Metric label="Admins" value={stats.admins} />
            <Metric label="Technicians" value={stats.technicians} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="omni-card rounded-lg p-5">
          <h2 className="text-xl font-semibold text-ink">Create user</h2>
          <form action={createUser} className="mt-4 grid gap-3">
            <label>Name<input name="name" required minLength={2} placeholder="Full name" /></label>
            <label>Email<input name="email" required type="email" placeholder="name@omnitech.io" /></label>
            <label>Phone<input name="phone" placeholder="+263..." /></label>
            <label>
              Temporary password
              <input name="password" required minLength={12} type="password" placeholder="At least 12 characters" />
            </label>
            <label>
              Role
              <select name="role" value={createRole} onChange={(event) => setCreateRole(event.target.value)}>
                {roles.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
              </select>
            </label>
            {isTechnicianRole(createRole) ? (
              <div className="grid gap-3 rounded-lg border border-line bg-cloud p-4">
                <label>Service area<input name="serviceArea" placeholder="Harare, Chitungwiza, remote..." /></label>
                <label>Skills<input name="skills" placeholder="Phone repair, networking, Starlink..." /></label>
              </div>
            ) : null}
            <button disabled={createState === "saving"} className="rounded-md bg-copper px-4 py-3 text-sm font-semibold text-ink shadow-lift disabled:opacity-70">
              <LoadingButtonContent loading={createState === "saving"} loadingLabel="Creating user">
                Create account
              </LoadingButtonContent>
            </button>
            {createMessage ? <p className={`text-sm font-semibold ${createState === "error" ? "text-red-700" : "text-teal"}`}>{createMessage}</p> : null}
          </form>

          <div className="mt-6 rounded-lg border border-line bg-white p-4">
            <h3 className="font-semibold text-ink">Role guide</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <p><span className="font-semibold text-ink">Super Admin:</span> full control, including users and settings.</p>
              <p><span className="font-semibold text-ink">Admin Assistant:</span> day-to-day operations, jobs, quotes, content and communications.</p>
              <p><span className="font-semibold text-ink">Technician:</span> assigned repair jobs and technician dashboard.</p>
              <p><span className="font-semibold text-ink">Field Installer:</span> field jobs, visits and installation work.</p>
            </div>
          </div>
        </section>

        <section className="omni-card rounded-lg p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-ink">Staff accounts</h2>
            <p className="text-sm font-semibold text-slate-500">{users.length} users</p>
          </div>
          <div className="mt-4 grid gap-3">
            {users.map((user) => (
              <UserRow key={user.id} user={user} />
            ))}
          </div>
        </section>
      </div>

      {pendingInvitations.length ? (
        <section className="omni-card mt-6 rounded-lg p-5">
          <h2 className="text-xl font-semibold text-ink">Pending invitations</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="border-b border-line text-xs uppercase text-slate-500">
                <tr><th className="py-3">Name</th><th>Email</th><th>Role</th><th>Created</th><th>Expires</th></tr>
              </thead>
              <tbody>
                {pendingInvitations.map((invite) => (
                  <tr key={invite.id} className="border-b border-line last:border-0">
                    <td className="py-3 font-semibold text-ink">{invite.name}</td>
                    <td>{invite.email}</td>
                    <td>{label(invite.role)}</td>
                    <td>{formatDate(invite.createdAt)}</td>
                    <td>{formatDate(invite.expiresAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </section>
  );
}

function Metric({ label: text, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/18 bg-white/12 px-4 py-3 backdrop-blur">
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs font-semibold text-white/72">{text}</p>
    </div>
  );
}

function UserRow({ user }: { user: UserItem }) {
  const router = useRouter();
  const [role, setRole] = useState(user.role);
  const [roleState, setRoleState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [statusState, setStatusState] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function updateRole(formData: FormData) {
    setRoleState("saving");
    setMessage("");
    try {
      await parseResponse(
        await fetch(`/api/admin/users/${user.id}/role`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            role: String(formData.get("role") ?? role),
            serviceArea: String(formData.get("serviceArea") ?? ""),
            skills: String(formData.get("skills") ?? "")
          })
        })
      );
      setRoleState("success");
      setMessage("Role updated.");
      router.refresh();
    } catch (error) {
      setRoleState("error");
      setMessage(error instanceof Error ? error.message : "Could not update role.");
    }
  }

  async function updateStatus(formData: FormData) {
    setStatusState("saving");
    setMessage("");
    const status = String(formData.get("status") ?? "ACTIVE");
    try {
      await parseResponse(
        await fetch(`/api/admin/users/${user.id}/status`, {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            status,
            isActive: status === "ACTIVE"
          })
        })
      );
      setStatusState("success");
      setMessage("Status updated.");
      router.refresh();
    } catch (error) {
      setStatusState("error");
      setMessage(error instanceof Error ? error.message : "Could not update status.");
    }
  }

  const statusTone = user.isActive && user.accountStatus === "ACTIVE" ? "bg-success/12 text-success" : "bg-copper/14 text-copper";

  return (
    <article className="rounded-lg border border-line bg-white/84 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-ink">{user.name}</h3>
          <p className="text-sm text-slate-600">{user.email}</p>
          <p className="text-xs text-slate-500">{user.phone ?? "No phone"} · Last login: {formatDate(user.lastLoginAt)}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}>
          {label(user.accountStatus)}{user.isActive ? "" : " / Inactive"}
        </span>
      </div>

      <div className="mt-4 grid gap-3 xl:grid-cols-2">
        <form action={updateRole} className="grid gap-3 rounded-lg border border-line bg-cloud p-3">
          <label>
            Role
            <select name="role" value={role} onChange={(event) => setRole(event.target.value)}>
              {roles.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
          </label>
          {isTechnicianRole(role) ? (
            <>
              <label>Service area<input name="serviceArea" defaultValue={user.technician?.serviceArea ?? ""} placeholder="Service area" /></label>
              <label>Skills<input name="skills" defaultValue={user.technician?.skills.join(", ") ?? ""} placeholder="Comma-separated skills" /></label>
            </>
          ) : null}
          <button disabled={roleState === "saving"} className="rounded-md bg-ink px-3 py-2 text-xs font-semibold text-white disabled:opacity-70">
            <LoadingButtonContent loading={roleState === "saving"} loadingLabel="Saving role">
              Save role
            </LoadingButtonContent>
          </button>
        </form>

        <form action={updateStatus} className="grid content-start gap-3 rounded-lg border border-line bg-cloud p-3">
          <label>
            Account status
            <select name="status" defaultValue={user.accountStatus}>
              {accountStatuses.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
            </select>
          </label>
          <button disabled={statusState === "saving"} className="rounded-md border border-line bg-white px-3 py-2 text-xs font-semibold text-ink disabled:opacity-70">
            <LoadingButtonContent loading={statusState === "saving"} loadingLabel="Saving status">
              Save status
            </LoadingButtonContent>
          </button>
          <p className="text-xs text-slate-500">Created {formatDate(user.createdAt)}</p>
        </form>
      </div>
      {message ? <p className={`mt-3 text-sm font-semibold ${roleState === "error" || statusState === "error" ? "text-red-700" : "text-teal"}`}>{message}</p> : null}
    </article>
  );
}
