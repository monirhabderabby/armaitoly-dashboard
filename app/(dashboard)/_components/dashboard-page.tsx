"use client";

import { BookCheck, DollarSign, Users } from "lucide-react";
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

/* ---------------- Mock Data ---------------- */

const earningsWeekly = [
  { label: "Mon", value: 12000 },
  { label: "Tue", value: 18000 },
  { label: "Wed", value: 15000 },
  { label: "Thu", value: 22000 },
  { label: "Fri", value: 30000 },
  { label: "Sat", value: 27000 },
  { label: "Sun", value: 35000 },
];

const earningsMonthly = [
  { label: "Feb", value: 18000 },
  { label: "Mar", value: 22000 },
  { label: "Apr", value: 45598 },
  { label: "May", value: 30000 },
  { label: "Jun", value: 38000 },
  { label: "Jul", value: 42000 },
  { label: "Aug", value: 50000 },
  { label: "Sep", value: 44000 },
  { label: "Oct", value: 47000 },
  { label: "Nov", value: 55000 },
  { label: "Dec", value: 60000 },
  { label: "Jan", value: 58000 },
];

const bookingWeekly = [
  { label: "1D", value: 1200 },
  { label: "2D", value: 5800 },
  { label: "3D", value: 3200 },
  { label: "4D", value: 10800 },
  { label: "5D", value: 5600 },
  { label: "6D", value: 10200 },
  { label: "7D", value: 6000 },
];

const bookingMonthly = [
  { label: "Jan", value: 4000 },
  { label: "Feb", value: 7000 },
  { label: "Mar", value: 5500 },
  { label: "Apr", value: 9000 },
  { label: "May", value: 6200 },
  { label: "Jun", value: 8800 },
  { label: "Jul", value: 7600 },
];

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
function CustomTooltip({ active, payload, label }: any) {
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

/* ---------------- Page ---------------- */

export default function DashboardPage() {
  const [earningsPeriod, setEarningsPeriod] = useState<"Weekly" | "Monthly">(
    "Monthly",
  );
  const [bookingPeriod, setBookingPeriod] = useState<"Weekly" | "Monthly">(
    "Weekly",
  );

  const earningsData =
    earningsPeriod === "Monthly" ? earningsMonthly : earningsWeekly;
  const bookingData =
    bookingPeriod === "Weekly" ? bookingWeekly : bookingMonthly;

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

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          label="Total Users"
          value="220"
          bg="bg-red-50"
          iconBg="bg-red-400"
          icon={<Users className="size-5 text-white" />}
        />
        <StatCard
          label="Total Bookings"
          value="220"
          bg="bg-blue-50"
          iconBg="bg-blue-400"
          icon={<BookCheck className="size-5 text-white" />}
        />
        <StatCard
          label="Total Revenue"
          value="$11,00"
          bg="bg-orange-50"
          iconBg="bg-orange-400"
          icon={<DollarSign className="size-5 text-white" />}
        />
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
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
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
      </div>

      {/* Booking Overview */}
      <div className="rounded-xl border border-gray-100 bg-white px-6 py-5">
        <div className="mb-4 flex items-start justify-between">
          <h2 className="text-sm font-semibold text-gray-800">
            Booking Overview
          </h2>
          <ToggleGroup value={bookingPeriod} onChange={setBookingPeriod} />
        </div>

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
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#23A4D2"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
