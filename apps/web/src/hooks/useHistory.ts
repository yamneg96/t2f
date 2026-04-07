import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface HistoryRecord {
  _id: string;
  source: "html" | "url" | "file";
  status: "success" | "error" | "pending";
  createdAt: string;
  nodeCount?: number;
  processingTimeMs?: number;
}

interface HistoryListResponse {
  records: HistoryRecord[];
  total: number;
  page: number;
  limit: number;
}

export function useHistory(page = 1, limit = 20) {
  return useQuery<HistoryListResponse>({
    queryKey: ["history", page, limit],
    queryFn: async () => {
      const { data } = await api.get("/api/history", {
        params: { page, limit },
      });
      return data;
    },
  });
}

export function useHistoryDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["history", id],
    queryFn: async () => {
      const { data } = await api.get(`/api/history/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
