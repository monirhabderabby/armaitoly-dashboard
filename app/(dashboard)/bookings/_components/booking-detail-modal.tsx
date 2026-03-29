"use client";

import { useGetSingleBooking } from "@/hooks/bookings/use-get-single-booking";
import {
  Building2,
  Calendar,
  CreditCard,
  Mail,
  MapPin,
  Moon,
  Phone,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect } from "react";

interface Props {
  bookId: string | null;
  onClose: () => void;
}

/* ── helpers ── */
function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
      <span className="text-sm text-gray-800 font-medium">{value}</span>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#4DC0CB]/10 text-[#4DC0CB]">
          {icon}
        </span>
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">{children}</div>
    </div>
  );
}

function StatusBadge({ label }: { label: string }) {
  const colorMap: Record<string, string> = {
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
  };
  const cls = colorMap[label] ?? "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}
    >
      {label}
    </span>
  );
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

export default function BookingDetailModal({ bookId, onClose }: Props) {
  const { data, isLoading, isError } = useGetSingleBooking(bookId ?? "");

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!bookId) return null;

  const booking = data?.data;

  const formatDate = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal panel */}
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#4DC0CB] flex items-center justify-center shrink-0">
              <Building2 className="text-white" size={18} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900 leading-tight">
                Booking Details
              </h2>
              {booking && (
                <p className="text-xs text-gray-400 mt-0.5">
                  #{booking.bookId}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {/* Loading skeleton */}
          {isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-xl border border-gray-100 bg-gray-50 p-4 space-y-3"
                >
                  <Skeleton className="h-4 w-32" />
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                    <Skeleton className="h-8" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
              <span className="text-3xl">⚠️</span>
              <p className="text-sm font-medium text-gray-700">
                Failed to load booking details.
              </p>
              <p className="text-xs text-gray-400">
                Please close and try again.
              </p>
            </div>
          )}

          {/* Content */}
          {booking && (
            <>
              {/* Top row: referer + status */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[11px] font-bold text-white"
                    style={{ backgroundColor: `#${booking.flagColor}` }}
                  >
                    {booking.flagText}
                  </span>
                  <span className="text-xs text-gray-400">
                    via {booking.referer}
                  </span>
                </div>
                <StatusBadge label={booking.statusLabel} />
              </div>

              {/* Stay overview */}
              <SectionCard icon={<Calendar size={15} />} title="Stay Overview">
                <InfoField
                  label="Check-in"
                  value={formatDate(booking.firstNight)}
                />
                <InfoField
                  label="Check-out"
                  value={formatDate(booking.lastNight)}
                />
                <InfoField
                  label="Duration"
                  value={`${booking.nights} night${booking.nights !== 1 ? "s" : ""}`}
                />
                <InfoField
                  label="Booked On"
                  value={formatDate(booking.bookingTime)}
                />
                <InfoField label="Room ID" value={booking.roomId} />
                <InfoField label="Booking ID" value={booking.bookId} />
              </SectionCard>

              {/* Guests */}
              <SectionCard icon={<Users size={15} />} title="Guests">
                <InfoField label="Adults" value={booking.numAdult} />
                <InfoField label="Children" value={booking.numChild} />
                {booking.guest.firstName && (
                  <InfoField
                    label="Name"
                    value={`${booking.guest.title ? booking.guest.title + " " : ""}${booking.guest.firstName} ${booking.guest.lastName}`}
                  />
                )}
                {booking.guest.arrivalTime && (
                  <InfoField
                    label="Arrival Time"
                    value={booking.guest.arrivalTime}
                  />
                )}
              </SectionCard>

              {/* Guest contact — only if any field is filled */}
              {(booking.guest.email ||
                booking.guest.phone ||
                booking.guest.mobile ||
                booking.guest.address) && (
                <SectionCard icon={<User size={15} />} title="Guest Contact">
                  {booking.guest.email && (
                    <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
                      <Mail size={13} className="text-gray-400 shrink-0" />
                      {booking.guest.email}
                    </div>
                  )}
                  {(booking.guest.phone || booking.guest.mobile) && (
                    <div className="col-span-2 flex items-center gap-2 text-sm text-gray-700">
                      <Phone size={13} className="text-gray-400 shrink-0" />
                      {booking.guest.phone || booking.guest.mobile}
                    </div>
                  )}
                  {booking.guest.address && (
                    <div className="col-span-2 flex items-start gap-2 text-sm text-gray-700">
                      <MapPin
                        size={13}
                        className="text-gray-400 shrink-0 mt-0.5"
                      />
                      <span>
                        {[
                          booking.guest.address,
                          booking.guest.city,
                          booking.guest.state,
                          booking.guest.postcode,
                          booking.guest.country,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </span>
                    </div>
                  )}
                </SectionCard>
              )}

              {/* Payment */}
              <SectionCard icon={<CreditCard size={15} />} title="Payment">
                <div className="col-span-2 flex items-center justify-between rounded-lg bg-[#4DC0CB]/10 px-4 py-3 mb-1">
                  <span className="text-sm font-medium text-gray-600">
                    Total Price
                  </span>
                  <span className="text-lg font-bold text-[#4DC0CB]">
                    {booking.payment.currency}{" "}
                    {booking.payment.price.toLocaleString()}
                  </span>
                </div>
                <InfoField
                  label="Commission"
                  value={`${booking.payment.currency} ${booking.payment.commission.toLocaleString()}`}
                />
                <InfoField
                  label="Deposit"
                  value={`${booking.payment.currency} ${booking.payment.deposit.toLocaleString()}`}
                />
                {booking.payment.tax > 0 && (
                  <InfoField
                    label="Tax"
                    value={`${booking.payment.currency} ${booking.payment.tax.toLocaleString()}`}
                  />
                )}
              </SectionCard>

              {/* Rate breakdown */}
              {booking.rateDescription && (
                <SectionCard icon={<Moon size={15} />} title="Rate Breakdown">
                  <div className="col-span-2">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed bg-white rounded-lg border border-gray-200 p-3">
                      {booking.rateDescription.trim()}
                    </pre>
                  </div>
                </SectionCard>
              )}

              {/* Notes */}
              {booking.notes && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-amber-500 mb-1">
                    Notes
                  </p>
                  <p className="text-sm text-amber-800">{booking.notes}</p>
                </div>
              )}

              {/* Guest comments */}
              {booking.guest.comments && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Guest Comments
                  </p>
                  <p className="text-sm text-gray-700">
                    {booking.guest.comments}
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Footer ── */}
        {booking && (
          <div className="shrink-0 px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/60">
            <p className="text-xs text-gray-400">
              Last modified:{" "}
              {booking.modified ? formatDate(booking.modified) : "—"}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
