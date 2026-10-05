import React from "react";
import { motion } from "framer-motion";
import {
  Brain, Eye, Hand, Mic, Shield, Zap, Globe2, Code2,
  Database, Server, Monitor, Cpu, ArrowDown, ArrowRight,
  Layers, GitBranch, Sparkles, Target, Heart, Users
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" } }),
};

const CURRENT_AI = [
  {
    icon: Eye, color: "var(--sb-purple)", bg: "var(--sb-lavender)",
    title: "Google Gemini 2.0 Flash", tag: "Live Now", tagColor: "bg-green-100 text-green-700",
    desc: "Multimodal AI model that sees and understands images. When a blind user uploads a photo, Gemini describes it in warm, human-like language and speaks it aloud.",
    tech: ["Gemini API", "Base64 Vision", "Web Speech API"],
  },
  {
    icon: Mic, color: "#3B82F6", bg: "var(--sb-blue-soft)",
    title: "FFT Audio Classification", tag: "Live Now", tagColor: "bg-green-100 text-green-700",
    desc: "Fast Fourier Transform frequency analysis on live microphone input. Classifies 15 real-world sounds including fire alarms, sirens and glass breaking in 1.5 seconds.",
    tech: ["Web Audio API", "FFT Analysis", "5-Band Spectrum"],
  },
  {
    icon: Mic, color: "var(--sb-teal)", bg: "var(--sb-mint)",
    title: "Web Speech Recognition", tag: "Live Now", tagColor: "bg-green-100 text-green-700",
    desc: "Browser-native speech recognition that converts live microphone input into real-time captions. Supports English, Hindi, Gujarati, Tamil, and Telugu.",
    tech: ["Web Speech API", "Multi-language", "Real-time"],
  },
];

const FUTURE_AI = [
  {
    icon: Hand, color: "var(--sb-teal)", bg: "var(--sb-mint)",
    title: "Real ASL Sign Language Recognition", timeline: "Version 2.0",
    desc: "Replace simulation with a trained TensorFlow model using MediaPipe hand landmarks. Will recognize full ASL alphabet and common words in real time from camera.",
    tech: ["TensorFlow.js", "MediaPipe", "CNN Model", "OpenCV"],
  },
  {
    icon: Brain, color: "#D946EF", bg: "#fdf4ff",
    title: "Trained Audio ML Model", timeline: "Version 2.0",
    desc: "Replace heuristic FFT classifier with a trained neural network using YAMNet or Whisper AI. Will achieve 95%+ accuracy on environmental sound classification.",
    tech: ["YAMNet", "Whisper AI", "TensorFlow", "AudioSet"],
  },
  {
    icon: Eye, color: "var(--sb-coral)", bg: "var(--sb-blush)",
    title: "Real-time Object Detection", timeline: "Version 3.0",
    desc: "Live camera feed with YOLO-based object detection. Blind users point their camera and hear what objects, people, and text are in front of them in real time.",
    tech: ["YOLOv8", "COCO Dataset", "WebRTC", "TensorFlow.js"],
  },
  {
    icon: Sparkles, color: "#0EA5E9", bg: "#f0f9ff",
    title: "Personalized Accessibility AI", timeline: "Version 3.0",
    desc: "AI learns each user's preferences, frequently used features, and adapts the interface. Suggests accessibility settings and remembers communication style.",
    tech: ["NLP", "User Profiling", "Recommendation AI", "MongoDB"],
  },
  {
    icon: Globe2, color: "var(--sb-purple)", bg: "var(--sb-lavender)",
    title: "AI Smart Assistant", timeline: "Version 4.0",
    desc: "Conversational AI assistant built specifically for accessibility. Users can ask questions, get help navigating, and control the app entirely by voice or text.",
    tech: ["LLM", "RAG", "Voice Control", "NLP"],
  },
  {
    icon: Shield, color: "var(--sb-teal)", bg: "var(--sb-mint)",
    title: "Predictive Danger Detection", timeline: "Version 4.0",
    desc: "AI learns environment patterns and predicts dangerous situations before they happen. Alerts users to unusual sound patterns or visual hazards proactively.",
    tech: ["LSTM", "Anomaly Detection", "Time Series", "Edge AI"],
  },
];

