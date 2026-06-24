import { useState } from "react";
import React from "react";

const AddCommentForm = ({ articleName, hasCommented, onUpdate, onAlreadyCommented, onPosted }) => {
  const [username, setUsername] = useState("");
  const [commentText, setCommentText] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error | success
  const [errorMessage, setErrorMessage] = useState("");

  const addComment = async (event) => {
    event.preventDefault();
    if (!username.trim() || !commentText.trim()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const result = await fetch(`/api/articles/${articleName}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), text: commentText.trim() }),
      });
      const body = await result.json().catch(() => ({}));

      if (result.status === 409) {
        // Someone already commented from this device — not a failure,
        // just settle into the "already commented" state without
        // touching the comments already loaded on the page.
        setStatus("idle");
        onAlreadyCommented?.();
        return;
      }

      if (!result.ok) {
        throw new Error(body?.message || "Comments are temporarily unavailable.");
      }

      setUsername("");
      setCommentText("");
      setStatus("success");
      onUpdate(body);
      onPosted?.();
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
      setErrorMessage("Comments are temporarily unavailable. Please try again later.");
    }
  };

  if (hasCommented && status !== "success") {
    return (
      <div className="mx-auto max-w-xl text-center rounded-2xl border border-border bg-white px-6 py-6 shadow-card">
        <p className="text-sm font-medium text-teal">
          You've already commented on this article — thanks for joining the discussion!
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl relative">
      <form
        onSubmit={addComment}
        className={`bg-white shadow-card rounded-2xl px-6 py-6 sm:px-8 border border-border text-center transition ${
          status === "error" ? "opacity-40 blur-[1px] pointer-events-none" : ""
        }`}
      >
        <p className="eyebrow mb-2">{"// add yours"}</p>
        <h3 className="text-xl font-display font-semibold mb-4 text-ink">Add a comment</h3>

        <div className="text-left">
          <label className="block text-sm font-medium text-ink mb-2">Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-border bg-paper px-4 py-3 text-ink focus:border-amber focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber/30"
            placeholder="Your name"
          />

          <label className="block text-sm font-medium text-ink mt-4 mb-2">Comment</label>
          <textarea
            rows="5"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full rounded-lg border border-border bg-paper px-4 py-3 text-ink focus:border-amber focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber/30"
            placeholder="Write your comment here"
          />
        </div>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="mt-5 mx-auto block items-center justify-center rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-light focus:outline-none focus:ring-2 focus:ring-amber/50 focus:ring-offset-2 disabled:opacity-60"
        >
          {status === "submitting" ? "Posting..." : "Post comment"}
        </button>

        {status === "success" && (
          <p className="mt-3 text-sm font-medium text-teal">Comment posted!</p>
        )}
      </form>

      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <div className="rounded-xl border border-red-200 bg-white px-5 py-3 text-sm text-red-700 shadow-lg text-center">
            {errorMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCommentForm;
