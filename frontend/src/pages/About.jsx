import React from "react";
import { Heart, Compass, Cpu, Users, Sparkles } from "lucide-react";

const team = [
  { name: "Prem Kalukuri",  role: "UI/UX Designer",  color: "var(--sb-purple)" },
  { name: "Payal Rathore",  role: "Frontend Developer",    color: "var(--sb-teal)" },
  { name: "Komal Gupta",    role: "Database Operator",     color: "var(--sb-coral)" },
  { name: "Jhanvi Modani",  role: "AI ML Integration",        color: "#3B82F6" },
  { name: "Komal Rajvi",    role: "Backend Developer",   color: "#3bcef6" },
];

const objectives = [
  { n: "01", title: "Make visuals speak", desc: "Any image uploaded by a blind user is described aloud in warm, human language — not robotic output." },
  { n: "02", title: "Caption the world", desc: "Every sound around a deaf user — alarms, doorbells, sirens — is detected and shown as a visual alert instantly." },
  { n: "03", title: "Break the language barrier", desc: "All tools work in English, Hindi, Gujarati, Tamil and Telugu so accessibility reaches every corner of India." },
  { n: "04", title: "Zero friction access", desc: "No account, no install, no hardware. Open the browser and every feature works immediately." },
];

export default function About() {
  return (
    <div className="bg-white" data-testid="about-page">

      {/* HERO */}
      <section className="bg-gradient-to-b from-[var(--sb-lavender)]/40 to-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[var(--sb-border)] text-[var(--sb-purple)] text-xs font-bold tracking-wider uppercase">
            <Heart className="w-4 h-4" /> Our Story
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight">
            Built so no one is <span className="text-[var(--sb-purple)]">left out</span> of the world.
          </h1>
          <p className="mt-5 text-[var(--sb-text-soft)] text-lg max-w-3xl mx-auto">
            SenseBridge began with one simple promise: every photo, every sound, every spoken word should be
            available to every person  regardless of how they sense the world.
          </p>
        </div>
      </section>

      {/* MISSION + PROBLEM */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-12 grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--sb-lavender)]/40 rounded-3xl p-8 sb-shadow-card">
          <Compass className="w-9 h-9 text-[var(--sb-purple)]" />
          <h2 className="mt-4 text-2xl font-bold">Our mission</h2>
          <p className="mt-3 text-[var(--sb-text-soft)] leading-relaxed">
            To translate the world into the senses you have — instantly, warmly, and without friction. We don't
            believe in "accessibility" as an add-on. We believe in{" "}
            <strong className="text-[var(--sb-text)]">universally designed experiences</strong> from the start.
          </p>
        </div>
        <div className="bg-[var(--sb-mint)]/50 rounded-3xl p-8 sb-shadow-card">
          <Sparkles className="w-9 h-9 text-[var(--sb-teal)]" />
          <h2 className="mt-4 text-2xl font-bold">The problem we solve</h2>
          <p className="mt-3 text-[var(--sb-text-soft)] leading-relaxed">
            285 million people live with vision loss. 466 million live with hearing loss. Yet most of the digital
            world  images, videos, audio messages, voice calls  is still designed for people who can see and
            hear. We're changing that.
          </p>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="bg-[var(--sb-lavender)]/20 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8">
          <h2 className="text-3xl font-extrabold mb-10 text-center">
            What we set out to <span className="text-[var(--sb-purple)]">achieve</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {objectives.map((o) => (
              <div key={o.n} className="bg-white rounded-3xl p-7 sb-shadow-card flex gap-5">
                <div className="text-3xl font-extrabold text-[var(--sb-purple)]/20 leading-none shrink-0">{o.n}</div>
                <div>
                  <h3 className="font-bold text-lg">{o.title}</h3>
                  <p className="mt-1 text-sm text-[var(--sb-text-soft)] leading-relaxed">{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TECHNOLOGY */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Cpu className="w-7 h-7 text-[var(--sb-purple)]" />
          <h2 className="text-3xl font-extrabold">Our technology</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { t: "Gemini 2.0 Flash Vision", d: "State-of-the-art image understanding, tuned to describe with warmth — not clinical detail." },
            { t: "Web Speech API", d: "Real-time, multi-lingual speech recognition and synthesis on-device — fast and private." },
            { t: "MediaPipe Hands (planned)", d: "On-device hand landmark detection for real sign recognition. The current sign language tool is a prototype." },
            { t: "Sound Classification", d: "FFT audio analysis to flag what matters in real time: alarms, sirens, doorbells, glass breaking." },
          ].map((b) => (
            <div key={b.t} className="bg-white rounded-2xl p-6 border border-[var(--sb-border)] sb-shadow-card">
              <h3 className="font-bold">{b.t}</h3>
              <p className="mt-1 text-sm text-[var(--sb-text-soft)]">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL IMPACT */}
      <section className="bg-gradient-to-b from-[var(--sb-mint)]/40 to-white py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="text-3xl font-extrabold mb-4">
            Why this <span className="text-[var(--sb-teal)]">matters</span>
          </h2>
          <p className="text-[var(--sb-text-soft)] max-w-2xl mx-auto mb-10">
            Accessibility is not a feature  it is a right. SenseBridge is built on the belief that the digital world should work for everyone, not just people who can see and hear.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { stat: "750M+", label: "People globally affected by sensory disabilities", color: "var(--sb-purple)" },
              { stat: "Free", label: "No subscriptions, no paywalls, no hardware required", color: "var(--sb-teal)" },
              { stat: "5 languages", label: "English, Hindi, Gujarati, Tamil and Telugu supported", color: "var(--sb-coral)" },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card">
                <div className="text-4xl font-extrabold" style={{ color: s.color }}>{s.stat}</div>
                <p className="mt-2 text-sm text-[var(--sb-text-soft)] leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-7 h-7 text-[var(--sb-teal)]" />
          <h2 className="text-3xl font-extrabold">The team</h2>
        </div>
        <div className="grid sm:grid-cols-3 md:grid-cols-5 gap-4">
          {team.map((m) => (
            <div
              key={m.name}
              className="bg-white rounded-3xl p-6 border border-[var(--sb-border)] sb-shadow-card text-center hover:-translate-y-1 transition-transform"
              data-testid={`team-${m.name.split(" ")[0].toLowerCase()}`}
            >
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold"
                style={{ background: m.color }}
              >
                {m.name[0]}
              </div>
              <div className="mt-3 font-bold text-sm">{m.name}</div>
              <div className="text-xs text-[var(--sb-text-soft)] mt-1">{m.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CLOSING */}
      <section className="pb-20 max-w-5xl mx-auto px-4 sm:px-8">
        <div className="rounded-3xl p-10 text-center text-white"
          style={{ background: "linear-gradient(120deg, #534AB7 0%, #6A5DD0 60%, #1D9E75 140%)" }}>
          <Heart className="w-10 h-10 mx-auto mb-4 opacity-80" />
          <h2 className="text-2xl md:text-3xl font-extrabold">
            "SenseBridge is designed as an accessibility-first digital platform that combines scalable frontend engineering with future AI integration possibilities to create a more inclusive experience for differently-abled users."
          </h2>
          <p className="mt-4 text-white/70 text-sm">— The SenseBridge Team</p>
        </div>
      </section>

    </div>
  );
}