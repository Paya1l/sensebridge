import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AccessibilityContext = createContext(null);

const DEFAULTS = {
  mode: null,
  fontSize: "normal",
  highContrast: false,
  hoverToRead: false,
  captions: false,
  language: "en",
};

const STORAGE_KEY = "sensebridge_prefs";

export function AccessibilityProvider({ children }) {
  const [prefs, setPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
    } catch {
      return DEFAULTS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));

    const root = document.documentElement;

    root.style.fontSize =
      prefs.fontSize === "xlarge"
        ? "20px"
        : prefs.fontSize === "large"
        ? "18px"
        : "16px";

    document.body.classList.toggle(
      "high-contrast",
      prefs.highContrast
    );
  }, [prefs]);

  const set = useCallback(
    (patch) => setPrefs((p) => ({ ...p, ...patch })),
    []
  );

  const speak = useCallback(
    (text, opts = {}) => {
      if (!window.speechSynthesis) return;

      window.speechSynthesis.cancel();

      const u = new SpeechSynthesisUtterance(text);

      u.rate = opts.rate || 1;
      u.pitch = opts.pitch || 1;
      u.lang =
        opts.lang ||
        (prefs.language === "hi" ? "hi-IN" : "en-US");

      if (opts.voice) u.voice = opts.voice;

      window.speechSynthesis.speak(u);
    },
    [prefs.language]
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
  }, []);

  const announce = useCallback((text) => {
    const el = document.getElementById("sb-live-region");

    if (el) {
      el.textContent = "";

      setTimeout(() => {
        el.textContent = text;
      }, 50);
    }
  }, []);

  return (
    <AccessibilityContext.Provider
      value={{
        prefs,
        set,
        speak,
        stopSpeaking,
        announce,
      }}
    >
      {children}

      <div
        id="sb-live-region"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        style={{
          position: "absolute",
          left: "-9999px",
        }}
      />
    </AccessibilityContext.Provider>
  );
}

export const useAccessibility = () => {
  const ctx = useContext(AccessibilityContext);

  if (!ctx) {
    throw new Error(
      "useAccessibility must be used within AccessibilityProvider"
    );
  }

  return ctx;
};