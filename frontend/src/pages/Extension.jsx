import React from "react";
import { Chrome, Globe, Volume2, Eye, Type, Hand, Video, Check, Download } from "lucide-react";

const features = [
  { icon: Volume2, title: "Auto-read any webpage aloud", desc: "Articles, news, blogs — read in a warm voice while you do other things." },
  { icon: Eye, title: "Describe every image", desc: "Hover any image on any site and hear what's in it." },
  { icon: Video, title: "Caption any video", desc: "YouTube, news clips, Vimeo — live captions appear automatically." },
  { icon: Type, title: "Highlight & speak", desc: "Select any text on any page and SenseBridge speaks it." },
  { icon: Hand, title: "Sign overlay on calls", desc: "Live sign-to-text overlay during Zoom, Meet, Teams." },
  { icon: Globe, title: "Works everywhere", desc: "Gmail, YouTube, news sites, banking — every site you visit." },
];

const steps = [
  {
    n: "01",
    title: "Download & unzip",
    desc: "Click 'Download for Chrome' below. Unzip the downloaded file to a folder on your computer.",
  },
  {
    n: "02",
    title: "Load in Chrome",
    desc: "Open chrome://extensions, enable Developer Mode (top right), click 'Load unpacked' and select the unzipped folder.",
  },
  {
    n: "03",
    title: "Pin & browse",
    desc: "Pin SenseBridge to your toolbar. It activates automatically on every page you visit.",
  },
];

export default function Extension() {
  return (
    <div className="bg-white" data-testid="extension-page">
      <section className="bg-gradient-to-b from-[var(--sb-lavender)]/50 to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--sb-mint)] text-[var(--sb-teal)] text-xs font-bold tracking-wider uppercase">
              <Chrome className="w-4 h-4" /> Browser Extension
            </div>
            <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold leading-tight">
              SenseBridge follows you <span className="text-[var(--sb-purple)]">everywhere</span> on the web.
            </h1>
            <p className="mt-5 text-[var(--sb-text-soft)] text-lg max-w-xl">
              One install. Every site you visit becomes accessible  automatically. Reading, describing, captioning, signing.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {/* Download zip directly — place sensebridge-extension.zip in /public */}
              <a
                href="/sensebridge-extension.zip"
                download="sensebridge-extension.zip"
                className="inline-flex items-center gap-2 px-6 h-14 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white font-semibold transition-all hover:gap-3 sb-shadow-soft"
                data-testid="install-chrome"
              >
                <Download className="w-5 h-5" /> Download for Chrome
              </a>
              <a
                href="https://support.mozilla.org/en-US/kb/find-and-install-add-ons-add-features-to-firefox"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 h-14 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] text-[var(--sb-text)] font-semibold transition-colors"
                data-testid="install-firefox"
              >
                Add to Firefox
              </a>
            </div>

            {/* Install hint */}
            <div className="mt-4 px-4 py-3 rounded-2xl bg-[var(--sb-lavender)]/60 border border-[var(--sb-border)] text-xs text-[var(--sb-text-soft)] leading-relaxed">
              <span className="font-semibold text-[var(--sb-purple)]">How to install: </span>
              Unzip the download → open <span className="font-mono bg-white px-1 rounded">chrome://extensions</span> → enable <strong>Developer Mode</strong> → click <strong>Load unpacked</strong> → select the folder.
            </div>

            <ul className="mt-5 space-y-2 text-sm text-[var(--sb-text-soft)]">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--sb-teal)]" /> Free forever for individuals
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--sb-teal)]" /> No account needed
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[var(--sb-teal)]" /> 100% on-device privacy where possible
              </li>
            </ul>
          </div>

          <div className="relative">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-[var(--sb-lavender)] via-white to-[var(--sb-mint)] p-6">
              <div className="rounded-2xl bg-white sb-shadow-card overflow-hidden">
                <div className="h-9 bg-[var(--sb-lavender)]/60 flex items-center gap-2 px-4">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                  <div className="ml-3 text-xs font-mono text-[var(--sb-text-soft)] bg-white rounded-full px-3 py-0.5">
                    sensebridge://reading-now
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold">Article: A bridge of senses</h3>
                  <p className="text-sm text-[var(--sb-text-soft)] mt-2 leading-relaxed">
                    "In a small town in Kerala, a blind grandmother heard her granddaughter's drawing for the first time. The picture showed two girls under a mango tree…"
                  </p>
                  <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-[var(--sb-lavender)]/50">
                    <Volume2 className="w-4 h-4 text-[var(--sb-purple)]" />
                    <span className="text-xs font-semibold">Now reading aloud</span>
                    <div className="ml-auto flex items-center gap-0.5">
                      {Array.from({ length: 14 }).map((_, i) => (
                        <span
                          key={i}
                          className="wave-bar bg-[var(--sb-purple)]"
                          style={{ height: 18, animationDelay: `${i * 0.08}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to get started */}
      <section className="py-16 bg-[var(--sb-lavender)]/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold">
            How to <span className="text-[var(--sb-purple)]">get started</span>
          </h2>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="bg-white rounded-3xl p-7 sb-shadow-card">
                <div className="text-xs font-bold text-[var(--sb-purple)] tracking-wider">{s.n}</div>
                <h3 className="mt-2 font-bold text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-[var(--sb-text-soft)] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 text-center">
            <a
              href="/sensebridge-extension.zip"
              download="sensebridge-extension.zip"
              className="inline-flex items-center gap-2 px-8 h-14 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white font-semibold transition-all sb-shadow-soft"
            >
              <Download className="w-5 h-5" /> Download Extension , Free
            </a>
            <p className="mt-3 text-xs text-[var(--sb-text-soft)]">
              Works on Chrome, Edge, Brave, and any Chromium browser.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <h2 className="text-center text-3xl sm:text-4xl font-extrabold">What it can do</h2>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card hover:-translate-y-1 transition-transform"
                  data-testid={`ext-feature-${i}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--sb-lavender)] flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-[var(--sb-purple)]" />
                  </div>
                  <h3 className="font-bold">{f.title}</h3>
                  <p className="mt-1 text-sm text-[var(--sb-text-soft)]">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}