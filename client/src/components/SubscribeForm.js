import React, { useState } from "react";

// Shared by Sidebar and Footer. `variant` controls styling only — both
// call the same /api/subscribe endpoint, which stores the email in
// MongoDB (and optionally emails a notification, see mailer.js).
const SubscribeForm = ({ variant = "light" }) => {
  const isDark = variant === "dark";
  const [mode, setMode] = useState("subscribe"); // subscribe | unsubscribe
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | unavailable | error
  const [message, setMessage] = useState("");

  const switchMode = (next) => {
    setMode(next);
    setStatus("idle");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    try {
      const result = await fetch("/api/subscribe", {
        method: mode === "subscribe" ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const body = await result.json().catch(() => ({}));

      // A 5xx here means the database is unreachable — show a calm,
      // human message instead of whatever the server actually said.
      if (result.status >= 500) {
        setStatus("unavailable");
        setMessage("This feature isn't available right now — please try again later.");
        setTimeout(() => setStatus("idle"), 6000);
        return;
      }

      if (!result.ok) {
        setStatus("error");
        setMessage(body?.message || "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage(
        body?.message || (mode === "subscribe" ? "You're on the list — thanks!" : "You've been unsubscribed.")
      );
      setEmail("");
    } catch (err) {
      // Network failure — same friendly treatment as a 5xx.
      setStatus("unavailable");
      setMessage("This feature isn't available right now — please try again later.");
      setTimeout(() => setStatus("idle"), 6000);
    }
  };

  const toggleLinkClass = isDark
    ? "font-mono text-[11px] text-slate-500 hover:text-white underline transition-colors"
    : "font-mono text-[11px] text-slate-400 hover:text-ink underline transition-colors";

  if (status === "success") {
    return (
      <div className="space-y-2">
        <p className="text-sm font-medium text-teal">{message}</p>
        <button type="button" onClick={() => switchMode(mode === "subscribe" ? "unsubscribe" : "subscribe")} className={toggleLinkClass}>
          {mode === "subscribe" ? "Change your mind? Unsubscribe" : "Subscribe again"}
        </button>
      </div>
    );
  }

  const inputClass = isDark
    ? "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber/50"
    : "w-full rounded-lg border border-border bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber";

  const buttonClass =
    mode === "subscribe"
      ? isDark
        ? "w-full rounded-lg bg-amber px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-light transition-colors disabled:opacity-60"
        : "w-full rounded-lg bg-ink px-3 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft transition-colors disabled:opacity-60"
      : "w-full rounded-lg border border-border bg-transparent px-3 py-2.5 text-sm font-semibold text-muted hover:border-red-300 hover:text-red-600 transition-colors disabled:opacity-60";

  return (
    <div className="space-y-2">
      <div className={`transition ${status === "unavailable" ? "opacity-50 grayscale pointer-events-none" : ""}`}>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className={inputClass}
          />
          <button type="submit" disabled={status === "submitting"} className={buttonClass}>
            {status === "submitting"
              ? mode === "subscribe" ? "Subscribing..." : "Unsubscribing..."
              : mode === "subscribe" ? "Subscribe" : "Unsubscribe"}
          </button>
        </form>
      </div>

      {status === "unavailable" && <p className="text-xs text-red-500">{message}</p>}
      {status === "error" && <p className="text-xs text-red-600">{message}</p>}

      <button type="button" onClick={() => switchMode(mode === "subscribe" ? "unsubscribe" : "subscribe")} className={toggleLinkClass}>
        {mode === "subscribe" ? "Already subscribed? Unsubscribe" : "Want to subscribe instead?"}
      </button>
    </div>
  );
};

export default SubscribeForm;
