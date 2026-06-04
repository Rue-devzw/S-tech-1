import { JobStatus, Prisma, RequestStatus } from "@prisma/client";
import { prisma } from "@/server/db";

const activeJobStatuses: JobStatus[] = ["CREATED", "ASSIGNED", "DIAGNOSING", "APPROVED", "IN_PROGRESS", "WAITING_PARTS", "WAITING_CUSTOMER", "QUALITY_CHECK", "PAYMENT_PENDING"];
const awaitingQuotationStatuses: JobStatus[] = ["CREATED", "ASSIGNED", "DIAGNOSING"];
const awaitingApprovalStatuses: JobStatus[] = ["QUOTED", "WAITING_CUSTOMER"];
const closedJobStatuses: JobStatus[] = ["COMPLETED", "CANCELLED", "DELIVERED", "WARRANTY_ACTIVE"];

export type DashboardFilters = {
  from?: string;
  to?: string;
  serviceCategoryId?: string;
  technicianId?: string;
  status?: string;
};

function parseDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function dateWhere(from: Date, to: Date) {
  return { gte: from, lte: to };
}

function serviceCategoryJobFilter(serviceCategoryId?: string): Prisma.JobCardWhereInput {
  if (!serviceCategoryId) return {};
  return { request: { service: { categoryId: serviceCategoryId } } };
}

function jobStatusFilter(status?: string): Prisma.JobCardWhereInput {
  if (!status || !(status in JobStatus)) return {};
  return { status: status as JobStatus };
}

function requestStatusFilter(status?: string): Prisma.ServiceRequestWhereInput {
  if (!status || !(status in RequestStatus)) return {};
  return { status: status as RequestStatus };
}

