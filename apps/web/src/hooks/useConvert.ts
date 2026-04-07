import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface ConvertPayload {
  html: string;
  source?: "html" | "url" | "file";
  viewport?: { width: number; height: number };
}

export function useConvert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ConvertPayload) => {
      const { data } = await api.post("/api/convert", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}
