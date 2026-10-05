import React, { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Copy, Download, Save } from "lucide-react";
import { saveTranscript } from "../api/sensebridgeApi";
import { toast } from "sonner";

export default function SpeechToText() {
  const [supported, setSupported] = useState(true);
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interim, setInterim] = useState("");
  const [bars, setBars] = useState(Array(28).fill(0.3));
  const [language, setLanguage] = useState("en-US");
  const recRef = useRef(null);
  const audioCtxRef = useRef(null);
  const rafRef = useRef(null);

  const buildRecognition = (lang) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setSupported(false); return null; }
    const r = new SR();
    r.continuous = true;
    r.interimResults = true;
    r.lang = lang;
    r.onresult = (ev) => {
      let interimT = "", finalT = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        if (res.isFinal) finalT += res[0].transcript + " ";
        else interimT += res[0].transcript;
      }
      if (finalT) setTranscript(t => (t + finalT).slice(-5000));
      setInterim(interimT);
    };
    r.onerror = (e) => {
      if (e.error === "not-allowed") {
        toast.error("Microphone permission denied. Please allow mic access.");
      } else if (e.error !== "no-speech") {
        toast.error("Speech recognition error: " + e.error);
      }
      setListening(false);
    };
    r.onend = () => {
      if (recRef.current) {
        try { recRef.current.start(); } catch {}
      }
    };
    return r;
  };

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      toast.error("Speech recognition not supported. Please use Chrome or Edge.");
    }
  }, []);

  const startVisualizer = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = { ac, stream };
      const src = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 64;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(data);
        const next = Array.from({ length: 28 }, (_, i) =>
          Math.max(0.18, (data[i % data.length] || 0) / 255)
        );
        setBars(next);
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch (e) {
      console.warn("Visualizer failed:", e);
    }
  };

  const stopVisualizer = () => {
    cancelAnimationFrame(rafRef.current);
    audioCtxRef.current?.stream?.getTracks().forEach(t => t.stop());
    try { audioCtxRef.current?.ac?.close(); } catch {}
    audioCtxRef.current = null;
    setBars(Array(28).fill(0.2));
  };

  const toggle = async () => {
    if (!supported) {
      toast.error("Use Chrome or Edge browser for speech recognition.");
      return;
    }

    if (listening) {
      setListening(false);
      try { recRef.current?.stop(); } catch {}
      recRef.current = null;
      stopVisualizer();
      setInterim("");
    } else {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        toast.error("Microphone access denied. Allow microphone in browser settings.");
        return;
      }

      const r = buildRecognition(language);
      if (!r) return;
      recRef.current = r;

      r.onend = () => {
        if (recRef.current) {
          try { recRef.current.start(); } catch {}
        }
      };

      try {
        r.start();
        setListening(true);
        startVisualizer();
        toast.success("Listening! Start speaking...");
      } catch (e) {
        toast.error("Could not start microphone: " + e.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      stopVisualizer();
      try { recRef.current?.stop(); } catch {}
      recRef.current = null;
    };
  }, []);

  const copy = () => {
    if (!transcript) { toast.error("Nothing to copy yet."); return; }
    navigator.clipboard.writeText(transcript);
    toast.success("Copied to clipboard!");
  };

  const download = () => {
    if (!transcript) { toast.error("Nothing to download yet."); return; }
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sensebridge-transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const save = async () => {
    if (!transcript.trim()) { toast.error("Nothing to save yet."); return; }
    try {
      await saveTranscript({ type: "speech-to-text", content: transcript.trim(), language });
      toast.success("Saved to your transcripts!");
    } catch {
      toast.error("Could not save. Make sure the backend is running.");
    }
  };

  const clearAll = () => {
    setTranscript("");
    setInterim("");
    toast.success("Cleared.");
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6" data-testid="speech-to-text">

      {/* LEFT: mic + visualizer */}
      <div className="lg:col-span-1 bg-gradient-to-br from-[var(--sb-blue-soft)] via-white to-[var(--sb-lavender)]/40 rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card flex flex-col items-center text-center">
        <h2 className="text-xl font-bold">Tap to listen</h2>
        <p className="text-sm text-[var(--sb-text-soft)] mt-1">We'll caption everything in real time.</p>

        {!supported && (
          <div className="mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-sm text-red-600 font-medium">
            ⚠️ Please use <strong>Chrome</strong> or <strong>Edge</strong> for speech recognition.
          </div>
        )}

        <button
          onClick={toggle}
          aria-pressed={listening}
          aria-label={listening ? "Stop listening" : "Start listening"}
          data-testid="mic-toggle"
          className={`mt-7 w-40 h-40 rounded-full text-white flex items-center justify-center transition-all sb-shadow-soft ${
            listening
              ? "bg-[var(--sb-coral)] animate-pulse"
              : "bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] hover:scale-105"
          }`}
        >
          {listening ? <MicOff className="w-16 h-16" /> : <Mic className="w-16 h-16" />}
        </button>

        <div className="mt-2 text-sm font-semibold" aria-live="polite">
          {listening ? "🔴 Listening…" : "Idle — tap to start"}
        </div>

        <div className="mt-6 flex items-end gap-1 h-16" aria-hidden>
          {bars.map((b, i) => (
            <span
              key={i}
              className="w-1.5 rounded-full bg-[var(--sb-purple)]"
              style={{
                height: `${Math.max(8, b * 64)}px`,
                opacity: 0.5 + b * 0.5,
                transition: "height 0.08s linear",
              }}
            />
          ))}
        </div>

        <div className="mt-6 w-full">
          <label className="text-xs uppercase font-bold tracking-wider text-[var(--sb-text-soft)]">Language</label>
          <select
            value={language}
            onChange={e => {
              setLanguage(e.target.value);
              if (listening) {
                try { recRef.current?.stop(); } catch {}
                recRef.current = null;
                setListening(false);
                setInterim("");
                toast("Language changed. Tap mic again to restart.");
              }
            }}
            className="mt-1 w-full h-11 rounded-xl border-2 border-[var(--sb-border)] px-3 bg-white focus:border-[var(--sb-purple)] outline-none"
            data-testid="stt-language"
          >
            <option value="en-US">English (US)</option>
            <option value="en-GB">English (UK)</option>
            <option value="hi-IN">हिन्दी</option>
            <option value="ta-IN">தமிழ்</option>
            <option value="te-IN">తెలుగు</option>
            <option value="gu-IN">ગુજરાતી</option>
          </select>
        </div>
      </div>

      {/* RIGHT: captions */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card flex flex-col">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Live captions</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--sb-text-soft)]">{transcript.length} chars</span>
            {transcript && (
              <button onClick={clearAll} className="text-xs text-red-400 hover:text-red-600 font-semibold">
                Clear
              </button>
            )}
          </div>
        </div>

        <div
          className="mt-4 min-h-[140px] p-5 rounded-2xl bg-[var(--sb-lavender)]/30 border-2 border-[var(--sb-border)]"
          aria-live="polite"
        >
          <p className="text-2xl leading-snug font-medium" data-testid="live-caption">
            {interim ? (
              <span className="text-[var(--sb-purple)]">{interim}</span>
            ) : (
              <span className="text-[var(--sb-text-soft)] italic font-normal text-base">
                {listening
                  ? "🎙️ Listening... speak now"
                  : "Tap the mic to begin. Captions will appear here in large, easy-to-read text."}
              </span>
            )}
          </p>
        </div>

        <div className="mt-4 flex-1">
          <div className="text-xs uppercase font-bold tracking-wider text-[var(--sb-text-soft)] mb-2">
            Full transcript
          </div>
          <textarea
            value={transcript}
            onChange={e => setTranscript(e.target.value)}
            placeholder="Your full transcript will build up here as you speak..."
            className="w-full min-h-[200px] p-4 rounded-2xl border-2 border-[var(--sb-border)] focus:border-[var(--sb-purple)] outline-none text-base resize-y"
            data-testid="full-transcript"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            onClick={copy}
            className="h-12 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] font-semibold flex items-center justify-center gap-2 transition-colors"
            data-testid="stt-copy"
          >
            <Copy className="w-4 h-4" /> Copy
          </button>
          <button
            onClick={download}
            className="h-12 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] font-semibold flex items-center justify-center gap-2 transition-colors"
            data-testid="stt-download"
          >
            <Download className="w-4 h-4" /> Download
          </button>
          <button
            onClick={save}
            className="h-12 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            data-testid="stt-save"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>
    </div>
  );
}