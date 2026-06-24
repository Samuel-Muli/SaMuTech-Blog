import React, { useState } from "react";

// Shared by Sidebar and Footer. `variant` controls styling only — both
// call the same /api/subscribe endpoint, which stores the email in
// MongoDB (and optionally emails a notification, see mailer.js).
const SubscribeForm = ({ variant = "light" }) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    try {
      const result = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const body = await result.json().catch(() => ({}));

      if (!result.ok) {
        throw new Error(body?.message || "Couldn't subscribe right now. Please try again.");
      }

      setStatus("success");
      setMessage(body?.message || "You're on the list — thanks!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  if (status === "success") {
    return <p className="text-sm font-medium text-teal">{message}</p>;
  }

  const isDark = variant === "dark";

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="space-y-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className={
            isDark
              ? "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber/50"
              : "w-full rounded-lg border border-border bg-paper px-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber"
          }
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className={
            isDark
              ? "w-full rounded-lg bg-amber px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-light transition-colors disabled:opacity-60"
              : "w-full rounded-lg bg-ink px-3 py-2.5 text-sm font-semibold text-white hover:bg-ink-soft transition-colors disabled:opacity-60"
          }
        >
          {status === "submitting" ? "Subscribing..." : "Subscribe"}
        </button>
      </form>
      {status === "error" && <p className="text-xs text-red-600">{message}</p>}
    </div>
  );
};

export default SubscribeForm;
