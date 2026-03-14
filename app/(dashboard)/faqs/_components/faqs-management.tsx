"use client";

import { useEffect, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { IoAdd, IoChevronDown, IoChevronUp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";

import { Faq, useFaqs } from "@/hooks/faqs";
import { Session } from "next-auth";
import CreateFaqModal, { FaqFormData } from "./create-faq-modal";

// ─── Replace with your existing AlertModal / ConfirmDialog component ─────────
// e.g. import AlertModal from "@/components/AlertModal";
// Below is a drop-in that matches your built-in alert modal pattern.
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  isLoading?: boolean;
}

const AlertModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
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
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
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
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  cu: Session["user"];
}

export const FaqsPage = ({ cu }: Props) => {
  const { faqs, loading, fetchFaqs, createFaq, updateFaq, deleteFaq } = useFaqs(
    { token: cu.accessToken },
  );

  // ── accordion state ──────────────────────────────────────────────────────
  const [openId, setOpenId] = useState<string | null>(null);

  // ── create / edit modal ──────────────────────────────────────────────────
  const [faqModal, setFaqModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Faq | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // ── delete modal ─────────────────────────────────────────────────────────
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  // ── handlers ─────────────────────────────────────────────────────────────
  const handleOpenCreate = () => {
    setEditTarget(null);
    setFaqModal(true);
  };

  const handleOpenEdit = (faq: Faq) => {
    setEditTarget(faq);
    setFaqModal(true);
  };

  const handleFaqSubmit = async (data: FaqFormData) => {
    setSubmitting(true);
    let success = false;
    if (editTarget) {
      success = await updateFaq(editTarget._id, data);
    } else {
      success = await createFaq(data);
    }
    setSubmitting(false);
    if (success) setFaqModal(false);
  };

  const handleOpenDelete = (id: string) => {
    setDeleteTarget(id);
    setDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await deleteFaq(deleteTarget);
    setDeleting(false);
    setDeleteModal(false);
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              FAQ Management
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Dashboard &rsaquo; FAQ Management
            </p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition shadow-sm"
          >
            <IoAdd size={18} />
            Add New FAQ
          </button>
        </div>

        {/* FAQ List */}
        <div className="mt-6 space-y-3">
          {loading && faqs.length === 0 && (
            <p className="text-center text-gray-400 py-12">Loading FAQs…</p>
          )}

          {!loading && faqs.length === 0 && (
            <p className="text-center text-gray-400 py-12">
              No FAQs found. Add one!
            </p>
          )}

          {faqs.map((faq) => {
            const isOpen = openId === faq._id;
            return (
              <div
                key={faq._id}
                className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden"
              >
                {/* Row */}
                <div className="flex items-center px-5 py-4 gap-3">
                  {/* Toggle */}
                  <button
                    className="flex-1 flex items-center justify-between text-left"
                    onClick={() => setOpenId(isOpen ? null : faq._id)}
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <IoChevronUp
                        className="text-gray-400 shrink-0"
                        size={18}
                      />
                    ) : (
                      <IoChevronDown
                        className="text-gray-400 shrink-0"
                        size={18}
                      />
                    )}
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-3">
                    <button
                      onClick={() => handleOpenEdit(faq)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-sky-50 text-sky-500 hover:bg-sky-100 transition"
                      title="Edit"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(faq._id)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 text-red-400 hover:bg-red-100 transition"
                      title="Delete"
                    >
                      <RiDeleteBin6Line size={15} />
                    </button>
                  </div>
                </div>

                {/* Expanded answer */}
                {isOpen && (
                  <div className="px-5 pb-4 border-t border-gray-50">
                    <div
                      className="prose prose-sm max-w-none text-gray-500 mt-3 
    prose-ul:list-disc prose-ul:pl-5 
    prose-ol:list-decimal prose-ol:pl-5
    prose-li:my-0.5"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Create / Edit Modal */}
      <CreateFaqModal
        isOpen={faqModal}
        onClose={() => setFaqModal(false)}
        onSubmit={handleFaqSubmit}
        initialData={
          editTarget
            ? { question: editTarget.question, answer: editTarget.answer }
            : undefined
        }
        isLoading={submitting}
      />

      {/* Delete Confirmation Modal */}
      <AlertModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Delete FAQ?"
        message="Are you sure you want to delete this FAQ? This action cannot be undone."
        isLoading={deleting}
      />
    </div>
  );
};

export default FaqsPage;
