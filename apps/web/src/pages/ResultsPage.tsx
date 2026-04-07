import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { historyApi } from "@/lib/api";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"tree" | "json" | "preview">("tree");

  useEffect(() => {
    if (!id) return;
    historyApi.detail(id).then((res) => {
      setData(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-[var(--sm-primary)]/30 border-t-[var(--sm-primary)] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-[var(--sm-on-surface-variant)]">Conversion not found</p>
        <Link to="/editor" className="text-[var(--sm-primary)] font-label text-xs uppercase tracking-widest">
          ← Back to Editor
        </Link>
      </div>
    );
  }

  const ir = data.ir;
  const record = data.record;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[var(--sm-outline-variant)]/20 bg-[var(--sm-surface-container-low)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/editor" className="text-[var(--sm-on-surface-variant)] hover:text-[var(--sm-on-surface)] transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div>
            <h1 className="text-lg font-bold tracking-tighter font-headline">Conversion Results</h1>
            <p className="font-label text-[10px] text-[var(--sm-outline)] uppercase tracking-widest">
              ID: {record.id?.slice(-8)} • {record.latencyMs}ms • {ir?.meta?.nodeCount ?? 0} nodes
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-sm font-label text-[10px] uppercase tracking-widest ${
            record.status === "success"
              ? "bg-[var(--sm-secondary)]/10 text-[var(--sm-secondary)]"
              : "bg-[var(--sm-error)]/10 text-[var(--sm-error)]"
          }`}>
            {record.status}
          </span>
          <button className="px-4 py-2 code-gradient text-[var(--sm-on-primary)] font-label text-xs uppercase font-bold tracking-widest">
            Export .fig
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-[var(--sm-outline-variant)]/20 bg-[var(--sm-surface-container)]">
        {(["tree", "json", "preview"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 font-label text-xs uppercase tracking-widest transition-colors ${
              activeTab === tab
                ? "text-[var(--sm-primary)] border-b-2 border-[var(--sm-primary)]"
                : "text-[var(--sm-on-surface-variant)] hover:text-[var(--sm-on-surface)]"
            }`}
          >
            {tab === "tree" ? "IR Tree" : tab === "json" ? "Raw JSON" : "Figma Preview"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {activeTab === "tree" && ir && (
          <div className="p-6">
            <div className="space-y-2">
              {ir.nodes?.map((node: any, i: number) => (
                <NodeTreeItem key={i} node={node} depth={0} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "json" && (
          <pre className="p-6 text-xs font-mono text-[var(--sm-on-surface-variant)] leading-relaxed whitespace-pre-wrap">
            {JSON.stringify(ir, null, 2)}
          </pre>
        )}

        {activeTab === "preview" && (
          <div className="flex items-center justify-center h-full p-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[var(--sm-primary)]/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--sm-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H3.75A2.25 2.25 0 001.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <h3 className="font-headline font-bold text-lg mb-2">Figma Preview</h3>
              <p className="text-[var(--sm-on-surface-variant)] text-sm max-w-sm">
                Install the Figma plugin to see a live preview of your IR ➜ Figma output.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Stats footer */}
      <div className="px-6 py-3 border-t border-[var(--sm-outline-variant)]/20 bg-[var(--sm-surface-container-low)] flex items-center gap-6">
        <div>
          <span className="font-label text-[10px] text-[var(--sm-outline)] uppercase tracking-widest">Tokens</span>
          <span className="ml-2 font-mono text-xs text-[var(--sm-on-surface)]">
            {Object.keys(ir?.tokens?.colors ?? {}).length} colors, {Object.keys(ir?.tokens?.spacing ?? {}).length} spacing
          </span>
        </div>
        <div>
          <span className="font-label text-[10px] text-[var(--sm-outline)] uppercase tracking-widest">Assets</span>
          <span className="ml-2 font-mono text-xs text-[var(--sm-on-surface)]">
            {Object.keys(ir?.assets?.images ?? {}).length} images
          </span>
        </div>
      </div>
    </div>
  );
}

function NodeTreeItem({ node, depth }: { node: any; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const typeColors: Record<string, string> = {
    FRAME: "text-[var(--sm-primary)]",
    TEXT: "text-[var(--sm-secondary)]",
    RECTANGLE: "text-[var(--sm-tertiary)]",
    IMAGE: "text-amber-400",
    GROUP: "text-[var(--sm-on-surface-variant)]",
  };

  return (
    <div style={{ paddingLeft: `${depth * 16}px` }}>
      <div
        className="flex items-center gap-2 py-1 px-2 rounded hover:bg-[var(--sm-surface-container)] transition-colors cursor-pointer group"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          <svg className={`w-3 h-3 text-[var(--sm-outline)] transition-transform ${expanded ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        ) : (
          <div className="w-3 h-3"></div>
        )}
        <span className={`font-mono text-[10px] font-bold ${typeColors[node.type] ?? "text-[var(--sm-on-surface)]"}`}>
          {node.type}
        </span>
        <span className="font-mono text-xs text-[var(--sm-on-surface-variant)] truncate max-w-[200px]">
          {node.name}
        </span>
        {node.content?.text && (
          <span className="text-[10px] text-[var(--sm-outline)] truncate max-w-[150px]">
            "{node.content.text.slice(0, 30)}"
          </span>
        )}
      </div>
      {expanded && hasChildren && node.children.map((child: any, i: number) => (
        <NodeTreeItem key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
