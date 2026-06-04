-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('SUPER_ADMIN', 'MANAGER', 'ADMIN_ASSISTANT', 'TECHNICIAN', 'FIELD_INSTALLER', 'SALES_MARKETING', 'CUSTOMER', 'VIEWER_AUDITOR');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('INVITED', 'ACTIVE', 'SUSPENDED', 'DISABLED', 'LOCKED');

-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('WALK_IN', 'HOME', 'SME', 'SCHOOL', 'CHURCH', 'FARM', 'LODGE', 'CLINIC', 'CORPORATE');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'SERVICE', 'INSTALLATION', 'SHIPPING');

-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('NEW', 'TRIAGED', 'QUOTED', 'APPROVED', 'IN_PROGRESS', 'WAITING_PARTS', 'READY', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('BENCH_REPAIR', 'FIELD_REPAIR', 'STARLINK_INSTALLATION', 'NETWORK_INSTALLATION', 'SOFTWARE_PROJECT', 'AUTOMATION_PROJECT', 'SUPPORT_CONTRACT');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('CREATED', 'ASSIGNED', 'DIAGNOSING', 'QUOTED', 'APPROVED', 'IN_PROGRESS', 'WAITING_PARTS', 'WAITING_CUSTOMER', 'QUALITY_CHECK', 'READY_FOR_COLLECTION', 'PAYMENT_PENDING', 'READY_FOR_DELIVERY', 'DELIVERED', 'WARRANTY_ACTIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "DeviceType" AS ENUM ('PHONE', 'TABLET', 'PC', 'LAPTOP', 'TV', 'GENERAL_ELECTRONICS');

-- CreateEnum
CREATE TYPE "RepairFaultCategory" AS ENUM ('SCREEN_DAMAGE', 'BATTERY_POWER', 'CHARGING_PORT', 'WATER_LIQUID_DAMAGE', 'NO_POWER', 'OVERHEATING', 'SOFTWARE_OS', 'STORAGE_DATA', 'NETWORK_CONNECTIVITY', 'AUDIO_VIDEO', 'KEYBOARD_INPUT', 'BOARD_COMPONENT', 'PHYSICAL_DAMAGE', 'INTERMITTENT_FAULT', 'OTHER');

-- CreateEnum
CREATE TYPE "RepairStatus" AS ENUM ('INTAKE', 'AWAITING_DEVICE', 'RECEIVED', 'DIAGNOSING', 'WAITING_QUOTE_APPROVAL', 'WAITING_PARTS', 'REPAIRING', 'TESTING', 'READY_FOR_COLLECTION', 'COLLECTED', 'WARRANTY_ACTIVE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RepairChecklistType" AS ENUM ('DIAGNOSTIC', 'TEST');

-- CreateEnum
CREATE TYPE "DiagnosisStatus" AS ENUM ('DRAFT', 'NEEDS_APPROVAL', 'APPROVED', 'REJECTED', 'FINAL');

-- CreateEnum
CREATE TYPE "QuotationStatus" AS ENUM ('DRAFT', 'SENT', 'ACCEPTED', 'DECLINED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_PAID', 'PAID', 'OVERDUE', 'VOID');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED', 'REFUNDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'BANK_TRANSFER', 'ECOCASH', 'CARD', 'PAYNOW', 'STRIPE', 'OTHER');

-- CreateEnum
CREATE TYPE "BillingItemType" AS ENUM ('LABOUR', 'PART', 'SERVICE', 'DISCOUNT', 'OTHER');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('PURCHASE', 'RESERVATION', 'USED_ON_JOB', 'RETURN_FROM_JOB', 'CUSTOMER_SUPPLIED', 'ADJUSTMENT', 'WRITE_OFF');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'RESCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "FieldVisitStatus" AS ENUM ('PLANNED', 'TRAVELING', 'ON_SITE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "FieldServiceType" AS ENUM ('STARLINK', 'NETWORKING', 'ONSITE_COMPUTER_SUPPORT', 'CCTV_NETWORK_SUPPORT', 'BUSINESS_ICT_MAINTENANCE');

-- CreateEnum
CREATE TYPE "FollowUpTaskStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'DONE', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ChecklistType" AS ENUM ('STARLINK', 'NETWORKING', 'FIELD_REPAIR', 'SOFTWARE_HANDOVER', 'AUTOMATION_HANDOVER');

-- CreateEnum
CREATE TYPE "StarlinkEnquiryType" AS ENUM ('KIT_SALES_SUPPORT', 'INSTALLATION', 'SITE_SURVEY', 'RELOCATION', 'TROUBLESHOOTING', 'WIFI_EXTENSION', 'SUPPORT');

-- CreateEnum
CREATE TYPE "ObstructionLevel" AS ENUM ('CLEAR', 'MINOR', 'MODERATE', 'SEVERE', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "MountingType" AS ENUM ('ROOF', 'WALL', 'POLE', 'GROUND_POLE', 'NON_PENETRATING', 'EXISTING_STRUCTURE', 'TO_BE_CONFIRMED');

-- CreateEnum
CREATE TYPE "StarlinkRecordType" AS ENUM ('RELOCATION', 'TROUBLESHOOTING', 'SUPPORT_TICKET');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WarrantyStatus" AS ENUM ('ACTIVE', 'CLAIMED', 'EXPIRED', 'VOID');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SMS', 'WHATSAPP', 'IN_APP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationTrigger" AS ENUM ('REQUEST_RECEIVED', 'JOB_CREATED', 'DIAGNOSIS_COMPLETE', 'QUOTATION_SENT', 'QUOTATION_APPROVED', 'PARTS_ORDERED', 'REPAIR_IN_PROGRESS', 'READY_FOR_COLLECTION', 'INVOICE_ISSUED', 'PAYMENT_RECEIVED', 'WARRANTY_EXPIRING', 'FOLLOW_UP_REMINDER', 'MANUAL_MESSAGE');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "PortfolioCategory" AS ENUM ('REPAIR', 'WEBSITE', 'MOBILE_APP', 'NETWORK_INSTALLATION', 'STARLINK_INSTALLATION', 'AI_SYSTEM', 'SOFTWARE_SYSTEM', 'ICT_SUPPORT');

-- CreateEnum
CREATE TYPE "PortfolioVisibility" AS ENUM ('PUBLIC', 'ANONYMIZED', 'PRIVATE');

-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "BlogCategory" AS ENUM ('DEVICE_CARE', 'LAPTOP_PERFORMANCE', 'NETWORKING', 'STARLINK', 'CYBERSECURITY_BASICS', 'WEBSITES', 'BUSINESS_AUTOMATION', 'AI_FOR_SMES');

-- CreateEnum
CREATE TYPE "AIInteractionType" AS ENUM ('DIAGNOSTICS', 'CUSTOMER_ENQUIRY', 'QUOTATION_DESCRIPTION', 'ADVERT_DRAFT', 'REPORT_GENERATION', 'FAQ_ASSISTANT', 'SUPPORT_CHAT', 'TECHNICIAN_TROUBLESHOOTING', 'SUMMARY', 'MANAGEMENT_INSIGHTS');

-- CreateEnum
CREATE TYPE "AIApprovalStatus" AS ENUM ('NOT_REQUIRED', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" "RoleName" NOT NULL DEFAULT 'CUSTOMER',
    "accountStatus" "AccountStatus" NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerifiedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserInvitation" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "RoleName" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "invitedById" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Technician" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "skills" TEXT[],
    "serviceArea" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Technician_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" "RoleName" NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "module" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("userId","roleId")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" "CustomerType" NOT NULL DEFAULT 'HOME',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT NOT NULL,
    "organization" TEXT,
    "taxNumber" TEXT,
    "notes" TEXT,
    "consentToNotify" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAddress" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'SERVICE',
    "label" TEXT,
    "line1" TEXT NOT NULL,
    "line2" TEXT,
    "city" TEXT NOT NULL,
    "province" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Zimbabwe',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomerAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" DECIMAL(12,2),
    "estimatedHours" DECIMAL(8,2),
    "isFieldService" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceRequest" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "deviceId" TEXT,
    "createdById" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'NEW',
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "intakeChannel" TEXT NOT NULL DEFAULT 'Website',
    "preferredDate" TIMESTAMP(3),
    "locationNote" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "make" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "imei" TEXT,
    "assetTag" TEXT,
    "conditionNotes" TEXT,
    "accessories" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobCard" (
    "id" TEXT NOT NULL,
    "jobNumber" TEXT NOT NULL,
    "requestId" TEXT,
    "customerId" TEXT NOT NULL,
    "deviceId" TEXT,
    "assignedToId" TEXT,
    "type" "JobType" NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'CREATED',
    "priority" "Priority" NOT NULL DEFAULT 'NORMAL',
    "faultReported" TEXT NOT NULL,
    "workDone" TEXT,
    "customerNotes" TEXT,
    "internalNotes" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairIntake" (
    "id" TEXT NOT NULL,
    "intakeNumber" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "deviceType" "DeviceType" NOT NULL,
    "faultCategory" "RepairFaultCategory" NOT NULL,
    "repairStatus" "RepairStatus" NOT NULL DEFAULT 'INTAKE',
    "conditionPhotos" JSONB,
    "accessoriesReceived" TEXT[],
    "faultDescription" TEXT NOT NULL,
    "customerPasswordNote" TEXT,
    "receivedById" TEXT,
    "technicianId" TEXT,
    "labourEstimateHours" DECIMAL(8,2),
    "labourEstimateAmount" DECIMAL(12,2),
    "warrantyTerms" TEXT,
    "receivedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairIntake_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairChecklist" (
    "id" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "type" "RepairChecklistType" NOT NULL,
    "title" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "completedById" TEXT,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairPartNeed" (
    "id" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "inventoryItemId" TEXT,
    "partName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "estimatedUnitCost" DECIMAL(12,2),
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RepairPartNeed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairNote" (
    "id" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "authorId" TEXT,
    "note" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RepairNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerCollectionConfirmation" (
    "id" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT,
    "confirmationNote" TEXT,
    "conditionAccepted" BOOLEAN NOT NULL DEFAULT true,
    "collectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerCollectionConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobStatusHistory" (
    "id" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "fromStatus" "JobStatus",
    "toStatus" "JobStatus" NOT NULL,
    "note" TEXT,
    "changedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" TEXT NOT NULL,
    "jobCardId" TEXT NOT NULL,
    "technicianId" TEXT,
    "status" "DiagnosisStatus" NOT NULL DEFAULT 'DRAFT',
    "symptoms" TEXT NOT NULL,
    "findings" TEXT NOT NULL,
    "recommendation" TEXT NOT NULL,
    "estimatedCost" DECIMAL(12,2),
    "estimatedHours" DECIMAL(8,2),
    "customerApprovedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" TEXT NOT NULL,
    "quotationNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "status" "QuotationStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "validUntil" TIMESTAMP(3),
    "acceptedAt" TIMESTAMP(3),
    "declinedAt" TIMESTAMP(3),
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuotationItem" (
    "id" TEXT NOT NULL,
    "quotationId" TEXT NOT NULL,
    "itemType" "BillingItemType" NOT NULL DEFAULT 'SERVICE',
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "total" DECIMAL(12,2) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "QuotationItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "quotationId" TEXT,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT',
    "subtotal" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "paidAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "balanceDue" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "issuedAt" TIMESTAMP(3),
    "dueAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "paymentNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "recordedById" TEXT,
    "method" "PaymentMethod" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "provider" TEXT,
    "providerReference" TEXT,
    "providerTransactionId" TEXT,
    "paidAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Receipt" (
    "id" TEXT NOT NULL,
    "receiptNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "invoiceId" TEXT,
    "paymentId" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Receipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactName" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryItem" (
    "id" TEXT NOT NULL,
    "supplierId" TEXT,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "quantityOnHand" INTEGER NOT NULL DEFAULT 0,
    "quantityReserved" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 2,
    "unitCost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "sellingPrice" DECIMAL(12,2),
    "location" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "inventoryItemId" TEXT NOT NULL,
    "supplierId" TEXT,
    "jobCardId" TEXT,
    "type" "StockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(12,2),
    "reference" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceRequestId" TEXT,
    "jobCardId" TEXT,
    "assignedToId" TEXT,
    "title" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'REQUESTED',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldVisit" (
    "id" TEXT NOT NULL,
    "visitNumber" TEXT NOT NULL,
    "appointmentId" TEXT,
    "customerId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "technicianId" TEXT,
    "serviceType" "FieldServiceType" NOT NULL DEFAULT 'ONSITE_COMPUTER_SUPPORT',
    "status" "FieldVisitStatus" NOT NULL DEFAULT 'PLANNED',
    "siteContact" TEXT,
    "sitePhone" TEXT,
    "address" TEXT NOT NULL,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "travelNotes" TEXT,
    "arrivalAt" TIMESTAMP(3),
    "departureAt" TIMESTAMP(3),
    "fieldPhotos" JSONB,
    "customerSignatureName" TEXT,
    "customerSignatureData" TEXT,
    "customerSignedAt" TIMESTAMP(3),
    "outcome" TEXT,
    "notes" TEXT,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FieldVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUpTask" (
    "id" TEXT NOT NULL,
    "fieldVisitId" TEXT,
    "jobCardId" TEXT,
    "assignedToId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "FollowUpTaskStatus" NOT NULL DEFAULT 'OPEN',
    "dueAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FollowUpTask_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceReport" (
    "id" TEXT NOT NULL,
    "reportNumber" TEXT NOT NULL,
    "fieldVisitId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "summary" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "generatedById" TEXT,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServiceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarlinkEnquiry" (
    "id" TEXT NOT NULL,
    "enquiryNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "serviceRequestId" TEXT,
    "jobCardId" TEXT,
    "enquiryType" "StarlinkEnquiryType" NOT NULL,
    "kitStatus" TEXT,
    "siteAddress" TEXT NOT NULL,
    "siteContact" TEXT,
    "sitePhone" TEXT,
    "usageGoal" TEXT,
    "officialDisclaimerAccepted" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StarlinkEnquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarlinkSiteSurvey" (
    "id" TEXT NOT NULL,
    "surveyNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "fieldVisitId" TEXT,
    "obstructionLevel" "ObstructionLevel" NOT NULL DEFAULT 'UNKNOWN',
    "obstructionNotes" TEXT,
    "recommendedMounting" "MountingType" NOT NULL DEFAULT 'TO_BE_CONFIRMED',
    "roofAccessNotes" TEXT,
    "cableRouteNotes" TEXT,
    "powerLocationNotes" TEXT,
    "photos" JSONB,
    "completedById" TEXT,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StarlinkSiteSurvey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarlinkInstallationPlan" (
    "id" TEXT NOT NULL,
    "planNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "fieldVisitId" TEXT,
    "mountingType" "MountingType" NOT NULL DEFAULT 'TO_BE_CONFIRMED',
    "accessoriesRequired" TEXT[],
    "wifiCoveragePlan" TEXT,
    "routerConfigNotes" TEXT,
    "meshExtenderPlan" TEXT,
    "setupChecklist" JSONB,
    "handoverNotes" TEXT,
    "handoverAcceptedBy" TEXT,
    "handoverAcceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StarlinkInstallationPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarlinkSupportTicket" (
    "id" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "issue" TEXT NOT NULL,
    "resolution" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StarlinkSupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StarlinkServiceRecord" (
    "id" TEXT NOT NULL,
    "recordNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "type" "StarlinkRecordType" NOT NULL,
    "previousAddress" TEXT,
    "newAddress" TEXT,
    "issueSummary" TEXT,
    "actionsTaken" TEXT NOT NULL,
    "outcome" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StarlinkServiceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstallationChecklist" (
    "id" TEXT NOT NULL,
    "fieldVisitId" TEXT NOT NULL,
    "type" "ChecklistType" NOT NULL,
    "name" TEXT NOT NULL,
    "items" JSONB NOT NULL,
    "completedBy" TEXT,
    "completedAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstallationChecklist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Warranty" (
    "id" TEXT NOT NULL,
    "warrantyNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "jobCardId" TEXT,
    "deviceId" TEXT,
    "status" "WarrantyStatus" NOT NULL DEFAULT 'ACTIVE',
    "coverage" TEXT NOT NULL,
    "terms" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "claimedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Warranty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "trigger" "NotificationTrigger",
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "variables" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "userId" TEXT,
    "serviceRequestId" TEXT,
    "manualMessageId" TEXT,
    "trigger" "NotificationTrigger",
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "provider" TEXT,
    "providerMessageId" TEXT,
    "error" TEXT,
    "queuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),

    CONSTRAINT "NotificationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManualMessage" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "sentById" TEXT,
    "channel" "NotificationChannel" NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ManualMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "offer" TEXT NOT NULL,
    "channelPlan" TEXT,
    "status" "PromotionStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PortfolioProject" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" "PortfolioCategory" NOT NULL,
    "clientName" TEXT,
    "clientSector" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "toolsUsed" TEXT[],
    "outcome" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "beforeImageUrls" TEXT[],
    "afterImageUrls" TEXT[],
    "visibility" "PortfolioVisibility" NOT NULL DEFAULT 'PUBLIC',
    "showClientName" BOOLEAN NOT NULL DEFAULT false,
    "showExactLocation" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PortfolioProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "projectId" TEXT,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "clientSector" TEXT,
    "quote" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "consentToPublish" BOOLEAN NOT NULL DEFAULT false,
    "privacyLabel" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" "BlogCategory" NOT NULL,
    "status" "BlogStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "featuredImageUrl" TEXT,
    "featuredImageAlt" TEXT,
    "relatedServiceSlug" TEXT,
    "authorId" TEXT,
    "tags" TEXT[],
    "publishedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInteraction" (
    "id" TEXT NOT NULL,
    "type" "AIInteractionType" NOT NULL,
    "provider" TEXT NOT NULL,
    "model" TEXT,
    "prompt" TEXT NOT NULL,
    "response" TEXT,
    "finalResponse" TEXT,
    "approvalStatus" "AIApprovalStatus" NOT NULL DEFAULT 'NOT_REQUIRED',
    "approvedAt" TIMESTAMP(3),
    "approvedById" TEXT,
    "safetyFlags" TEXT[],
    "fallbackUsed" BOOLEAN NOT NULL DEFAULT false,
    "metadata" JSONB,
    "userId" TEXT,
    "jobCardId" TEXT,
    "tokensIn" INTEGER,
    "tokensOut" INTEGER,
    "costEstimate" DECIMAL(12,6),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "isSecret" BOOLEAN NOT NULL DEFAULT false,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_accountStatus_idx" ON "User"("accountStatus");

-- CreateIndex
CREATE INDEX "User_isActive_deletedAt_idx" ON "User"("isActive", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_tokenHash_key" ON "UserSession"("tokenHash");

-- CreateIndex
CREATE INDEX "UserSession_userId_revokedAt_idx" ON "UserSession"("userId", "revokedAt");

-- CreateIndex
CREATE INDEX "UserSession_expiresAt_idx" ON "UserSession"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserInvitation_tokenHash_key" ON "UserInvitation"("tokenHash");

-- CreateIndex
CREATE INDEX "UserInvitation_email_idx" ON "UserInvitation"("email");

-- CreateIndex
CREATE INDEX "UserInvitation_role_idx" ON "UserInvitation"("role");

-- CreateIndex
CREATE INDEX "UserInvitation_expiresAt_idx" ON "UserInvitation"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_usedAt_idx" ON "PasswordResetToken"("userId", "usedAt");

-- CreateIndex
CREATE INDEX "PasswordResetToken_expiresAt_idx" ON "PasswordResetToken"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Technician_userId_key" ON "Technician"("userId");

-- CreateIndex
CREATE INDEX "Technician_isActive_deletedAt_idx" ON "Technician"("isActive", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_key_key" ON "Permission"("key");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_phone_key" ON "Customer"("phone");

-- CreateIndex
CREATE INDEX "Customer_type_idx" ON "Customer"("type");

-- CreateIndex
CREATE INDEX "Customer_name_idx" ON "Customer"("name");

-- CreateIndex
CREATE INDEX "Customer_deletedAt_idx" ON "Customer"("deletedAt");

-- CreateIndex
CREATE INDEX "CustomerAddress_customerId_type_idx" ON "CustomerAddress"("customerId", "type");

-- CreateIndex
CREATE INDEX "CustomerAddress_deletedAt_idx" ON "CustomerAddress"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceCategory_slug_key" ON "ServiceCategory"("slug");

-- CreateIndex
CREATE INDEX "ServiceCategory_isActive_sortOrder_idx" ON "ServiceCategory"("isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_categoryId_isActive_idx" ON "Service"("categoryId", "isActive");

-- CreateIndex
CREATE INDEX "Service_deletedAt_idx" ON "Service"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceRequest_requestNumber_key" ON "ServiceRequest"("requestNumber");

-- CreateIndex
CREATE INDEX "ServiceRequest_customerId_status_idx" ON "ServiceRequest"("customerId", "status");

-- CreateIndex
CREATE INDEX "ServiceRequest_serviceId_idx" ON "ServiceRequest"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_priority_idx" ON "ServiceRequest"("status", "priority");

-- CreateIndex
CREATE INDEX "ServiceRequest_createdAt_idx" ON "ServiceRequest"("createdAt");

-- CreateIndex
CREATE INDEX "ServiceRequest_deletedAt_idx" ON "ServiceRequest"("deletedAt");

-- CreateIndex
CREATE INDEX "Device_customerId_idx" ON "Device"("customerId");

-- CreateIndex
CREATE INDEX "Device_serialNumber_idx" ON "Device"("serialNumber");

-- CreateIndex
CREATE INDEX "Device_imei_idx" ON "Device"("imei");

-- CreateIndex
CREATE INDEX "Device_deletedAt_idx" ON "Device"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "JobCard_jobNumber_key" ON "JobCard"("jobNumber");

-- CreateIndex
CREATE UNIQUE INDEX "JobCard_requestId_key" ON "JobCard"("requestId");

-- CreateIndex
CREATE INDEX "JobCard_customerId_status_idx" ON "JobCard"("customerId", "status");

-- CreateIndex
CREATE INDEX "JobCard_assignedToId_status_idx" ON "JobCard"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "JobCard_type_status_idx" ON "JobCard"("type", "status");

-- CreateIndex
CREATE INDEX "JobCard_scheduledFor_idx" ON "JobCard"("scheduledFor");

-- CreateIndex
CREATE INDEX "JobCard_deletedAt_idx" ON "JobCard"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RepairIntake_intakeNumber_key" ON "RepairIntake"("intakeNumber");

-- CreateIndex
CREATE UNIQUE INDEX "RepairIntake_jobCardId_key" ON "RepairIntake"("jobCardId");

-- CreateIndex
CREATE INDEX "RepairIntake_deviceType_faultCategory_idx" ON "RepairIntake"("deviceType", "faultCategory");

-- CreateIndex
CREATE INDEX "RepairIntake_repairStatus_idx" ON "RepairIntake"("repairStatus");

-- CreateIndex
CREATE INDEX "RepairIntake_technicianId_idx" ON "RepairIntake"("technicianId");

-- CreateIndex
CREATE INDEX "RepairIntake_deletedAt_idx" ON "RepairIntake"("deletedAt");

-- CreateIndex
CREATE INDEX "RepairChecklist_jobCardId_type_idx" ON "RepairChecklist"("jobCardId", "type");

-- CreateIndex
CREATE INDEX "RepairPartNeed_jobCardId_idx" ON "RepairPartNeed"("jobCardId");

-- CreateIndex
CREATE INDEX "RepairPartNeed_inventoryItemId_idx" ON "RepairPartNeed"("inventoryItemId");

-- CreateIndex
CREATE INDEX "RepairNote_jobCardId_createdAt_idx" ON "RepairNote"("jobCardId", "createdAt");

-- CreateIndex
CREATE INDEX "RepairNote_authorId_idx" ON "RepairNote"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCollectionConfirmation_jobCardId_key" ON "CustomerCollectionConfirmation"("jobCardId");

-- CreateIndex
CREATE INDEX "JobStatusHistory_jobCardId_createdAt_idx" ON "JobStatusHistory"("jobCardId", "createdAt");

-- CreateIndex
CREATE INDEX "JobStatusHistory_changedById_idx" ON "JobStatusHistory"("changedById");

-- CreateIndex
CREATE INDEX "Diagnosis_jobCardId_status_idx" ON "Diagnosis"("jobCardId", "status");

-- CreateIndex
CREATE INDEX "Diagnosis_technicianId_idx" ON "Diagnosis"("technicianId");

-- CreateIndex
CREATE INDEX "Diagnosis_deletedAt_idx" ON "Diagnosis"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_quotationNumber_key" ON "Quotation"("quotationNumber");

-- CreateIndex
CREATE INDEX "Quotation_customerId_status_idx" ON "Quotation"("customerId", "status");

-- CreateIndex
CREATE INDEX "Quotation_jobCardId_idx" ON "Quotation"("jobCardId");

-- CreateIndex
CREATE INDEX "Quotation_status_validUntil_idx" ON "Quotation"("status", "validUntil");

-- CreateIndex
CREATE INDEX "Quotation_deletedAt_idx" ON "Quotation"("deletedAt");

-- CreateIndex
CREATE INDEX "QuotationItem_quotationId_idx" ON "QuotationItem"("quotationId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");

-- CreateIndex
CREATE INDEX "Invoice_customerId_status_idx" ON "Invoice"("customerId", "status");

-- CreateIndex
CREATE INDEX "Invoice_jobCardId_idx" ON "Invoice"("jobCardId");

-- CreateIndex
CREATE INDEX "Invoice_quotationId_idx" ON "Invoice"("quotationId");

-- CreateIndex
CREATE INDEX "Invoice_status_dueAt_idx" ON "Invoice"("status", "dueAt");

-- CreateIndex
CREATE INDEX "Invoice_deletedAt_idx" ON "Invoice"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_paymentNumber_key" ON "Payment"("paymentNumber");

-- CreateIndex
CREATE INDEX "Payment_customerId_status_idx" ON "Payment"("customerId", "status");

-- CreateIndex
CREATE INDEX "Payment_invoiceId_idx" ON "Payment"("invoiceId");

-- CreateIndex
CREATE INDEX "Payment_method_status_idx" ON "Payment"("method", "status");

-- CreateIndex
CREATE INDEX "Payment_providerReference_idx" ON "Payment"("providerReference");

-- CreateIndex
CREATE INDEX "Payment_deletedAt_idx" ON "Payment"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Receipt_receiptNumber_key" ON "Receipt"("receiptNumber");

-- CreateIndex
CREATE INDEX "Receipt_customerId_idx" ON "Receipt"("customerId");

-- CreateIndex
CREATE INDEX "Receipt_invoiceId_idx" ON "Receipt"("invoiceId");

-- CreateIndex
CREATE INDEX "Receipt_paymentId_idx" ON "Receipt"("paymentId");

-- CreateIndex
CREATE INDEX "Receipt_deletedAt_idx" ON "Receipt"("deletedAt");

-- CreateIndex
CREATE INDEX "Supplier_name_idx" ON "Supplier"("name");

-- CreateIndex
CREATE INDEX "Supplier_deletedAt_idx" ON "Supplier"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "InventoryItem_sku_key" ON "InventoryItem"("sku");

-- CreateIndex
CREATE INDEX "InventoryItem_supplierId_idx" ON "InventoryItem"("supplierId");

-- CreateIndex
CREATE INDEX "InventoryItem_category_idx" ON "InventoryItem"("category");

-- CreateIndex
CREATE INDEX "InventoryItem_isActive_deletedAt_idx" ON "InventoryItem"("isActive", "deletedAt");

-- CreateIndex
CREATE INDEX "InventoryItem_quantityOnHand_idx" ON "InventoryItem"("quantityOnHand");

-- CreateIndex
CREATE INDEX "StockMovement_inventoryItemId_createdAt_idx" ON "StockMovement"("inventoryItemId", "createdAt");

-- CreateIndex
CREATE INDEX "StockMovement_jobCardId_idx" ON "StockMovement"("jobCardId");

-- CreateIndex
CREATE INDEX "StockMovement_supplierId_idx" ON "StockMovement"("supplierId");

-- CreateIndex
CREATE INDEX "StockMovement_type_idx" ON "StockMovement"("type");

-- CreateIndex
CREATE INDEX "Appointment_customerId_startsAt_idx" ON "Appointment"("customerId", "startsAt");

-- CreateIndex
CREATE INDEX "Appointment_assignedToId_startsAt_idx" ON "Appointment"("assignedToId", "startsAt");

-- CreateIndex
CREATE INDEX "Appointment_status_startsAt_idx" ON "Appointment"("status", "startsAt");

-- CreateIndex
CREATE INDEX "Appointment_deletedAt_idx" ON "Appointment"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FieldVisit_visitNumber_key" ON "FieldVisit"("visitNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FieldVisit_appointmentId_key" ON "FieldVisit"("appointmentId");

-- CreateIndex
CREATE INDEX "FieldVisit_customerId_status_idx" ON "FieldVisit"("customerId", "status");

-- CreateIndex
CREATE INDEX "FieldVisit_serviceType_status_idx" ON "FieldVisit"("serviceType", "status");

-- CreateIndex
CREATE INDEX "FieldVisit_jobCardId_idx" ON "FieldVisit"("jobCardId");

-- CreateIndex
CREATE INDEX "FieldVisit_technicianId_status_idx" ON "FieldVisit"("technicianId", "status");

-- CreateIndex
CREATE INDEX "FieldVisit_deletedAt_idx" ON "FieldVisit"("deletedAt");

-- CreateIndex
CREATE INDEX "FollowUpTask_fieldVisitId_idx" ON "FollowUpTask"("fieldVisitId");

-- CreateIndex
CREATE INDEX "FollowUpTask_jobCardId_idx" ON "FollowUpTask"("jobCardId");

-- CreateIndex
CREATE INDEX "FollowUpTask_assignedToId_status_idx" ON "FollowUpTask"("assignedToId", "status");

-- CreateIndex
CREATE INDEX "FollowUpTask_status_dueAt_idx" ON "FollowUpTask"("status", "dueAt");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceReport_reportNumber_key" ON "ServiceReport"("reportNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ServiceReport_fieldVisitId_key" ON "ServiceReport"("fieldVisitId");

-- CreateIndex
CREATE INDEX "ServiceReport_jobCardId_idx" ON "ServiceReport"("jobCardId");

-- CreateIndex
CREATE INDEX "ServiceReport_generatedAt_idx" ON "ServiceReport"("generatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "StarlinkEnquiry_enquiryNumber_key" ON "StarlinkEnquiry"("enquiryNumber");

-- CreateIndex
CREATE INDEX "StarlinkEnquiry_customerId_enquiryType_idx" ON "StarlinkEnquiry"("customerId", "enquiryType");

-- CreateIndex
CREATE INDEX "StarlinkEnquiry_serviceRequestId_idx" ON "StarlinkEnquiry"("serviceRequestId");

-- CreateIndex
CREATE INDEX "StarlinkEnquiry_jobCardId_idx" ON "StarlinkEnquiry"("jobCardId");

-- CreateIndex
CREATE UNIQUE INDEX "StarlinkSiteSurvey_surveyNumber_key" ON "StarlinkSiteSurvey"("surveyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StarlinkSiteSurvey_fieldVisitId_key" ON "StarlinkSiteSurvey"("fieldVisitId");

-- CreateIndex
CREATE INDEX "StarlinkSiteSurvey_customerId_idx" ON "StarlinkSiteSurvey"("customerId");

-- CreateIndex
CREATE INDEX "StarlinkSiteSurvey_jobCardId_idx" ON "StarlinkSiteSurvey"("jobCardId");

-- CreateIndex
CREATE INDEX "StarlinkSiteSurvey_obstructionLevel_idx" ON "StarlinkSiteSurvey"("obstructionLevel");

-- CreateIndex
CREATE UNIQUE INDEX "StarlinkInstallationPlan_planNumber_key" ON "StarlinkInstallationPlan"("planNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StarlinkInstallationPlan_fieldVisitId_key" ON "StarlinkInstallationPlan"("fieldVisitId");

-- CreateIndex
CREATE INDEX "StarlinkInstallationPlan_customerId_idx" ON "StarlinkInstallationPlan"("customerId");

-- CreateIndex
CREATE INDEX "StarlinkInstallationPlan_jobCardId_idx" ON "StarlinkInstallationPlan"("jobCardId");

-- CreateIndex
CREATE INDEX "StarlinkInstallationPlan_mountingType_idx" ON "StarlinkInstallationPlan"("mountingType");

-- CreateIndex
CREATE UNIQUE INDEX "StarlinkSupportTicket_ticketNumber_key" ON "StarlinkSupportTicket"("ticketNumber");

-- CreateIndex
CREATE INDEX "StarlinkSupportTicket_customerId_status_idx" ON "StarlinkSupportTicket"("customerId", "status");

-- CreateIndex
CREATE INDEX "StarlinkSupportTicket_jobCardId_idx" ON "StarlinkSupportTicket"("jobCardId");

-- CreateIndex
CREATE UNIQUE INDEX "StarlinkServiceRecord_recordNumber_key" ON "StarlinkServiceRecord"("recordNumber");

-- CreateIndex
CREATE INDEX "StarlinkServiceRecord_customerId_type_idx" ON "StarlinkServiceRecord"("customerId", "type");

-- CreateIndex
CREATE INDEX "StarlinkServiceRecord_jobCardId_idx" ON "StarlinkServiceRecord"("jobCardId");

-- CreateIndex
CREATE INDEX "InstallationChecklist_fieldVisitId_type_idx" ON "InstallationChecklist"("fieldVisitId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Warranty_warrantyNumber_key" ON "Warranty"("warrantyNumber");

-- CreateIndex
CREATE INDEX "Warranty_customerId_status_idx" ON "Warranty"("customerId", "status");

-- CreateIndex
CREATE INDEX "Warranty_jobCardId_idx" ON "Warranty"("jobCardId");

-- CreateIndex
CREATE INDEX "Warranty_deviceId_idx" ON "Warranty"("deviceId");

-- CreateIndex
CREATE INDEX "Warranty_status_endsAt_idx" ON "Warranty"("status", "endsAt");

-- CreateIndex
CREATE INDEX "Warranty_deletedAt_idx" ON "Warranty"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "MessageTemplate_key_key" ON "MessageTemplate"("key");

-- CreateIndex
CREATE INDEX "MessageTemplate_channel_isActive_idx" ON "MessageTemplate"("channel", "isActive");

-- CreateIndex
CREATE INDEX "MessageTemplate_trigger_channel_idx" ON "MessageTemplate"("trigger", "channel");

-- CreateIndex
CREATE INDEX "MessageTemplate_deletedAt_idx" ON "MessageTemplate"("deletedAt");

-- CreateIndex
CREATE INDEX "NotificationLog_status_queuedAt_idx" ON "NotificationLog"("status", "queuedAt");

-- CreateIndex
CREATE INDEX "NotificationLog_channel_status_idx" ON "NotificationLog"("channel", "status");

-- CreateIndex
CREATE INDEX "NotificationLog_trigger_status_idx" ON "NotificationLog"("trigger", "status");

-- CreateIndex
CREATE INDEX "NotificationLog_serviceRequestId_idx" ON "NotificationLog"("serviceRequestId");

-- CreateIndex
CREATE INDEX "NotificationLog_manualMessageId_idx" ON "NotificationLog"("manualMessageId");

-- CreateIndex
CREATE INDEX "NotificationLog_userId_idx" ON "NotificationLog"("userId");

-- CreateIndex
CREATE INDEX "ManualMessage_customerId_createdAt_idx" ON "ManualMessage"("customerId", "createdAt");

-- CreateIndex
CREATE INDEX "ManualMessage_sentById_createdAt_idx" ON "ManualMessage"("sentById", "createdAt");

-- CreateIndex
CREATE INDEX "ManualMessage_channel_idx" ON "ManualMessage"("channel");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_slug_key" ON "Promotion"("slug");

-- CreateIndex
CREATE INDEX "Promotion_status_startsAt_endsAt_idx" ON "Promotion"("status", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Promotion_deletedAt_idx" ON "Promotion"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PortfolioProject_slug_key" ON "PortfolioProject"("slug");

-- CreateIndex
CREATE INDEX "PortfolioProject_published_publishedAt_idx" ON "PortfolioProject"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "PortfolioProject_category_idx" ON "PortfolioProject"("category");

-- CreateIndex
CREATE INDEX "PortfolioProject_featured_sortOrder_idx" ON "PortfolioProject"("featured", "sortOrder");

-- CreateIndex
CREATE INDEX "PortfolioProject_visibility_idx" ON "PortfolioProject"("visibility");

-- CreateIndex
CREATE INDEX "PortfolioProject_deletedAt_idx" ON "PortfolioProject"("deletedAt");

-- CreateIndex
CREATE INDEX "Testimonial_published_publishedAt_idx" ON "Testimonial"("published", "publishedAt");

-- CreateIndex
CREATE INDEX "Testimonial_customerId_idx" ON "Testimonial"("customerId");

-- CreateIndex
CREATE INDEX "Testimonial_projectId_idx" ON "Testimonial"("projectId");

-- CreateIndex
CREATE INDEX "Testimonial_deletedAt_idx" ON "Testimonial"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "BlogPost_category_status_idx" ON "BlogPost"("category", "status");

-- CreateIndex
CREATE INDEX "BlogPost_relatedServiceSlug_idx" ON "BlogPost"("relatedServiceSlug");

-- CreateIndex
CREATE INDEX "BlogPost_deletedAt_idx" ON "BlogPost"("deletedAt");

-- CreateIndex
CREATE INDEX "FAQ_category_isActive_sortOrder_idx" ON "FAQ"("category", "isActive", "sortOrder");

-- CreateIndex
CREATE INDEX "FAQ_deletedAt_idx" ON "FAQ"("deletedAt");

-- CreateIndex
CREATE INDEX "AIInteraction_type_createdAt_idx" ON "AIInteraction"("type", "createdAt");

-- CreateIndex
CREATE INDEX "AIInteraction_approvalStatus_createdAt_idx" ON "AIInteraction"("approvalStatus", "createdAt");

-- CreateIndex
CREATE INDEX "AIInteraction_userId_idx" ON "AIInteraction"("userId");

-- CreateIndex
CREATE INDEX "AIInteraction_approvedById_idx" ON "AIInteraction"("approvedById");

-- CreateIndex
CREATE INDEX "AIInteraction_jobCardId_idx" ON "AIInteraction"("jobCardId");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- AddForeignKey
ALTER TABLE "UserSession" ADD CONSTRAINT "UserSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserInvitation" ADD CONSTRAINT "UserInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Technician" ADD CONSTRAINT "Technician_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAddress" ADD CONSTRAINT "CustomerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "ServiceCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceRequest" ADD CONSTRAINT "ServiceRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobCard" ADD CONSTRAINT "JobCard_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairIntake" ADD CONSTRAINT "RepairIntake_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairIntake" ADD CONSTRAINT "RepairIntake_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairChecklist" ADD CONSTRAINT "RepairChecklist_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairPartNeed" ADD CONSTRAINT "RepairPartNeed_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairPartNeed" ADD CONSTRAINT "RepairPartNeed_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairNote" ADD CONSTRAINT "RepairNote_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCollectionConfirmation" ADD CONSTRAINT "CustomerCollectionConfirmation_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobStatusHistory" ADD CONSTRAINT "JobStatusHistory_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobStatusHistory" ADD CONSTRAINT "JobStatusHistory_changedById_fkey" FOREIGN KEY ("changedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuotationItem" ADD CONSTRAINT "QuotationItem_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_quotationId_fkey" FOREIGN KEY ("quotationId") REFERENCES "Quotation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Receipt" ADD CONSTRAINT "Receipt_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "InventoryItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldVisit" ADD CONSTRAINT "FieldVisit_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldVisit" ADD CONSTRAINT "FieldVisit_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldVisit" ADD CONSTRAINT "FieldVisit_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldVisit" ADD CONSTRAINT "FieldVisit_technicianId_fkey" FOREIGN KEY ("technicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpTask" ADD CONSTRAINT "FollowUpTask_fieldVisitId_fkey" FOREIGN KEY ("fieldVisitId") REFERENCES "FieldVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpTask" ADD CONSTRAINT "FollowUpTask_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FollowUpTask" ADD CONSTRAINT "FollowUpTask_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReport" ADD CONSTRAINT "ServiceReport_fieldVisitId_fkey" FOREIGN KEY ("fieldVisitId") REFERENCES "FieldVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceReport" ADD CONSTRAINT "ServiceReport_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkEnquiry" ADD CONSTRAINT "StarlinkEnquiry_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkEnquiry" ADD CONSTRAINT "StarlinkEnquiry_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkEnquiry" ADD CONSTRAINT "StarlinkEnquiry_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkSiteSurvey" ADD CONSTRAINT "StarlinkSiteSurvey_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkSiteSurvey" ADD CONSTRAINT "StarlinkSiteSurvey_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkSiteSurvey" ADD CONSTRAINT "StarlinkSiteSurvey_fieldVisitId_fkey" FOREIGN KEY ("fieldVisitId") REFERENCES "FieldVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkInstallationPlan" ADD CONSTRAINT "StarlinkInstallationPlan_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkInstallationPlan" ADD CONSTRAINT "StarlinkInstallationPlan_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkInstallationPlan" ADD CONSTRAINT "StarlinkInstallationPlan_fieldVisitId_fkey" FOREIGN KEY ("fieldVisitId") REFERENCES "FieldVisit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkSupportTicket" ADD CONSTRAINT "StarlinkSupportTicket_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkSupportTicket" ADD CONSTRAINT "StarlinkSupportTicket_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkServiceRecord" ADD CONSTRAINT "StarlinkServiceRecord_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StarlinkServiceRecord" ADD CONSTRAINT "StarlinkServiceRecord_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstallationChecklist" ADD CONSTRAINT "InstallationChecklist_fieldVisitId_fkey" FOREIGN KEY ("fieldVisitId") REFERENCES "FieldVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Warranty" ADD CONSTRAINT "Warranty_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "MessageTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_serviceRequestId_fkey" FOREIGN KEY ("serviceRequestId") REFERENCES "ServiceRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_manualMessageId_fkey" FOREIGN KEY ("manualMessageId") REFERENCES "ManualMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualMessage" ADD CONSTRAINT "ManualMessage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManualMessage" ADD CONSTRAINT "ManualMessage_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "PortfolioProject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInteraction" ADD CONSTRAINT "AIInteraction_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInteraction" ADD CONSTRAINT "AIInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInteraction" ADD CONSTRAINT "AIInteraction_jobCardId_fkey" FOREIGN KEY ("jobCardId") REFERENCES "JobCard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

