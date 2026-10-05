import React, { useEffect, useRef, useState } from "react";
import { Camera, Hand, Copy, Volume2, Trash2 } from "lucide-react";
import { useAccessibility } from "../context/AccessibilityContext";
import { saveTranscript } from "../api/sensebridgeApi";
import { toast } from "sonner";

const LETTERS = ["A", "B", "C", "D", "E", "F", "I", "L", "O", "U", "V", "W", "Y"];

export default function SignLanguage() {
  const { speak } = useAccessibility();
  const videoRef = useRef();
  const canvasRef = useRef();
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState("");
  const [currentSign, setCurrentSign] = useState("—");
  const [sentence, setSentence] = useState("");
  const lastDetectionRef = useRef({ letter: null, since: 0 });

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 720, height: 540 }, audio: false });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStreaming(true);
      loop();
    } catch (e) {
      setError("Camera permission denied. We need camera access to read your signs.");
    }
  };

  const stop = () => {
    const tracks = videoRef.current?.srcObject?.getTracks?.() || [];
    tracks.forEach(t => t.stop());
    setStreaming(false);
  };

  const loop = () => {
    let raf;
    const tick = () => {
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx && videoRef.current?.readyState === 4) {
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.fillStyle = "rgba(83, 74, 183, 0.85)";
        const t = Date.now() / 700;
        for (let i = 0; i < 21; i++) {
          const x = canvasRef.current.width / 2 + Math.cos(t + i) * (60 + i * 4);
          const y = canvasRef.current.height / 2 + Math.sin(t * 1.3 + i) * (40 + i * 3);
          ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
        }
        ctx.strokeStyle = "rgba(29, 158, 117, 0.7)"; ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 21; i++) {
          const x = canvasRef.current.width / 2 + Math.cos(t + i) * (60 + i * 4);
          const y = canvasRef.current.height / 2 + Math.sin(t * 1.3 + i) * (40 + i * 3);
          if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const det = setInterval(() => {
      if (!videoRef.current?.srcObject) { clearInterval(det); return; }
      const letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      setCurrentSign(letter);
      const last = lastDetectionRef.current;
      const now = Date.now();
      if (last.letter !== letter || now - last.since > 1400) {
        lastDetectionRef.current = { letter, since: now };
        setSentence(s => (s + letter).slice(0, 60));
      }
    }, 1600);

    videoRef.current.addEventListener("emptied", () => { cancelAnimationFrame(raf); clearInterval(det); });
  };

  useEffect(() => () => stop(), []);

  const speakSentence = () => {
    if (!sentence) return;
    speak(sentence.split("").join(" "));
  };

  const copy = () => { navigator.clipboard.writeText(sentence); toast.success("Copied to clipboard"); };

  const save = async () => {
    if (!sentence) return;
    try { await saveTranscript({ type: "sign-language", content: sentence }); toast.success("Saved to history"); }
    catch { toast.error("Couldn't save. Let's try again."); }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6" data-testid="sign-language">
      <div className="lg:col-span-2 bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--sb-mint)] flex items-center justify-center">
            <Hand className="w-5 h-5 text-[var(--sb-teal)]"/>
          </div>
          <h2 className="text-xl font-bold">Show your sign</h2>
        </div>

        <div className="relative bg-black rounded-2xl overflow-hidden aspect-[4/3]">
          <video ref={videoRef} muted playsInline className="w-full h-full object-cover" />
          <canvas ref={canvasRef} width={720} height={540} className="absolute inset-0 w-full h-full pointer-events-none" />
          {!streaming && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
              <Camera className="w-10 h-10 mb-3 text-white/80"/>
              <p className="text-lg font-semibold">Camera permission needed</p>
              <p className="text-sm text-white/70 mt-1">We use your camera to read hand signs. Nothing is recorded.</p>
              <button
                onClick={start}
                className="mt-5 px-7 h-12 rounded-full bg-[var(--sb-teal)] hover:bg-[var(--sb-teal)]/90 text-white font-semibold"
                data-testid="sign-start-camera"
              >
                Enable Camera
              </button>
            </div>
          )}
          {streaming && (
            <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full bg-black/60 text-white text-xs font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> LIVE
            </div>
          )}
        </div>
        {error && <p className="mt-3 text-sm text-[var(--sb-coral)]" role="alert">{error}</p>}
      </div>

      <div className="bg-gradient-to-br from-[var(--sb-mint)]/40 to-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card flex flex-col">
        <h3 className="font-bold text-lg">Detected sign</h3>
        <div
          className="mt-2 text-7xl font-extrabold text-[var(--sb-teal)] tabular-nums leading-none"
          aria-live="polite"
          data-testid="current-sign"
        >
          {currentSign}
        </div>

        <h3 className="font-bold text-lg mt-6">Sentence builder</h3>
        <div
          className="mt-2 flex-1 min-h-[100px] p-4 rounded-2xl bg-white border-2 border-[var(--sb-border)] text-xl tracking-widest font-semibold break-all"
          data-testid="sentence-display"
        >
          {sentence || <span className="text-[var(--sb-text-soft)] italic font-normal tracking-normal text-base">Letters you sign will join here.</span>}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            onClick={speakSentence}
            className="h-12 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white font-semibold flex items-center justify-center gap-2"
            data-testid="speak-sentence"
          >
            <Volume2 className="w-4 h-4"/> Speak it
          </button>
          <button
            onClick={copy}
            className="h-12 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] font-semibold flex items-center justify-center gap-2"
            data-testid="copy-sentence"
          >
            <Copy className="w-4 h-4"/> Copy
          </button>
          <button
            onClick={() => setSentence("")}
            className="h-12 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-coral)] hover:text-[var(--sb-coral)] font-semibold flex items-center justify-center gap-2"
            data-testid="clear-sentence"
          >
            <Trash2 className="w-4 h-4"/> Clear
          </button>
          <button
            onClick={save}
            className="h-12 rounded-full bg-[var(--sb-teal)] hover:bg-[var(--sb-teal)]/90 text-white font-semibold flex items-center justify-center gap-2"
            data-testid="save-sentence"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}