const TECH_STACK = [
  { icon: Monitor, label: "React.js", desc: "Frontend UI", color: "#61DAFB", bg: "#e8f9fd" },
  { icon: Zap, label: "Tailwind CSS", desc: "Styling", color: "#38BDF8", bg: "#f0f9ff" },
  { icon: Server, label: "FastAPI", desc: "Backend API", color: "#059669", bg: "#ecfdf5" },
  { icon: Database, label: "MongoDB", desc: "Database", color: "#47A248", bg: "#f0fdf4" },
  { icon: Code2, label: "Python", desc: "Backend Lang", color: "#3776AB", bg: "#eff6ff" },
  { icon: Brain, label: "Gemini AI", desc: "Vision AI", color: "#8B5CF6", bg: "#f5f3ff" },
  { icon: Cpu, label: "Web Audio API", desc: "Sound Analysis", color: "var(--sb-coral)", bg: "var(--sb-blush)" },
  { icon: Mic, label: "Web Speech API", desc: "STT / TTS", color: "#D946EF", bg: "#fdf4ff" },
];

const ARCHITECTURE = [
  { step: "01", icon: Users, label: "User Input", desc: "Image upload, microphone, text, or camera", color: "var(--sb-purple)" },
  { step: "02", icon: Monitor, label: "React Frontend", desc: "Processes browser APIs directly for speech & sound", color: "#3B82F6" },
  { step: "03", icon: Server, label: "FastAPI Backend", desc: "Handles AI requests, auth, and database operations", color: "var(--sb-teal)" },
  { step: "04", icon: Brain, label: "Gemini AI", desc: "Analyses images and generates warm descriptions", color: "#D946EF" },
  { step: "05", icon: Database, label: "MongoDB", desc: "Stores transcripts, alerts, and community posts", color: "#47A248" },
  { step: "06", icon: Zap, label: "Accessible Output", desc: "Speech, captions, visual alerts, or notifications", color: "var(--sb-coral)" },
];

const PROJECT_STRUCTURE = [
  {
    icon: Monitor, label: "frontend/", color: "var(--sb-purple)", bg: "var(--sb-lavender)",
    items: ["src/pages/ — 7 pages", "src/components/ — 8 components", "src/api/ — backend calls", "src/context/ — accessibility state"],
  },
  {
    icon: Server, label: "backend/", color: "var(--sb-teal)", bg: "var(--sb-mint)",
    items: ["server.py — FastAPI routes", "Gemini AI integration", "MongoDB motor async", "gTTS text-to-speech"],
  },
  {
    icon: Database, label: "database/", color: "#47A248", bg: "#f0fdf4",
    items: ["transcripts collection", "sound_alerts collection", "community_posts collection", "Auto-seeded on startup"],
  },
  {
    icon: Brain, label: "AI modules/", color: "#D946EF", bg: "#fdf4ff",
    items: ["Gemini 2.0 Flash — images", "FFT classifier — sounds", "Web Speech — captions", "Future: TensorFlow + MediaPipe"],
  },
];

const IMPACT = [
  { icon: "👁️", stat: "2.2B", label: "People with visual impairment worldwide", color: "var(--sb-purple)" },
  { icon: "👂", stat: "430M", label: "People with disabling hearing loss", color: "var(--sb-teal)" },
  { icon: "🌍", stat: "1 in 6", label: "People globally live with some disability", color: "var(--sb-coral)" },
  { icon: "📱", stat: "0", label: "Apps that bridge all three — until SenseBridge", color: "#3B82F6" },
];

