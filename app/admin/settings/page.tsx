"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Save,
  Bell,
  Shield,
  Globe,
  History,
  Database,
  Send,
  Mail,
  Smartphone,
  Clock3,
  LogOut,
} from "lucide-react";
import { usePlatformSettings } from "@/lib/use-platform-settings";
import { useAuditEvents } from "@/lib/use-audit-events";
import { useNotificationJobs } from "@/lib/use-notification-jobs";
import { useAdminSessions } from "@/lib/use-admin-sessions";
import { useAdminMfa } from "@/lib/use-admin-mfa";
import { type NotificationDeliveryMode } from "@/lib/notification-job";
import {
  type GeneralSettings,
  type NotificationSettings,
  type SecuritySettings,
} from "@/lib/platform-settings";

const notificationToggleItems: Array<{
  key: "emailOnNewInquiry" | "emailOnNewSale" | "weeklyReport" | "systemAlerts";
  label: string;
  description: string;
}> = [
  {
    key: "emailOnNewInquiry",
    label: "Email on new inquiry",
    description:
      "Receive an email whenever a new lead inquiry is submitted.",
  },
  {
    key: "emailOnNewSale",
    label: "Email on new sale",
    description: "Get notified immediately when a purchase is completed.",
  },
  {
    key: "weeklyReport",
    label: "Weekly performance report",
    description:
      "Receive a weekly summary of revenue, sales, and visitor stats.",
  },
  {
    key: "systemAlerts",
    label: "System alerts",
    description: "Critical maintenance and security alert notifications.",
  },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const {
    settings,
    loading: settingsLoading,
    refresh: refreshSettings,
  } = usePlatformSettings();
  const {
    events,
    loading: auditLoading,
    refresh: refreshAudit,
  } = useAuditEvents();
  const {
    jobs,
    summary,
    health,
    webhookEvents,
    loading: notificationsLoading,
    refresh: refreshNotifications,
  } = useNotificationJobs();
  const {
    sessions,
    loading: sessionsLoading,
    refresh: refreshSessions,
  } = useAdminSessions();
  const {
    status: mfaStatus,
    loading: mfaLoading,
    refresh: refreshMfa,
  } = useAdminMfa();

  const [general, setGeneral] = useState(settings.general);
  const [notifications, setNotifications] = useState(settings.notifications);
  const [security, setSecurity] = useState(settings.security);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [dispatchingNotifications, setDispatchingNotifications] =
    useState(false);
  const [requeueingNotifications, setRequeueingNotifications] = useState(false);
  const [mfaWorking, setMfaWorking] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaEnrollment, setMfaEnrollment] = useState<{
    formattedSecret: string;
    provisioningUri: string;
    recoveryCodes: string[];
  } | null>(null);
  const [revokingSessionId, setRevokingSessionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    setGeneral(settings.general);
    setNotifications(settings.notifications);
    setSecurity(settings.security);
  }, [settings]);

  async function saveSection(
    section: "general" | "notifications" | "security",
    value: GeneralSettings | NotificationSettings | SecuritySettings,
    successTitle: string,
    successDescription: string
  ) {
    setSavingSection(section);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section,
          value,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to save settings.");
      }

      await Promise.all([
        refreshSettings(),
        refreshAudit(),
        refreshNotifications(),
      ]);
      toast({
        title: successTitle,
        description: successDescription,
      });
    } catch (caughtError) {
      toast({
        title: "Save Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to save settings.",
        variant: "destructive",
      });
    } finally {
      setSavingSection(null);
    }
  }

  async function dispatchNotifications() {
    setDispatchingNotifications(true);

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "dispatch_due",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to dispatch notifications.");
      }

      await Promise.all([refreshNotifications(), refreshAudit()]);
      toast({
        title: "Dispatch Complete",
        description: "Queued notifications have been processed.",
      });
    } catch (caughtError) {
      toast({
        title: "Dispatch Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to dispatch notifications.",
        variant: "destructive",
      });
    } finally {
      setDispatchingNotifications(false);
    }
  }

  async function requeueNotifications() {
    setRequeueingNotifications(true);

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "requeue_failed",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to requeue notifications.");
      }

      await Promise.all([refreshNotifications(), refreshAudit()]);
      toast({
        title: "Notifications Requeued",
        description: "Failed notifications are ready for another dispatch.",
      });
    } catch (caughtError) {
      toast({
        title: "Requeue Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to requeue notifications.",
        variant: "destructive",
      });
    } finally {
      setRequeueingNotifications(false);
    }
  }

  async function startMfaEnrollment() {
    setMfaWorking(true);

    try {
      const response = await fetch("/api/admin/mfa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "start_enrollment",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to start MFA enrollment.");
      }

      const data = (await response.json()) as {
        enrollment: {
          formattedSecret: string;
          provisioningUri: string;
          recoveryCodes: string[];
        };
      };

      setMfaEnrollment(data.enrollment);
      setMfaCode("");
      toast({
        title: "MFA Enrollment Started",
        description: "Save the secret and recovery codes, then confirm a code.",
      });
    } catch (caughtError) {
      toast({
        title: "MFA Setup Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to start MFA enrollment.",
        variant: "destructive",
      });
    } finally {
      setMfaWorking(false);
    }
  }

  async function confirmMfaEnrollment() {
    setMfaWorking(true);

    try {
      const response = await fetch("/api/admin/mfa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "confirm_enrollment",
          code: mfaCode,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to confirm MFA.");
      }

      setMfaEnrollment(null);
      setMfaCode("");
      await refreshMfa();
      toast({
        title: "MFA Enabled",
        description: "Your admin account now requires an authenticator code.",
      });
    } catch (caughtError) {
      toast({
        title: "MFA Confirmation Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to confirm MFA.",
        variant: "destructive",
      });
    } finally {
      setMfaWorking(false);
    }
  }

  async function disableMfa() {
    setMfaWorking(true);

    try {
      const response = await fetch("/api/admin/mfa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "disable",
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to disable MFA.");
      }

      setMfaEnrollment(null);
      setMfaCode("");
      await refreshMfa();
      toast({
        title: "MFA Disabled",
        description: "Authenticator protection has been removed from this account.",
      });
    } catch (caughtError) {
      toast({
        title: "MFA Disable Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to disable MFA.",
        variant: "destructive",
      });
    } finally {
      setMfaWorking(false);
    }
  }

  async function revokeSession(sessionId: string) {
    setRevokingSessionId(sessionId);

    try {
      const response = await fetch("/api/admin/sessions", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
        }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Unable to revoke the session.");
      }

      await refreshSessions();
      toast({
        title: "Session Revoked",
        description: "The selected admin session has been signed out.",
      });
    } catch (caughtError) {
      toast({
        title: "Revocation Failed",
        description:
          caughtError instanceof Error
            ? caughtError.message
            : "Unable to revoke the session.",
        variant: "destructive",
      });
    } finally {
      setRevokingSessionId(null);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold font-headline text-primary">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure your S-Tech Digital Hub platform settings.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-headline text-primary">
                  General
                </CardTitle>
                <CardDescription>
                  Basic platform information and contact details.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={general.siteName}
                    disabled={settingsLoading}
                    onChange={(event) =>
                      setGeneral((prev) => ({
                        ...prev,
                        siteName: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteTagline">Tagline</Label>
                  <Input
                    id="siteTagline"
                    value={general.siteTagline}
                    disabled={settingsLoading}
                    onChange={(event) =>
                      setGeneral((prev) => ({
                        ...prev,
                        siteTagline: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={general.contactEmail}
                    disabled={settingsLoading}
                    onChange={(event) =>
                      setGeneral((prev) => ({
                        ...prev,
                        contactEmail: event.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supportPhone">Support Phone</Label>
                  <Input
                    id="supportPhone"
                    value={general.supportPhone}
                    disabled={settingsLoading}
                    onChange={(event) =>
                      setGeneral((prev) => ({
                        ...prev,
                        supportPhone: event.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Office Address</Label>
                <Textarea
                  id="address"
                  value={general.address}
                  disabled={settingsLoading}
                  onChange={(event) =>
                    setGeneral((prev) => ({
                      ...prev,
                      address: event.target.value,
                    }))
                  }
                  rows={2}
                />
              </div>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                disabled={savingSection === "general"}
                onClick={() =>
                  saveSection(
                    "general",
                    general,
                    "Settings Saved",
                    "General settings have been updated."
                  )
                }
              >
                <Save className="mr-2 h-4 w-4" />
                {savingSection === "general"
                  ? "Saving..."
                  : "Save General Settings"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-xl bg-accent/10 p-2">
                <Bell className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-headline text-primary">
                  Notifications
                </CardTitle>
                <CardDescription>
                  Control when and how you receive notifications.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              {notificationToggleItems.map((item) => (
                <div key={item.key}>
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-primary">{item.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      disabled={settingsLoading}
                      onCheckedChange={(value) =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.key]: value,
                        }))
                      }
                    />
                  </div>
                  <Separator className="mt-4" />
                </div>
              ))}
              <div className="space-y-2">
                <Label htmlFor="adminNotificationEmail">
                  Notification Inbox
                </Label>
                <Input
                  id="adminNotificationEmail"
                  type="email"
                  value={notifications.adminNotificationEmail}
                  disabled={settingsLoading}
                  onChange={(event) =>
                    setNotifications((prev) => ({
                      ...prev,
                      adminNotificationEmail: event.target.value,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  New inquiry alerts will target this inbox.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryMode">Delivery Mode</Label>
                <Select
                  value={notifications.deliveryMode}
                  onValueChange={(value: NotificationDeliveryMode) =>
                    setNotifications((prev) => ({
                      ...prev,
                      deliveryMode: value,
                    }))
                  }
                >
                  <SelectTrigger id="deliveryMode" disabled={settingsLoading}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="console">
                      Console transport (staging)
                    </SelectItem>
                    <SelectItem value="resend">Resend API transport</SelectItem>
                    <SelectItem value="disabled">Disabled</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Resend mode requires `RESEND_API_KEY` plus
                  `NOTIFICATION_FROM_EMAIL` in the server environment.
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-primary">
                    Auto-dispatch inquiry emails
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Send new inquiry alerts immediately after they are queued.
                  </p>
                </div>
                <Switch
                  checked={notifications.autoDispatchInquiryEmails}
                  disabled={settingsLoading}
                  onCheckedChange={(value) =>
                    setNotifications((prev) => ({
                      ...prev,
                      autoDispatchInquiryEmails: value,
                    }))
                  }
                />
              </div>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                disabled={savingSection === "notifications"}
                onClick={() =>
                  saveSection(
                    "notifications",
                    notifications,
                    "Notification Preferences Saved",
                    "Your notification settings have been updated."
                  )
                }
              >
                <Save className="mr-2 h-4 w-4" />
                {savingSection === "notifications"
                  ? "Saving..."
                  : "Save Notification Settings"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-xl bg-green-100 p-2">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-headline text-primary">
                  Security
                </CardTitle>
                <CardDescription>
                  Manage authentication and access control settings.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-primary">
                    Two-Factor Authentication
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for all admin logins.
                  </p>
                </div>
                <Switch
                  checked={security.twoFactorAuth}
                  disabled={settingsLoading}
                  onCheckedChange={(value) =>
                    setSecurity((prev) => ({
                      ...prev,
                      twoFactorAuth: value,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-primary">
                    Strong Password Policy
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enforce uppercase, number, and symbol requirements.
                  </p>
                </div>
                <Switch
                  checked={security.requireStrongPasswords}
                  disabled={settingsLoading}
                  onCheckedChange={(value) =>
                    setSecurity((prev) => ({
                      ...prev,
                      requireStrongPasswords: value,
                    }))
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="session-timeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="session-timeout"
                  value={security.sessionTimeout}
                  disabled={settingsLoading}
                  onChange={(event) =>
                    setSecurity((prev) => ({
                      ...prev,
                      sessionTimeout: event.target.value,
                    }))
                  }
                />
              </div>
              <Button
                className="bg-primary text-white hover:bg-primary/90"
                disabled={savingSection === "security"}
                onClick={() =>
                  saveSection(
                    "security",
                    security,
                    "Security Settings Saved",
                    "Security configuration has been updated."
                  )
                }
              >
                <Save className="mr-2 h-4 w-4" />
                {savingSection === "security"
                  ? "Saving..."
                  : "Save Security Settings"}
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-xl bg-cyan-100 p-2">
                <Smartphone className="h-5 w-5 text-cyan-700" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-headline text-primary">
                  My MFA
                </CardTitle>
                <CardDescription>
                  Set up an authenticator app and store recovery codes offline.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-medium text-primary">
                  {mfaLoading
                    ? "Loading MFA status..."
                    : mfaStatus.enabled
                      ? "MFA is enabled"
                      : mfaEnrollment
                        ? "Enrollment is waiting for confirmation"
                        : "MFA is not enabled yet"}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {mfaStatus.enabled
                    ? `${mfaStatus.recoveryCodesRemaining} recovery code(s) remaining.`
                    : "Protect your sign-in with a 6-digit authenticator code."}
                </p>
              </div>

              {mfaEnrollment ? (
                <div className="space-y-4 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-4">
                  <div className="space-y-2">
                    <Label htmlFor="mfa-secret">Manual setup key</Label>
                    <Textarea id="mfa-secret" readOnly value={mfaEnrollment.formattedSecret} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mfa-uri">Provisioning URI</Label>
                    <Textarea id="mfa-uri" readOnly value={mfaEnrollment.provisioningUri} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mfa-recovery-codes">Recovery codes</Label>
                    <Textarea
                      id="mfa-recovery-codes"
                      readOnly
                      value={mfaEnrollment.recoveryCodes.join("\n")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mfa-code">Authenticator code</Label>
                    <Input
                      id="mfa-code"
                      value={mfaCode}
                      onChange={(event) => setMfaCode(event.target.value)}
                      placeholder="123456"
                    />
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="bg-primary text-white hover:bg-primary/90"
                      disabled={mfaWorking}
                      onClick={confirmMfaEnrollment}
                    >
                      {mfaWorking ? "Confirming..." : "Confirm MFA"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={mfaWorking}
                      onClick={() => {
                        setMfaEnrollment(null);
                        setMfaCode("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="bg-primary text-white hover:bg-primary/90"
                    disabled={mfaWorking}
                    onClick={startMfaEnrollment}
                  >
                    {mfaStatus.enabled ? "Rotate MFA" : "Set Up MFA"}
                  </Button>
                  {mfaStatus.enabled ? (
                    <Button
                      variant="outline"
                      disabled={mfaWorking}
                      onClick={disableMfa}
                    >
                      Disable MFA
                    </Button>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-xl bg-amber-100 p-2">
                <Clock3 className="h-5 w-5 text-amber-700" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-headline text-primary">
                  Active Sessions
                </CardTitle>
                <CardDescription>
                  Review and revoke signed-in admin sessions.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading active sessions...
                </p>
              ) : sessions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No active sessions found.
                </p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-primary">
                          {session.user.displayName}
                          {session.isCurrent ? " (Current session)" : ""}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.user.email}
                        </p>
                        <p className="mt-2 text-xs text-slate-500">
                          Last seen:{" "}
                          {new Date(
                            session.lastSeenAt ?? session.expiresAt
                          ).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500">
                          Expires: {new Date(session.expiresAt).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={revokingSessionId === session.id}
                        onClick={() => revokeSession(session.id)}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        {revokingSessionId === session.id
                          ? "Revoking..."
                          : "Revoke"}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-xl bg-accent/10 p-2">
                <Mail className="h-5 w-5 text-accent" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-headline text-primary">
                  Delivery Queue
                </CardTitle>
                <CardDescription>
                  Durable notification jobs created from inquiry workflows.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {health.providerConfigError ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                  <p className="font-medium">Delivery is blocked</p>
                  <p className="mt-1">{health.providerConfigError}</p>
                </div>
              ) : null}
              {health.webhookConfigError ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                  <p className="font-medium">Webhook visibility is degraded</p>
                  <p className="mt-1">{health.webhookConfigError}</p>
                </div>
              ) : null}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Queued", value: summary.queued },
                  { label: "Due now", value: health.dueNow },
                  { label: "Dead letters", value: health.deadLetters },
                  { label: "Sent", value: summary.sent },
                  { label: "Retrying", value: health.scheduledRetries },
                  { label: "Failed", value: summary.failed },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-center"
                  >
                    <p className="text-[11px] uppercase tracking-wide text-slate-500">
                      {item.label}
                    </p>
                    <p className="mt-1 text-2xl font-bold font-headline text-slate-900">
                      {notificationsLoading ? "..." : item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                <div className="flex flex-wrap gap-4">
                  <span>Mode: {health.deliveryMode}</span>
                  <span>Lock: {health.lockActive ? "Active" : "Idle"}</span>
                  <span>
                    Last dispatch:{" "}
                    {health.lastDispatchCompletedAt
                      ? new Date(health.lastDispatchCompletedAt).toLocaleString()
                      : "Never"}
                  </span>
                  <span>
                    Last webhook:{" "}
                    {health.lastWebhookReceivedAt
                      ? new Date(health.lastWebhookReceivedAt).toLocaleString()
                      : "Never"}
                  </span>
                </div>
                {health.oldestDueCreatedAt ? (
                  <p className="mt-2">
                    Oldest due job created at{" "}
                    {new Date(health.oldestDueCreatedAt).toLocaleString()}.
                  </p>
                ) : null}
                {health.oldestFailureAt ? (
                  <p className="mt-1">
                    Oldest unresolved failure updated at{" "}
                    {new Date(health.oldestFailureAt).toLocaleString()}.
                  </p>
                ) : null}
              </div>
              <Button
                className="w-full bg-primary text-white hover:bg-primary/90"
                disabled={
                  dispatchingNotifications ||
                  health.dueNow === 0 ||
                  Boolean(health.providerConfigError)
                }
                onClick={dispatchNotifications}
              >
                <Send className="mr-2 h-4 w-4" />
                {dispatchingNotifications
                  ? "Dispatching..."
                  : "Dispatch Queued Notifications"}
              </Button>
              <Button
                className="w-full border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
                disabled={requeueingNotifications || summary.failed === 0}
                onClick={requeueNotifications}
                variant="outline"
              >
                <Send className="mr-2 h-4 w-4" />
                {requeueingNotifications
                  ? "Requeueing..."
                  : "Requeue Failed Notifications"}
              </Button>
              <div className="space-y-3">
                {jobs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {notificationsLoading
                      ? "Loading notification jobs..."
                      : "No notification jobs yet."}
                  </p>
                ) : (
                  jobs.slice(0, 6).map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">
                          {job.subject}
                        </p>
                        <span className="text-[11px] uppercase tracking-wide text-slate-500">
                          {job.status}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>{job.recipient}</span>
                        <span>{job.provider}</span>
                        <span>State: {job.deliveryState}</span>
                        <span>Attempts: {job.attempts}</span>
                        <span>{new Date(job.createdAt).toLocaleString()}</span>
                      </div>
                      {job.nextAttemptAt ? (
                        <p className="mt-2 text-xs text-slate-500">
                          Next attempt:{" "}
                          {new Date(job.nextAttemptAt).toLocaleString()}
                        </p>
                      ) : null}
                      {job.providerMessageId ? (
                        <p className="mt-2 text-xs text-slate-500">
                          Provider id: {job.providerMessageId}
                        </p>
                      ) : null}
                      {job.lastEventType ? (
                        <p className="mt-2 text-xs text-slate-500">
                          Last webhook: {job.lastEventType}
                          {job.lastWebhookAt
                            ? ` at ${new Date(job.lastWebhookAt).toLocaleString()}`
                            : ""}
                        </p>
                      ) : null}
                      {job.lastError ? (
                        <p className="mt-2 text-xs text-rose-600">
                          Last error: {job.lastError}
                        </p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900">
                  Recent webhooks
                </p>
                {webhookEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No webhook events recorded yet.
                  </p>
                ) : (
                  webhookEvents.slice(0, 5).map((event) => (
                    <div
                      key={event.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium text-slate-900">
                          {event.eventType}
                        </p>
                        <span className="text-xs text-slate-500">
                          {new Date(event.receivedAt).toLocaleString()}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                        <span>Provider: {event.provider}</span>
                        <span>
                          Job: {event.notificationJobId ?? "Unmatched"}
                        </span>
                        {event.providerMessageId ? (
                          <span>Message id: {event.providerMessageId}</span>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-xl bg-slate-100 p-2">
                <Database className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-headline text-primary">
                  Platform Runtime
                </CardTitle>
                <CardDescription>
                  Current operational baseline for this environment.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Persistent admin data is now stored in the local SQLite
                database.
              </p>
              <p>
                Every listing, inquiry, and settings mutation creates an audit
                event.
              </p>
              <p>
                Inquiry notifications are queued durably before dispatch so
                delivery work is inspectable and retryable.
              </p>
              <p>
                Use this view as a staging-grade operational checkpoint before
                moving to managed Postgres.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-2">
                <History className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold font-headline text-primary">
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest auditable actions captured by the admin platform.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {auditLoading
                    ? "Loading audit events..."
                    : "No audit events yet."}
                </p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-900">
                        {event.summary}
                      </p>
                      <span className="text-[11px] uppercase tracking-wide text-slate-500">
                        {event.entityType}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>Actor: {event.actor}</span>
                      <span>Action: {event.action}</span>
                      <span>{new Date(event.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
