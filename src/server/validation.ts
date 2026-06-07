import { z } from "zod";

const safeFilenameSchema = z
  .string()
  .min(1)
  .max(180)
  .regex(/^[\w .()_-]+$/, "Filenames may only contain letters, numbers, spaces, dots, parentheses, underscores and hyphens.");

const safeFileUrlSchema = z
  .string()
  .max(500)
  .refine((value) => value.startsWith("/storage/") || /^https:\/\/[^\s]+$/i.test(value), "File URLs must be HTTPS or use the managed /storage path.");

export const fileReferenceSchema = z.object({
  filename: safeFilenameSchema,
  url: safeFileUrlSchema.optional(),
  caption: z.string().max(300).optional()
});

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  q: z.string().max(160).optional(),
  status: z.string().max(80).optional(),
  sort: z.string().max(80).optional(),
  order: z.enum(["asc", "desc"]).default("desc"),
  from: z.string().optional(),
  to: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email().max(160),
  password: z.string().min(8).max(128)
});

export const customerRegisterSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(40),
  organization: z.string().max(120).optional().or(z.literal("")),
  password: z.string().min(12).max(128)
});

export const roleNameSchema = z.enum([
  "SUPER_ADMIN",
  "MANAGER",
  "ADMIN_ASSISTANT",
  "TECHNICIAN",
  "FIELD_INSTALLER",
  "SALES_MARKETING",
  "CUSTOMER",
  "VIEWER_AUDITOR"
]);

export const accountStatusSchema = z.enum(["INVITED", "ACTIVE", "SUSPENDED", "DISABLED", "LOCKED"]);

export const invitationSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  role: roleNameSchema
});

export const managedUserCreateSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(7).max(40).optional().or(z.literal("")),
  password: z.string().min(12).max(128),
  role: roleNameSchema.exclude(["CUSTOMER"]),
  serviceArea: z.string().max(120).optional().or(z.literal("")),
  skills: z.string().max(500).optional().or(z.literal(""))
});

export const managedUserRoleUpdateSchema = z.object({
  role: roleNameSchema.exclude(["CUSTOMER"]),
  serviceArea: z.string().max(120).optional().or(z.literal("")),
  skills: z.string().max(500).optional().or(z.literal(""))
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(32).max(256),
  password: z.string().min(12).max(128)
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email().max(160)
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(32).max(256),
  password: z.string().min(12).max(128)
});

export const accountStatusUpdateSchema = z.object({
  status: accountStatusSchema,
  isActive: z.boolean().optional()
});

export const customerUpsertSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160).optional().or(z.literal("")),
  phone: z.string().min(7).max(40),
  organization: z.string().max(120).optional().or(z.literal("")),
  type: z.enum(["WALK_IN", "HOME", "SME", "SCHOOL", "CHURCH", "FARM", "LODGE", "CLINIC", "CORPORATE"]).default("HOME"),
  notes: z.string().max(2000).optional().or(z.literal("")),
  consentToNotify: z.boolean().default(true)
});

export const serviceUpsertSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2).max(120),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  summary: z.string().min(5).max(300),
  description: z.string().min(5).max(2000),
  basePrice: z.number().min(0).optional(),
  estimatedHours: z.number().min(0).optional(),
  isFieldService: z.boolean().default(false),
  isActive: z.boolean().default(true)
});

export const serviceRequestSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(160).optional().or(z.literal("")),
  phone: z.string().min(7).max(40),
  organization: z.string().max(120).optional().or(z.literal("")),
  serviceId: z.string().min(1),
  title: z.string().min(4).max(160),
  description: z.string().min(12).max(3000),
  location: z.string().max(240).optional().or(z.literal("")),
  urgency: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  preferredDate: z.string().optional().or(z.literal(""))
});

export const jobStatusSchema = z.object({
  status: z.enum([
    "CREATED",
    "ASSIGNED",
    "DIAGNOSING",
    "QUOTED",
    "APPROVED",
    "IN_PROGRESS",
    "WAITING_PARTS",
    "WAITING_CUSTOMER",
    "QUALITY_CHECK",
    "READY_FOR_COLLECTION",
    "PAYMENT_PENDING",
    "READY_FOR_DELIVERY",
    "DELIVERED",
    "WARRANTY_ACTIVE",
    "COMPLETED",
    "CANCELLED"
  ]),
  diagnosis: z.string().max(3000).optional(),
  workDone: z.string().max(3000).optional(),
  scheduledFor: z.string().optional()
});

