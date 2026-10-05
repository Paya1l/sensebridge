import React, { useState } from "react";
import { useAccessibility } from "../context/AccessibilityContext";
import { Eye, Ear, Hand, X, Settings2 } from "lucide-react";

const sizes = [
  { v: "normal", label: "A" },
  { v: "large", label: "A" },
  { v: "xlarge", label: "A" },
];

export default function AccessibilityToolbar() {
  const { prefs, set, announce } = useAccessibility();
  const [open, setOpen] = useState(false);

  const modeLabel = prefs.mode ? prefs.mode.replace("-", " · ").toUpperCase() : "NO MODE";

  return (
    <>
      {/* Sticky floating launcher */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 h-14 px-5 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white shadow-2xl flex items-center gap-2.5 transition-all hover:scale-105"
        aria-label="Open accessibility toolbar"
        aria-expanded={open}
        data-testid="a11y-launcher"
      >
        <Settings2 className="w-5 h-5" />
        <span className="text-sm font-semibold hidden sm:inline">Accessibility</span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Accessibility settings"
          className="fixed bottom-24 right-6 z-50 w-[340px] bg-white rounded-2xl sb-shadow-soft border border-[var(--sb-border)] p-5"
          data-testid="a11y-panel"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-[var(--sb-text-soft)]">Current Mode</div>
              <div className="text-sm font-bold text-[var(--sb-purple)]" data-testid="mode-indicator">{modeLabel}</div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close" className="w-9 h-9 rounded-full hover:bg-[var(--sb-lavender)] flex items-center justify-center">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { v: "blind", icon: Eye, label: "Blind" },
              { v: "deaf", icon: Ear, label: "Deaf" },
              { v: "deaf-blind", icon: Hand, label: "Both" },
            ].map(({ v, icon: Icon, label }) => (
              <button
                key={v}
                onClick={() => { set({ mode: v }); announce(`Mode set to ${label}`); }}
                className={`p-3 rounded-xl border-2 transition-all text-xs font-semibold flex flex-col items-center gap-1 ${
                  prefs.mode === v
                    ? "border-[var(--sb-purple)] bg-[var(--sb-lavender)] text-[var(--sb-purple)]"
                    : "border-[var(--sb-border)] hover:border-[var(--sb-purple-light)]"
                }`}
                data-testid={`a11y-mode-${v}`}
                aria-pressed={prefs.mode === v}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>

          <Row label="Hover-to-read" testId="a11y-hover-read" checked={prefs.hoverToRead} onChange={v => set({ hoverToRead: v })} />
          <Row label="Live captions" testId="a11y-captions" checked={prefs.captions} onChange={v => set({ captions: v })} />
          <Row label="High contrast" testId="a11y-high-contrast" checked={prefs.highContrast} onChange={v => set({ highContrast: v })} />

          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-[var(--sb-text-soft)] mb-2">Font size</div>
            <div className="flex gap-2">
              {sizes.map((s, i) => (
                <button
                  key={s.v}
                  onClick={() => set({ fontSize: s.v })}
                  data-testid={`a11y-font-${s.v}`}
                  aria-pressed={prefs.fontSize === s.v}
                  className={`flex-1 h-11 rounded-xl border-2 transition-all font-bold flex items-center justify-center ${
                    prefs.fontSize === s.v
                      ? "border-[var(--sb-purple)] bg-[var(--sb-lavender)] text-[var(--sb-purple)]"
                      : "border-[var(--sb-border)] hover:border-[var(--sb-purple-light)]"
                  }`}
                  style={{ fontSize: i === 0 ? 14 : i === 1 ? 17 : 22 }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-xs uppercase tracking-wider text-[var(--sb-text-soft)] mb-2">Language</div>
            <select
              value={prefs.language}
              onChange={(e) => set({ language: e.target.value })}
              className="w-full h-11 rounded-xl border-2 border-[var(--sb-border)] px-3 bg-white focus:border-[var(--sb-purple)] outline-none"
              data-testid="a11y-language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
}

function Row({ label, checked, onChange, testId }) {
  return (
    <label className="flex items-center justify-between py-2.5 cursor-pointer">
      <span className="text-sm font-medium">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        data-testid={testId}
        className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-[var(--sb-purple)]" : "bg-gray-300"}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : ""}`} />
      </button>
    </label>
  );
}