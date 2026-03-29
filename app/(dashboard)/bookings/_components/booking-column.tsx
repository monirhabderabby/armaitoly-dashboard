"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Booking } from "@/types/booking";
import { ColumnDef } from "@tanstack/react-table";
import { Ban, Eye, Trash2 } from "lucide-react";

const statusStyles: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700 border-green-200",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const className =
    statusStyles[normalized] ?? "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <Badge
      variant="outline"
      className={`capitalize font-medium text-xs px-3 py-1 rounded-full border ${className}`}
    >
      {status}
    </Badge>
  );
}

interface BookingColumnsProps {
  onView?: (booking: Booking) => void;
  onDelete?: (booking: Booking) => void;
  onCancel?: (booking: Booking) => void; // 👈 added
}

export function getBookingColumns({
  onView,
  onDelete,
  onCancel, // 👈 added
}: BookingColumnsProps = {}): ColumnDef<Booking>[] {
  return [
    {
      id: "userName",
      header: "User Name",
      cell: ({ row }) => {
        const { firstName, lastName } = row.original.guest;
        return (
          <span className="font-medium text-gray-800">
            {firstName} {lastName}
          </span>
        );
      },
    },
    {
      id: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-gray-600 text-sm">
          {row.original.guest.email}
        </span>
      ),
    },
    {
      id: "phone",
      header: "Phone",
      cell: ({ row }) => (
        <span className="text-gray-600 text-sm">
          {row.original.guest.phone || row.original.guest.mobile || "—"}
        </span>
      ),
    },
    {
      id: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.firstNight);
        return (
          <span className="text-gray-600 text-sm">
            {date.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        );
      },
    },
    {
      id: "bookingPrice",
      header: "Booking Price",
      cell: ({ row }) => {
        const { price, currency } = row.original.payment;
        return (
          <span className="font-medium text-gray-800">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency || "USD",
            }).format(price)}
          </span>
        );
      },
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.statusLabel || row.original.status} />
      ),
    },
    {
      id: "action",
      header: "Action",
      cell: ({ row }) => {
        const isCancelled =
          row.original.statusLabel?.toLowerCase() === "cancelled" ||
          row.original.status === "0";

        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-cyan-500 hover:text-cyan-700 hover:bg-cyan-50"
              onClick={() => onView?.(row.original)}
              aria-label="View booking"
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-amber-400 hover:text-amber-600 hover:bg-amber-50 disabled:opacity-30 disabled:cursor-not-allowed"
              onClick={() => onCancel?.(row.original)}
              aria-label="Cancel booking"
              disabled={isCancelled}
            >
              <Ban className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete?.(row.original)}
              aria-label="Delete booking"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}