export const adminReviewSchema = z.object({
  requestId: z.string().min(1),
  jobType: z.enum([
    "BENCH_REPAIR",
    "FIELD_REPAIR",
    "STARLINK_INSTALLATION",
    "NETWORK_INSTALLATION",
    "SOFTWARE_PROJECT",
    "AUTOMATION_PROJECT",
    "SUPPORT_CONTRACT"
  ]),
  assignedToId: z.string().optional(),
  device: z
    .object({
      type: z.string().min(2).max(80),
      make: z.string().max(80).optional(),
      model: z.string().max(80).optional(),
      serialNumber: z.string().max(120).optional(),
      conditionNotes: z.string().max(1000).optional(),
      accessories: z.string().max(1000).optional()
    })
    .optional(),
  appointment: z
    .object({
      startsAt: z.string(),
      endsAt: z.string(),
      location: z.string().min(3).max(240),
      notes: z.string().max(1000).optional()
    })
    .optional(),
  internalNotes: z.string().max(2000).optional()
});

export const workflowTransitionSchema = z.object({
  toStatus: jobStatusSchema.shape.status,
  note: z.string().max(1200).optional()
});

export const diagnosisCreateSchema = z.object({
  symptoms: z.string().min(3).max(3000),
  findings: z.string().min(3).max(5000),
  recommendation: z.string().min(3).max(5000),
  estimatedCost: z.number().min(0).optional(),
  estimatedHours: z.number().min(0).optional(),
  final: z.boolean().default(true)
});

export const quotationDecisionSchema = z.object({
  decision: z.enum(["ACCEPTED", "DECLINED"]),
  note: z.string().max(1200).optional()
});

export const partsAllocationSchema = z.object({
  items: z
    .array(
      z.object({
        inventoryItemId: z.string().min(1),
        quantity: z.number().int().positive().max(999),
        notes: z.string().max(500).optional()
      })
    )
    .min(1)
});

export const paymentRecordSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().positive(),
  method: z.enum(["CASH", "BANK_TRANSFER", "ECOCASH", "CARD", "PAYNOW", "STRIPE", "OTHER"]),
  providerReference: z.string().max(160).optional()
});

export const inventoryItemSchema = z.object({
  supplierId: z.string().optional(),
  sku: z.string().min(2).max(80),
  name: z.string().min(2).max(160),
  category: z.string().min(2).max(120),
  description: z.string().max(1000).optional().or(z.literal("")),
  quantityOnHand: z.number().int().min(0).default(0),
  reorderLevel: z.number().int().min(0).default(2),
  unitCost: z.number().min(0).default(0),
  sellingPrice: z.number().min(0).optional(),
  location: z.string().max(120).optional().or(z.literal("")),
  isActive: z.boolean().default(true)
});

