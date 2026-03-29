"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import AlertModal from "@/components/ui/custom/alert-modal";
import { useCancelBooking } from "@/hooks/bookings/use-cancel-booking";
import { useDeleteBooking } from "@/hooks/bookings/use-delete-booking";
import { useGetBookings } from "@/hooks/bookings/use-get-bookings";
import { Booking } from "@/types/booking";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { toast } from "sonner";
import { getBookingColumns } from "./booking-column";
const BookingDetailModal = dynamic(() => import("./booking-detail-modal"), {
  ssr: false,
});

interface Props {
  user: Session["user"];
}

export default function BookingManagementContainer({ user }: Props) {
  const [page, setPage] = useState(1);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const limit = 30;

  const { data, isLoading, isError } = useGetBookings({
    token: user.accessToken,
    page,
    limit,
  });

  const { mutate: deleteBooking, isPending: isDeleting } = useDeleteBooking();
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const bookings = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.pages ?? 1;

  const columns = getBookingColumns({
    onView: (booking: Booking) => setSelectedBookId(booking.bookId),
    onDelete: (booking: Booking) => setBookingToDelete(booking),
    onCancel: (booking: Booking) => setBookingToCancel(booking),
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: bookings,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleConfirmDelete = () => {
    if (!bookingToDelete) return;

    deleteBooking(bookingToDelete.bookId, {
      onSuccess: () => {
        toast.success("Booking deleted successfully.");
        setBookingToDelete(null);
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to delete booking.");
      },
    });
  };

  const handleConfirmCancel = () => {
    if (!bookingToCancel) return;

    cancelBooking(bookingToCancel.bookId, {
      onSuccess: () => {
        toast.success("Booking cancelled successfully.");
        setBookingToCancel(null);
      },
      onError: (err) => {
        toast.error(err.message ?? "Failed to cancel booking.");
      },
    });
  };

  /* ── helpers ── */
  const startItem = meta ? (meta.page - 1) * meta.limit + 1 : 0;
  const endItem = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      {/* Page heading */}
      <div className="mb-1">
        <h1 className="text-2xl font-semibold text-gray-800">
          Booking Management
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Dashboard &rsaquo; Booking Management
        </p>
      </div>

      {/* Table card */}
      <div className="mt-5 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#4DC0CB] hover:bg-[#4DC0CB]">
              {table.getHeaderGroups().map((hg) =>
                hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-white font-semibold text-sm py-3 first:rounded-tl-xl last:rounded-tr-xl"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                )),
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-16 text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="animate-spin h-6 w-6 text-[#4DC0CB]"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    <span>Loading bookings…</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : isError ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-16 text-red-500"
                >
                  Failed to load bookings. Please try again.
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-16 text-gray-400"
                >
                  No bookings found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer: count + pagination */}
        {!isLoading && !isError && bookings.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing {startItem} to {endItem} of {meta?.total ?? 0} results
            </p>

            <Pagination>
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage((p) => p - 1);
                    }}
                    className={
                      page <= 1
                        ? "pointer-events-none opacity-40"
                        : "hover:bg-gray-100"
                    }
                  />
                </PaginationItem>

                {pageNumbers.map((num) => (
                  <PaginationItem key={num}>
                    <PaginationLink
                      href="#"
                      isActive={num === page}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(num);
                      }}
                      className={
                        num === page
                          ? "bg-[#4DC0CB] text-white border-[#4DC0CB] hover:bg-[#3daebb] hover:text-white"
                          : "hover:bg-gray-100"
                      }
                    >
                      {num}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < totalPages) setPage((p) => p + 1);
                    }}
                    className={
                      page >= totalPages
                        ? "pointer-events-none opacity-40"
                        : "hover:bg-gray-100"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {selectedBookId && (
        <BookingDetailModal
          bookId={selectedBookId}
          onClose={() => setSelectedBookId(null)}
        />
      )}

      <AlertModal
        isOpen={!!bookingToDelete}
        onClose={() => setBookingToDelete(null)}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
        title="Delete Booking?"
        message={`Are you sure you want to delete booking #${bookingToDelete?.bookId}? This action cannot be undone.`}
      />

      <AlertModal
        isOpen={!!bookingToCancel}
        onClose={() => setBookingToCancel(null)}
        onConfirm={handleConfirmCancel}
        loading={isCancelling}
        title="Cancel Booking?"
        message={`Are you sure you want to cancel booking #${bookingToCancel?.bookId}? This action cannot be undone.`}
      />
    </div>
  );
}
