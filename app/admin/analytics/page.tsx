"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingDown,
  TrendingUp,
  Eye,
  MousePointerClick,
  DollarSign,
  MessagesSquare,
} from "lucide-react";
import { type AnalyticsOverview } from "@/lib/analytics";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CATEGORY_COLORS = [
  "#0f766e",
  "#2563eb",
  "#f97316",
  "#16a34a",
  "#b45309",
  "#7c3aed",
];

const EMPTY_OVERVIEW: AnalyticsOverview = {
  generatedAt: new Date(0).toISOString(),
  windowDays: 30,
  stats: {
    uniqueVisitors: {
      value: 0,
      previousValue: 0,
      delta: 0,
      changePercent: 0,
      direction: "flat",
    },
    listingViews: {
      value: 0,
      previousValue: 0,
      delta: 0,
      changePercent: 0,
      direction: "flat",
    },
    inquiries: {
      value: 0,
      previousValue: 0,
      delta: 0,
      changePercent: 0,
      direction: "flat",
    },
    pipelineValue: {
      value: 0,
      previousValue: 0,
      delta: 0,
      changePercent: 0,
      direction: "flat",
    },
  },
  dailyTraffic: [],
  monthlyPipeline: [],
  categoryBreakdown: [],
  topListings: [],
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatChange(changePercent: number, direction: "up" | "down" | "flat") {
  if (direction === "flat") {
    return "0%";
  }

  return `${direction === "up" ? "+" : ""}${changePercent}%`;
}

export default function AnalyticsPage() {
  const [overview, setOverview] = useState<AnalyticsOverview>(EMPTY_OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadOverview() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/analytics", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Unable to load analytics.");
        }

        const data = (await response.json()) as {
          overview?: AnalyticsOverview;
        };

        if (!cancelled) {
          setOverview(data.overview ?? EMPTY_OVERVIEW);
        }
      } catch (caughtError) {
        if (!cancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Unable to load analytics."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadOverview();

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryChartData = overview.categoryBreakdown.map((item) => ({
    ...item,
    chartValue: item.pipelineValue || item.inquiries || item.views,
  }));

  const statCards = [
    {
      label: `Unique Visitors (${overview.windowDays}d)`,
      value: overview.stats.uniqueVisitors.value.toLocaleString(),
      change: formatChange(
        overview.stats.uniqueVisitors.changePercent,
        overview.stats.uniqueVisitors.direction
      ),
      up: overview.stats.uniqueVisitors.direction !== "down",
      icon: Eye,
      color: "text-cyan-700",
      bg: "bg-cyan-100",
    },
    {
      label: `Listing Views (${overview.windowDays}d)`,
      value: overview.stats.listingViews.value.toLocaleString(),
      change: formatChange(
        overview.stats.listingViews.changePercent,
        overview.stats.listingViews.direction
      ),
      up: overview.stats.listingViews.direction !== "down",
      icon: MousePointerClick,
      color: "text-blue-700",
      bg: "bg-blue-100",
    },
    {
      label: `Inquiries (${overview.windowDays}d)`,
      value: overview.stats.inquiries.value.toLocaleString(),
      change: formatChange(
        overview.stats.inquiries.changePercent,
        overview.stats.inquiries.direction
      ),
      up: overview.stats.inquiries.direction !== "down",
      icon: MessagesSquare,
      color: "text-emerald-700",
      bg: "bg-emerald-100",
    },
    {
      label: `Estimated Pipeline (${overview.windowDays}d)`,
      value: formatCurrency(overview.stats.pipelineValue.value),
      change: formatChange(
        overview.stats.pipelineValue.changePercent,
        overview.stats.pipelineValue.direction
      ),
      up: overview.stats.pipelineValue.direction !== "down",
      icon: DollarSign,
      color: "text-amber-700",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-headline font-bold text-primary">
          Analytics
        </h1>
        <p className="text-muted-foreground">
          Real storefront traffic, listing interest, and inquiry pipeline
          rollups from tracked product events.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {loading
            ? "Refreshing analytics..."
            : `Updated ${new Date(overview.generatedAt).toLocaleString()}`}
        </p>
      </div>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="overflow-hidden border-none shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className={`rounded-2xl p-3 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm font-semibold ${
                    stat.up ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {stat.up ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {loading ? "..." : stat.change}
                </div>
              </div>
              <p className="mb-1 text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="text-2xl font-headline font-bold text-primary">
                {loading ? "..." : stat.value}
              </h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold text-primary">
              Traffic Over The Last 7 Days
            </CardTitle>
            <CardDescription>
              Unique visitors, listing views, and inquiries by day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overview.dailyTraffic.length === 0 ? (
              <p className="text-sm text-slate-500">
                No tracked storefront traffic yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={overview.dailyTraffic}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="visitors"
                    stroke="#0f766e"
                    strokeWidth={2}
                    dot={{ fill: "#0f766e", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="listingViews"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb", r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="inquiries"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold text-primary">
              Inquiry Pipeline By Month
            </CardTitle>
            <CardDescription>
              Six-month view of inquiry volume and estimated pipeline value.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {overview.monthlyPipeline.length === 0 ? (
              <p className="text-sm text-slate-500">
                Monthly pipeline will appear after inquiries are recorded.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={overview.monthlyPipeline} barCategoryGap="28%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number, key: string) =>
                      key === "pipelineValue"
                        ? [formatCurrency(value), "Pipeline"]
                        : [value, "Inquiries"]
                    }
                  />
                  <Bar
                    dataKey="pipelineValue"
                    fill="hsl(var(--primary))"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold text-primary">
              Interest By Category
            </CardTitle>
            <CardDescription>
              Current {overview.windowDays}-day mix of listing interest and
              inquiry demand.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-8 md:flex-row md:items-center">
            {categoryChartData.length === 0 ? (
              <p className="text-sm text-slate-500">
                Category interest will populate once storefront traffic is
                recorded.
              </p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={260} className="max-w-xs">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      dataKey="chartValue"
                      label={({ percent }) =>
                        percent ? `${(percent * 100).toFixed(0)}%` : ""
                      }
                      labelLine={false}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell
                          key={entry.name}
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        value.toLocaleString(),
                        "Interest signal",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex-1 space-y-3">
                  {overview.categoryBreakdown.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{
                          background: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
                        }}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {entry.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {entry.views} views, {entry.inquiries} inquiries
                        </p>
                      </div>
                      <span className="text-sm font-bold text-primary">
                        {formatCurrency(entry.pipelineValue)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-headline font-bold text-primary">
              Top Listings This Period
            </CardTitle>
            <CardDescription>
              Ranked by inquiry pipeline, then inquiry count and listing views.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.topListings.length === 0 ? (
              <p className="text-sm text-slate-500">
                Top listing performance will appear after traffic and inquiries
                are recorded.
              </p>
            ) : (
              overview.topListings.map((listing, index) => (
                <div
                  key={listing.listingId}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                        #{index + 1} · {listing.category}
                      </p>
                      <p className="mt-1 font-semibold text-slate-900">
                        {listing.listingName}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(listing.pipelineValue)}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{listing.views} views</span>
                    <span>{listing.inquiries} inquiries</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