export const appointmentSchema = z.object({
  customerId: z.string().min(1),
  serviceRequestId: z.string().optional(),
  jobCardId: z.string().optional(),
  assignedToId: z.string().optional(),
  title: z.string().min(3).max(160),
  status: z.enum(["REQUESTED", "CONFIRMED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "NO_SHOW"]).default("REQUESTED"),
  startsAt: z.string(),
  endsAt: z.string(),
  location: z.string().max(300).optional().or(z.literal("")),
  notes: z.string().max(1200).optional().or(z.literal(""))
});

export const deliverySchema = z.object({
  mode: z.enum(["COLLECTION", "DELIVERY"]),
  note: z.string().max(1200).optional()
});

export const warrantyCreateSchema = z.object({
  coverage: z.string().min(3).max(1000),
  terms: z.string().max(2000).optional(),
  startsAt: z.string().optional(),
  endsAt: z.string()
});

export const repairFaultCategorySchema = z.enum([
  "SCREEN_DAMAGE",
  "BATTERY_POWER",
  "CHARGING_PORT",
  "WATER_LIQUID_DAMAGE",
  "NO_POWER",
  "OVERHEATING",
  "SOFTWARE_OS",
  "STORAGE_DATA",
  "NETWORK_CONNECTIVITY",
  "AUDIO_VIDEO",
  "KEYBOARD_INPUT",
  "BOARD_COMPONENT",
  "PHYSICAL_DAMAGE",
  "INTERMITTENT_FAULT",
  "OTHER"
]);

export const deviceTypeSchema = z.enum(["PHONE", "TABLET", "PC", "LAPTOP", "TV", "GENERAL_ELECTRONICS"]);

export const repairIntakeSchema = z.object({
  customerId: z.string().min(1),
  jobCardId: z.string().optional(),
  technicianId: z.string().optional(),
  device: z.object({
    type: deviceTypeSchema,
    make: z.string().max(80).optional(),
    model: z.string().max(80).optional(),
    serialNumber: z.string().max(120).optional(),
    imei: z.string().max(80).optional(),
    conditionNotes: z.string().max(1200).optional()
  }),
  faultCategory: repairFaultCategorySchema,
  faultDescription: z.string().min(5).max(3000),
  conditionPhotos: z.array(fileReferenceSchema).optional(),
  accessoriesReceived: z.array(z.string().min(1).max(80)).default([]),
  customerPasswordNote: z.string().max(500).optional(),
  labourEstimateHours: z.number().min(0).optional(),
  labourEstimateAmount: z.number().min(0).optional(),
  warrantyTerms: z.string().max(2000).optional()
});

export const technicianAssignmentSchema = z.object({
  technicianId: z.string().min(1),
  note: z.string().max(800).optional()
});

export const repairChecklistSchema = z.object({
  type: z.enum(["DIAGNOSTIC", "TEST"]),
  title: z.string().min(3).max(160),
  items: z
    .array(
      z.object({
        label: z.string().min(2).max(200),
        checked: z.boolean().default(false),
        note: z.string().max(500).optional()
      })
    )
    .min(1),
  completed: z.boolean().default(false),
  notes: z.string().max(1000).optional()
});

export const repairPartNeedSchema = z.object({
  parts: z
    .array(
      z.object({
        inventoryItemId: z.string().optional(),
        partName: z.string().min(2).max(160),
        quantity: z.number().int().positive().max(999),
        estimatedUnitCost: z.number().min(0).optional(),
        isRequired: z.boolean().default(true),
        notes: z.string().max(500).optional()
      })
    )
    .min(1)
});

export const repairEstimateSchema = z.object({
  labourEstimateHours: z.number().min(0).optional(),
  labourEstimateAmount: z.number().min(0).optional(),
  warrantyTerms: z.string().min(3).max(2000)
});

export const repairNoteSchema = z.object({
  note: z.string().min(2).max(3000)
});

export const repairCollectionSchema = z.object({
  customerName: z.string().min(2).max(120),
  customerPhone: z.string().max(40).optional(),
  confirmationNote: z.string().max(1000).optional(),
  conditionAccepted: z.boolean().default(true)
});

export const starlinkDisclaimer =
  "OmniTech Solutions provides independent Starlink-related installation, setup and support services. OmniTech does not claim official Starlink partnership or reseller status unless this is explicitly configured and displayed later.";

export const starlinkEnquirySchema = z.object({
  customerId: z.string().min(1),
  serviceRequestId: z.string().optional(),
  jobCardId: z.string().optional(),
  enquiryType: z.enum(["KIT_SALES_SUPPORT", "INSTALLATION", "SITE_SURVEY", "RELOCATION", "TROUBLESHOOTING", "WIFI_EXTENSION", "SUPPORT"]),
  kitStatus: z.string().max(120).optional(),
  siteAddress: z.string().min(3).max(300),
  siteContact: z.string().max(120).optional(),
  sitePhone: z.string().max(40).optional(),
  usageGoal: z.string().max(1000).optional(),
  notes: z.string().max(2000).optional(),
  officialDisclaimerAccepted: z.boolean().default(true)
});

export const starlinkSiteSurveySchema = z.object({
  customerId: z.string().min(1),
  jobCardId: z.string().optional(),
  fieldVisitId: z.string().optional(),
  obstructionLevel: z.enum(["CLEAR", "MINOR", "MODERATE", "SEVERE", "UNKNOWN"]).default("UNKNOWN"),
  obstructionNotes: z.string().max(2000).optional(),
  recommendedMounting: z.enum(["ROOF", "WALL", "POLE", "GROUND_POLE", "NON_PENETRATING", "EXISTING_STRUCTURE", "TO_BE_CONFIRMED"]).default("TO_BE_CONFIRMED"),
  roofAccessNotes: z.string().max(1200).optional(),
  cableRouteNotes: z.string().max(1200).optional(),
  powerLocationNotes: z.string().max(1200).optional(),
  photos: z.array(fileReferenceSchema).optional(),
  completed: z.boolean().default(false)
});

export const starlinkInstallationPlanSchema = z.object({
  customerId: z.string().min(1),
  jobCardId: z.string().optional(),
  fieldVisitId: z.string().optional(),
  mountingType: z.enum(["ROOF", "WALL", "POLE", "GROUND_POLE", "NON_PENETRATING", "EXISTING_STRUCTURE", "TO_BE_CONFIRMED"]).default("TO_BE_CONFIRMED"),
  accessoriesRequired: z.array(z.string().min(1).max(120)).default([]),
  wifiCoveragePlan: z.string().max(2000).optional(),
  routerConfigNotes: z.string().max(2000).optional(),
  meshExtenderPlan: z.string().max(2000).optional(),
  setupChecklist: z
    .array(z.object({ label: z.string().min(2).max(200), checked: z.boolean().default(false), note: z.string().max(500).optional() }))
    .optional()
});

export const starlinkAppointmentSchema = z.object({
  customerId: z.string().min(1),
  serviceRequestId: z.string().optional(),
  jobCardId: z.string().optional(),
  assignedToId: z.string().optional(),
  startsAt: z.string(),
  endsAt: z.string(),
  location: z.string().min(3).max(300),
  notes: z.string().max(1200).optional()
});

export const starlinkHandoverSchema = z.object({
  handoverNotes: z.string().min(3).max(2000),
  handoverAcceptedBy: z.string().min(2).max(120)
});

export const starlinkSupportTicketSchema = z.object({
  customerId: z.string().min(1),
  jobCardId: z.string().optional(),
  issue: z.string().min(5).max(3000)
});

export const starlinkSupportResolutionSchema = z.object({
  status: z.enum(["IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"]),
  resolution: z.string().max(3000).optional()
});

export const starlinkServiceRecordSchema = z.object({
  customerId: z.string().min(1),
  jobCardId: z.string().optional(),
  type: z.enum(["RELOCATION", "TROUBLESHOOTING", "SUPPORT_TICKET"]),
  previousAddress: z.string().max(300).optional(),
  newAddress: z.string().max(300).optional(),
  issueSummary: z.string().max(2000).optional(),
  actionsTaken: z.string().min(3).max(3000),
  outcome: z.string().max(2000).optional()
});

export const fieldServiceTypeSchema = z.enum(["STARLINK", "NETWORKING", "ONSITE_COMPUTER_SUPPORT", "CCTV_NETWORK_SUPPORT", "BUSINESS_ICT_MAINTENANCE"]);

export const fieldAppointmentSchema = z.object({
  customerId: z.string().min(1),
  serviceRequestId: z.string().optional(),
  jobCardId: z.string().optional(),
  technicianId: z.string().optional(),
  serviceType: fieldServiceTypeSchema,
  title: z.string().min(3).max(160),
  startsAt: z.string(),
  endsAt: z.string(),
  address: z.string().min(3).max(300),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  siteContact: z.string().max(120).optional(),
  sitePhone: z.string().max(40).optional(),
  travelNotes: z.string().max(1500).optional(),
  notes: z.string().max(1500).optional()
});

export const fieldVisitStatusSchema = z.object({
  status: z.enum(["PLANNED", "TRAVELING", "ON_SITE", "COMPLETED", "CANCELLED"]),
  arrivalAt: z.string().optional(),
  departureAt: z.string().optional(),
  note: z.string().max(1200).optional()
});

export const fieldChecklistSchema = z.object({
  type: z.enum(["STARLINK", "NETWORKING", "FIELD_REPAIR", "SOFTWARE_HANDOVER", "AUTOMATION_HANDOVER"]),
  name: z.string().min(3).max(160),
  items: z.array(z.object({ label: z.string().min(2).max(200), checked: z.boolean().default(false), note: z.string().max(500).optional() })).min(1),
  completed: z.boolean().default(false),
  notes: z.string().max(1200).optional()
});

export const fieldVisitEvidenceSchema = z.object({
  fieldPhotos: z.array(fileReferenceSchema).default([]),
  customerSignatureName: z.string().max(120).optional(),
  customerSignatureData: z.string().max(5000).optional(),
  outcome: z.string().max(2500).optional(),
  notes: z.string().max(2500).optional()
});

export const followUpTaskSchema = z.object({
  title: z.string().min(3).max(160),
  description: z.string().max(1000).optional(),
  assignedToId: z.string().optional(),
  dueAt: z.string().optional()
});

export const followUpTaskStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "DONE", "CANCELLED"])
});

