import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface UserSettings {
  tailwindConfig?: string;
  figmaApiKey?: string;
  defaultViewport: { width: number; height: number };
  preserveMargins: boolean;
  generateTokens: boolean;
  autoLayoutMode: "flex" | "absolute" | "auto";
}

export function useSettings() {
  return useQuery<UserSettings>({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/api/settings");
      return data;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Partial<UserSettings>) => {
      const { data } = await api.put("/api/settings", settings);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
