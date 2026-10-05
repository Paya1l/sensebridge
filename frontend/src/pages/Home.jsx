import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Ear, Mic, Hand, ImageIcon, Type, BellRing, Chrome, ArrowRight, Play, Sparkles } from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: "easeOut" },
  }),
};

function Waveform({ color = "var(--sb-purple)", bars = 28, className = "" }) {
  return (
    <div className={`flex items-center h-9 ${className}`} aria-hidden>
      {Array.from({ length: bars }).map((_, i) => (
        <span
          key={i}
          className="wave-bar"
          style={{
            background: color,
            height: "100%",
            animationDelay: `${i * 0.07}s`,
            opacity: 0.55 + Math.sin(i) * 0.3,
          }}
        />
      ))}
    </div>
  );
}

function FloatingCard({ icon: Icon, title, desc, color, delay = 0, position }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      className={`absolute ${position} bg-white rounded-2xl sb-shadow-soft border border-[var(--sb-border)] p-4 w-[250px]`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color + "22" }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <div className="text-sm font-bold">{title}</div>
          <div className="text-xs text-[var(--sb-text-soft)] mt-0.5 leading-snug">{desc}</div>
        </div>
      </div>
      <Waveform color={color} bars={22} className="mt-2" />
    </motion.div>
  );
}

const personas = [
  {
    mode: "blind",
    icon: Eye,
    color: "var(--sb-purple)",
    bg: "var(--sb-lavender)",
    title: "For Blind Users",
    desc: "Takes any image and reads it to you (like about the people, text, colors, all of it.)"

,
  },
  {
    mode: "deaf",
    icon: Mic,
    color: "#3B82F6",
    bg: "var(--sb-blue-soft)",
    title: "For Deaf Users",
    desc: "Convert all audio content into accurate and readable text instantly.",
  },
  {
    mode: "deaf-blind",
    icon: Hand,
    color: "var(--sb-teal)",
    bg: "var(--sb-mint)",
    title: "For Deaf-Blind Users",
    desc: "Convert both visual and audio content into tactile output for real-world touch.",
  },
];

const features = [
  { icon: ImageIcon, title: "Image to Speech", desc: "AI describes your images in rich, spoken detail.", color: "var(--sb-purple)" },
  { icon: Type, title: "Text to Speech", desc: "Paste articles or text and hear them read aloud in natural audio.", color: "#3B82F6" },
  { icon: Hand, title: "Sign Language Identifier", desc: "Camera-based sign recognition that turns signs into text and speech (prototype).", color: "var(--sb-teal)" },
  { icon: Mic, title: "Speech to Text", desc: "Large font captions appear as you or anyone around you speaks.", color: "#D946EF" },
  { icon: BellRing, title: "Sound Alerts", desc: "Get visual alerts for alarms, sirens and doorbells (prototype).", color: "var(--sb-coral)" },
  { icon: Chrome, title: "Browser Extension", desc: "Read pages aloud, boost contrast and resize text on any website.", color: "#0EA5E9" },
];