export default function AIVision() {
  return (
    <div className="bg-white" data-testid="ai-vision-page">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--sb-lavender)] via-white to-[var(--sb-mint)] py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[var(--sb-purple)] text-xs font-bold tracking-wider uppercase border border-[var(--sb-purple)]/20 mb-6">
              <Sparkles className="w-4 h-4" /> AI Integration  Present & Future
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              The <span className="text-[var(--sb-purple)]">AI</span> behind<br />SenseBridge
            </h1>
            <p className="mt-6 text-[var(--sb-text-soft)] text-lg max-w-3xl mx-auto leading-relaxed">
              SenseBridge uses real AI today  and has a clear roadmap for deeper AI integration. Here's exactly what's live, what's coming, and how it all fits together.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CURRENT AI */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-wider uppercase mb-4">
             Currently Live
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">AI features working <span className="text-[var(--sb-teal)]">right now</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {CURRENT_AI.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: f.bg }}>
                    <Icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${f.tagColor}`}>{f.tag}</span>
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--sb-text-soft)] leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {f.tech.map(t => (
                    <span key={t} className="px-2 py-1 rounded-lg bg-[var(--sb-lavender)] text-[var(--sb-purple)] text-xs font-semibold">{t}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ARCHITECTURE */}
      <section className="py-20 bg-gradient-to-b from-[var(--sb-lavender)]/40 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold">How it <span className="text-[var(--sb-purple)]">works</span> Architecture</h2>
            <p className="mt-3 text-[var(--sb-text-soft)]">Clean client-server architecture with direct browser API integration</p>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {ARCHITECTURE.map((a, i) => {
              const Icon = a.icon;
              return (
                <React.Fragment key={a.step}>
                  <motion.div custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                    className="flex flex-col items-center text-center flex-1">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 sb-shadow-card" style={{ background: a.color + "18" }}>
                      <Icon className="w-7 h-7" style={{ color: a.color }} />
                    </div>
                    <div className="text-xs font-bold tracking-wider mb-1" style={{ color: a.color }}>{a.step}</div>
                    <div className="font-bold text-sm">{a.label}</div>
                    <div className="text-xs text-[var(--sb-text-soft)] mt-1 leading-snug max-w-[120px]">{a.desc}</div>
                  </motion.div>
                  {i < ARCHITECTURE.length - 1 && (
                    <>
                      <div className="hidden md:flex items-center text-[var(--sb-purple-light)]">
                        <ArrowRight className="w-6 h-6" />
                      </div>
                      <div className="md:hidden flex items-center text-[var(--sb-purple-light)]">
                        <ArrowDown className="w-6 h-6" />
                      </div>
                    </>
                  )}
                </React.Fragment>
              );
            })}
          </div>
          <div className="mt-14 bg-white rounded-3xl p-8 border border-[var(--sb-border)] sb-shadow-card">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-[var(--sb-purple)]" /> Architecture Notes
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--sb-text-soft)] leading-relaxed">
              {[
                { color: "var(--sb-purple)", title: "Speech & Sound features", body: "run entirely in the browser using native Web APIs — no backend call needed, making them faster and offline-capable." },
                { color: "var(--sb-teal)", title: "Image description", body: "goes through the FastAPI backend which calls Gemini AI — keeping the API key secure on the server side." },
                { color: "var(--sb-coral)", title: "All data", body: "— transcripts, sound history, community posts — is stored in MongoDB and accessible across sessions." },
                { color: "#3B82F6", title: "CORS and security", body: "is handled by FastAPI middleware, and environment variables keep all keys out of the codebase." },
              ].map((n, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full mt-2 shrink-0" style={{ background: n.color }} />
                  <p><strong className="text-[var(--sb-text)]">{n.title}</strong> {n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FUTURE AI */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sb-lavender)] text-[var(--sb-purple)] text-xs font-bold tracking-wider uppercase mb-4">
            <Sparkles className="w-4 h-4" /> Future Roadmap
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold">AI features <span className="text-[var(--sb-purple)]">coming next</span></h2>
          <p className="mt-3 text-[var(--sb-text-soft)] max-w-2xl mx-auto">
            The current version lays the foundation. Future versions will add trained ML models for deeper, more accurate accessibility intelligence.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FUTURE_AI.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-3xl p-7 border-2 border-dashed border-[var(--sb-border)] hover:border-[var(--sb-purple)] hover:-translate-y-1 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: f.bg }}>
                    <Icon className="w-6 h-6" style={{ color: f.color }} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[var(--sb-lavender)] text-[var(--sb-purple)]">{f.timeline}</span>
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="mt-2 text-sm text-[var(--sb-text-soft)] leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {f.tech.map(t => (
                    <span key={t} className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold">{t}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-20 bg-[var(--sb-lavender)]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Technology <span className="text-[var(--sb-teal)]">stack</span></h2>
            <p className="mt-3 text-[var(--sb-text-soft)]">Every tool chosen for performance, accessibility, and scalability</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TECH_STACK.map((t, i) => {
              const Icon = t.icon;
              return (
                <motion.div key={i} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                  className="bg-white rounded-2xl p-5 border border-[var(--sb-border)] sb-shadow-card hover:-translate-y-1 transition-all text-center">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: t.bg }}>
                    <Icon className="w-6 h-6" style={{ color: t.color }} />
                  </div>
                  <div className="font-bold">{t.label}</div>
                  <div className="text-xs text-[var(--sb-text-soft)] mt-1">{t.desc}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJECT STRUCTURE */}
      <section className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold">Project <span className="text-[var(--sb-purple)]">structure</span></h2>
          <p className="mt-3 text-[var(--sb-text-soft)]">Clean modular architecture across frontend, backend, database and AI</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PROJECT_STRUCTURE.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div key={i} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-3xl p-6 border border-[var(--sb-border)] sb-shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: p.bg }}>
                    <Icon className="w-5 h-5" style={{ color: p.color }} />
                  </div>
                  <code className="font-bold text-sm" style={{ color: p.color }}>{p.label}</code>
                </div>
                <ul className="space-y-2">
                  {p.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-[var(--sb-text-soft)]">
                      <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: p.color }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="py-20 bg-gradient-to-b from-[var(--sb-lavender)]/30 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold">Why this <span className="text-[var(--sb-coral)]">matters</span></h2>
            <p className="mt-3 text-[var(--sb-text-soft)] max-w-2xl mx-auto">
              SenseBridge is not just a technical project. It is a social impact platform built for people who are often completely excluded from the digital world.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {IMPACT.map((item, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp}
                className="bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card text-center">
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="text-3xl font-extrabold" style={{ color: item.color }}>{item.stat}</div>
                <div className="text-sm text-[var(--sb-text-soft)] mt-2 leading-snug">{item.label}</div>
              </motion.div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--sb-blush)] rounded-3xl p-8 border border-[var(--sb-coral)]/20">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-[var(--sb-coral)]" />
                <h3 className="font-bold text-xl">The Problem</h3>
              </div>
              <ul className="space-y-3 text-sm text-[var(--sb-text-soft)] leading-relaxed">
                <li className="flex gap-2"><span>•</span>Blind users cannot access visual content on the web</li>
                <li className="flex gap-2"><span>•</span>Deaf users miss critical audio alerts and live conversations</li>
                <li className="flex gap-2"><span>•</span>Deaf-blind users have almost no independent digital access</li>
                <li className="flex gap-2"><span>•</span>Existing tools are expensive, fragmented, or require special hardware</li>
              </ul>
            </div>
            <div className="bg-[var(--sb-mint)] rounded-3xl p-8 border border-[var(--sb-teal)]/20">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-[var(--sb-teal)]" />
                <h3 className="font-bold text-xl">SenseBridge Solution</h3>
              </div>
              <ul className="space-y-3 text-sm text-[var(--sb-text-soft)] leading-relaxed">
                <li className="flex gap-2"><span>•</span>Free, browser-based — no hardware or installation needed</li>
                <li className="flex gap-2"><span>•</span>AI describes images warmly and speaks them aloud instantly</li>
                <li className="flex gap-2"><span>•</span>Real-time captions for all spoken audio around them</li>
                <li className="flex gap-2"><span>•</span>Automatic danger alerts with full-screen flash and notifications</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 max-w-6xl mx-auto px-4 sm:px-8">
        <div className="rounded-3xl p-10 md:p-14 text-white text-center"
          style={{ background: "linear-gradient(120deg, #534AB7 0%, #6A5DD0 60%, #1D9E75 140%)" }}>
          <Layers className="w-12 h-12 mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-extrabold">Built today. Designed for tomorrow.</h2>
          <p className="mt-4 text-white/85 max-w-2xl mx-auto text-lg">
            The current version demonstrates the full accessibility workflow with real AI integration. Future versions will add trained ML models, mobile apps, and deeper AI intelligence.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-[var(--sb-purple)] font-bold text-lg">
            <Sparkles className="w-5 h-5" /> Version 1.0  Live & Working
          </div>
        </div>
      </section>

    </div>
  );
}