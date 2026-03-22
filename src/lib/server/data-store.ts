import "server-only";

import { getDatabaseUrl } from "@/lib/env";
import * as postgresStore from "@/lib/server/postgres-store";
import * as sqliteStore from "@/lib/server/sqlite-store";
import * as workersFallbackStore from "@/lib/server/workers-fallback-store";
import { isWorkersReadOnlyPreviewMode } from "@/lib/server/runtime";

const store: typeof sqliteStore = getDatabaseUrl()
  ? postgresStore
  : isWorkersReadOnlyPreviewMode()
    ? workersFallbackStore
    : sqliteStore;

export const getListings = store.getListings;
export const getListingById = store.getListingById;
export const upsertListing = store.upsertListing;
export const deleteListing = store.deleteListing;
export const getInquiries = store.getInquiries;
export const createInquiry = store.createInquiry;
export const updateInquiryStatus = store.updateInquiryStatus;
export const recordAnalyticsEvent = store.recordAnalyticsEvent;
export const getAnalyticsOverview = store.getAnalyticsOverview;
export const getAuditEvents = store.getAuditEvents;
export const recordRequestEvent = store.recordRequestEvent;
export const countRecentRequestEvents = store.countRecentRequestEvents;
export const recordSecurityAudit = store.recordSecurityAudit;
export const hasRecentDuplicateInquiry = store.hasRecentDuplicateInquiry;
export const getNotificationJobs = store.getNotificationJobs;
export const getNotificationSummary = store.getNotificationSummary;
export const getNotificationQueueHealth = store.getNotificationQueueHealth;
export const countDueNotificationJobs = store.countDueNotificationJobs;
export const createNotificationJob = store.createNotificationJob;
export const dispatchQueuedNotificationJobs =
  store.dispatchQueuedNotificationJobs;
export const requeueFailedNotificationJobs = store.requeueFailedNotificationJobs;
export const getNotificationWebhookEvents = store.getNotificationWebhookEvents;
export const ingestResendWebhookEvent = store.ingestResendWebhookEvent;
export const runNotificationDispatchCycle = store.runNotificationDispatchCycle;
export const recordSessionAudit = store.recordSessionAudit;
export const getPlatformSettings = store.getPlatformSettings;
export const updatePlatformSettings = store.updatePlatformSettings;
export const listAdminUsers = store.listAdminUsers;
export const createAdminUser = store.createAdminUser;
export const updateAdminUser = store.updateAdminUser;
export const verifyAdminCredentials = store.verifyAdminCredentials;
export const createAdminSession = store.createAdminSession;
export const getAdminSessionById = store.getAdminSessionById;
export const deleteAdminSession = store.deleteAdminSession;
export const listAdminSessions = store.listAdminSessions;
export const revokeAdminSession = store.revokeAdminSession;
export const revokeAdminSessionsForUser = store.revokeAdminSessionsForUser;
export const getAdminMfaStatus = store.getAdminMfaStatus;
export const beginAdminMfaEnrollment = store.beginAdminMfaEnrollment;
export const confirmAdminMfaEnrollment = store.confirmAdminMfaEnrollment;
export const disableAdminMfa = store.disableAdminMfa;
export const createAdminMfaChallenge = store.createAdminMfaChallenge;
export const verifyAdminMfaChallenge = store.verifyAdminMfaChallenge;
export const requestAdminPasswordReset = store.requestAdminPasswordReset;
export const resetAdminPassword = store.resetAdminPassword;
export const getAdminPasswordResetRequest = store.getAdminPasswordResetRequest;
