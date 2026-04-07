import { create } from "zustand";

interface EditorState {
  htmlContent: string;
  breakpoint: "sm" | "md" | "lg";
  inputMode: "paste" | "upload" | "url";
  autoLayoutStrict: boolean;
  mapDesignTokens: boolean;
  setHtmlContent: (html: string) => void;
  setBreakpoint: (bp: "sm" | "md" | "lg") => void;
  setInputMode: (mode: "paste" | "upload" | "url") => void;
  setAutoLayoutStrict: (v: boolean) => void;
  setMapDesignTokens: (v: boolean) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  htmlContent: `<section class="bg-slate-900 py-24">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-4xl font-bold text-white mb-8">
      The Future of Design Systems
    </h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="p-6 bg-slate-800 rounded-xl border border-slate-700">
        <p class="text-slate-400">
          Precision engineering at scale.
        </p>
      </div>
    </div>
  </div>
</section>`,
  breakpoint: "lg",
  inputMode: "paste",
  autoLayoutStrict: true,
  mapDesignTokens: false,
  setHtmlContent: (html) => set({ htmlContent: html }),
  setBreakpoint: (bp) => set({ breakpoint: bp }),
  setInputMode: (mode) => set({ inputMode: mode }),
  setAutoLayoutStrict: (v) => set({ autoLayoutStrict: v }),
  setMapDesignTokens: (v) => set({ mapDesignTokens: v }),
}));
