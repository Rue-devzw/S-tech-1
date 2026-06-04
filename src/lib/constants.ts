export const brand = {
  name: "OmniTech Solutions",
  tagline: "We repair. We connect. We build. We automate.",
  phone: "+263 718 704 505",
  whatsappChannel: "https://whatsapp.com/channel/0029VaE4TMq545v0wnXxRL0F",
  email: "hello@omnitech.io",
  location: "Harare, Zimbabwe"
};

export const roles = ["SUPER_ADMIN", "MANAGER", "ADMIN_ASSISTANT", "TECHNICIAN", "FIELD_INSTALLER", "SALES_MARKETING", "CUSTOMER", "VIEWER_AUDITOR"] as const;

export const serviceCategories = [
  "REPAIR",
  "CONNECTIVITY",
  "SOFTWARE",
  "AUTOMATION",
  "STARLINK",
  "NETWORKING",
  "SUPPORT"
] as const;

export const statusLabels = {
  NEW: "New",
  TRIAGED: "Triaged",
  QUOTED: "Quoted",
  APPROVED: "Approved",
  IN_PROGRESS: "In progress",
  WAITING_PARTS: "Waiting for parts",
  READY: "Ready",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled"
};
