import "server-only";

import {
  type AnalyticsCategoryBreakdown,
  type AnalyticsDailyTrafficPoint,
  type AnalyticsEvent,
  type AnalyticsMonthlyPipelinePoint,
  type AnalyticsOverview,
  type AnalyticsStat,
  type AnalyticsTopListing,
} from "@/lib/analytics";
import { type Listing } from "@/lib/mock-data";

interface InquiryAnalyticsRow {
  inquiryId: string;
  listingId: string;
  listingName: string;
  category: string;
  price: number;
  createdAt: string;
}

interface BuildAnalyticsOverviewInput {
  events: AnalyticsEvent[];
  inquiries: InquiryAnalyticsRow[];
  listings: Listing[];
  windowDays?: number;
}

const VIEW_EVENT_TYPES = new Set(["home_view", "store_view", "listing_view"]);
const DAY_MS = 24 * 60 * 60 * 1000;

function getUtcDayKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 10);
}

function getUtcMonthKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  return date.toISOString().slice(0, 7);
}

function startOfUtcMonth(value: Date) {
  return new Date(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), 1));
}

function formatDayLabel(key: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${key}T00:00:00.000Z`));
}

function formatMonthLabel(key: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${key}-01T00:00:00.000Z`));
}

function buildStat(currentValue: number, previousValue: number): AnalyticsStat {
  const delta = currentValue - previousValue;
  const direction = delta === 0 ? "flat" : delta > 0 ? "up" : "down";
  const changePercent =
    previousValue === 0
      ? currentValue === 0
        ? 0
        : 100
      : Number((((delta / previousValue) * 100) || 0).toFixed(1));

  return {
    value: currentValue,
    previousValue,
    delta,
    changePercent,
    direction,
  };
}