export default function Home() {
  const { set, announce } = useAccessibility();

  const pickMode = (mode) => {
    set({ mode });
    announce(`Mode set to ${mode}. You can now use any tool tailored for you.`);
  };

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative overflow-hidden sb-grain" data-testid="hero">
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full bg-[var(--sb-lavender)] blur-3xl opacity-60"
          aria-hidden
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-12 pb-20 grid lg:grid-cols-2 gap-12 items-center relative">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sb-lavender)] text-[var(--sb-purple)] text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-4 h-4" /> Sense Bridging Senses With AI
            </div>
           <h1 className="mt-6 font-extrabold tracking-tight leading-[1.05] text-2xl sm:text-5xl lg:text-[40px]">
              
              Make every moment something you can <br />
              <div className="mt-6 flex flex-col text-[0.95em] italic">
    <span className="ml-0 bg-gradient-to-r from-[#E9D5FF] to-[#C4B5FD] bg-clip-text text-transparent">
      See
    </span>

    <span className="ml-16 bg-gradient-to-r from-[#C4B5FD] to-[#A78BFA] bg-clip-text text-transparent">
      Hear
    </span>

    <span className="ml-32 bg-gradient-to-r from-[#A78BFA] to-[#7C3AED] bg-clip-text text-transparent">
      Feel
    </span>
  </div>
            </h1>
            <p className="mt-6 text-[var(--sb-text-soft)] text-lg leading-relaxed max-w-xl">
              SenseBridge helps you experience the world differently turning what you see and hear into meaningful real-time understanding
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/tools"
                data-testid="hero-try-live"
                className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white font-semibold transition-all hover:gap-3 sb-shadow-soft"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                data-testid="hero-watch"
                className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] text-[var(--sb-text)] font-semibold transition-colors"
              >
                <Play className="w-4 h-4 fill-current" /> Watch How It Works
              </button>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-2">
                {["#a78bfa", "#34d399", "#fb923c", "#60a5fa"].map((c, i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-white" style={{ background: c }} aria-hidden />
                ))}
              </div>
              <p className="text-sm text-[var(--sb-text-soft)]">
                <strong className="text-[var(--sb-text)]"></strong> 
              </p>
            </div>

            {/* Mode picker */}
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
              {[
                { v: "blind", label: "I am Blind", icon: Eye, color: "var(--sb-purple)" },
                { v: "deaf", label: "I am Deaf", icon: Ear, color: "var(--sb-teal)" },
                { v: "deaf-blind", label: "I am Deaf-Blind", icon: Hand, color: "var(--sb-coral)" },
              ].map(({ v, label, icon: Icon, color }) => (
                <button
                  key={v}
                  data-testid={`pick-mode-${v}`}
                  onClick={() => pickMode(v)}
                  className="group p-4 rounded-2xl bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] hover:bg-[var(--sb-lavender)]/50 transition-all min-h-[88px] flex flex-col items-start gap-2 text-left"
                >
                  <Icon className="w-6 h-6 transition-transform group-hover:scale-110" style={{ color }} />
                  <span className="text-sm font-semibold leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right illustration */}
          <div className="relative h-[560px] hidden lg:block">
            <div className="absolute inset-0 rounded-[40px] overflow-hidden bg-gradient-to-br from-[var(--sb-lavender)] via-white to-[var(--sb-mint)]">
              <img
                src="https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=900&q=80"
                alt="A person wearing modern accessibility glasses, smiling and looking upward"
                className="w-full h-full object-cover mix-blend-multiply"
              />
            </div>
            <FloatingCard icon={Eye} title="Visual → Speech" desc="AI describes images and visuals aloud." color="#534AB7" position="top-6 left-2" delay={0.2} />
            <FloatingCard icon={Mic} title="Audio → Text" desc="AI listens and converts audio into text." color="#3B82F6" position="top-1/2 -left-6 -translate-y-1/2" delay={0.4} />
            <FloatingCard icon={Hand} title="Speech/Text → Tactile" desc="AI converts content into Braille for real-world touch." color="#1D9E75" position="bottom-6 left-4" delay={0.6} />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-[var(--sb-lavender)]/40 py-20" data-testid="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-center font-extrabold text-3xl sm:text-4xl">
            How <span className="text-[var(--sb-purple)]">SenseBridge</span> Works
          </h2>
          <div className="mt-14 grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {[
              { n: "01", title: "Upload or Input", desc: "Upload images, videos, or audio content.", color: "var(--sb-purple)", bg: "var(--sb-lavender)" },
              { n: "02", title: "AI Processing", desc: "Our AI understands and analyzes the content in real time.", color: "#3B82F6", bg: "var(--sb-blue-soft)" },
              { n: "03", title: "Convert Instantly", desc: "Convert to speech, text, or tactile output instantly.", color: "var(--sb-purple)", bg: "var(--sb-lavender)" },
              { n: "04", title: "Accessible Output", desc: "Accessible formats for blind, deaf, and deaf-blind users.", color: "var(--sb-teal)", bg: "var(--sb-mint)" },
            ].map((s, i) => (
              <div key={s.n} className="relative">
                <div className="flex flex-col items-start gap-3">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: s.bg }}>
                    {i === 0 && <ImageIcon className="w-7 h-7" style={{ color: s.color }} />}
                    {i === 1 && <Sparkles className="w-7 h-7" style={{ color: s.color }} />}
                    {i === 2 && <Zap className="w-7 h-7" style={{ color: s.color }} />}
                    {i === 3 && <Users className="w-7 h-7" style={{ color: s.color }} />}
                  </div>
                  <div className="text-xs font-bold tracking-wider" style={{ color: s.color }}>{s.n}</div>
                  <h3 className="font-bold text-lg">{s.title}</h3>
                  <p className="text-sm text-[var(--sb-text-soft)] leading-relaxed">{s.desc}</p>
                </div>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 right-[-12%] w-1/4 dash-connector text-[var(--sb-purple-light)]" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DESIGNED FOR EVERYONE */}
      <section className="py-20" data-testid="designed-for-everyone">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-center font-extrabold text-3xl sm:text-4xl">
            Designed for <span className="text-[var(--sb-purple)]">Everyone</span>
          </h2>
          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {personas.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.mode}
                  className="sb-card rounded-3xl p-7 sb-shadow-card"
                  style={{ background: p.bg }}
                  data-testid={`persona-${p.mode}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: p.color }}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">{p.title}</h3>
                      <p className="mt-2 text-[var(--sb-text-soft)] leading-relaxed">{p.desc}</p>
                    </div>
                  </div>
                  <Waveform color={p.color} bars={42} className="mt-5" />
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-20 bg-gradient-to-b from-white to-[var(--sb-lavender)]/30" data-testid="features-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <h2 className="text-center font-extrabold text-3xl sm:text-4xl">
            Everything you need, <span className="text-[var(--sb-teal)]">in one place</span>
          </h2>
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="group bg-white rounded-3xl p-7 border border-[var(--sb-border)] hover:border-[var(--sb-purple)] hover:-translate-y-1 transition-all sb-shadow-card"
                  data-testid={`feature-${f.title.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                    style={{ background: f.color + "1A" }}
                  >
                    <Icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-lg">{f.title}</h3>
                  <p className="mt-2 text-sm text-[var(--sb-text-soft)] leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div
            className="relative overflow-hidden rounded-3xl p-10 md:p-14 sb-grain"
            style={{ background: "linear-gradient(120deg, #534AB7 0%, #6A5DD0 60%, #1D9E75 140%)" }}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-white">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold">Let's build a world without barriers.</h2>
                <p className="mt-2 text-white/85 max-w-2xl">Join us in making digital content accessible to everyone, everywhere.</p>
              </div>
              <Link
                to="/tools"
                data-testid="cta-get-started"
                className="inline-flex items-center gap-2 px-7 h-14 rounded-full bg-white text-[var(--sb-purple)] font-bold hover:gap-3 transition-all"
              >
                Get Started for Free <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}