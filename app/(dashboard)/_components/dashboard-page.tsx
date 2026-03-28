"use client";

import {
  BookingEntry,
  useGetDashboardInfo,
} from "@/hooks/overview/use-get-dashboard-info";
import { BookCheck, DollarSign } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

/* ---------------- Stat Card ---------------- */

type StatCardProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  bg: string;
  iconBg: string;
};

function StatCard({ label, value, icon, bg, iconBg }: StatCardProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-xl px-5 py-4 ${bg}`}
    >
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="mt-0.5 text-xs font-medium text-gray-500">{label}</p>
      </div>
      <div
        className={`flex size-10 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  );
}

/* ---------------- Toggle Button ---------------- */

function ToggleGroup({
  value,
  onChange,
}: {
  value: "Weekly" | "Monthly";
  onChange: (v: "Weekly" | "Monthly") => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-gray-100 p-0.5">
      {(["Weekly", "Monthly"] as const).map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`rounded-full px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
            value === opt
              ? "bg-[#23A4D2] text-white shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Custom Tooltip ---------------- */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function EarningsTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md text-xs">
        <p className="font-semibold text-[#23A4D2]">
          ${payload[0].value.toLocaleString()}
        </p>
        <p className="text-gray-400">{label}</p>
      </div>
    );
  }
  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function BookingTooltip({ active, payload, label }: any) {
  if (active && payload?.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white px-3 py-2 shadow-md text-xs">
        <p className="font-semibold text-[#23A4D2]">
          {payload[0].value.toLocaleString()} bookings
        </p>
        <p className="text-gray-400">{label}</p>
      </div>
    );
  }
  return null;
}

/* ---------------- Skeleton Loader ---------------- */

function SkeletonCard() {
  return (
    <div className="flex items-center justify-between rounded-xl px-5 py-4 bg-gray-50 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-24 rounded bg-gray-200" />
        <div className="h-3 w-16 rounded bg-gray-200" />
      </div>
      <div className="size-10 rounded-full bg-gray-200" />
    </div>
  );
}

function SkeletonChart() {
  return <div className="h-50 w-full animate-pulse rounded-lg bg-gray-100" />;
}

/* ---------------- Page ---------------- */

export default function DashboardPage() {
  const [earningsPeriod, setEarningsPeriod] = useState<"Weekly" | "Monthly">(
    "Monthly",
  );
  const [bookingPeriod, setBookingPeriod] = useState<"Weekly" | "Monthly">(
    "Monthly",
  );

  const { data, isLoading, isError } = useGetDashboardInfo();

  const dashboardData = data?.data;

  // Map API earnings data to chart format
  const earningsData = (
    earningsPeriod === "Weekly"
      ? (dashboardData?.earningsOverview.weekly ?? [])
      : (dashboardData?.earningsOverview.monthly ?? [])
  ).map((item) => ({
    label: item.label,
    value: item.revenue,
  }));

  // Map API booking data to chart format
  const bookingData = (
    bookingPeriod === "Weekly"
      ? (dashboardData?.bookingOverview.weekly ?? [])
      : (dashboardData?.bookingOverview.monthly ?? [])
  ).map((item: BookingEntry) => ({
    label: item.label,
    value: item.count,
  }));

  // Format total revenue with currency
  const formattedRevenue = dashboardData
    ? `${dashboardData.currency} ${dashboardData.totalRevenue.toLocaleString()}`
    : "—";

  return (
    <div className="flex flex-col gap-6">
      {/* Page heading */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-gray-800">
          Dashboard
        </h1>
        <p className="mt-0.5 text-xs text-gray-400">
          Welcome back to your admin panel
        </p>
      </div>

      {/* Error State */}
      {isError && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-600">
          Failed to load dashboard data. Please try again later.
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              label="Total Bookings"
              value={dashboardData?.totalBookings.toLocaleString() ?? "—"}
              bg="bg-blue-50"
              iconBg="bg-blue-400"
              icon={<BookCheck className="size-5 text-white" />}
            />
            <StatCard
              label="Total Revenue"
              value={formattedRevenue}
              bg="bg-orange-50"
              iconBg="bg-orange-400"
              icon={<DollarSign className="size-5 text-white" />}
            />
          </>
        )}
      </div>

      {/* Earnings Overview */}
      <div className="rounded-xl border border-gray-100 bg-white px-6 py-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Earnings Overview
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Track total revenue, platform commission, and payouts over time.
            </p>
          </div>
          <ToggleGroup value={earningsPeriod} onChange={setEarningsPeriod} />
        </div>

        {isLoading ? (
          <SkeletonChart />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={earningsData}
              margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#23A4D2" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#23A4D2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip content={<EarningsTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#23A4D2"
                strokeWidth={2}
                fill="url(#earningsGrad)"
                dot={false}
                activeDot={{ r: 4, fill: "#23A4D2", strokeWidth: 0 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Booking Overview */}
      <div className="rounded-xl border border-gray-100 bg-white px-6 py-5">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Booking Overview
            </h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Booking counts across the {bookingPeriod.toLowerCase()}.
            </p>
          </div>
          <ToggleGroup value={bookingPeriod} onChange={setBookingPeriod} />
        </div>

        {isLoading ? (
          <SkeletonChart />
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={bookingData}
              margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={false}
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<BookingTooltip />} />
              <Bar
                dataKey="value"
                fill="#23A4D2"
                radius={[4, 4, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
