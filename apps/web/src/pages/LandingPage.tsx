import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="relative">
      {/* ── Hero Section ─────────────────────────────────── */}
      <section className="min-h-[819px] flex flex-col justify-center px-6 md:px-20 py-20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left – Copy */}
          <div className="space-y-8 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--sm-surface-container-high)] rounded-lg border border-[var(--sm-outline-variant)]/30">
              <span className="w-2 h-2 rounded-full bg-[var(--sm-secondary)] animate-pulse" />
              <span className="text-[10px] font-label uppercase tracking-[0.2em] text-[var(--sm-secondary)]">
                System Online: v2.4.0
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-[var(--sm-on-surface)]">
              Turn Tailwind Code into{" "}
              <span className="text-[var(--sm-primary)]">Production-Ready</span>{" "}
              Figma Designs
            </h1>

            <p className="text-xl text-[var(--sm-on-surface-variant)] font-body leading-relaxed max-w-xl">
              Headless rendering, layout reconstruction, and intelligent Auto
              Layout mapping. Sync your production code directly to your design
              workspace.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/signup"
                className="px-8 py-4 code-gradient text-[var(--sm-on-primary)] font-label font-bold uppercase tracking-widest rounded-md hover:scale-[0.98] transition-transform active:opacity-80"
              >
                Get Started
              </Link>
              <Link
                to="/editor"
                className="px-8 py-4 bg-[var(--sm-surface-variant)] border border-[var(--sm-primary)]/30 text-[var(--sm-primary)] font-label font-bold uppercase tracking-widest rounded-md hover:bg-[var(--sm-surface-bright)] transition-all"
              >
                View Demo
              </Link>
            </div>
          </div>

          {/* Right – Split Code / Figma mockup */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--sm-primary)]/20 to-[var(--sm-tertiary)]/20 blur-2xl opacity-50" />
            <div className="relative grid grid-cols-2 gap-px bg-[var(--sm-outline-variant)]/20 rounded-xl overflow-hidden border border-[var(--sm-outline-variant)]/30 shadow-2xl">
              {/* Code Panel */}
              <div className="bg-[var(--sm-surface-container-lowest)] p-6 font-mono text-xs overflow-hidden h-[500px]">
                <div className="flex items-center gap-2 mb-6 opacity-40">
                  <span className="w-3 h-3 rounded-full bg-red-500/50" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <span className="w-3 h-3 rounded-full bg-green-500/50" />
                  <span className="ml-2 font-label text-[10px] tracking-widest uppercase">
                    index.html
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-[var(--sm-secondary)] opacity-80">
                    &lt;div{" "}
                    <span className="text-[var(--sm-tertiary)]">class</span>
                    =&quot;flex items-center p-8&quot;&gt;
                  </p>
                  <p className="text-[var(--sm-secondary)] opacity-80 ml-4">
                    &lt;div{" "}
                    <span className="text-[var(--sm-tertiary)]">class</span>
                    =&quot;bg-primary/20 rounded-xl&quot;&gt;
                  </p>
                  <p className="text-[var(--sm-on-surface)]/60 ml-8">
                    Design to Code
                  </p>
                  <p className="text-[var(--sm-secondary)] opacity-80 ml-4">
                    &lt;/div&gt;
                  </p>
                  <p className="text-[var(--sm-secondary)] opacity-80 ml-4">
                    &lt;button{" "}
                    <span className="text-[var(--sm-tertiary)]">class</span>
                    =&quot;px-4 py-2 bg-blue-500 hover:shadow-lg
                    transition-all&quot;&gt;
                  </p>
                  <p className="text-[var(--sm-on-surface)]/60 ml-8">
                    Sync Project
                  </p>
                  <p className="text-[var(--sm-secondary)] opacity-80 ml-4">
                    &lt;/button&gt;
                  </p>
                  <p className="text-[var(--sm-secondary)] opacity-80">
                    &lt;/div&gt;
                  </p>
                  <div className="w-full h-32 mt-8 bg-[var(--sm-surface-container-low)]/50 rounded-md border-l-2 border-[var(--sm-primary)] p-4">
                    <span className="text-[var(--sm-primary)] font-bold">
                      Rendering Node...
                    </span>
                    <div className="mt-2 h-1 w-2/3 bg-[var(--sm-surface-container-high)] rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-[var(--sm-primary)]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Figma Canvas Panel */}
              <div className="bg-[var(--sm-surface-container)] p-6 relative h-[500px] flex items-center justify-center border-l border-[var(--sm-outline-variant)]/20">
                <div className="absolute top-4 left-4 font-label text-[10px] tracking-widest uppercase opacity-40">
                  Figma Canvas
                </div>
                <div className="w-full max-w-[200px] space-y-4">
                  <div className="relative p-6 border-2 border-[var(--sm-primary)]/50 bg-[var(--sm-primary)]/5 rounded-md">
                    <div className="absolute -top-3 -left-3 px-2 py-0.5 bg-[var(--sm-primary)] text-[8px] font-bold text-white uppercase rounded">
                      Frame 1
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[var(--sm-primary)]/20 border border-[var(--sm-primary)]/40" />
                      <div className="h-2 w-20 bg-[var(--sm-primary)]/30 rounded" />
                    </div>
                    <div className="mt-4 px-3 py-1.5 bg-[var(--sm-primary)]/80 rounded text-[10px] font-bold text-center">
                      Sync Project
                    </div>
                    <div className="absolute -bottom-2 -right-8 flex flex-col gap-1">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[10px] text-[var(--sm-secondary)]">
                          auto_awesome_motion
                        </span>
                        <span className="text-[8px] font-label text-[var(--sm-secondary)] uppercase">
                          Auto Layout
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-1 mt-8 opacity-40">
                    <div className="flex items-center gap-2 text-[10px] font-label uppercase">
                      <span className="material-symbols-outlined text-sm">
                        layers
                      </span>
                      Layers
                    </div>
                    <div className="ml-4 flex items-center gap-2 text-[9px] font-mono text-[var(--sm-primary)]">
                      # Frame 1
                    </div>
                    <div className="ml-8 flex items-center gap-2 text-[9px] font-mono">
                      _ Icon
                    </div>
                    <div className="ml-8 flex items-center gap-2 text-[9px] font-mono">
                      _ Text
                    </div>
                    <div className="ml-8 flex items-center gap-2 text-[9px] font-mono text-[var(--sm-secondary)]">
                      _ Button
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-Phase Pipeline ─────────────────────────────── */}
      <section className="py-24 bg-[var(--sm-surface-container-low)] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--sm-outline-variant)]/30 to-transparent hidden md:block" />

            {/* Phase 01 */}
            <div className="relative space-y-6 flex flex-col items-start bg-[var(--sm-surface)] p-8 rounded-lg border border-[var(--sm-outline-variant)]/10">
              <div className="w-12 h-12 bg-[var(--sm-primary)]/10 text-[var(--sm-primary)] rounded flex items-center justify-center border border-[var(--sm-primary)]/20">
                <span className="material-symbols-outlined">data_object</span>
              </div>
              <h3 className="text-xl font-bold font-headline">
                Parse &amp; Render
              </h3>
              <p className="text-[var(--sm-on-surface-variant)] text-sm leading-relaxed">
                Our headless browser engine executes your production Tailwind
                code, capturing computed styles and DOM hierarchy in
                high-fidelity.
              </p>
              <div className="text-[10px] font-label uppercase tracking-widest text-[var(--sm-primary)]/40">
                Phase 01
              </div>
            </div>

            {/* Phase 02 */}
            <div className="relative space-y-6 flex flex-col items-start bg-[var(--sm-surface)] p-8 rounded-lg border border-[var(--sm-outline-variant)]/10">
              <div className="w-12 h-12 bg-[var(--sm-secondary)]/10 text-[var(--sm-secondary)] rounded flex items-center justify-center border border-[var(--sm-secondary)]/20">
                <span className="material-symbols-outlined">account_tree</span>
              </div>
              <h3 className="text-xl font-bold font-headline">
                Normalize &amp; Map
              </h3>
              <p className="text-[var(--sm-on-surface-variant)] text-sm leading-relaxed">
                CSS Flexbox and Grid are intelligently translated into Figma's
                Auto Layout engine, maintaining absolute structural integrity.
              </p>
              <div className="text-[10px] font-label uppercase tracking-widest text-[var(--sm-secondary)]/40">
                Phase 02
              </div>
            </div>

            {/* Phase 03 */}
            <div className="relative space-y-6 flex flex-col items-start bg-[var(--sm-surface)] p-8 rounded-lg border border-[var(--sm-outline-variant)]/10">
              <div className="w-12 h-12 bg-[var(--sm-tertiary)]/10 text-[var(--sm-tertiary)] rounded flex items-center justify-center border border-[var(--sm-tertiary)]/20">
                <span className="material-symbols-outlined">
                  design_services
                </span>
              </div>
              <h3 className="text-xl font-bold font-headline">
                Generate Editable Figma
              </h3>
              <p className="text-[var(--sm-on-surface-variant)] text-sm leading-relaxed">
                Receive a layered Figma file with semantic naming, functional
                components, and mapped design tokens ready for handoff.
              </p>
              <div className="text-[10px] font-label uppercase tracking-widest text-[var(--sm-tertiary)]/40">
                Phase 03
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Technical Architecture ────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-4xl font-bold mb-4 font-headline uppercase tracking-tighter">
                Technical Architecture
              </h2>
              <p className="text-[var(--sm-on-surface-variant)] font-body">
                The infrastructure behind pixel-perfect code-to-design
                translation.
              </p>
            </div>
            <div className="flex gap-8 items-center opacity-40 grayscale hover:grayscale-0 transition-all">
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl">
                  terminal
                </span>
                <span className="font-label text-[10px] uppercase">
                  Node.js
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl">
                  open_in_browser
                </span>
                <span className="font-label text-[10px] uppercase">
                  Playwright
                </span>
              </div>
              <div className="flex flex-col items-center gap-2 text-[var(--sm-primary)] !opacity-100">
                <span className="material-symbols-outlined text-3xl">
                  grid_view
                </span>
                <span className="font-label text-[10px] uppercase">
                  Tailwind
                </span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-3xl">
                  layers
                </span>
                <span className="font-label text-[10px] uppercase">
                  Figma API
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-[var(--sm-surface-container)] border border-[var(--sm-outline-variant)]/10 rounded-md hover:bg-[var(--sm-surface-bright)] transition-colors group">
              <span className="material-symbols-outlined text-[var(--sm-primary)] mb-4 block group-hover:scale-110 transition-transform">
                view_quilt
              </span>
              <h4 className="font-bold mb-2 font-headline">
                Flex to Auto Layout
              </h4>
              <p className="text-xs text-[var(--sm-on-surface-variant)] leading-relaxed">
                Automated conversion of flex-direction, gap, and alignment into
                Figma constraints.
              </p>
            </div>
            <div className="p-8 bg-[var(--sm-surface-container)] border border-[var(--sm-outline-variant)]/10 rounded-md hover:bg-[var(--sm-surface-bright)] transition-colors group">
              <span className="material-symbols-outlined text-[var(--sm-secondary)] mb-4 block group-hover:scale-110 transition-transform">
                grid_on
              </span>
              <h4 className="font-bold mb-2 font-headline">
                Grid Approximation
              </h4>
              <p className="text-xs text-[var(--sm-on-surface-variant)] leading-relaxed">
                Complex CSS Grids are reconstructed using nested Auto Layout
                frames for editing.
              </p>
            </div>
            <div className="p-8 bg-[var(--sm-surface-container)] border border-[var(--sm-outline-variant)]/10 rounded-md hover:bg-[var(--sm-surface-bright)] transition-colors group">
              <span className="material-symbols-outlined text-[var(--sm-tertiary)] mb-4 block group-hover:scale-110 transition-transform">
                palette
              </span>
              <h4 className="font-bold mb-2 font-headline">
                Token Generation
              </h4>
              <p className="text-xs text-[var(--sm-on-surface-variant)] leading-relaxed">
                Tailwind color and spacing scales are automatically converted
                into Figma Local Variables.
              </p>
            </div>
            <div className="p-8 bg-[var(--sm-surface-container)] border border-[var(--sm-outline-variant)]/10 rounded-md hover:bg-[var(--sm-surface-bright)] transition-colors group">
              <span className="material-symbols-outlined text-[var(--sm-primary)] mb-4 block group-hover:scale-110 transition-transform">
                devices
              </span>
              <h4 className="font-bold mb-2 font-headline">
                Breakpoint Support
              </h4>
              <p className="text-xs text-[var(--sm-on-surface-variant)] leading-relaxed">
                Generate multi-device variants in a single pass based on your
                media queries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ──────────────────────────────────── */}
      <section className="py-24 px-6 mb-20">
        <div className="max-w-7xl mx-auto rounded-xl overflow-hidden border border-[var(--sm-outline-variant)]/20 relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--sm-primary)]/10 via-transparent to-[var(--sm-tertiary)]/10" />
          <div className="relative glass-panel p-12 md:p-24 flex flex-col items-center text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 max-w-3xl font-headline tracking-tight">
              Ready to close the gap between code and design?
            </h2>
            <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
              <Link
                to="/pricing"
                className="flex-1 px-8 py-4 bg-[var(--sm-primary)] text-[var(--sm-on-primary)] font-label font-bold uppercase tracking-widest rounded-md hover:bg-[var(--sm-primary-container)] transition-colors shadow-lg shadow-[var(--sm-primary)]/20"
              >
                Download Plugin
              </Link>
              <a
                href="#"
                className="flex-1 px-8 py-4 bg-transparent border border-[var(--sm-outline)] text-[var(--sm-on-surface)] font-label font-bold uppercase tracking-widest rounded-md hover:bg-[var(--sm-surface-variant)] transition-colors"
              >
                Documentation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-[var(--sm-surface-container-lowest)] border-t border-[var(--sm-outline-variant)]/20 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
          <div className="space-y-6 max-w-sm">
            <div className="text-2xl font-bold tracking-tighter text-[var(--sm-on-surface)] uppercase font-label">
              SYNTHETIC_MONOLITH
            </div>
            <p className="text-sm text-[var(--sm-on-surface-variant)] leading-relaxed">
              Bridging the engineering-design divide through automated schema
              reconstruction and headless rendering.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-[var(--sm-outline-variant)]/30 rounded-md hover:border-[var(--sm-primary)] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">code</span>
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-[var(--sm-outline-variant)]/30 rounded-md hover:border-[var(--sm-primary)] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  terminal
                </span>
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center border border-[var(--sm-outline-variant)]/30 rounded-md hover:border-[var(--sm-primary)] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">hub</span>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h5 className="font-label text-xs uppercase tracking-widest text-[var(--sm-primary)]">
                Engine
              </h5>
              <ul className="space-y-2 text-sm text-[var(--sm-on-surface-variant)]">
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    Architecture
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    Tailwind Specs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    Figma Schema
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-label text-xs uppercase tracking-widest text-[var(--sm-secondary)]">
                Resources
              </h5>
              <ul className="space-y-2 text-sm text-[var(--sm-on-surface-variant)]">
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    API Docs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    Examples
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h5 className="font-label text-xs uppercase tracking-widest text-[var(--sm-tertiary)]">
                Enterprise
              </h5>
              <ul className="space-y-2 text-sm text-[var(--sm-on-surface-variant)]">
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    Licensing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[var(--sm-on-surface)] transition-colors"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-[var(--sm-outline-variant)]/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-label uppercase tracking-widest text-[var(--sm-on-surface-variant)]">
          <p>© 2024 SYNTHETIC_MONOLITH LABS. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <a
              href="#"
              className="hover:text-[var(--sm-primary)] transition-colors"
            >
              Privacy Protocol
            </a>
            <a
              href="#"
              className="hover:text-[var(--sm-primary)] transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
