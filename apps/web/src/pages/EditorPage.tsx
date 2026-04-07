import { useState } from "react";
import { useEditorStore } from "@/stores/editorStore";
import { convertApi } from "@/lib/api";
import { useNavigate } from "react-router-dom";

export default function EditorPage() {
  const navigate = useNavigate();
  const { htmlContent, setHtmlContent, breakpoint, setBreakpoint, inputMode, setInputMode } = useEditorStore();
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");

  const breakpoints = {
    sm: { label: "Mobile", width: 375, icon: "📱" },
    md: { label: "Tablet", width: 768, icon: "📲" },
    lg: { label: "Desktop", width: 1440, icon: "🖥️" },
  };

  const handleConvert = async () => {
    if (!htmlContent.trim()) return;
    setConverting(true);
    setError("");
    try {
      const bp = breakpoints[breakpoint];
      const res = await convertApi.convert({
        html: htmlContent,
        source: "html",
        viewport: { width: bp.width, height: 900 },
      });
      const conversionId = res.data.data.id;
      navigate(`/results/${conversionId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Conversion failed");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--sm-outline-variant)]/20 bg-[var(--sm-surface-container-low)]">
        <div className="flex items-center gap-4">
          <div className="inline-block px-3 py-1 border border-[var(--sm-primary)]/30 bg-[var(--sm-primary)]/10 rounded-sm">
            <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--sm-primary)]">
              Source Editor
            </span>
          </div>
          {/* Input mode tabs */}
          <div className="flex bg-[var(--sm-surface-container)] rounded overflow-hidden">
            {(["paste", "upload", "url"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setInputMode(mode)}
                className={`px-3 py-1.5 font-label text-[10px] uppercase tracking-widest transition-all ${
                  inputMode === mode
                    ? "bg-[var(--sm-primary)] text-[var(--sm-on-primary)]"
                    : "text-[var(--sm-on-surface-variant)] hover:bg-[var(--sm-surface-container-high)]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Breakpoint selector */}
          <div className="flex bg-[var(--sm-surface-container)] rounded overflow-hidden">
            {(Object.entries(breakpoints) as [keyof typeof breakpoints, typeof breakpoints.sm][]).map(([key, bp]) => (
              <button
                key={key}
                onClick={() => setBreakpoint(key)}
                className={`px-3 py-1.5 font-label text-[10px] uppercase tracking-wider transition-all flex items-center gap-1 ${
                  breakpoint === key
                    ? "bg-[var(--sm-surface-container-high)] text-[var(--sm-on-surface)]"
                    : "text-[var(--sm-on-surface-variant)] hover:bg-[var(--sm-surface-container-high)]"
                }`}
              >
                <span className="text-xs">{bp.icon}</span> {bp.width}
              </button>
            ))}
          </div>

          {/* Convert button */}
          <button
            onClick={handleConvert}
            disabled={converting || !htmlContent.trim()}
            className="px-6 py-2 code-gradient text-[var(--sm-on-primary)] font-label uppercase font-bold text-xs tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {converting ? (
              <>
                <span className="w-3 h-3 border-2 border-[var(--sm-on-primary)]/30 border-t-[var(--sm-on-primary)] rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
                </svg>
                Convert
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="px-6 py-2 bg-[var(--sm-error)]/10 border-b border-[var(--sm-error)]/30 text-[var(--sm-error)] text-xs font-label">
          {error}
        </div>
      )}

      {/* Editor + Preview split */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-2 bg-[var(--sm-surface-container)] border-b border-[var(--sm-outline-variant)]/20 flex items-center gap-3">
            <span className="font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)]">
              source.html
            </span>
            <div className="flex-1"></div>
            <span className="font-label text-[10px] text-[var(--sm-outline)]">
              {htmlContent.split("\n").length} lines
            </span>
          </div>
          <div className="flex-1 relative">
            <textarea
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="absolute inset-0 w-full h-full p-6 bg-[var(--sm-surface-container-lowest)] text-[var(--sm-on-surface)] font-mono text-sm leading-relaxed resize-none outline-none custom-scrollbar border-none"
              spellCheck={false}
              placeholder="Paste your HTML + Tailwind CSS code here..."
            />
          </div>
        </div>

        {/* Vertical divider */}
        <div className="w-px bg-[var(--sm-outline-variant)]/20"></div>

        {/* Preview Panel */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="px-4 py-2 bg-[var(--sm-surface-container)] border-b border-[var(--sm-outline-variant)]/20 flex items-center gap-3">
            <span className="font-label text-[10px] uppercase tracking-widest text-[var(--sm-outline)]">
              Live Preview — {breakpoints[breakpoint].label} ({breakpoints[breakpoint].width}px)
            </span>
            <div className="flex-1"></div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-[var(--sm-secondary)] animate-pulse"></div>
              <span className="font-label text-[10px] text-[var(--sm-secondary)]">Active</span>
            </div>
          </div>
          <div className="flex-1 bg-[var(--sm-surface)] overflow-auto custom-scrollbar flex items-start justify-center p-6">
            <div
              className="bg-white rounded-sm shadow-2xl overflow-hidden transition-all duration-300"
              style={{ width: `${Math.min(breakpoints[breakpoint].width, 800)}px`, minHeight: "200px" }}
            >
              <iframe
                srcDoc={`
                  <!DOCTYPE html>
                  <html>
                  <head>
                    <meta charset="utf-8"/>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                    <script src="https://cdn.tailwindcss.com"></script>
                    <style>body{margin:0;overflow:auto}</style>
                  </head>
                  <body>${htmlContent}</body>
                  </html>
                `}
                className="w-full h-full border-none min-h-[400px]"
                sandbox="allow-scripts"
                title="Preview"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom info bar */}
      <div className="px-6 py-2 border-t border-[var(--sm-outline-variant)]/20 bg-[var(--sm-surface-container-low)] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-label text-[10px] text-[var(--sm-outline)] uppercase tracking-wider">
            Engine: Tailwind v4.0
          </span>
          <span className="font-label text-[10px] text-[var(--sm-outline)] uppercase tracking-wider">
            Target: Figma Auto-Layout
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[var(--sm-secondary)]"></div>
          <span className="font-label text-[10px] text-[var(--sm-outline)] uppercase tracking-wider">
            System Ready
          </span>
        </div>
      </div>
    </div>
  );
}
