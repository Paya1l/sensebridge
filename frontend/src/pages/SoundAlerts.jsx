import React, { useEffect, useRef, useState } from "react";
import { BellRing, ShieldAlert, Activity, History } from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";
import { toast } from "sonner";

const SOUND_META = {
  fire_alarm:  { icon: "🔥", label: "Fire Alarm",         dangerous: true  },
  siren:       { icon: "🚨", label: "Emergency Siren",     dangerous: true  },
  car_horn:    { icon: "🚗", label: "Car Horn",            dangerous: true  },
  baby_cry:    { icon: "👶", label: "Baby Crying",         dangerous: true  },
  glass_break: { icon: "🪟", label: "Glass Breaking",      dangerous: true  },
  loud_bang:   { icon: "💥", label: "Loud Bang",           dangerous: true  },
  alarm_beep:  { icon: "⏰", label: "Alarm / Beeping",     dangerous: true  },
  dog_bark:    { icon: "🐕", label: "Dog Barking",         dangerous: false },
  doorbell:    { icon: "🔔", label: "Doorbell",            dangerous: false },
  knocking:    { icon: "✊", label: "Knocking",            dangerous: false },
  thunder:     { icon: "⛈️", label: "Thunder",             dangerous: false },
  speech:      { icon: "🗣️", label: "Someone Speaking",    dangerous: false },
  music:       { icon: "🎵", label: "Music Playing",       dangerous: false },
  phone_ring:  { icon: "📱", label: "Phone Ringing",       dangerous: false },
  ambient:     { icon: "🌿", label: "Ambient / Quiet",     dangerous: false },
};

function classifyAudio(freqData, sampleRate) {
  const len = freqData.length;
  const binHz = sampleRate / (len * 2);
  const band = (lo, hi) => {
    const a = Math.round(lo / binHz);
    const b = Math.min(Math.round(hi / binHz), len - 1);
    if (a > b) return 0;
    let sum = 0;
    for (let i = a; i <= b; i++) sum += freqData[i];
    return sum / (b - a + 1);
  };
  const subBass = band(20, 80);
  const bass    = band(80, 300);
  const lowMid  = band(300, 800);
  const mid     = band(800, 2500);
  const highMid = band(2500, 5000);
  const high    = band(5000, 10000);
  const loudness = freqData.reduce((s, v) => s + v, 0) / len;
  let weightedSum = 0, totalEnergy = 0;
  for (let i = 0; i < len; i++) { weightedSum += freqData[i] * i * binHz; totalEnergy += freqData[i]; }
  const centroid = totalEnergy > 0 ? weightedSum / totalEnergy : 0;
  const nonZero = freqData.filter(v => v > 0);
  const geoMean = nonZero.length ? Math.exp(nonZero.reduce((s, v) => s + Math.log(v + 1e-6), 0) / nonZero.length) : 0;
  const arithMean = nonZero.length ? nonZero.reduce((s, v) => s + v, 0) / nonZero.length : 1;
  const flatness = arithMean > 0 ? geoMean / arithMean : 0;
  let peakBin = 0;
  for (let i = 1; i < len; i++) if (freqData[i] > freqData[peakBin]) peakBin = i;
  const peakHz = peakBin * binHz;

  if (loudness < 12) return { sound: "ambient", confidence: 0.92 };
  if (loudness > 140 && flatness > 0.55 && subBass > 100) return { sound: "glass_break", confidence: 0.82 };
  if (loudness > 160 && flatness > 0.5) return { sound: "loud_bang", confidence: 0.80 };
  if (subBass > 90 && bass > 80 && flatness > 0.4 && loudness > 60) return { sound: "thunder", confidence: 0.78 };
  if (peakHz > 800 && peakHz < 3500 && flatness < 0.3 && highMid > 90 && loudness > 70) return { sound: "fire_alarm", confidence: 0.85 };
  if (mid > 100 && flatness < 0.25 && loudness > 60 && peakHz > 500 && peakHz < 1500) return { sound: "alarm_beep", confidence: 0.78 };
  if (highMid > 80 && mid > 70 && centroid > 1500 && loudness > 55) return { sound: "siren", confidence: 0.80 };
  if (bass > 100 && lowMid > 90 && peakHz > 150 && peakHz < 600 && flatness < 0.35) return { sound: "car_horn", confidence: 0.79 };
  if (lowMid > 110 && mid > 80 && flatness > 0.3 && loudness > 70 && peakHz < 1000) return { sound: "dog_bark", confidence: 0.76 };
  if (mid > 90 && flatness < 0.3 && peakHz > 600 && peakHz < 1500 && loudness > 45) {
    if (highMid > 60) return { sound: "phone_ring", confidence: 0.74 };
    return { sound: "doorbell", confidence: 0.75 };
  }
  if (bass > 80 && lowMid > 60 && flatness < 0.4 && loudness > 45 && peakHz < 400) return { sound: "knocking", confidence: 0.72 };
  if (centroid > 2000 && mid > 80 && high > 50 && loudness > 55) return { sound: "baby_cry", confidence: 0.77 };
  if (lowMid > 70 && mid > 60 && flatness > 0.2 && flatness < 0.5 && loudness > 30) return { sound: "speech", confidence: 0.71 };
  if (bass > 50 && mid > 50 && high > 40 && flatness > 0.15 && loudness > 35) return { sound: "music", confidence: 0.70 };
  return { sound: "ambient", confidence: 0.88 };
}

