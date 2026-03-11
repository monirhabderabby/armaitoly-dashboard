"use client";

import { useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FaQuestion } from "react-icons/fa";
import { MdOutlineQuestionAnswer } from "react-icons/md";

export interface FaqFormData {
  question: string;
  answer: string;
}

interface CreateFaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FaqFormData) => Promise<void>;
  initialData?: FaqFormData;
  isLoading?: boolean;
}

const EMPTY_FORM: FaqFormData = { question: "", answer: "" };

function FaqFormContent({
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: Omit<CreateFaqModalProps, "isOpen">) {
  const [form, setForm] = useState<FaqFormData>(initialData ?? EMPTY_FORM);

  const isEdit = Boolean(initialData);

  const handleSubmit = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    await onSubmit(form);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-5">
          {isEdit ? "Edit FAQ" : "Add New FAQ"}
        </h2>

        <div className="mb-4">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
            <FaQuestion className="text-gray-400" size={13} />
            FAQ Question
          </label>
          <input
            type="text"
            placeholder="Savannah"
            value={form.question}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, question: e.target.value }))
            }
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition"
          />
        </div>

        <div className="mb-6">
          <label className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1.5">
            <MdOutlineQuestionAnswer className="text-gray-400" size={15} />
            Answer
          </label>
          <textarea
            placeholder="Write your answer here..."
            value={form.answer}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, answer: e.target.value }))
            }
            rows={5}
            className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent transition resize-none"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !form.question.trim() || !form.answer.trim()}
            className="flex-1 flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-sm font-medium py-2.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <AiOutlineSave size={17} />
            {isLoading ? "Saving..." : isEdit ? "Update FAQ" : "Save FAQ"}
          </button>
        </div>
      </div>
    </div>
  );
}

const CreateFaqModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: CreateFaqModalProps) => {
  if (!isOpen) return null;

  return (
    <FaqFormContent
      key={
        initialData ? `${initialData.question}-${initialData.answer}` : "new"
      }
      onClose={onClose}
      onSubmit={onSubmit}
      initialData={initialData}
      isLoading={isLoading}
    />
  );
};

export default CreateFaqModal;
