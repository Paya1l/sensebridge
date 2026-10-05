import React, { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Square, SkipForward, Volume2, Upload, Type } from "lucide-react";
import { toast } from "sonner";

export default function TextToSpeech() {
  const [text, setText] = useState(
    "Welcome to SenseBridge. Paste any article, story, or document here, and I will read it aloud in a warm, natural voice. You can also click any word below to start reading from that point."
  );
  const [voices, setVoices] = useState([]);
  const [voiceUri, setVoiceUri] = useState("");
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [language, setLanguage] = useState("en");
  const fileRef = useRef();
  const utteranceRef = useRef(null);

  useEffect(() => {
    const load = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) {
        setVoices(v);
        if (!voiceUri) {
          const preferred =
            v.find(x => x.lang.startsWith("en") && /female|zira|samantha|google/i.test(x.name)) ||
            v.find(x => x.lang.startsWith("en")) ||
            v[0];
          setVoiceUri(preferred?.voiceURI || "");
        }
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = (startFrom = 0) => {
    if (!text.trim()) { toast.error("Please enter some text first."); return; }
    window.speechSynthesis.cancel();

    const chunk = text.slice(startFrom);
    const u = new SpeechSynthesisUtterance(chunk);
    u.rate = rate;
    u.pitch = pitch;

    const v = voices.find(x => x.voiceURI === voiceUri);
    if (v) u.voice = v;

    u.onstart = () => { setSpeaking(true); setPaused(false); };
    u.onend = () => { setSpeaking(false); setPaused(false); };
    u.onerror = (e) => {
      if (e.error !== "interrupted") {
        toast.error("Speech error: " + e.error);
      }
      setSpeaking(false);
      setPaused(false);
    };

    utteranceRef.current = u;
    window.speechSynthesis.speak(u);
  };

  const togglePlay = () => {
    if (!speaking && !paused) {
      speak(0);
    } else if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setPaused(false);
  };

  const skipForward = () => {
    const charsPerSec = 18 * rate;
    speak(Math.floor(charsPerSec * 10));
  };

  const onFile = async (file) => {
    if (!file) return;
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const t = await file.text();
      setText(t.slice(0, 20000));
      toast.success("File loaded! Click Play to listen.");
    } else {
      toast.error("Please upload a .txt file.");
    }
  };

  const handleWordClick = (e) => {
    const node = e.target;
    if (node.dataset?.idx == null) return;
    const idx = parseInt(node.dataset.idx, 10);
    speak(idx);
    toast.success("Reading from here...");
  };

  const renderedWords = useMemo(() => {
    const out = [];
    let i = 0;
    text.split(/(\s+)/).forEach((w, k) => {
      if (/\s+/.test(w)) {
        out.push(<span key={k}>{w}</span>);
        i += w.length;
      } else {
        out.push(
          <span
            key={k}
            data-idx={i}
            className="hover:bg-[var(--sb-lavender)] cursor-pointer rounded px-0.5 transition-colors"
          >
            {w}
          </span>
        );
        i += w.length;
      }
    });
    return out;
  }, [text]);

  const filteredVoices = voices.filter(v => v.lang.startsWith(language));
  const displayVoices = filteredVoices.length ? filteredVoices : voices;

  return (
    <div className="grid lg:grid-cols-3 gap-6" data-testid="text-to-speech">

      {/* LEFT: text input */}
      <div className="lg:col-span-2 bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--sb-blue-soft)] flex items-center justify-center">
            <Type className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold">Your text</h2>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste or type anything here and press Play..."
          className="w-full min-h-[220px] p-4 rounded-2xl border-2 border-[var(--sb-border)] focus:border-[var(--sb-purple)] outline-none text-lg leading-relaxed resize-y"
          aria-label="Text to read aloud"
          data-testid="tts-textarea"
        />

        <div className="mt-2 text-xs text-[var(--sb-text-soft)] flex justify-between items-center">
          <span>{text.length.toLocaleString()} characters</span>
          <button
            onClick={() => fileRef.current?.click()}
            className="font-semibold text-[var(--sb-purple)] hover:underline inline-flex items-center gap-1"
            data-testid="tts-upload-btn"
          >
            <Upload className="w-3 h-3" /> Upload .txt file
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,text/plain"
            hidden
            onChange={e => onFile(e.target.files?.[0])}
          />
        </div>

        {/* Clickable word reader */}
        <div
          className="mt-5 p-4 rounded-2xl bg-[var(--sb-lavender)]/40 max-h-48 overflow-auto"
          onClick={handleWordClick}
          data-testid="tts-highlightable"
        >
          <div className="text-xs uppercase font-bold tracking-wider text-[var(--sb-text-soft)] mb-2">
            Click any word to start reading from there
          </div>
          <p className="leading-relaxed text-[15px]">{renderedWords}</p>
        </div>

        <button
          onClick={() => {
            setText("This is SenseBridge. Your AI-powered accessibility platform. We make sure nothing passes you by.");
            setTimeout(() => speak(0), 100);
          }}
          className="mt-3 text-xs text-[var(--sb-teal)] hover:underline font-semibold"
        >
          Try a sample sentence
        </button>
      </div>

      {/* RIGHT: controls */}
      <div className="bg-gradient-to-br from-[var(--sb-lavender)]/50 to-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <Volume2 className="w-5 h-5 text-[var(--sb-purple)]" />
          <h3 className="font-bold">Playback</h3>
        </div>

        <div className={`mb-4 text-center text-sm font-semibold px-3 py-2 rounded-xl ${
          speaking && !paused
            ? "bg-green-50 text-green-600"
            : paused
            ? "bg-yellow-50 text-yellow-600"
            : "bg-[var(--sb-lavender)]/40 text-[var(--sb-text-soft)]"
        }`}>
          {speaking && !paused ? "Reading aloud..." : paused ? "Paused" : "Press Play to listen"}
        </div>

        <div className="flex items-center justify-center gap-3 my-4">
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white flex items-center justify-center sb-shadow-soft transition-all hover:scale-105"
            aria-label={speaking && !paused ? "Pause" : "Play"}
            data-testid="tts-play-pause"
          >
            {speaking && !paused ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
          </button>
          <button
            onClick={stop}
            className="w-12 h-12 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] flex items-center justify-center transition-colors"
            aria-label="Stop"
            data-testid="tts-stop"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={skipForward}
            className="w-12 h-12 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] flex items-center justify-center transition-colors"
            aria-label="Skip forward"
            data-testid="tts-skip"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[var(--sb-text-soft)]">Language</label>
            <select
              value={language}
              onChange={e => { setLanguage(e.target.value); stop(); }}
              className="mt-1 w-full h-11 rounded-xl border-2 border-[var(--sb-border)] px-3 bg-white focus:border-[var(--sb-purple)] outline-none"
              data-testid="tts-language"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="gu">ગુજરાતી</option>
              <option value="ta">தமிழ்</option>
              <option value="te">తెలుగు</option>
            </select>
          </div>

          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[var(--sb-text-soft)]">Voice</label>
            <select
              value={voiceUri}
              onChange={e => { setVoiceUri(e.target.value); stop(); }}
              className="mt-1 w-full h-11 rounded-xl border-2 border-[var(--sb-border)] px-3 bg-white focus:border-[var(--sb-purple)] outline-none"
              data-testid="tts-voice"
            >
              {displayVoices.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[var(--sb-text-soft)]">
              Speed · {rate.toFixed(1)}x
            </label>
            <input
              type="range" min="0.5" max="2" step="0.1"
              value={rate}
              onChange={e => setRate(parseFloat(e.target.value))}
              className="mt-2 w-full accent-[var(--sb-purple)]"
              data-testid="tts-rate"
            />
          </div>

          <div>
            <label className="text-xs uppercase font-bold tracking-wider text-[var(--sb-text-soft)]">
              Pitch · {pitch.toFixed(1)}
            </label>
            <input
              type="range" min="0.5" max="2" step="0.1"
              value={pitch}
              onChange={e => setPitch(parseFloat(e.target.value))}
              className="mt-2 w-full accent-[var(--sb-purple)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}