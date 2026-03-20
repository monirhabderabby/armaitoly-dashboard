import { baseUrl } from "@/constants";
import { VillaByFilterResponse } from "@/types/property";
import { useQuery } from "@tanstack/react-query";

export function useGetVilla() {
  return useQuery<VillaByFilterResponse>({
    queryKey: ["villas-by-filter"],
    queryFn: async () => {
      const res = await fetch(`${baseUrl}/property/search`, {
        method: "GET",
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? "Failed to fetch villas");
      }

      return res.json();
    },
  });
}
