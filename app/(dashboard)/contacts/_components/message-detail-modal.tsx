"use client";

import { Contact } from "@/hooks/contacts/use-get-all-contacts";
import { format } from "date-fns";
import { FiCheck, FiX } from "react-icons/fi";

interface MessageDetailModalProps {
  contact: Contact | null;
  onClose: () => void;
}

const MessageDetailModal = ({ contact, onClose }: MessageDetailModalProps) => {
  if (!contact) return null;

  const receivedAt = format(new Date(contact.createdAt), "MMMM d, h:mm a");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">New Message</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <FiX size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Row 1: From, Phone, Email */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">From</p>
              <p className="text-sm font-medium text-gray-800">
                {contact.name}
              </p>
            </div>

            <div className={contact.email ? "" : "col-span-2"}>
              <p className="text-xs text-gray-400 mb-0.5">Email</p>
              <p className="text-sm font-medium text-gray-800 break-all">
                {contact.email}
              </p>
            </div>
          </div>

          {/* Received */}
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Received</p>
            <p className="text-sm font-medium text-gray-800">{receivedAt}</p>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Message</p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-sm text-gray-700 leading-relaxed">
                {contact.message}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 rounded-lg transition"
          >
            <FiCheck size={14} />
            Mark as Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal;