export const serviceReportSchema = z.object({
  summary: z.string().max(2500).optional()
});

export const notificationChannelSchema = z.enum(["EMAIL", "SMS", "WHATSAPP", "IN_APP"]);

export const notificationTriggerSchema = z.enum([
  "REQUEST_RECEIVED",
  "JOB_CREATED",
  "DIAGNOSIS_COMPLETE",
  "QUOTATION_SENT",
  "QUOTATION_APPROVED",
  "PARTS_ORDERED",
  "REPAIR_IN_PROGRESS",
  "READY_FOR_COLLECTION",
  "INVOICE_ISSUED",
  "PAYMENT_RECEIVED",
  "WARRANTY_EXPIRING",
  "FOLLOW_UP_REMINDER",
  "MANUAL_MESSAGE"
]);

export const messageTemplateSchema = z.object({
  key: z.string().min(3).max(120),
  name: z.string().min(3).max(160),
  channel: notificationChannelSchema,
  trigger: notificationTriggerSchema.optional(),
  subject: z.string().max(180).optional(),
  body: z.string().min(3).max(4000),
  variables: z.array(z.string().min(1).max(80)).default([]),
  isActive: z.boolean().default(true)
});

export const triggerNotificationSchema = z.object({
  trigger: notificationTriggerSchema,
  customerId: z.string().optional(),
  userId: z.string().optional(),
  serviceRequestId: z.string().optional(),
  channels: z.array(notificationChannelSchema).optional(),
  data: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).default({})
});

