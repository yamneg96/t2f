import { useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { checkoutApi } from "@/lib/api";

export default function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const plan = searchParams.get("plan") || "pro";
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "screenshot">("stripe");
  const [loading, setLoading] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [error, setError] = useState("");

  const prices = { pro: { monthly: 29, annual: 199 }, enterprise: { monthly: 99, annual: 799 } };
  const amount = prices[plan as keyof typeof prices]?.[billingCycle] ?? 29;

  const handleStripeCheckout = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await checkoutApi.stripe({ plan, billingCycle });
      navigate(`/success?payment_id=${res.data.data.paymentId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotUpload = async () => {
    if (!screenshot) { setError("Please upload a screenshot"); return; }
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("screenshot", screenshot);
      formData.append("plan", plan);
      formData.append("billingCycle", billingCycle);
      await checkoutApi.screenshot(formData);
      navigate("/success?method=screenshot");
    } catch (err: any) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-49px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-xl border border-[var(--sm-outline-variant)]/20 shadow-2xl">
        {/* Order Summary */}
        <div className="lg:col-span-5 bg-[var(--sm-surface-container-low)] p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--sm-primary)]/5 blur-[120px] rounded-full -mr-32 -mt-32"></div>
          <div className="relative z-10">
            <Link to="/pricing" className="flex items-center gap-2 mb-8 text-[var(--sm-on-surface-variant)] hover:text-[var(--sm-on-surface)] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              <span className="font-label text-xs uppercase tracking-widest">Back to plans</span>
            </Link>
            <h2 className="font-label text-xs uppercase tracking-[0.2em] text-[var(--sm-primary)] mb-2">Checkout</h2>
            <h1 className="text-3xl font-extrabold tracking-tighter mb-12">Order Summary</h1>

            <div className="space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-headline font-bold text-xl capitalize">{plan} Plan — {billingCycle === "annual" ? "Annual" : "Monthly"}</h3>
                  <p className="text-[var(--sm-on-surface-variant)] text-sm mt-1">Unlimited Figma components & AI tokens</p>
                </div>
                <span className="font-headline font-bold text-xl">${amount}.00</span>
              </div>

              <div className="h-px bg-[var(--sm-outline-variant)]/20"></div>

              {/* Billing toggle */}
              <div className="flex bg-[var(--sm-surface-container)] rounded overflow-hidden">
                <button onClick={() => setBillingCycle("monthly")} className={`flex-1 py-2 font-label text-xs uppercase tracking-widest transition-all ${billingCycle === "monthly" ? "bg-[var(--sm-primary)] text-[var(--sm-on-primary)]" : "text-[var(--sm-on-surface-variant)]"}`}>
                  Monthly
                </button>
                <button onClick={() => setBillingCycle("annual")} className={`flex-1 py-2 font-label text-xs uppercase tracking-widest transition-all ${billingCycle === "annual" ? "bg-[var(--sm-primary)] text-[var(--sm-on-primary)]" : "text-[var(--sm-on-surface-variant)]"}`}>
                  Annual (Save 43%)
                </button>
              </div>

              <div className="h-px bg-[var(--sm-outline-variant)]/20"></div>

              <div className="flex justify-between items-center">
                <span className="font-headline font-bold text-lg">Total Due</span>
                <span className="text-3xl font-extrabold text-[var(--sm-primary)] tracking-tighter">${amount}.00</span>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[var(--sm-surface-container)] rounded-lg border-l-2 border-[var(--sm-secondary)]/50">
              <p className="text-sm text-[var(--sm-on-surface-variant)] leading-relaxed">
                <span className="text-[var(--sm-secondary)] font-bold">Priority Support</span> included for annual subscribers. Access our private Discord engineering channel immediately after payment.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="lg:col-span-7 bg-[var(--sm-surface)] p-8 lg:p-12">
          <div className="max-w-md mx-auto lg:mx-0">
            <h2 className="font-headline font-bold text-2xl mb-8">Payment Method</h2>

            {error && (
              <div className="mb-6 p-3 bg-[var(--sm-error)]/10 border border-[var(--sm-error)]/30 text-[var(--sm-error)] text-xs font-label rounded">
                {error}
              </div>
            )}

            {/* Payment method tabs */}
            <div className="flex bg-[var(--sm-surface-container)] rounded overflow-hidden mb-8">
              <button onClick={() => setPaymentMethod("stripe")} className={`flex-1 py-3 font-label text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${paymentMethod === "stripe" ? "bg-[var(--sm-primary)] text-[var(--sm-on-primary)]" : "text-[var(--sm-on-surface-variant)]"}`}>
                💳 Card Payment
              </button>
              <button onClick={() => setPaymentMethod("screenshot")} className={`flex-1 py-3 font-label text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${paymentMethod === "screenshot" ? "bg-[var(--sm-primary)] text-[var(--sm-on-primary)]" : "text-[var(--sm-on-surface-variant)]"}`}>
                📸 Screenshot
              </button>
            </div>

            {paymentMethod === "stripe" ? (
              <div className="space-y-6">
                <p className="text-sm text-[var(--sm-on-surface-variant)]">
                  You'll be redirected to Stripe's secure payment page to complete your purchase.
                </p>
                <button
                  onClick={handleStripeCheckout}
                  disabled={loading}
                  className="w-full bg-gradient-to-br from-[var(--sm-primary)] to-[var(--sm-primary-container)] text-white font-headline font-extrabold py-5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg shadow-[var(--sm-primary)]/10 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? "Processing..." : `PAY $${amount}.00 NOW`}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-sm text-[var(--sm-on-surface-variant)]">
                  Upload a screenshot of your payment (bank transfer, mobile payment, etc.). Our admin will verify it within 24 hours.
                </p>
                <div className="border-2 border-dashed border-[var(--sm-outline-variant)]/30 rounded-lg p-8 text-center hover:border-[var(--sm-primary)]/50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    id="screenshot-upload"
                    className="hidden"
                    onChange={(e) => setScreenshot(e.target.files?.[0] ?? null)}
                  />
                  <label htmlFor="screenshot-upload" className="cursor-pointer">
                    {screenshot ? (
                      <div className="flex items-center justify-center gap-2 text-[var(--sm-secondary)]">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span className="font-label text-xs">{screenshot.name}</span>
                      </div>
                    ) : (
                      <div>
                        <svg className="w-8 h-8 mx-auto text-[var(--sm-outline)] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <span className="font-label text-xs text-[var(--sm-outline)] uppercase tracking-widest">Click to upload screenshot</span>
                      </div>
                    )}
                  </label>
                </div>
                <button
                  onClick={handleScreenshotUpload}
                  disabled={loading || !screenshot}
                  className="w-full bg-gradient-to-br from-[var(--sm-primary)] to-[var(--sm-primary-container)] text-white font-headline font-extrabold py-5 rounded-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Submit for Verification"}
                </button>
              </div>
            )}

            <p className="text-center text-[11px] text-[var(--sm-outline)] font-label uppercase tracking-widest mt-8">
              Transaction managed by Monolith Secure Gateway.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
