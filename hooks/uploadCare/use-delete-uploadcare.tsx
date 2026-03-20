// hooks/useDeleteUploadcareFile.ts
"use client";

import { useState } from "react";

interface DeleteState {
  loading: boolean;
  error: string | null;
}

export function useDeleteUploadcareFile() {
  const [state, setState] = useState<DeleteState>({
    loading: false,
    error: null,
  });

  const deleteUploadcareFile = async (uuid: string): Promise<boolean> => {
    setState({ loading: true, error: null });

    try {
      const res = await fetch("/api/uploadcare/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid }),
      });

      const data = await res.json();

      if (!res.ok) {
        setState({ loading: false, error: data.error ?? "Delete failed." });
        return false;
      }

      setState({ loading: false, error: null });
      return true;
    } catch {
      setState({ loading: false, error: "Network error." });
      return false;
    }
  };

  return { ...state, deleteUploadcareFile };
}