export const manualMessageSchema = z.object({
  customerId: z.string().optional(),
  channel: notificationChannelSchema,
  recipient: z.string().min(3).max(180),
  subject: z.string().max(180).optional(),
  body: z.string().min(3).max(4000)
});

export const dispatchNotificationsSchema = z.object({
  limit: z.number().int().min(1).max(100).default(25)
});

export const promotionSchema = z.object({
  title: z.string().min(3).max(160),
  slug: z.string().min(3).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  audience: z.string().min(2).max(160),
  offer: z.string().min(5).max(1000),
  channelPlan: z.string().max(1200).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "ENDED"]).default("DRAFT"),
  startsAt: z.string(),
  endsAt: z.string()
});

export const systemSettingSchema = z.object({
  key: z.string().min(2).max(120).regex(/^[a-z0-9_.-]+$/),
  value: z.unknown(),
  description: z.string().max(500).optional().or(z.literal("")),
  isSecret: z.boolean().default(false)
});

export const portfolioCategorySchema = z.enum([
  "REPAIR",
  "WEBSITE",
  "MOBILE_APP",
  "NETWORK_INSTALLATION",
  "STARLINK_INSTALLATION",
  "AI_SYSTEM",
  "SOFTWARE_SYSTEM",
  "ICT_SUPPORT"
]);

export const portfolioVisibilitySchema = z.enum(["PUBLIC", "ANONYMIZED", "PRIVATE"]);

