import { ExpenseStatus, InvoiceStatus, Prisma, QuotationStatus } from "@prisma/client";
import { audit } from "@/server/audit";
import { prisma } from "@/server/db";
import { expenseCreateSchema } from "@/server/validation";

export type FinanceFilters = {
  from?: string;
  to?: string;
  status?: string;
  q?: string;
};

const revenueInvoiceStatuses: InvoiceStatus[] = ["SENT", "PARTIALLY_PAID", "PAID", "OVERDUE"];
const activeExpenseStatuses: ExpenseStatus[] = ["APPROVED", "PAID"];

function parseDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

function nextNumber(prefix: string) {
  return `${prefix}-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

function dateWhere(from: Date, to: Date) {
  return { gte: from, lte: to };
}

function invoiceStatusFilter(status?: string): Prisma.InvoiceWhereInput {
  if (!status || !(status in InvoiceStatus)) return {};
  return { status: status as InvoiceStatus };
}

function quotationStatusFilter(status?: string): Prisma.QuotationWhereInput {
  if (!status || !(status in QuotationStatus)) return {};
  return { status: status as QuotationStatus };
}

export async function getFinanceDashboard(filters: FinanceFilters = {}) {
  const now = new Date();
  const from = parseDate(filters.from, startOfMonth(now));
  const to = endOfDay(parseDate(filters.to, now));
  const q = filters.q?.trim();

  const invoiceWhere: Prisma.InvoiceWhereInput = {
    deletedAt: null,
    createdAt: dateWhere(from, to),
    ...invoiceStatusFilter(filters.status),
    ...(q
      ? {
          OR: [
            { invoiceNumber: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } },
            { customer: { phone: { contains: q, mode: "insensitive" } } },
            { customer: { email: { contains: q, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const quotationWhere: Prisma.QuotationWhereInput = {
    deletedAt: null,
    createdAt: dateWhere(from, to),
    ...quotationStatusFilter(filters.status),
    ...(q
      ? {
          OR: [
            { quotationNumber: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } },
            { customer: { phone: { contains: q, mode: "insensitive" } } },
            { customer: { email: { contains: q, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const paymentWhere: Prisma.PaymentWhereInput = {
    deletedAt: null,
    status: "CONFIRMED",
    paidAt: dateWhere(from, to),
    ...(q
      ? {
          OR: [
            { paymentNumber: { contains: q, mode: "insensitive" } },
            { providerReference: { contains: q, mode: "insensitive" } },
            { customer: { name: { contains: q, mode: "insensitive" } } }
          ]
        }
      : {})
  };

  const expenseWhere: Prisma.ExpenseWhereInput = {
    deletedAt: null,
    status: { in: activeExpenseStatuses },
    expenseDate: dateWhere(from, to),
    ...(q
      ? {
          OR: [
            { expenseNumber: { contains: q, mode: "insensitive" } },
            { vendorName: { contains: q, mode: "insensitive" } },
            { category: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
            { reference: { contains: q, mode: "insensitive" } }
          ]
        }
      : {})
  };

  const overdueWhere: Prisma.InvoiceWhereInput = {
    deletedAt: null,
    status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] },
    balanceDue: { gt: 0 },
    dueAt: { lt: now }
  };

  const [
    revenue,
    payments,
    expenses,
    receivables,
    overdue,
    draftQuotes,
    sentQuotes,
    acceptedQuotes,
    invoices,
    quotations,
    recentPayments,
    receipts,
    recentExpenses,
    expenseCategories
  ] = await Promise.all([
    prisma.invoice.aggregate({
      where: { ...invoiceWhere, status: { in: revenueInvoiceStatuses } },
      _sum: { total: true }
    }),
    prisma.payment.aggregate({ where: paymentWhere, _sum: { amount: true } }),
    prisma.expense.aggregate({ where: expenseWhere, _sum: { amount: true } }),
    prisma.invoice.aggregate({
      where: { deletedAt: null, status: { in: ["SENT", "PARTIALLY_PAID", "OVERDUE"] }, balanceDue: { gt: 0 } },
      _sum: { balanceDue: true },
      _count: { id: true }
    }),
    prisma.invoice.aggregate({ where: overdueWhere, _sum: { balanceDue: true }, _count: { id: true } }),
    prisma.quotation.count({ where: { ...quotationWhere, status: "DRAFT" } }),
    prisma.quotation.count({ where: { ...quotationWhere, status: "SENT" } }),
    prisma.quotation.count({ where: { ...quotationWhere, status: "ACCEPTED" } }),
    prisma.invoice.findMany({
      where: invoiceWhere,
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { customer: true, jobCard: true, payments: true, receipts: true }
    }),
    prisma.quotation.findMany({
      where: quotationWhere,
      orderBy: { createdAt: "desc" },
      take: 16,
      include: { customer: true, items: true, jobCard: true, invoices: true }
    }),
    prisma.payment.findMany({
      where: paymentWhere,
      orderBy: { paidAt: "desc" },
      take: 12,
      include: { customer: true, invoice: true, receipts: true }
    }),
    prisma.receipt.findMany({
      where: { deletedAt: null, createdAt: dateWhere(from, to) },
      orderBy: { issuedAt: "desc" },
      take: 12,
      include: { customer: true, invoice: true, payment: true }
    }),
    prisma.expense.findMany({
      where: expenseWhere,
      orderBy: { expenseDate: "desc" },
      take: 16,
      include: { recordedBy: { select: { name: true, email: true } } }
    }),
    prisma.expense.groupBy({
      by: ["category"],
      where: expenseWhere,
      _sum: { amount: true },
      _count: { id: true },
      orderBy: { _sum: { amount: "desc" } },
      take: 8
    })
  ]);

  const invoiced = Number(revenue._sum.total ?? 0);
  const collected = Number(payments._sum.amount ?? 0);
  const spent = Number(expenses._sum.amount ?? 0);

  return {
    filters: {
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
      status: filters.status ?? "",
      q: q ?? ""
    },
    widgets: {
      invoiced,
      collected,
      expenses: spent,
      netCash: collected - spent,
      receivables: Number(receivables._sum.balanceDue ?? 0),
      receivableCount: receivables._count.id,
      overdue: Number(overdue._sum.balanceDue ?? 0),
      overdueCount: overdue._count.id,
      draftQuotes,
      sentQuotes,
      acceptedQuotes
    },
    invoices,
    quotations,
    recentPayments,
    receipts,
    recentExpenses,
    expenseCategories: expenseCategories.map((category) => ({
      category: category.category,
      amount: Number(category._sum.amount ?? 0),
      count: category._count.id
    }))
  };
}

export async function createExpense(input: unknown, actorId: string) {
  const parsed = expenseCreateSchema.parse(input);
  const expense = await prisma.expense.create({
    data: {
      expenseNumber: nextNumber("EXP"),
      category: parsed.category,
      vendorName: parsed.vendorName || undefined,
      description: parsed.description,
      amount: parsed.amount,
      currency: parsed.currency.toUpperCase(),
      method: parsed.method || undefined,
      status: parsed.status,
      expenseDate: parsed.expenseDate ? new Date(parsed.expenseDate) : new Date(),
      reference: parsed.reference || undefined,
      notes: parsed.notes || undefined,
      recordedById: actorId
    }
  });

  await audit("EXPENSE_RECORDED", "Expense", expense.id, actorId, {
    expenseNumber: expense.expenseNumber,
    amount: expense.amount,
    category: expense.category
  });

  return expense;
}
