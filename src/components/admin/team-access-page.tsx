"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Shield, UserCheck, UserX, Plus, KeyRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAdminUsers } from "@/lib/use-admin-users";
import { type AdminRole, type AdminUser } from "@/lib/admin-user";

const ROLE_OPTIONS: AdminRole[] = ["owner", "manager", "support"];

export function TeamAccessPage() {
  const { toast } = useToast();
  const { users, loading, setUsers } = useAdminUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    displayName: "",
    email: "",
    role: "support" as AdminRole,
    password: "",
  });

  const filteredUsers = useMemo(
    () =>
      users.filter((user) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
          return true;
        }

        return (
          user.displayName.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.role.toLowerCase().includes(query)
        );
      }),
    [searchQuery, users]
  );

  const counts = {
    total: users.length,
    active: users.filter((user) => user.status === "active").length,
    inactive: users.filter((user) => user.status === "inactive").length,
    owners: users.filter((user) => user.role === "owner").length,
  };

  async function createUser() {
    setSaving(true);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to create team member.");
      }

      const data = (await response.json()) as { user: AdminUser };
      setUsers((current) => [...current, data.user]);
      setNewUser({
        username: "",
        displayName: "",
        email: "",
        role: "support",
        password: "",
      });
      setCreateOpen(false);
      toast({
        title: "Team Member Added",
        description: `${data.user.displayName} can now access the admin.`,
      });
    } catch (caughtError) {
      toast({
        title: "Invite Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to create team member.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  }

  async function updateUser(
    id: string,
    updates: Partial<Pick<AdminUser, "role" | "status">>
  ) {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          ...updates,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to update team member.");
      }

      const data = (await response.json()) as { user: AdminUser };
      setUsers((current) =>
        current.map((user) => (user.id === data.user.id ? data.user : user))
      );
      toast({
        title: "Access Updated",
        description: `${data.user.displayName}'s access has been updated.`,
      });
    } catch (caughtError) {
      toast({
        title: "Update Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to update team member.",
        variant: "destructive",
      });
    }
  }

  async function resetUserMfa(user: AdminUser) {
    try {
      const response = await fetch("/api/admin/mfa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "disable",
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to reset MFA.");
      }

      setUsers((current) =>
        current.map((entry) =>
          entry.id === user.id ? { ...entry, mfaEnabled: false } : entry
        )
      );
      toast({
        title: "MFA Reset",
        description: `${user.displayName} will need to enroll again.`,
      });
    } catch (caughtError) {
      toast({
        title: "MFA Reset Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to reset MFA.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="mb-2 text-3xl font-bold font-headline text-primary">
            Team Access
          </h1>
          <p className="text-muted-foreground">
            Manage admin users, roles, and account status.
          </p>
        </div>

        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-white hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Admin User</DialogTitle>
              <DialogDescription>
                Add a named account instead of sharing the primary owner login.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={newUser.displayName}
                  onChange={(event) =>
                    setNewUser((current) => ({
                      ...current,
                      displayName: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(event) =>
                    setNewUser((current) => ({
                      ...current,
                      username: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(event) =>
                    setNewUser((current) => ({
                      ...current,
                      email: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser((current) => ({
                      ...current,
                      role: value as AdminRole,
                    }))
                  }
                >
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem key={role} value={role} className="capitalize">
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Temporary Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(event) =>
                    setNewUser((current) => ({
                      ...current,
                      password: event.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                onClick={createUser}
                disabled={
                  saving ||
                  !newUser.displayName.trim() ||
                  !newUser.username.trim() ||
                  !newUser.email.trim() ||
                  !newUser.password.trim()
                }
              >
                {saving ? "Creating..." : "Create User"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          {
            label: "Total Accounts",
            count: counts.total,
            icon: Shield,
            color: "text-primary",
            bg: "bg-primary/10",
          },
          {
            label: "Active",
            count: counts.active,
            icon: UserCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-100",
          },
          {
            label: "Inactive",
            count: counts.inactive,
            icon: UserX,
            color: "text-slate-500",
            bg: "bg-slate-100",
          },
          {
            label: "Owners",
            count: counts.owners,
            icon: KeyRound,
            color: "text-amber-600",
            bg: "bg-amber-100",
          },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`rounded-2xl p-3 ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold font-headline text-primary">
                  {loading ? "..." : stat.count}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          className="border-none bg-white pl-10 shadow-sm"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <Card className="overflow-hidden border-none shadow-sm">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="pl-6">Team Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MFA</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="pr-6 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-16 text-center text-muted-foreground"
                >
                  {loading
                    ? "Loading team members..."
                    : "No matching team members found."}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="hover:bg-muted/10">
                  <TableCell className="py-4 pl-6">
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">
                        {user.displayName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.username} · {user.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === "active" ? "secondary" : "outline"}
                      className="rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider capitalize"
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.mfaEnabled ? "Enabled" : "Not enrolled"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {user.lastLoginAt
                      ? new Date(user.lastLoginAt).toLocaleString()
                      : "Never"}
                  </TableCell>
                  <TableCell className="pr-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Manage
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {ROLE_OPTIONS.filter((role) => role !== user.role).map(
                          (role) => (
                            <DropdownMenuItem
                              key={role}
                              onClick={() => updateUser(user.id, { role })}
                              className="capitalize"
                            >
                              Make {role}
                            </DropdownMenuItem>
                          )
                        )}
                        {user.status === "active" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              updateUser(user.id, { status: "inactive" })
                            }
                          >
                            Suspend access
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              updateUser(user.id, { status: "active" })
                            }
                          >
                            Reactivate access
                          </DropdownMenuItem>
                        )}
                        {user.mfaEnabled ? (
                          <DropdownMenuItem onClick={() => resetUserMfa(user)}>
                            Reset MFA
                          </DropdownMenuItem>
                        ) : null}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
