import { Link } from "react-router-dom";

const plans = [
  {
    tier: "01",
    name: "Hobby",
    price: "$0",
    cycle: "/perpetual",
    desc: "Perfect for personal experiments and learning the Tailwind2Figma workflow.",
    cta: "Start Coding",
    ctaStyle: "border border-[var(--sm-outline-variant)] hover:bg-[var(--sm-surface-container-high)] text-[var(--sm-on-surface)]",
    featured: false,
    capabilities: [
      { label: "5 Components / Mo", included: true },
      { label: "Single Workspace", included: true },
      { label: "Advanced Export", included: false },
      { label: "Team Collaboration", included: false },
    ],
  },
  {
    tier: "02",
    name: "Pro",
    price: "$29",
    cycle: "/monthly",
    desc: "Advanced tools for professional engineers building high-fidelity design systems.",
    cta: "Upgrade to Pro",
    ctaStyle: "code-gradient hover:opacity-90 text-[var(--sm-on-primary)] font-bold",
    featured: true,
    capabilities: [
      { label: "Unlimited Components", included: true },
      { label: "10 Workspaces", included: true },
      { label: "Advanced Export (.fig)", included: true },
      { label: "Auto-Layout Engine", included: true },
    ],
  },
  {
    tier: "03",
    name: "Enterprise",
    price: "Custom",
    cycle: "",
    desc: "Full governance, security, and dedicated infrastructure for global teams.",
    cta: "Contact Sales",
    ctaStyle: "border border-[var(--sm-outline-variant)] hover:bg-[var(--sm-surface-container-high)] text-[var(--sm-on-surface)]",
    featured: false,
    capabilities: [
      { label: "Unlimited Everything", included: true },
      { label: "SSO / SAML Security", included: true },
      { label: "Custom API Endpoints", included: true },
      { label: "24/7 Priority Support", included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="pt-8 pb-20 px-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <header className="mb-16">
        <div className="inline-block px-3 py-1 mb-6 border border-[var(--sm-primary)]/30 bg-[var(--sm-primary)]/10 rounded-sm">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--sm-primary)]">
            Licensing Framework v4.0
          </span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 max-w-4xl font-headline">
          Scaled for <span className="text-[var(--sm-primary)]">Production.</span>
          <br />Built for Precision.
        </h1>
        <p className="text-[var(--sm-on-surface-variant)] max-w-2xl text-lg font-light leading-relaxed">
          Choose the architecture that matches your workflow. From solo developers to massive design systems, Tailwind2Figma scales with your code.
        </p>
      </header>

      {/* Pricing Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-0 border border-[var(--sm-outline-variant)]/20 rounded-lg overflow-hidden mb-32">
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`flex flex-col p-8 relative ${
              plan.featured
                ? "bg-[var(--sm-surface-container-high)] z-10 shadow-[0_0_50px_-12px_rgba(59,191,250,0.2)]"
                : `bg-[var(--sm-surface-container-low)] ${i === 0 ? "border-r" : "border-l"} border-[var(--sm-outline-variant)]/20`
            }`}
          >
            {plan.featured && (
              <div className="absolute top-0 right-0 code-gradient px-4 py-1">
                <span className="font-label text-[10px] font-bold text-[var(--sm-on-primary)] uppercase tracking-widest">
                  Recommended
                </span>
              </div>
            )}
            <div className="mb-8">
              <h3 className={`font-label text-xs uppercase tracking-widest mb-2 ${plan.featured ? "text-[var(--sm-primary)]" : "text-[var(--sm-on-surface-variant)]"}`}>
                Tier {plan.tier}
              </h3>
              <h2 className="text-3xl font-bold mb-4 font-headline uppercase tracking-tighter">{plan.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className={`text-4xl font-bold ${plan.featured ? "text-[var(--sm-primary)]" : ""}`}>{plan.price}</span>
                <span className="text-[var(--sm-on-surface-variant)] text-sm font-label">{plan.cycle}</span>
              </div>
            </div>
            <p className="text-[var(--sm-on-surface-variant)] text-sm mb-8 leading-relaxed">{plan.desc}</p>
            <Link
              to={plan.name === "Pro" ? "/checkout?plan=pro" : plan.name === "Enterprise" ? "#" : "/editor"}
              className={`w-full py-4 px-6 transition-all duration-200 font-label uppercase text-xs tracking-widest text-center mb-12 active:scale-[0.98] block ${plan.ctaStyle}`}
            >
              {plan.cta}
            </Link>
            <div className="space-y-6">
              <p className={`font-label text-[10px] uppercase tracking-widest ${plan.featured ? "text-[var(--sm-primary)]" : "text-[var(--sm-outline)]"}`}>
                {plan.featured ? "Full Access" : "Capabilities"}
              </p>
              {plan.capabilities.map((cap) => (
                <div key={cap.label} className={`flex items-center gap-3 ${!cap.included ? "text-[var(--sm-on-surface-variant)]/40" : ""}`}>
                  {cap.included ? (
                    <svg className="w-4 h-4 text-[var(--sm-secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                  <span className="text-sm">{cap.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Feature Comparison Table */}
      <section>
        <div className="mb-12 border-l-2 border-[var(--sm-primary)] pl-6">
          <h2 className="text-2xl font-bold font-headline uppercase tracking-tighter">System Specifications</h2>
          <p className="text-[var(--sm-on-surface-variant)] font-label text-sm uppercase mt-2">Comparison Matrix / 001</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--sm-outline-variant)]/20">
                <th className="py-6 px-4 font-label text-xs uppercase tracking-widest text-[var(--sm-outline)]">Parameter</th>
                <th className="py-6 px-4 font-label text-xs uppercase tracking-widest">Hobby</th>
                <th className="py-6 px-4 font-label text-xs uppercase tracking-widest text-[var(--sm-primary)]">Pro</th>
                <th className="py-6 px-4 font-label text-xs uppercase tracking-widest">Enterprise</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                { param: "Auto-Layout Conversion", hobby: "Basic", pro: "Advanced", enterprise: "Deterministic" },
                { param: "Token Synchronization", hobby: "Manual", pro: "Real-time", enterprise: "Continuous" },
                { param: "Export Formats", hobby: "SVG, PNG", pro: "FIGMA, JSON", enterprise: "ALL + RAW" },
                { param: "System Uptime", hobby: "99.0%", pro: "99.9%", enterprise: "99.99% SLA" },
              ].map((row) => (
                <tr key={row.param} className="hover:bg-[var(--sm-surface-container-low)] transition-colors">
                  <td className="py-4 px-4 text-[var(--sm-on-surface-variant)] font-medium">{row.param}</td>
                  <td className="py-4 px-4">{row.hobby}</td>
                  <td className="py-4 px-4 text-[var(--sm-primary)] font-bold">{row.pro}</td>
                  <td className="py-4 px-4">{row.enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
