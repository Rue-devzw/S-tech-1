export type AnalyticsEventType =
  | "home_view"
  | "store_view"
  | "listing_view"
  | "inquiry_created";

export interface AnalyticsEvent {
  id: string;
  route: string;
  fingerprint: string;
  eventType: AnalyticsEventType;
  subject: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AnalyticsStat {
  value: number;
  previousValue: number;
  delta: number;
  changePercent: number;
  direction: "up" | "down" | "flat";
}

export interface AnalyticsDailyTrafficPoint {
  date: string;
  label: string;
  visitors: number;
  listingViews: number;
  inquiries: number;
}

export interface AnalyticsMonthlyPipelinePoint {
  month: string;
  label: string;
  inquiries: number;
  pipelineValue: number;
}

export interface AnalyticsCategoryBreakdown {
  name: string;
  views: number;
  inquiries: number;
  pipelineValue: number;
}

export interface AnalyticsTopListing {
  listingId: string;
  listingName: string;
  category: string;
  views: number;
  inquiries: number;
  pipelineValue: number;
}

export interface AnalyticsOverview {
  generatedAt: string;
  windowDays: number;
  stats: {
    uniqueVisitors: AnalyticsStat;
    listingViews: AnalyticsStat;
    inquiries: AnalyticsStat;
    pipelineValue: AnalyticsStat;
  };
  dailyTraffic: AnalyticsDailyTrafficPoint[];
  monthlyPipeline: AnalyticsMonthlyPipelinePoint[];
  categoryBreakdown: AnalyticsCategoryBreakdown[];
  topListings: AnalyticsTopListing[];
}
