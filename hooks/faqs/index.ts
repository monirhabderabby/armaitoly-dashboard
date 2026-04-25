import { baseUrl } from "@/constants";
import { useCallback, useState } from "react";

export interface Faq {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

interface CreateFaqPayload {
  question: string;
  answer: string;
}

// ─── useFaqs hook ────────────────────────────────────────────────────────────

interface Props {
  token: string;
}
export const useFaqs = ({ token }: Props) => {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── GET ALL (public – no auth header) ──────────────────────────────────────
  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/faq?page=1&limit=500`);
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      const data = await res.json();
      // Support both { data: [] } and plain array responses
      setFaqs(Array.isArray(data) ? data : (data.data ?? []));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ── CREATE (private) ────────────────────────────────────────────────────────
  const createFaq = useCallback(
    async (payload: CreateFaqPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/faq`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to create FAQ");
        await fetchFaqs();
        return true;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchFaqs],
  );

  // ── UPDATE (private) ────────────────────────────────────────────────────────
  const updateFaq = useCallback(
    async (id: string, payload: CreateFaqPayload): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/faq/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed to update FAQ");
        await fetchFaqs();
        return true;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token, fetchFaqs],
  );

  // ── DELETE (private) ────────────────────────────────────────────────────────
  const deleteFaq = useCallback(
    async (id: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${baseUrl}/faq/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to delete FAQ");
        setFaqs((prev) => prev.filter((f) => f._id !== id));
        return true;
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [token],
  );

  return { faqs, loading, error, fetchFaqs, createFaq, updateFaq, deleteFaq };
};
