import { useEffect, useState } from "react";
import { settingsApi } from "@/lib/api";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    tailwindConfig: "",
    figmaApiKey: "",
    preserveMargins: true,
    experimentalAutoLayout: false,
    mapDesignTokens: true,
    autoLayoutStrict: true,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    settingsApi.get().then((res) => {
      if (res.data.data) setSettings(res.data.data);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await settingsApi.update(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  const toggles = [
    { key: "preserveMargins" as const, label: "Preserve Margins", desc: "Keep margin values as padding on parent frames" },
    { key: "experimentalAutoLayout" as const, label: "Experimental Auto-Layout", desc: "Enable next-gen layout heuristics (beta)" },
    { key: "mapDesignTokens" as const, label: "Map Design Tokens", desc: "Auto-create Figma Styles from Tailwind tokens" },
    { key: "autoLayoutStrict" as const, label: "Strict Auto-Layout", desc: "Force all containers into Auto Layout mode" },
  ];

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-block px-3 py-1 mb-4 border border-[var(--sm-primary)]/30 bg-[var(--sm-primary)]/10 rounded-sm">
          <span className="font-label text-[10px] uppercase tracking-[0.2em] text-[var(--sm-primary)]">
            Engine Configuration
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tighter font-headline uppercase">
          Settings
        </h1>
      </div>

      <div className="space-y-8">
        {/* Tailwind Config */}
        <section className="border border-[var(--sm-outline-variant)]/20 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-[var(--sm-surface-container)] border-b border-[var(--sm-outline-variant)]/20">
            <h2 className="font-headline font-bold text-sm uppercase tracking-tight">Tailwind Configuration</h2>
            <p className="text-[var(--sm-on-surface-variant)] text-xs mt-1">Override default Tailwind config for custom themes</p>
          </div>
          <div className="p-6">
            <textarea
              value={settings.tailwindConfig}
              onChange={(e) => setSettings({ ...settings, tailwindConfig: e.target.value })}
              className="w-full h-32 bg-[var(--sm-surface-container-lowest)] text-[var(--sm-on-surface)] font-mono text-xs p-4 resize-none outline-none border-l-2 border-transparent focus:border-[var(--sm-primary)] transition-colors custom-scrollbar"
              placeholder='{"theme":{"extend":{"colors":{"brand":"#3bbffa"}}}}'
              spellCheck={false}
            />
          </div>
        </section>

        {/* Figma API Key */}
        <section className="border border-[var(--sm-outline-variant)]/20 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-[var(--sm-surface-container)] border-b border-[var(--sm-outline-variant)]/20">
            <h2 className="font-headline font-bold text-sm uppercase tracking-tight">API Credentials</h2>
            <p className="text-[var(--sm-on-surface-variant)] text-xs mt-1">Connect external services</p>
          </div>
          <div className="p-6">
            <div className="space-y-1.5">
              <label className="block font-label text-[10px] uppercase tracking-[0.15em] text-[var(--sm-outline)]">
                Figma Personal Access Token
              </label>
              <input
                type="password"
                value={settings.figmaApiKey}
                onChange={(e) => setSettings({ ...settings, figmaApiKey: e.target.value })}
                className="w-full bg-[var(--sm-surface-container-lowest)] border-l-2 border-transparent focus:border-[var(--sm-primary)] text-[var(--sm-on-surface)] font-mono text-xs py-3 px-4 transition-all outline-none"
                placeholder="figd_••••••••••••••••"
              />
            </div>
          </div>
        </section>

        {/* Engine Toggles */}
        <section className="border border-[var(--sm-outline-variant)]/20 rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-[var(--sm-surface-container)] border-b border-[var(--sm-outline-variant)]/20">
            <h2 className="font-headline font-bold text-sm uppercase tracking-tight">Engine Parameters</h2>
            <p className="text-[var(--sm-on-surface-variant)] text-xs mt-1">Fine-tune conversion behavior</p>
          </div>
          <div className="divide-y divide-[var(--sm-outline-variant)]/10">
            {toggles.map((toggle) => (
              <div key={toggle.key} className="flex items-center justify-between px-6 py-4 hover:bg-[var(--sm-surface-container-low)] transition-colors">
                <div>
                  <div className="font-headline font-medium text-sm">{toggle.label}</div>
                  <div className="text-[var(--sm-on-surface-variant)] text-xs mt-0.5">{toggle.desc}</div>
                </div>
                <button
                  onClick={() => setSettings({ ...settings, [toggle.key]: !settings[toggle.key] })}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    settings[toggle.key] ? "bg-[var(--sm-primary)]" : "bg-[var(--sm-outline-variant)]"
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                      settings[toggle.key] ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 code-gradient text-[var(--sm-on-primary)] font-label uppercase font-bold text-xs tracking-widest hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Configuration"}
          </button>
          {saved && (
            <span className="font-label text-xs text-[var(--sm-secondary)] uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
              Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
