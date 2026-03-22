import "server-only";

import { getDatabaseUrl } from "@/lib/env";
import { isWorkersReadOnlyPreviewMode } from "@/lib/server/runtime";

type StoreModule = typeof import("@/lib/server/sqlite-store");

type StoreMethodName = {
  [Key in keyof StoreModule]: StoreModule[Key] extends (
    ...args: never[]
  ) => Promise<unknown>
    ? Key
    : never;
}[keyof StoreModule];

let storePromise: Promise<StoreModule> | undefined;

async function resolveStore(): Promise<StoreModule> {
  if (!storePromise) {
    storePromise = (async () => {
      if (getDatabaseUrl()) {
        return import("@/lib/server/postgres-store");
      }

      if (isWorkersReadOnlyPreviewMode()) {
        return import("@/lib/server/workers-fallback-store");
      }

      return import("@/lib/server/sqlite-store");
    })();
  }

  return storePromise;
}

function bindStoreMethod<Key extends StoreMethodName>(
  methodName: Key
): StoreModule[Key] {
  return (async (...args: unknown[]) => {
    const store = await resolveStore();
    const storeMethod = store[methodName] as (
      ...params: unknown[]
    ) => Promise<unknown>;

    return storeMethod(...args);
  }) as StoreModule[Key];
}

export const getListings = bindStoreMethod("getListings");
export const getListingById = bindStoreMethod("getListingById");
export const upsertListing = bindStoreMethod("upsertListing");
export const deleteListing = bindStoreMethod("deleteListing");
export const getInquiries = bindStoreMethod("getInquiries");
export const createInquiry = bindStoreMethod("createInquiry");
export const updateInquiryStatus = bindStoreMethod("updateInquiryStatus");
export const recordAnalyticsEvent = bindStoreMethod("recordAnalyticsEvent");
export const getAnalyticsOverview = bindStoreMethod("getAnalyticsOverview");
export const getAuditEvents = bindStoreMethod("getAuditEvents");
export const recordRequestEvent = bindStoreMethod("recordRequestEvent");
export const countRecentRequestEvents = bindStoreMethod(
  "countRecentRequestEvents"
);
export const recordSecurityAudit = bindStoreMethod("recordSecurityAudit");
export const hasRecentDuplicateInquiry = bindStoreMethod(
  "hasRecentDuplicateInquiry"
);
export const getNotificationJobs = bindStoreMethod("getNotificationJobs");
export const getNotificationSummary = bindStoreMethod(
  "getNotificationSummary"
);
export const getNotificationQueueHealth = bindStoreMethod(
  "getNotificationQueueHealth"
);
export const countDueNotificationJobs = bindStoreMethod(
  "countDueNotificationJobs"
);
export const createNotificationJob = bindStoreMethod("createNotificationJob");
export const dispatchQueuedNotificationJobs = bindStoreMethod(
  "dispatchQueuedNotificationJobs"
);
export const requeueFailedNotificationJobs = bindStoreMethod(
  "requeueFailedNotificationJobs"
);
export const getNotificationWebhookEvents = bindStoreMethod(
  "getNotificationWebhookEvents"
);
export const ingestResendWebhookEvent = bindStoreMethod(
  "ingestResendWebhookEvent"
);
export const runNotificationDispatchCycle = bindStoreMethod(
  "runNotificationDispatchCycle"
);
export const recordSessionAudit = bindStoreMethod("recordSessionAudit");
export const getPlatformSettings = bindStoreMethod("getPlatformSettings");
export const updatePlatformSettings = bindStoreMethod("updatePlatformSettings");
export const listAdminUsers = bindStoreMethod("listAdminUsers");
export const createAdminUser = bindStoreMethod("createAdminUser");
export const updateAdminUser = bindStoreMethod("updateAdminUser");
export const verifyAdminCredentials = bindStoreMethod(
  "verifyAdminCredentials"
);
export const createAdminSession = bindStoreMethod("createAdminSession");
export const getAdminSessionById = bindStoreMethod("getAdminSessionById");
export const deleteAdminSession = bindStoreMethod("deleteAdminSession");
export const listAdminSessions = bindStoreMethod("listAdminSessions");
export const revokeAdminSession = bindStoreMethod("revokeAdminSession");
export const revokeAdminSessionsForUser = bindStoreMethod(
  "revokeAdminSessionsForUser"
);
export const getAdminMfaStatus = bindStoreMethod("getAdminMfaStatus");
export const beginAdminMfaEnrollment = bindStoreMethod(
  "beginAdminMfaEnrollment"
);
export const confirmAdminMfaEnrollment = bindStoreMethod(
  "confirmAdminMfaEnrollment"
);
export const disableAdminMfa = bindStoreMethod("disableAdminMfa");
export const createAdminMfaChallenge = bindStoreMethod(
  "createAdminMfaChallenge"
);
export const verifyAdminMfaChallenge = bindStoreMethod(
  "verifyAdminMfaChallenge"
);
export const requestAdminPasswordReset = bindStoreMethod(
  "requestAdminPasswordReset"
);
export const resetAdminPassword = bindStoreMethod("resetAdminPassword");
export const getAdminPasswordResetRequest = bindStoreMethod(
  "getAdminPasswordResetRequest"
);
