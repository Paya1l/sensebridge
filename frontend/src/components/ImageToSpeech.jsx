import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImageIcon, Play, Pause, Square, Volume2, Camera, Loader2, Sparkles, Send } from "lucide-react";
import { describeImage } from "../api/sensebridgeApi";
import { toast } from "sonner";

export default function ImageToSpeech() {
  const [imageData, setImageData] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [rate, setRate] = useState(1);
  const [question, setQuestion] = useState("");
  const camRef = useRef();

  const handleFile = useCallback((file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageData(reader.result);
      setPreview(reader.result);
      setDescription("");
      toast.success("Image loaded! Click 'Describe Image' to hear it.");
    };
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((files) => handleFile(files[0]), [handleFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const speakText = (text) => {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  };

  const describe = async (followUp = null) => {
    if (!imageData) {
      toast.error("Please upload an image first.");
      return;
    }

    setLoading(true);
    toast("Analyzing your image... (may take up to 30s if retrying)");

    try {
      const res = await describeImage(imageData, followUp);
      setDescription(res.description);
      speakText(res.description);
      toast.success("Description ready!");
    } catch (e) {
      // ✅ Better error messages based on error type
      const detail = e?.response?.data?.detail || e?.message || "";
      if (detail.includes("429") || detail.toLowerCase().includes("quota") || detail.toLowerCase().includes("rate")) {
        toast.error("Rate limit reached. Please wait a minute and try again.");
      } else if (detail.includes("API_KEY_INVALID") || detail.includes("expired")) {
        toast.error("API key is invalid or expired. Please update your .env file.");
      } else if (detail.includes("API key not configured")) {
        toast.error("Gemini API key missing. Add GEMINI_API_KEY to your backend .env file.");
      } else {
        toast.error("Could not describe image. Make sure the backend is running and your API key is set.");
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePlay = () => {
    if (!description) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    } else {
      speakText(description);
    }
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6" data-testid="image-to-speech">

      {/* LEFT: upload */}
      <div className="bg-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--sb-lavender)] flex items-center justify-center">
            <ImageIcon className="w-5 h-5 text-[var(--sb-purple)]" />
          </div>
          <h2 className="text-xl font-bold">Upload an image</h2>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all min-h-[260px] flex flex-col items-center justify-center ${
            isDragActive
              ? "border-[var(--sb-purple)] bg-[var(--sb-lavender)]/60"
              : "border-[var(--sb-border)] hover:border-[var(--sb-purple)] hover:bg-[var(--sb-lavender)]/30"
          }`}
          data-testid="image-dropzone"
        >
          <input {...getInputProps()} data-testid="image-file-input" />
          {preview ? (
            <img
              src={preview}
              alt="Uploaded preview"
              className="max-h-56 rounded-xl object-contain"
            />
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-[var(--sb-lavender)] flex items-center justify-center mb-3">
                <ImageIcon className="w-7 h-7 text-[var(--sb-purple)]" />
              </div>
              <p className="font-semibold">Drag & drop your image here</p>
              <p className="text-sm text-[var(--sb-text-soft)] mt-1">or click to upload · JPG, PNG, WEBP</p>
            </>
          )}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={() => camRef.current?.click()}
            className="flex-1 h-12 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] font-semibold flex items-center justify-center gap-2 transition-colors"
            data-testid="use-camera-btn"
          >
            <Camera className="w-4 h-4" /> Use Camera
          </button>
          <input
            ref={camRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={e => handleFile(e.target.files?.[0])}
          />
          <button
            onClick={() => describe()}
            disabled={loading || !imageData}
            className="flex-1 h-12 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] disabled:opacity-50 text-white font-semibold flex items-center justify-center gap-2 transition-all"
            data-testid="describe-btn"
          >
            {loading
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Looking...</>
              : <><Sparkles className="w-4 h-4" /> Describe Image</>
            }
          </button>
        </div>
      </div>

      {/* RIGHT: description */}
      <div className="bg-gradient-to-br from-[var(--sb-lavender)]/50 to-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-[var(--sb-purple)]" />
          </div>
          <h2 className="text-xl font-bold">Description</h2>
        </div>

        <div
          className="flex-1 min-h-[200px] bg-white rounded-2xl p-5 border border-[var(--sb-border)]"
          aria-live="polite"
          data-testid="description-area"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-[var(--sb-text-soft)]">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--sb-purple)]" />
              <p className="text-sm italic">Describing your image...</p>
            </div>
          ) : description ? (
            <p className="text-lg leading-relaxed">{description}</p>
          ) : (
            <p className="text-[var(--sb-text-soft)] italic">
              Your description will appear here. Upload an image and let SenseBridge speak it to you.
            </p>
          )}
        </div>

        {description && (
          <>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white flex items-center justify-center transition-all"
                aria-label={speaking ? "Pause" : "Play"}
                data-testid="play-pause-btn"
              >
                {speaking ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={stopSpeaking}
                className="w-12 h-12 rounded-full bg-white border-2 border-[var(--sb-border)] hover:border-[var(--sb-purple)] flex items-center justify-center transition-colors"
                aria-label="Stop"
                data-testid="stop-btn"
              >
                <Square className="w-4 h-4" />
              </button>
              <div className="flex-1 flex items-center gap-2">
                <span className="text-xs font-semibold text-[var(--sb-text-soft)]">Speed</span>
                <input
                  type="range" min="0.5" max="2" step="0.1"
                  value={rate}
                  onChange={e => setRate(parseFloat(e.target.value))}
                  className="flex-1 accent-[var(--sb-purple)]"
                  aria-label="Speech rate"
                  data-testid="rate-slider"
                />
                <span className="text-xs font-bold tabular-nums w-10 text-right">{rate.toFixed(1)}x</span>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (question.trim()) {
                  describe(question);
                  setQuestion("");
                }
              }}
              className="mt-4 flex gap-2"
            >
              <input
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask more: e.g. What colors are in this image?"
                className="flex-1 h-12 rounded-full border-2 border-[var(--sb-border)] px-5 focus:border-[var(--sb-purple)] outline-none text-sm"
                aria-label="Follow-up question"
                data-testid="followup-input"
              />
              <button
                type="submit"
                className="w-12 h-12 rounded-full bg-[var(--sb-teal)] hover:opacity-90 text-white flex items-center justify-center transition-opacity"
                aria-label="Send follow-up"
                data-testid="followup-send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}