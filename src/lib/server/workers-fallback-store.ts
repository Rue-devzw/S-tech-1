import "server-only";

import { randomUUID } from "node:crypto";
import type * as SqliteStore from "@/lib/server/sqlite-store";
import {
  type AnalyticsOverview,
  type AnalyticsStat,
} from "@/lib/analytics";
import {
  type Inquiry,
  INQUIRIES,
  LISTINGS,
} from "@/lib/mock-data";
import {
  type NotificationJob,
  type NotificationQueueHealth,
  type NotificationSummary,
} from "@/lib/notification-job";
import { DEFAULT_PLATFORM_SETTINGS } from "@/lib/platform-settings";
import {
  PersistenceConfigurationError,
  getPersistenceConfigurationErrorMessage,
} from "@/lib/server/runtime";

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function createEmptyStat(): AnalyticsStat {
  return {
    value: 0,
    previousValue: 0,
    delta: 0,
    changePercent: 0,
    direction: "flat",
  };
}

function createEmptyAnalyticsOverview(windowDays: number): AnalyticsOverview {
  return {
    generatedAt: new Date().toISOString(),
    windowDays,
    stats: {
      uniqueVisitors: createEmptyStat(),
      listingViews: createEmptyStat(),
      inquiries: createEmptyStat(),
      pipelineValue: createEmptyStat(),
    },
    dailyTraffic: [],
    monthlyPipeline: [],
    categoryBreakdown: [],
    topListings: [],
  };
}

function createQueueHealth(): NotificationQueueHealth {
  return {
    deliveryMode: "disabled",
    providerReady: false,
    providerConfigError: getPersistenceConfigurationErrorMessage(),
    webhookConfigError: null,
    dueNow: 0,
    scheduledRetries: 0,
    deadLetters: 0,
    oldestDueCreatedAt: null,
    oldestFailureAt: null,
    lockActive: false,
    lastDispatchCompletedAt: null,
    lastDispatchAttemptAt: null,
    lastDispatchProcessedCount: null,
    lastWebhookReceivedAt: null,
  };
}

function createPreviewInquiry(
  input: Omit<Inquiry, "id" | "status" | "date">
): Inquiry {
  return {
    id: `preview-${randomUUID()}`,
    listingId: input.listingId,
    listingName: input.listingName,
    userName: input.userName.trim(),
    userEmail: input.userEmail.trim().toLowerCase(),
    message: input.message.trim(),
    status: "pending",
    date: new Date().toISOString().slice(0, 10),
  };
}

function throwPersistenceConfigurationError(): never {
  throw new PersistenceConfigurationError();
}

export const getListings: typeof SqliteStore.getListings = async () =>
  cloneValue(LISTINGS);

export const getListingById: typeof SqliteStore.getListingById = async (id) => {
  const listing = LISTINGS.find((item) => item.id === id);
  return listing ? cloneValue(listing) : null;
};

export const upsertListing: typeof SqliteStore.upsertListing = async () =>
  throwPersistenceConfigurationError();

export const deleteListing: typeof SqliteStore.deleteListing = async () =>
  throwPersistenceConfigurationError();

export const getInquiries: typeof SqliteStore.getInquiries = async () =>
  cloneValue(INQUIRIES);

export const createInquiry: typeof SqliteStore.createInquiry = async (input) =>
  createPreviewInquiry(input);

export const updateInquiryStatus: typeof SqliteStore.updateInquiryStatus =
  async () => throwPersistenceConfigurationError();

export const getAuditEvents: typeof SqliteStore.getAuditEvents = async () => [];

export const recordRequestEvent: typeof SqliteStore.recordRequestEvent =
  async () => undefined;

export const countRecentRequestEvents: typeof SqliteStore.countRecentRequestEvents =
  async () => 0;

export const recordAnalyticsEvent: typeof SqliteStore.recordAnalyticsEvent =
  async () => undefined;

export const getAnalyticsOverview: typeof SqliteStore.getAnalyticsOverview =
  async (windowDays = 30) => createEmptyAnalyticsOverview(windowDays);

export const recordSecurityAudit: typeof SqliteStore.recordSecurityAudit =
  async () => undefined;

export const hasRecentDuplicateInquiry: typeof SqliteStore.hasRecentDuplicateInquiry =
  async () => false;

export const getNotificationJobs: typeof SqliteStore.getNotificationJobs =
  async () => [];

export const getNotificationSummary: typeof SqliteStore.getNotificationSummary =
  async (): Promise<NotificationSummary> => ({
    queued: 0,
    sent: 0,
    failed: 0,
  });

