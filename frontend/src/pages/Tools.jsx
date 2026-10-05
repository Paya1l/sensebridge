import React, { useState } from "react";
import { ImageIcon, Type, Hand, Mic } from "lucide-react";
import ImageToSpeech from "../components/ImageToSpeech";
import TextToSpeech from "../components/TextToSpeech";
import SignLanguage from "../components/SignLanguage";
import SpeechToText from "../components/SpeechToText";

const TABS = [
  { id: "img", label: "Image to Speech", icon: ImageIcon, comp: ImageToSpeech, color: "var(--sb-purple)" },
  { id: "tts", label: "Text to Speech", icon: Type, comp: TextToSpeech, color: "#3B82F6" },
  { id: "sign", label: "Sign Language", icon: Hand, comp: SignLanguage, color: "var(--sb-teal)" },
  { id: "stt", label: "Speech to Text", icon: Mic, comp: SpeechToText, color: "#D946EF" },
];

export default function Tools() {
  const [active, setActive] = useState("img");
  const ActiveComp = TABS.find((t) => t.id === active).comp;

  return (
    <div className="bg-white" data-testid="tools-page">
      <section className="bg-gradient-to-b from-[var(--sb-lavender)]/50 to-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Your AI-powered <span className="text-[var(--sb-purple)]">toolkit</span>
          </h1>
          <p className="mt-4 text-[var(--sb-text-soft)] max-w-2xl mx-auto">
            Four powerful tools designed to bridge senses. Pick one and start exploring  no sign-up needed.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-24">
        <div
          role="tablist"
          aria-label="Tools"
          className="grid grid-cols-2 lg:grid-cols-4 gap-2 p-2 bg-[var(--sb-lavender)]/40 rounded-2xl"
        >
          {TABS.map((t) => {
            const Icon = t.icon;
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={isActive}
                data-testid={`tab-${t.id}`}
                onClick={() => setActive(t.id)}
                className={`min-h-[56px] rounded-xl px-4 py-3 flex items-center justify-center gap-2 font-semibold text-sm transition-all ${
                  isActive
                    ? "bg-white text-[var(--sb-purple)] sb-shadow-card"
                    : "text-[var(--sb-text-soft)] hover:bg-white/60"
                }`}
              >
                <Icon className="w-5 h-5" style={{ color: isActive ? t.color : undefined }} />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-8">
          <ActiveComp />
        </div>
      </section>
    </div>
  );
}