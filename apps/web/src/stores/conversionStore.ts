import { create } from "zustand";

interface ConversionState {
  currentIR: Record<string, unknown> | null;
  conversionStatus: "idle" | "converting" | "success" | "error";
  errorMessage: string | null;
  lastConversionId: string | null;

  setIR: (ir: Record<string, unknown>) => void;
  setStatus: (status: ConversionState["conversionStatus"]) => void;
  setError: (msg: string) => void;
  setLastConversionId: (id: string) => void;
  reset: () => void;
}

export const useConversionStore = create<ConversionState>((set) => ({
  currentIR: null,
  conversionStatus: "idle",
  errorMessage: null,
  lastConversionId: null,

  setIR: (ir) => set({ currentIR: ir, conversionStatus: "success", errorMessage: null }),
  setStatus: (status) => set({ conversionStatus: status }),
  setError: (msg) => set({ errorMessage: msg, conversionStatus: "error" }),
  setLastConversionId: (id) => set({ lastConversionId: id }),
  reset: () =>
    set({
      currentIR: null,
      conversionStatus: "idle",
      errorMessage: null,
      lastConversionId: null,
    }),
}));