export const getNotificationQueueHealth: typeof SqliteStore.getNotificationQueueHealth =
  async (): Promise<NotificationQueueHealth> => createQueueHealth();

export const countDueNotificationJobs: typeof SqliteStore.countDueNotificationJobs =
  async () => 0;

export const createNotificationJob: typeof SqliteStore.createNotificationJob =
  async (input) =>
    ({
      id: randomUUID(),
      kind: input.kind,
      channel: "email",
      recipient: input.recipient.trim().toLowerCase(),
      subject: input.subject,
      body: input.body,
      status: "failed",
      provider: input.provider,
      attempts: 0,
      lastError: getPersistenceConfigurationErrorMessage(),
      nextAttemptAt: null,
      providerMessageId: null,
      deliveryState: "failed",
      lastEventType: null,
      lastWebhookAt: null,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: cloneValue(input.metadata ?? {}),
      createdAt: new Date().toISOString(),
      processedAt: null,
      updatedAt: new Date().toISOString(),
    }) satisfies NotificationJob;

export const dispatchQueuedNotificationJobs: typeof SqliteStore.dispatchQueuedNotificationJobs =
  async () => [];

export const requeueFailedNotificationJobs: typeof SqliteStore.requeueFailedNotificationJobs =
  async () => [];

export const getNotificationWebhookEvents: typeof SqliteStore.getNotificationWebhookEvents =
  async () => [];

export const ingestResendWebhookEvent: typeof SqliteStore.ingestResendWebhookEvent =
  async () => ({
    duplicate: false,
    event: null,
    job: null,
  });

export const runNotificationDispatchCycle: typeof SqliteStore.runNotificationDispatchCycle =
  async () => ({
    acquired: true,
    blockedReason: getPersistenceConfigurationErrorMessage(),
    processed: [] as NotificationJob[],
    dueBefore: 0,
    dueAfter: 0,
    summary: {
      queued: 0,
      sent: 0,
      failed: 0,
    },
    health: createQueueHealth(),
  });

export const recordSessionAudit: typeof SqliteStore.recordSessionAudit =
  async () => undefined;

export const getPlatformSettings: typeof SqliteStore.getPlatformSettings =
  async () => cloneValue(DEFAULT_PLATFORM_SETTINGS);

export const updatePlatformSettings: typeof SqliteStore.updatePlatformSettings =
  async () => throwPersistenceConfigurationError();

export const listAdminUsers: typeof SqliteStore.listAdminUsers = async () => [];

export const createAdminUser: typeof SqliteStore.createAdminUser = async () =>
  throwPersistenceConfigurationError();

export const updateAdminUser: typeof SqliteStore.updateAdminUser = async () =>
  throwPersistenceConfigurationError();

export const verifyAdminCredentials: typeof SqliteStore.verifyAdminCredentials =
  async () => null;

export const createAdminSession: typeof SqliteStore.createAdminSession =
  async () => null;

export const getAdminSessionById: typeof SqliteStore.getAdminSessionById =
  async () => null;

export const deleteAdminSession: typeof SqliteStore.deleteAdminSession =
  async () => undefined;

export const listAdminSessions: typeof SqliteStore.listAdminSessions =
  async () => [];

export const revokeAdminSession: typeof SqliteStore.revokeAdminSession =
  async () => false;

export const revokeAdminSessionsForUser: typeof SqliteStore.revokeAdminSessionsForUser =
  async () => 0;

export const getAdminMfaStatus: typeof SqliteStore.getAdminMfaStatus =
  async () => ({
    enabled: false,
    pending: false,
    enabledAt: null,
    recoveryCodesRemaining: 0,
  });

export const beginAdminMfaEnrollment: typeof SqliteStore.beginAdminMfaEnrollment =
  async () => throwPersistenceConfigurationError();

export const confirmAdminMfaEnrollment: typeof SqliteStore.confirmAdminMfaEnrollment =
  async () => throwPersistenceConfigurationError();

export const disableAdminMfa: typeof SqliteStore.disableAdminMfa = async () =>
  throwPersistenceConfigurationError();

export const createAdminMfaChallenge: typeof SqliteStore.createAdminMfaChallenge =
  async () => null;

export const verifyAdminMfaChallenge: typeof SqliteStore.verifyAdminMfaChallenge =
  async () => null;

export const requestAdminPasswordReset: typeof SqliteStore.requestAdminPasswordReset =
  async () => false;

export const resetAdminPassword: typeof SqliteStore.resetAdminPassword =
  async () => throwPersistenceConfigurationError();

export const getAdminPasswordResetRequest: typeof SqliteStore.getAdminPasswordResetRequest =
  async () => null;
