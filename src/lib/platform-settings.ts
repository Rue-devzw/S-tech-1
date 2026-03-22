import { type NotificationDeliveryMode } from "./notification-job";

export interface GeneralSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  supportPhone: string;
  address: string;
}

export interface NotificationSettings {
  emailOnNewInquiry: boolean;
  emailOnNewSale: boolean;
  weeklyReport: boolean;
  systemAlerts: boolean;
  adminNotificationEmail: string;
  autoDispatchInquiryEmails: boolean;
  deliveryMode: NotificationDeliveryMode;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: string;
  requireStrongPasswords: boolean;
}

export interface PlatformSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
}

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  general: {
    siteName: "S-Tech Digital Hub",
    siteTagline: "Digital Excellence in Zimbabwe",
    contactEmail: "info@s-tech.co.zw",
    supportPhone: "+263 77 123 4567",
    address: "15 Samora Machel Ave, Harare, Zimbabwe",
  },
  notifications: {
    emailOnNewInquiry: true,
    emailOnNewSale: true,
    weeklyReport: false,
    systemAlerts: true,
    adminNotificationEmail: "info@s-tech.co.zw",
    autoDispatchInquiryEmails: false,
    deliveryMode: "console",
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: "60",
    requireStrongPasswords: true,
  },
};
