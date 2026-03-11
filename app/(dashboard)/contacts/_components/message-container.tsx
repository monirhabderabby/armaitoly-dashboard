"use client";

import { useDeleteContact } from "@/hooks/contacts/use-delete-contact";
import {
  Contact,
  useGetAllContacts,
} from "@/hooks/contacts/use-get-all-contacts";
import { format, isToday, isYesterday } from "date-fns";
import { Session } from "next-auth";
import { useState } from "react";
import { HiOutlineEnvelope } from "react-icons/hi2";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";
import MessageDetailModal from "./message-detail-modal";

const LIMIT = 10;

// ─── Inline delete-confirm modal ─────────────────────────────────────────────
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: AlertModalProps) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <RiDeleteBin6Line className="text-red-500" size={26} />
        </div>
        <h3 className="text-base font-semibold text-gray-800 mb-1">
          Delete Message?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Are you sure you want to delete this message? This action cannot be
          undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {isLoading ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatReceived = (iso: string) => {
  const date = new Date(iso);
  const time = format(date, "h:mm a");
  if (isToday(date)) return `Today, ${time}`;
  if (isYesterday(date)) return `Yesterday, ${time}`;
  return format(date, "MMM dd, yyyy");
};

// ─── Component ────────────────────────────────────────────────────────────────
interface MessagesContainerProps {
  accessToken: string;
  user: Session["user"];
}

const MessagesContainer = ({ accessToken }: MessagesContainerProps) => {
  const [page, setPage] = useState(1);

  // Server-side pagination — page & limit sent to the API
  const { data, isLoading, isFetching } = useGetAllContacts(
    accessToken,
    page,
    LIMIT,
  );
  const { mutateAsync: deleteContact, isPending: deleting } =
    useDeleteContact(accessToken);

  const contacts = data?.data ?? [];
  const meta = data?.meta;
  const totalPages = meta?.pages ?? 1;

  // Modal state
  const [viewContact, setViewContact] = useState<Contact | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteContact(deleteTargetId);
      toast.success("Message deleted successfully");
      setDeleteTargetId(null);
      // If we deleted the last item on a non-first page, go back
      if (contacts.length === 1 && page > 1) setPage((p) => p - 1);
    } catch {
      toast.error("Failed to delete message");
    }
  };

  // Page numbers with ellipsis
  const getPageNumbers = (): (number | "…")[] => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (page > 3) pages.push("…");
    const start = Math.max(2, page - 1);
    const end = Math.min(totalPages - 1, page + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  const TABLE_HEADERS = ["Name", "Message", "Received", "Status", "Action"];

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-6xl  ">
        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Contact Messages
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Dashboard <span className="mx-1">›</span> Contact Messages
          </p>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-sky-500 text-white">
                  {TABLE_HEADERS.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3.5 text-left font-medium text-xs tracking-wide first:rounded-tl-xl last:rounded-tr-xl"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Skeleton rows */}
                {isLoading &&
                  [...Array(LIMIT)].map((_, i) => (
                    <tr key={i} className="border-b border-gray-50">
                      {[...Array(TABLE_HEADERS.length)].map((_, j) => (
                        <td key={j} className="px-4 py-3.5">
                          <div className="h-3.5 rounded bg-gray-100 animate-pulse w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ))}

                {/* Empty state */}
                {!isLoading && contacts.length === 0 && (
                  <tr>
                    <td
                      colSpan={TABLE_HEADERS.length}
                      className="text-center py-16 text-gray-400 text-sm"
                    >
                      No messages found.
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {!isLoading &&
                  contacts.map((contact, idx) => (
                    <tr
                      key={contact._id}
                      className={`border-b border-gray-50 transition-colors hover:bg-sky-50/30 ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      } ${isFetching ? "opacity-60" : ""}`}
                    >
                      {/* Name + email */}
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-800 text-xs">
                          {contact.name}
                        </p>
                        <p className="text-gray-400 text-xs mt-0.5 truncate max-w-40">
                          {contact.email}
                        </p>
                      </td>

                      {/* Message preview */}
                      <td className="px-4 py-3.5 text-gray-600 text-xs max-w-65">
                        <span className="line-clamp-2">{contact.message}</span>
                      </td>

                      {/* Received */}
                      <td className="px-4 py-3.5 text-gray-500 text-xs whitespace-nowrap">
                        {formatReceived(contact.createdAt)}
                      </td>

                      {/* Status badges */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-col gap-1">
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                              contact.isRead
                                ? "bg-sky-50 text-sky-500"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {contact.isRead ? (
                              <MdOutlineMarkEmailRead size={11} />
                            ) : (
                              <HiOutlineEnvelope size={11} />
                            )}
                            {contact.isRead ? "Read" : "Unread"}
                          </span>
                          {contact.isReplied && (
                            <span className="inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-500 w-fit">
                              Replied
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewContact(contact)}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-sky-50 text-sky-500 hover:bg-sky-100 transition"
                            title="View message"
                          >
                            <HiOutlineEnvelope size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(contact._id)}
                            className="w-7 h-7 rounded-full flex items-center justify-center bg-red-50 text-red-400 hover:bg-red-100 transition"
                            title="Delete message"
                          >
                            <RiDeleteBin6Line size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          {!isLoading && meta && meta.total > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-50">
              <p className="text-xs text-gray-400">
                Showing{" "}
                <span className="font-medium text-gray-600">
                  {(meta.page - 1) * meta.limit + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-gray-600">
                  {Math.min(meta.page * meta.limit, meta.total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-600">{meta.total}</span>{" "}
                results
              </p>

              <div className="flex items-center gap-1">
                {/* Prev */}
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <LuChevronLeft size={13} />
                </button>

                {getPageNumbers().map((num, i) =>
                  num === "…" ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-7 h-7 flex items-center justify-center text-gray-400 text-xs"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={num}
                      onClick={() => setPage(num as number)}
                      disabled={isFetching}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-medium transition ${
                        page === num
                          ? "bg-sky-500 text-white shadow-sm"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {num}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || isFetching}
                  className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <LuChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <MessageDetailModal
        contact={viewContact}
        onClose={() => setViewContact(null)}
      />

      <AlertModal
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        isLoading={deleting}
      />
    </div>
  );
};

export default MessagesContainer;