export function buildAnalyticsOverview(
  input: BuildAnalyticsOverviewInput
): AnalyticsOverview {
  const now = new Date();
  const windowDays = input.windowDays ?? 30;
  const currentStart = new Date(now.getTime() - windowDays * DAY_MS);
  const previousStart = new Date(currentStart.getTime() - windowDays * DAY_MS);
  const trafficStart = new Date(now.getTime() - 6 * DAY_MS);
  const monthlyStart = startOfUtcMonth(
    new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1))
  );
  const listingMap = new Map(input.listings.map((listing) => [listing.id, listing]));

  const currentEvents = input.events.filter((event) => {
    const createdAt = new Date(event.createdAt);
    return createdAt >= currentStart && createdAt <= now;
  });
  const previousEvents = input.events.filter((event) => {
    const createdAt = new Date(event.createdAt);
    return createdAt >= previousStart && createdAt < currentStart;
  });
  const currentInquiries = input.inquiries.filter((inquiry) => {
    const createdAt = new Date(inquiry.createdAt);
    return createdAt >= currentStart && createdAt <= now;
  });
  const previousInquiries = input.inquiries.filter((inquiry) => {
    const createdAt = new Date(inquiry.createdAt);
    return createdAt >= previousStart && createdAt < currentStart;
  });

  const currentVisitors = new Set(
    currentEvents
      .filter((event) => VIEW_EVENT_TYPES.has(event.eventType))
      .map((event) => event.fingerprint)
  ).size;
  const previousVisitors = new Set(
    previousEvents
      .filter((event) => VIEW_EVENT_TYPES.has(event.eventType))
      .map((event) => event.fingerprint)
  ).size;
  const currentListingViews = currentEvents.filter(
    (event) => event.eventType === "listing_view"
  ).length;
  const previousListingViews = previousEvents.filter(
    (event) => event.eventType === "listing_view"
  ).length;
  const currentPipelineValue = currentInquiries.reduce(
    (sum, inquiry) => sum + inquiry.price,
    0
  );
  const previousPipelineValue = previousInquiries.reduce(
    (sum, inquiry) => sum + inquiry.price,
    0
  );

  const trafficDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(trafficStart.getTime() + index * DAY_MS);
    const key = getUtcDayKey(date);
    return {
      key,
      label: formatDayLabel(key),
      visitors: new Set<string>(),
      listingViews: 0,
      inquiries: 0,
    };
  });
  const trafficMap = new Map(trafficDays.map((point) => [point.key, point]));

  input.events.forEach((event) => {
    const createdAt = new Date(event.createdAt);
    if (createdAt < trafficStart || createdAt > now) {
      return;
    }

    const point = trafficMap.get(getUtcDayKey(createdAt));
    if (!point) {
      return;
    }

    if (VIEW_EVENT_TYPES.has(event.eventType)) {
      point.visitors.add(event.fingerprint);
    }
    if (event.eventType === "listing_view") {
      point.listingViews += 1;
    }
  });

  input.inquiries.forEach((inquiry) => {
    const createdAt = new Date(inquiry.createdAt);
    if (createdAt < trafficStart || createdAt > now) {
      return;
    }

    const point = trafficMap.get(getUtcDayKey(createdAt));
    if (point) {
      point.inquiries += 1;
    }
  });

  const dailyTraffic: AnalyticsDailyTrafficPoint[] = trafficDays.map((point) => ({
    date: point.key,
    label: point.label,
    visitors: point.visitors.size,
    listingViews: point.listingViews,
    inquiries: point.inquiries,
  }));

  const monthlyBuckets = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(
      Date.UTC(
        monthlyStart.getUTCFullYear(),
        monthlyStart.getUTCMonth() + index,
        1
      )
    );
    const key = getUtcMonthKey(date);
    return {
      key,
      label: formatMonthLabel(key),
      inquiries: 0,
      pipelineValue: 0,
    };
  });
  const monthlyMap = new Map(monthlyBuckets.map((point) => [point.key, point]));

  input.inquiries.forEach((inquiry) => {
    const createdAt = new Date(inquiry.createdAt);
    if (createdAt < monthlyStart || createdAt > now) {
      return;
    }

    const point = monthlyMap.get(getUtcMonthKey(createdAt));
    if (point) {
      point.inquiries += 1;
      point.pipelineValue += inquiry.price;
    }
  });

  const categoryMap = new Map<string, AnalyticsCategoryBreakdown>();
  const topListingMap = new Map<string, AnalyticsTopListing>();

  currentEvents.forEach((event) => {
    if (event.eventType !== "listing_view") {
      return;
    }

    const listingId = event.subject ?? String(event.metadata.listingId ?? "");
    const listing =
      listingMap.get(listingId) ??
      ({
        id: listingId,
        name: String(event.metadata.listingName ?? "Unknown Listing"),
        category: String(event.metadata.category ?? "Uncategorized"),
      } as Pick<Listing, "id" | "name" | "category">);
    const categoryName = listing.category || "Uncategorized";
    const category =
      categoryMap.get(categoryName) ??
      {
        name: categoryName,
        views: 0,
        inquiries: 0,
        pipelineValue: 0,
      };
    category.views += 1;
    categoryMap.set(categoryName, category);

    const topListing =
      topListingMap.get(listing.id) ??
      {
        listingId: listing.id,
        listingName: listing.name,
        category: categoryName,
        views: 0,
        inquiries: 0,
        pipelineValue: 0,
      };
    topListing.views += 1;
    topListingMap.set(listing.id, topListing);
  });

  currentInquiries.forEach((inquiry) => {
    const categoryName = inquiry.category || "Uncategorized";
    const category =
      categoryMap.get(categoryName) ??
      {
        name: categoryName,
        views: 0,
        inquiries: 0,
        pipelineValue: 0,
      };
    category.inquiries += 1;
    category.pipelineValue += inquiry.price;
    categoryMap.set(categoryName, category);

    const topListing =
      topListingMap.get(inquiry.listingId) ??
      {
        listingId: inquiry.listingId,
        listingName: inquiry.listingName,
        category: categoryName,
        views: 0,
        inquiries: 0,
        pipelineValue: 0,
      };
    topListing.inquiries += 1;
    topListing.pipelineValue += inquiry.price;
    topListingMap.set(inquiry.listingId, topListing);
  });

  return {
    generatedAt: now.toISOString(),
    windowDays,
    stats: {
      uniqueVisitors: buildStat(currentVisitors, previousVisitors),
      listingViews: buildStat(currentListingViews, previousListingViews),
      inquiries: buildStat(currentInquiries.length, previousInquiries.length),
      pipelineValue: buildStat(currentPipelineValue, previousPipelineValue),
    },
    dailyTraffic,
    monthlyPipeline: monthlyBuckets.map((point): AnalyticsMonthlyPipelinePoint => ({
      month: point.key,
      label: point.label,
      inquiries: point.inquiries,
      pipelineValue: point.pipelineValue,
    })),
    categoryBreakdown: Array.from(categoryMap.values())
      .sort((left, right) => {
        return (
          right.pipelineValue - left.pipelineValue ||
          right.inquiries - left.inquiries ||
          right.views - left.views
        );
      })
      .slice(0, 6),
    topListings: Array.from(topListingMap.values())
      .sort((left, right) => {
        return (
          right.pipelineValue - left.pipelineValue ||
          right.inquiries - left.inquiries ||
          right.views - left.views
        );
      })
      .slice(0, 5),
  };
}