export default function SoundAlerts() {
  const { announce } = useAccessibility();
  const [status, setStatus]           = useState("requesting");
  const [history, setHistory]         = useState([]);
  const [currentAlert, setCurrentAlert] = useState(null);
  const [dangerAlert, setDangerAlert] = useState(null);
  const [bars, setBars]               = useState(Array(40).fill(2));

  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef   = useRef(null);
  const intervalRef = useRef(null);
  const rafRef      = useRef(null);

  const requestNotifPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  const sendNotification = (title, body, icon) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, { body, requireInteraction: true });
    }
  };

  const startVisualizer = () => {
    const tick = () => {
      if (!analyserRef.current) return;
      const data = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(data);
      const step = Math.floor(data.length / 40);
      setBars(Array.from({ length: 40 }, (_, i) => Math.max(2, data[i * step] / 255 * 80)));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  const startMonitoring = async () => {
    try {
      setStatus("requesting");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ac;
      const analyser = ac.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;
      const src = ac.createMediaStreamSource(stream);
      src.connect(analyser);
      setStatus("active");
      announce("SenseBridge is now protecting you automatically.");
      startVisualizer();

      intervalRef.current = setInterval(() => {
        if (!analyserRef.current) return;
        const freqData = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(freqData);
        const { sound, confidence } = classifyAudio(freqData, ac.sampleRate);
        const meta = SOUND_META[sound] || SOUND_META.ambient;
        const entry = {
          id: Math.random().toString(36).slice(2),
          sound, label: meta.label, icon: meta.icon,
          confidence: parseFloat(confidence.toFixed(2)),
          is_dangerous: meta.dangerous,
          created_at: new Date().toISOString(),
        };
        setCurrentAlert(entry);
        setHistory(h => [entry, ...h].slice(0, 50));
        if (meta.dangerous) {
          setDangerAlert(entry);
          setTimeout(() => setDangerAlert(null), 4000);
          sendNotification(`⚠️ ${meta.label} Detected!`, `SenseBridge detected a ${meta.label}. Check your surroundings immediately.`, meta.icon);
          announce(`ALERT! ${meta.label} detected!`);
          if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 1000]);
          toast.error(`⚠️ ${meta.label} detected!`, { duration: 5000 });
        }
      }, 1500);

    } catch {
      setStatus("denied");
    }
  };

  const stopMonitoring = () => {
    clearInterval(intervalRef.current);
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach(t => t.stop());
    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;
    analyserRef.current = null;
    streamRef.current = null;
    setBars(Array(40).fill(2));
  };

  // AUTO-START on page open
  useEffect(() => {
    requestNotifPermission();
    startMonitoring();
    return () => stopMonitoring();
  }, []);

  return (
    <div className="bg-white min-h-screen" data-testid="sound-alerts-page">

      {/* BIG DANGER OVERLAY — covers full screen */}
      {dangerAlert && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: "rgba(216,90,48,0.96)" }}
          role="alert"
          aria-live="assertive"
        >
          <div className="text-[120px] leading-none animate-bounce">{dangerAlert.icon}</div>
          <div className="mt-6 text-5xl sm:text-7xl font-extrabold text-white text-center px-8 uppercase">
            {dangerAlert.label}
          </div>
          <div className="mt-4 text-xl sm:text-2xl text-white/90 font-semibold text-center px-8">
            DETECTED — CHECK YOUR SURROUNDINGS NOW
          </div>
          <div className="mt-3 text-white/70 text-lg">
            {(dangerAlert.confidence * 100).toFixed(0)}% confidence
          </div>
          <button
            onClick={() => setDangerAlert(null)}
            className="mt-10 px-12 py-5 rounded-full bg-white text-[var(--sb-coral)] font-extrabold text-xl shadow-2xl"
          >
            I'M SAFE — DISMISS
          </button>
        </div>
      )}

      {/* HERO */}
      <section className="bg-gradient-to-b from-[var(--sb-blush)]/60 to-white py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-[var(--sb-coral)] text-xs font-bold tracking-wider uppercase border border-[var(--sb-coral)]/30">
            <ShieldAlert className="w-4 h-4" /> Always On , Always Protecting You
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl font-extrabold">
            SenseBridge listens and <span className="text-[var(--sb-coral)]">alerts you</span>
          </h1>
          <p className="mt-4 text-[var(--sb-text-soft)] text-lg max-w-2xl mx-auto">
            Protection starts <strong>automatically</strong> when you open this page. No button needed. Fire alarms, sirens, glass breaking  your entire screen flashes and a popup notification appears instantly.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-8 pb-24 space-y-8">

        {/* Status card */}
        <div className="bg-white rounded-3xl p-8 border border-[var(--sb-border)] sb-shadow-card flex flex-col items-center text-center">

          {status === "requesting" && (
            <>
              <div className="w-32 h-32 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse">
                <span className="text-5xl">🎤</span>
              </div>
              <div className="mt-5 text-xl font-bold text-yellow-600">Requesting microphone...</div>
              <p className="text-sm text-[var(--sb-text-soft)] mt-1">Please allow microphone access to start protection</p>
            </>
          )}

          {status === "active" && (
            <>
              <div className="w-32 h-32 rounded-full bg-[var(--sb-teal)] flex items-center justify-center animate-pulse">
                <span className="text-5xl">👂</span>
              </div>
              <div className="mt-5 text-xl font-bold text-[var(--sb-teal)]">Protection Active</div>
              <p className="text-sm text-[var(--sb-text-soft)] mt-1">Listening automatically every 1.5 seconds  no button press needed</p>

              {/* Live spectrum bars */}
              <div className="mt-6 flex items-end gap-0.5 h-20 w-full max-w-md" aria-hidden>
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-full"
                    style={{
                      height: `${h}px`,
                      background: h > 50 ? "var(--sb-coral)" : h > 25 ? "var(--sb-purple)" : "var(--sb-purple-light)",
                      opacity: 0.7 + (h / 80) * 0.3,
                      transition: "height 0.08s linear",
                    }}
                  />
                ))}
              </div>

              {/* Current detection */}
              {currentAlert && (
                <div className={`mt-6 w-full p-5 rounded-2xl border-2 ${
                  currentAlert.is_dangerous
                    ? "border-[var(--sb-coral)] bg-[var(--sb-blush)]"
                    : "border-[var(--sb-border)] bg-[var(--sb-lavender)]/30"
                }`} role="status">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{currentAlert.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-bold text-lg">{currentAlert.label}</div>
                      <div className="text-sm text-[var(--sb-text-soft)]">Confidence: {(currentAlert.confidence * 100).toFixed(0)}%</div>
                    </div>
                    {currentAlert.is_dangerous && <BellRing className="w-7 h-7 text-[var(--sb-coral)] animate-bounce" />}
                  </div>
                </div>
              )}

              {/* Notification enable reminder */}
              {"Notification" in window && Notification.permission !== "granted" && (
                <div className="mt-4 w-full p-4 rounded-2xl bg-yellow-50 border border-yellow-200 text-sm text-yellow-700 text-left">
                  <strong>Enable browser notifications</strong> so alerts pop up even when this tab is minimized.
                  <button onClick={requestNotifPermission} className="ml-3 underline font-semibold">Enable now</button>
                </div>
              )}
            </>
          )}

          {status === "denied" && (
            <>
              <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center">
                <span className="text-5xl">🚫</span>
              </div>
              <div className="mt-5 text-xl font-bold text-red-600">Microphone Access Denied</div>
              <p className="text-sm text-[var(--sb-text-soft)] mt-2 max-w-sm">
                Click the 🔒 lock icon in your browser address bar → Allow microphone → Refresh this page
              </p>
              <button onClick={() => window.location.reload()}
                className="mt-5 px-8 h-12 rounded-full bg-[var(--sb-purple)] text-white font-semibold">
                Refresh & Try Again
              </button>
            </>
          )}
        </div>

        {/* What we detect */}
        <div className="bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card">
          <div className="flex items-center gap-3 mb-5">
            <Activity className="w-5 h-5 text-[var(--sb-purple)]" />
            <h2 className="text-lg font-bold">What we detect</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(SOUND_META).map(([key, { icon, label, dangerous }]) => (
              <div key={key} className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
                dangerous ? "bg-[var(--sb-blush)] text-[var(--sb-coral)]" : "bg-[var(--sb-lavender)]/40 text-[var(--sb-text)]"
              }`}>
                <span className="text-lg">{icon}</span>
                <span className="truncate">{label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[var(--sb-text-soft)]">
            Red = dangerous alert · Grey = informational · Uses real microphone frequency analysis
          </p>
        </div>

        {/* History */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <History className="w-5 h-5 text-[var(--sb-purple)]" />
            <h2 className="text-xl font-bold">Alert history</h2>
            {history.length > 0 && (
              <button onClick={() => setHistory([])} className="ml-auto text-xs text-red-400 hover:text-red-600 font-semibold">Clear</button>
            )}
          </div>
          <div className="space-y-2" data-testid="history-list">
            {history.length === 0 && (
              <p className="text-sm text-[var(--sb-text-soft)] italic">
                No sounds detected yet. Keep this page open and SenseBridge will protect you automatically.
              </p>
            )}
            {history.map((h) => (
              <div key={h.id} className={`p-4 rounded-2xl flex items-center gap-4 ${
                h.is_dangerous ? "bg-[var(--sb-blush)]" : "bg-[var(--sb-lavender)]/30"
              }`}>
                <div className="text-2xl">{h.icon}</div>
                <div className="flex-1">
                  <div className="font-bold">{h.label}</div>
                  <div className="text-xs text-[var(--sb-text-soft)]">
                    {new Date(h.created_at).toLocaleTimeString()} · {(h.confidence * 100).toFixed(0)}% confidence
                  </div>
                </div>
                {h.is_dangerous && (
                  <span className="px-3 py-1 rounded-full bg-[var(--sb-coral)] text-white text-xs font-bold">ALERT</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}