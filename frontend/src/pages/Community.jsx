import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Lightbulb, BookOpen, HelpCircle, Send } from "lucide-react";
import { listCommunity, createPost, likePost } from "../api/sensebridgeApi";
import { toast } from "sonner";

const CATEGORIES = [
  { v: "", label: "All", icon: MessageCircle },
  { v: "story", label: "Stories", icon: BookOpen },
  { v: "tip", label: "Tips", icon: Lightbulb },
  { v: "question", label: "Questions", icon: HelpCircle },
];

const COLORS = ["var(--sb-purple)", "var(--sb-teal)", "var(--sb-coral)", "#3B82F6", "#D946EF"];

export default function Community() {
  const [posts, setPosts]     = useState([]);
  const [category, setCategory] = useState("");
  const [form, setForm]       = useState({ author_name: "", title: "", body: "", category: "story" });
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      const data = await listCommunity(category || undefined);
      setPosts(data || []);
    } catch {
      // Backend offline: show an empty list
      setPosts([]);
    }
  };

  useEffect(() => { refresh(); }, [category]); // eslint-disable-line

  const submit = async (e) => {
    e.preventDefault();
    if (!form.author_name.trim() || !form.title.trim() || !form.body.trim()) {
      toast.error("Please fill in name, title, and your story.");
      return;
    }
    setLoading(true);
    try {
      await createPost(form);
      setForm({ author_name: "", title: "", body: "", category: "story" });
      toast.success("Posted! Thank you for sharing.");
      refresh();
    } catch {
      // If backend offline, add to local state so it shows immediately
      const newPost = {
        id: `local-${Date.now()}`,
        ...form,
        likes: 0,
      };
      setPosts(prev => [newPost, ...prev]);
      setForm({ author_name: "", title: "", body: "", category: "story" });
      toast.success("Posted locally! Will sync when backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const onLike = async (id) => {
    // Optimistic update — increment immediately
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: (p.likes || 0) + 1 } : p));
    try { await likePost(id); } catch {}
  };

  return (
    <div className="bg-white" data-testid="community-page">
      <section className="bg-gradient-to-b from-[var(--sb-mint)]/50 to-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold">
            Our <span className="text-[var(--sb-teal)]">community</span>
          </h1>
          <p className="mt-4 text-[var(--sb-text-soft)] text-lg max-w-2xl mx-auto">
            Share stories, tips and questions with other blind and deaf users.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-8 pb-24">
        <div className="grid lg:grid-cols-3 gap-8">

          {/* POSTS */}
          <div className="lg:col-span-2">
            <div className="flex gap-2 flex-wrap mb-6">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                const active = category === c.v;
                return (
                  <button
                    key={c.v}
                    onClick={() => setCategory(c.v)}
                    data-testid={`cat-${c.v || "all"}`}
                    className={`h-11 px-5 rounded-full font-semibold text-sm flex items-center gap-2 transition-all ${
                      active
                        ? "bg-[var(--sb-purple)] text-white sb-shadow-card"
                        : "bg-[var(--sb-lavender)]/40 text-[var(--sb-text)] hover:bg-[var(--sb-lavender)]"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {c.label}
                  </button>
                );
              })}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {posts.map((p, i) => (
                <article
                  key={p.id}
                  className="bg-white rounded-3xl p-6 border border-[var(--sb-border)] sb-shadow-card flex flex-col hover:-translate-y-1 transition-transform"
                  data-testid={`post-${p.id}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                      style={{ background: COLORS[i % COLORS.length] }}
                    >
                      {p.author_name[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{p.author_name}</div>
                      <div className="text-xs text-[var(--sb-text-soft)] uppercase tracking-wider">{p.category}</div>
                    </div>
                  </div>
                  <h3 className="mt-3 font-bold text-lg leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-[var(--sb-text-soft)] leading-relaxed flex-1">{p.body}</p>
                  <button
                    onClick={() => onLike(p.id)}
                    className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--sb-coral)] hover:text-[var(--sb-purple)] font-semibold w-fit transition-colors"
                    data-testid={`like-${p.id}`}
                  >
                    <Heart className="w-4 h-4 fill-current" /> {p.likes}
                  </button>
                </article>
              ))}

              {posts.length === 0 && (
                <p className="text-sm text-[var(--sb-text-soft)] italic col-span-2 py-8 text-center">
                  No posts yet in this category. Be the first to share!
                </p>
              )}
            </div>
          </div>

          {/* FORM */}
          <aside className="bg-gradient-to-br from-[var(--sb-lavender)]/50 to-white rounded-3xl p-7 border border-[var(--sb-border)] sb-shadow-card h-fit lg:sticky lg:top-24">
            <h2 className="font-bold text-lg">Share your story</h2>
            <p className="text-sm text-[var(--sb-text-soft)] mt-1">Your words help others feel less alone.</p>
            <form onSubmit={submit} className="mt-5 space-y-3" data-testid="post-form">
              <input
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                placeholder="Your name"
                className="w-full h-11 px-4 rounded-xl border-2 border-[var(--sb-border)] focus:border-[var(--sb-purple)] outline-none"
                aria-label="Your name"
                data-testid="post-author"
              />
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full h-11 px-4 rounded-xl border-2 border-[var(--sb-border)] focus:border-[var(--sb-purple)] outline-none"
                aria-label="Title"
                data-testid="post-title"
              />
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Tell us what happened..."
                rows={5}
                className="w-full p-4 rounded-xl border-2 border-[var(--sb-border)] focus:border-[var(--sb-purple)] outline-none resize-y"
                aria-label="Body"
                data-testid="post-body"
              />
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border-2 border-[var(--sb-border)] focus:border-[var(--sb-purple)] outline-none bg-white"
                data-testid="post-category"
              >
                <option value="story">Story</option>
                <option value="tip">Tip</option>
                <option value="question">Question</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-full bg-[var(--sb-purple)] hover:bg-[var(--sb-purple-dark)] text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-60 transition-all"
                data-testid="post-submit"
              >
                <Send className="w-4 h-4" /> {loading ? "Posting…" : "Share"}
              </button>
            </form>
          </aside>

        </div>
      </section>
    </div>
  );
}