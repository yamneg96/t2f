import { Link, useSearchParams } from "react-router-dom";

export default function SuccessPage() {
  const [searchParams] = useSearchParams();
  const isScreenshot = searchParams.get("method") === "screenshot";

  return (
    <main className="min-h-[calc(100vh-49px)] flex items-center justify-center px-4 py-12 relative">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--sm-primary)]/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-xl relative">
        <div className="bg-[var(--sm-surface-container-low)] p-8 md:p-12 border border-[var(--sm-outline-variant)]/10 shadow-2xl shadow-[var(--sm-primary)]/5 rounded-lg flex flex-col items-center text-center">
          {/* Success Indicator */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-[var(--sm-secondary)]/20 blur-2xl rounded-full"></div>
            <div className="relative h-20 w-20 bg-[var(--sm-surface-container-high)] border border-[var(--sm-secondary)]/30 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-[var(--sm-secondary)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 font-headline">
            {isScreenshot ? "Submission Received" : "Payment Successful"}
          </h1>
          <p className="text-[var(--sm-on-surface-variant)] max-w-md mb-10 leading-relaxed">
            {isScreenshot ? (
              <>Your payment screenshot has been submitted for verification. You'll receive confirmation within <span className="text-[var(--sm-secondary)] font-semibold">24 hours</span>.</>
            ) : (
              <>Thank you for subscribing! Your account is now active on the <span className="text-[var(--sm-secondary)] font-semibold">Pro plan</span>. Explore your new features immediately.</>
            )}
          </p>

          {/* Transaction Details */}
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-1 mb-10 bg-[var(--sm-outline-variant)]/10 p-px rounded-lg overflow-hidden">
            <div className="bg-[var(--sm-surface-container)] p-4 flex flex-col items-start gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--sm-outline)] font-label">Plan Name</span>
              <span className="text-sm font-medium font-headline">Pro Tier</span>
            </div>
            <div className="bg-[var(--sm-surface-container)] p-4 flex flex-col items-start gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--sm-outline)] font-label">Date</span>
              <span className="text-sm font-medium font-headline">{new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</span>
            </div>
            <div className="bg-[var(--sm-surface-container)] p-4 flex flex-col items-start gap-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--sm-outline)] font-label">Status</span>
              <span className="text-sm font-mono text-[var(--sm-secondary)]">
                {isScreenshot ? "PENDING_REVIEW" : "CONFIRMED"}
              </span>
            </div>
          </div>

          {/* Primary CTA */}
          <Link
            to="/editor"
            className="group relative inline-flex items-center justify-center px-10 py-4 bg-gradient-to-br from-[var(--sm-primary)] to-[var(--sm-primary-container)] text-white font-bold tracking-tight rounded-md transition-all duration-200 active:scale-95 shadow-lg shadow-[var(--sm-primary)]/20"
          >
            Go to Dashboard
            <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          {/* Footnote */}
          <div className="mt-8 pt-8 border-t border-[var(--sm-outline-variant)]/20 w-full flex flex-col items-center gap-2">
            <p className="text-xs text-[var(--sm-outline)] font-label uppercase tracking-widest">
              System Status: {isScreenshot ? "Pending Verification" : "Active"}
            </p>
            <div className="flex gap-1">
              <div className={`h-1 w-4 rounded-full ${isScreenshot ? "bg-amber-400" : "bg-[var(--sm-secondary)]"}`}></div>
              <div className="h-1 w-1 bg-[var(--sm-outline-variant)] rounded-full"></div>
              <div className="h-1 w-1 bg-[var(--sm-outline-variant)] rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