export async function getAdminDashboard(filters: DashboardFilters) {
  const now = new Date();
  const from = parseDate(filters.from, startOfMonth(now));
  const to = endOfDay(parseDate(filters.to, now));
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = endOfDay(todayStart);
  const monthStart = startOfMonth(now);

  const requestWhere: Prisma.ServiceRequestWhereInput = {
    deletedAt: null,
    createdAt: dateWhere(from, to),
    ...(filters.serviceCategoryId ? { service: { categoryId: filters.serviceCategoryId } } : {}),
    ...requestStatusFilter(filters.status)
  };

  const jobWhere: Prisma.JobCardWhereInput = {
    deletedAt: null,
    createdAt: dateWhere(from, to),
    ...(filters.technicianId ? { assignedToId: filters.technicianId } : {}),
    ...serviceCategoryJobFilter(filters.serviceCategoryId),
    ...jobStatusFilter(filters.status)
  };

  const fieldVisitWhere: Prisma.FieldVisitWhereInput = {
    deletedAt: null,
    ...(filters.technicianId ? { technicianId: filters.technicianId } : {}),
    ...(filters.serviceCategoryId ? { jobCard: serviceCategoryJobFilter(filters.serviceCategoryId) } : {}),
    ...(filters.status ? { status: filters.status as never } : {})
  };

  const [
    serviceCategories,
    technicians,
    newRequests,
    activeJobs,
    overdueJobs,
    awaitingQuotation,
    awaitingApproval,
    fieldVisitsToday,
    lowStock,
    revenue,
    campaignEnquiries,
    warrantyClaims,
    satisfaction,
    recentRequests,
    recentJobs,
    categoryCounts,
    activePromotions
  ] = await Promise.all([
    prisma.serviceCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.user.findMany({
      where: { deletedAt: null, isActive: true, role: { in: ["TECHNICIAN", "FIELD_INSTALLER"] } },
      orderBy: { name: "asc" },
      select: { id: true, name: true, role: true }
    }),
    prisma.serviceRequest.count({ where: { ...requestWhere, status: "NEW" } }),
    prisma.jobCard.count({ where: { ...jobWhere, status: { in: activeJobStatuses } } }),
    prisma.jobCard.count({
      where: {
        ...jobWhere,
        status: { notIn: closedJobStatuses },
        OR: [{ scheduledFor: { lt: todayStart } }, { updatedAt: { lt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5) } }]
      }
    }),
    prisma.jobCard.count({ where: { ...jobWhere, status: { in: awaitingQuotationStatuses }, quotations: { none: { deletedAt: null } } } }),
    prisma.jobCard.count({
      where: {
        ...jobWhere,
        OR: [{ status: { in: awaitingApprovalStatuses } }, { quotations: { some: { status: "SENT", deletedAt: null } } }]
      }
    }),
    prisma.fieldVisit.count({
      where: {
        ...fieldVisitWhere,
        appointment: { startsAt: dateWhere(todayStart, todayEnd) },
        status: { not: "CANCELLED" }
      }
    }),
    prisma.inventoryItem.findMany({
      where: { deletedAt: null, isActive: true },
      orderBy: [{ quantityOnHand: "asc" }, { name: "asc" }],
      take: 50
    }),
    prisma.invoice.aggregate({
      where: { deletedAt: null, status: { in: ["PARTIALLY_PAID", "PAID"] }, issuedAt: { gte: monthStart, lte: now } },
      _sum: { paidAmount: true, total: true }
    }),
    prisma.serviceRequest.count({
      where: {
        ...requestWhere,
        OR: [{ intakeChannel: { contains: "campaign", mode: "insensitive" } }, { intakeChannel: { contains: "promotion", mode: "insensitive" } }, { intakeChannel: { contains: "ad", mode: "insensitive" } }]
      }
    }),
    prisma.warranty.count({ where: { deletedAt: null, status: "CLAIMED", createdAt: dateWhere(from, to) } }),
    prisma.testimonial.aggregate({ where: { deletedAt: null, createdAt: dateWhere(from, to) }, _avg: { rating: true }, _count: { id: true } }),
    prisma.serviceRequest.findMany({
      where: requestWhere,
      orderBy: { createdAt: "desc" },
      take: 6,
      include: { customer: true, jobCard: true, service: { include: { category: true } } }
    }),
    prisma.jobCard.findMany({
      where: jobWhere,
      orderBy: { updatedAt: "desc" },
      take: 8,
      include: { customer: true, assignedTo: true, request: { include: { service: { include: { category: true } } } } }
    }),
    prisma.serviceRequest.groupBy({
      by: ["serviceId"],
      where: requestWhere,
      _count: { id: true }
    }),
    prisma.promotion.count({ where: { deletedAt: null, status: "ACTIVE", startsAt: { lte: now }, endsAt: { gte: now } } })
  ]);

  const services = await prisma.service.findMany({
    where: { id: { in: categoryCounts.map((item) => item.serviceId) } },
    include: { category: true }
  });
  const serviceById = new Map(services.map((service) => [service.id, service]));
  const categoryPerformance = categoryCounts
    .map((item) => {
      const service = serviceById.get(item.serviceId);
      return {
        name: service?.category.name ?? "Uncategorised",
        service: service?.name ?? "Unknown service",
        count: item._count.id
      };
    })
    .sort((left, right) => right.count - left.count)
    .slice(0, 8);

  return {
    filters: {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
      serviceCategoryId: filters.serviceCategoryId ?? "",
      technicianId: filters.technicianId ?? "",
      status: filters.status ?? ""
    },
    serviceCategories,
    technicians,
    widgets: {
      newRequests,
      activeJobs,
      overdueJobs,
      awaitingQuotation,
      awaitingApproval,
      fieldVisitsToday,
      lowStock: lowStock.filter((item) => item.quantityOnHand <= item.reorderLevel).length,
      monthlyRevenue: Number(revenue._sum.paidAmount ?? revenue._sum.total ?? 0),
      campaignEnquiries,
      activePromotions,
      warrantyClaims,
      customerSatisfaction: satisfaction._avg.rating ? Number(satisfaction._avg.rating.toFixed(1)) : null,
      satisfactionCount: satisfaction._count.id
    },
    lowStock: lowStock.filter((item) => item.quantityOnHand <= item.reorderLevel).slice(0, 8),
    recentRequests,
    recentJobs,
    categoryPerformance
  };
}
