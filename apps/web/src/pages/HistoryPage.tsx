import { useEffect, useState } from "react";
import { historyApi } from "@/lib/api";
import { Link } from "react-router-dom";

export default function HistoryPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    historyApi.list(page, 12).then((res) => {
      setRecords(res.data.data.records);
      setTotal(res.data.data.total);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [page]);

  const stats = {
    total: total,
    success: records.filter((r) => r.status === "success").length,
    avgLatency: records.length > 0 ? Math.round(records.reduce((s, r) => s + r.latencyMs, 0) / records.length) : 0,
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-block px-3 py-1 mb-4 border border-[var(--sm-primary)]/30 bg-[var(--sm-primary)]/10 rounded-sm">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--sm-primary)]">
            Conversion Logs
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter font-headline uppercase">
          History
        </h1>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-[var(--sm-outline-variant)]/10 p-px rounded-lg overflow-hidden mb-8">
        <div className="bg-[var(--sm-surface-container)] p-6 flex flex-col gap-1">
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-[var(--sm-outline)]">Total Runs</span>
          <span className="text-3xl font-bold font-headline text-[var(--sm-on-surface)]">{stats.total}</span>
        </div>
        <div className="bg-[var(--sm-surface-container)] p-6 flex flex-col gap-1">
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-[var(--sm-outline)]">Success Rate</span>
          <span className="text-3xl font-bold font-headline text-[var(--sm-secondary)]">
            {stats.total > 0 ? Math.round((stats.success / records.length) * 100) : 0}%
          </span>
        </div>
        <div className="bg-[var(--sm-surface-container)] p-6 flex flex-col gap-1">
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-[var(--sm-outline)]">Avg Latency</span>
          <span className="text-3xl font-bold font-headline text-[var(--sm-primary)]">{stats.avgLatency}ms</span>
        </div>
      </div>

      {/* Table */}
      <div className="border border-[var(--sm-outline-variant)]/20 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[var(--sm-outline-variant)]/20 bg-[var(--sm-surface-container)]">
              <th className="py-4 px-6 font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)]">Source</th>
              <th className="py-4 px-6 font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)]">Status</th>
              <th className="py-4 px-6 font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)]">Nodes</th>
              <th className="py-4 px-6 font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)]">Latency</th>
              <th className="py-4 px-6 font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)]">Date</th>
              <th className="py-4 px-6 font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)]"></th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {loading ? (
              <tr><td colSpan={6} className="py-12 text-center text-[var(--sm-on-surface-variant)]">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-[var(--sm-on-surface-variant)]">No conversions yet. <Link to="/editor" className="text-[var(--sm-primary)]">Start one →</Link></td></tr>
            ) : (
              records.map((r) => (
                <tr key={r.id} className="border-b border-[var(--sm-outline-variant)]/10 hover:bg-[var(--sm-surface-container-low)] transition-colors">
                  <td className="py-3 px-6">
                    <span className="font-mono text-xs">{r.sourceLabel?.slice(0, 30)}</span>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm font-label text-[10px] uppercase tracking-wider ${
                      r.status === "success" ? "bg-[var(--sm-secondary)]/10 text-[var(--sm-secondary)]" : "bg-[var(--sm-error)]/10 text-[var(--sm-error)]"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${r.status === "success" ? "bg-[var(--sm-secondary)]" : "bg-[var(--sm-error)]"}`}></span>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 font-mono text-xs">{r.nodeCount ?? "-"}</td>
                  <td className="py-3 px-6 font-mono text-xs">{r.latencyMs}ms</td>
                  <td className="py-3 px-6 font-label text-xs text-[var(--sm-on-surface-variant)]">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6">
                    <Link to={`/results/${r.id}`} className="text-[var(--sm-primary)] font-label text-[10px] uppercase tracking-widest hover:underline">
                      View →
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 12 && (
        <div className="flex justify-center gap-2 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-[var(--sm-outline-variant)]/30 font-label text-xs uppercase disabled:opacity-30 hover:bg-[var(--sm-surface-container)] transition-colors"
          >
            Prev
          </button>
          <span className="px-4 py-2 font-label text-xs text-[var(--sm-on-surface-variant)]">
            Page {page} of {Math.ceil(total / 12)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= Math.ceil(total / 12)}
            className="px-4 py-2 border border-[var(--sm-outline-variant)]/30 font-label text-xs uppercase disabled:opacity-30 hover:bg-[var(--sm-surface-container)] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