export const portfolioProjectSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  category: portfolioCategorySchema,
  clientName: z.string().max(160).optional().or(z.literal("")),
  clientSector: z.string().min(2).max(120),
  summary: z.string().min(10).max(600),
  challenge: z.string().min(10).max(2000),
  solution: z.string().min(10).max(2500),
  toolsUsed: z.array(z.string().min(1).max(80)).default([]),
  outcome: z.string().min(10).max(1500),
  description: z.string().max(3000).optional().or(z.literal("")),
  imageUrl: z.string().url().optional().or(z.literal("")),
  beforeImageUrls: z.array(z.string().url()).default([]),
  afterImageUrls: z.array(z.string().url()).default([]),
  visibility: portfolioVisibilitySchema.default("PUBLIC"),
  showClientName: z.boolean().default(false),
  showExactLocation: z.boolean().default(false),
  featured: z.boolean().default(false),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  published: z.boolean().default(false)
});

export const testimonialSchema = z.object({
  customerId: z.string().optional(),
  projectId: z.string().optional(),
  name: z.string().min(2).max(120),
  company: z.string().max(160).optional().or(z.literal("")),
  clientSector: z.string().max(120).optional().or(z.literal("")),
  quote: z.string().min(10).max(1200),
  rating: z.number().int().min(1).max(5).default(5),
  consentToPublish: z.boolean().default(true),
  privacyLabel: z.string().max(120).optional().or(z.literal("")),
  published: z.boolean().default(false)
});

export const blogCategorySchema = z.enum([
  "DEVICE_CARE",
  "LAPTOP_PERFORMANCE",
  "NETWORKING",
  "STARLINK",
  "CYBERSECURITY_BASICS",
  "WEBSITES",
  "BUSINESS_AUTOMATION",
  "AI_FOR_SMES"
]);

export const blogPostSchema = z.object({
  title: z.string().min(3).max(180),
  slug: z.string().min(3).max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  excerpt: z.string().min(20).max(600),
  body: z.string().min(50).max(20000),
  category: blogCategorySchema,
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  seoTitle: z.string().max(70).optional().or(z.literal("")),
  seoDescription: z.string().max(170).optional().or(z.literal("")),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
  featuredImageAlt: z.string().max(180).optional().or(z.literal("")),
  relatedServiceSlug: z.string().max(120).optional().or(z.literal("")),
  tags: z.array(z.string().min(1).max(60)).default([])
});

export const quoteSchema = z.object({
  customerId: z.string().min(1),
  jobCardId: z.string().optional(),
  validUntil: z.string().optional(),
  status: z.enum(["DRAFT", "SENT"]).default("DRAFT"),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  notes: z.string().max(2000).optional(),
  lineItems: z
    .array(
      z.object({
        itemType: z.enum(["LABOUR", "PART", "SERVICE", "DISCOUNT", "OTHER"]).default("SERVICE"),
        description: z.string().min(2).max(200),
        quantity: z.number().min(0.01).max(999),
        unitPrice: z.number().min(0).max(999999)
      })
    )
    .min(1)
});

export const quotationApprovalSchema = z.object({
  decision: z.enum(["ACCEPTED", "DECLINED"]),
  note: z.string().max(1200).optional()
});

export const invoiceConversionSchema = z.object({
  dueAt: z.string().optional(),
  issuedAt: z.string().optional()
});

export const shareDocumentSchema = z.object({
  channel: z.enum(["EMAIL", "WHATSAPP", "SMS"]),
  recipient: z.string().min(3).max(180),
  message: z.string().max(1000).optional()
});

export const aiInteractionTypeSchema = z.enum([
  "DIAGNOSTICS",
  "CUSTOMER_ENQUIRY",
  "QUOTATION_DESCRIPTION",
  "ADVERT_DRAFT",
  "REPORT_GENERATION",
  "FAQ_ASSISTANT",
  "SUPPORT_CHAT",
  "TECHNICIAN_TROUBLESHOOTING",
  "SUMMARY",
  "MANAGEMENT_INSIGHTS"
]);

export const aiAssistSchema = z.object({
  type: aiInteractionTypeSchema,
  input: z.string().min(8).max(8000),
  context: z.record(z.union([z.string(), z.number(), z.boolean(), z.null(), z.array(z.string())])).default({}),
  jobCardId: z.string().optional(),
  customerFacing: z.boolean().optional(),
  requireApproval: z.boolean().optional()
});

export const aiApprovalSchema = z.object({
  decision: z.enum(["APPROVED", "REJECTED"]),
  finalResponse: z.string().max(12000).optional(),
  note: z.string().max(1200).optional()
});
