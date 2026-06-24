import React, { useState } from "react";

const HeartIcon = ({ filled, ...props }) => (
  <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
  </svg>
);

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
  } catch {
    return "";
  }
};

const callApi = async (url, options) => {
  const result = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
  });
  const body = await result.json().catch(() => ({}));
  if (!result.ok) {
    throw new Error(body?.message || "Something went wrong. Please try again.");
  }
  return body;
};

const ActionButton = ({ onClick, busy, children, className = "" }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={busy}
    className={`font-mono text-xs text-muted hover:text-ink disabled:opacity-50 transition-colors ${className}`}
  >
    {children}
  </button>
);

const CommentItem = ({ comment, articleName, parentId, onUpdate, onError, isReply }) => {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyUsername, setReplyUsername] = useState("");
  const [replyText, setReplyText] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [busy, setBusy] = useState(false);

  const run = async (fn) => {
    setBusy(true);
    try {
      const updated = await fn();
      onUpdate(updated);
    } catch (err) {
      onError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleLike = () =>
    run(() =>
      callApi(`/api/articles/${articleName}/comments/${comment.id}/like`, { method: "POST" })
    );

  const handleSaveEdit = () => {
    if (!editText.trim()) return;
    run(async () => {
      const updated = await callApi(`/api/articles/${articleName}/comments/${comment.id}`, {
        method: "PUT",
        body: JSON.stringify({ text: editText.trim() }),
      });
      setEditing(false);
      return updated;
    });
  };

  const handleDelete = () =>
    run(() => callApi(`/api/articles/${articleName}/comments/${comment.id}`, { method: "DELETE" }));

  const handleReply = () => {
    if (!replyUsername.trim() || !replyText.trim()) return;
    run(async () => {
      const updated = await callApi(`/api/articles/${articleName}/comments/${comment.id}/replies`, {
        method: "POST",
        body: JSON.stringify({ username: replyUsername.trim(), text: replyText.trim() }),
      });
      setShowReplyForm(false);
      setReplyUsername("");
      setReplyText("");
      return updated;
    });
  };

  return (
    <div className={isReply ? "pl-5 border-l-2 border-border" : ""}>
      <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
        <div className="flex items-center justify-between gap-4">
          <h4 className="text-base font-semibold text-ink">{comment.username}</h4>
          <span className="font-mono text-xs text-slate-400">
            {formatDate(comment.createdAt)}
            {comment.editedAt && " · edited"}
          </span>
        </div>

        {editing ? (
          <div className="mt-3">
            <textarea
              rows="3"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber"
            />
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={busy}
                className="font-mono text-xs text-white bg-amber px-3 py-1.5 rounded-full hover:bg-amber-light disabled:opacity-50"
              >
                Save
              </button>
              <ActionButton onClick={() => { setEditing(false); setEditText(comment.text); }}>
                Cancel
              </ActionButton>
            </div>
          </div>
        ) : (
          <p className="mt-3 text-ink/80 leading-relaxed">{comment.text}</p>
        )}

        <div className="mt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={handleLike}
            disabled={busy}
            className={`flex items-center gap-1.5 font-mono text-xs transition-colors disabled:opacity-50 ${
              comment.likedByMe ? "text-amber" : "text-muted hover:text-ink"
            }`}
          >
            <HeartIcon filled={comment.likedByMe} className="w-3.5 h-3.5" />
            {comment.likes > 0 ? comment.likes : "Like"}
          </button>

          {!isReply && (
            <ActionButton onClick={() => setShowReplyForm((v) => !v)} busy={busy}>
              Reply
            </ActionButton>
          )}

          {comment.isMine && !editing && (
            <>
              <ActionButton onClick={() => setEditing(true)} busy={busy}>
                Edit
              </ActionButton>
              {confirmingDelete ? (
                <span className="flex items-center gap-2 font-mono text-xs">
                  <span className="text-muted">Delete?</span>
                  <button onClick={handleDelete} disabled={busy} className="text-red-600 hover:text-red-700">
                    Yes
                  </button>
                  <button onClick={() => setConfirmingDelete(false)} className="text-muted hover:text-ink">
                    No
                  </button>
                </span>
              ) : (
                <ActionButton onClick={() => setConfirmingDelete(true)} busy={busy} className="hover:text-red-600">
                  Delete
                </ActionButton>
              )}
            </>
          )}
        </div>

        {showReplyForm && (
          <div className="mt-4 pt-4 border-t border-border space-y-2">
            <input
              type="text"
              value={replyUsername}
              onChange={(e) => setReplyUsername(e.target.value)}
              placeholder="Your name"
              className="w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber"
            />
            <textarea
              rows="2"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full rounded-lg border border-border bg-paper px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-amber/30 focus:border-amber"
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleReply}
                disabled={busy}
                className="font-mono text-xs text-white bg-ink px-3 py-1.5 rounded-full hover:bg-ink-soft disabled:opacity-50"
              >
                Post reply
              </button>
              <ActionButton onClick={() => setShowReplyForm(false)} busy={busy}>
                Cancel
              </ActionButton>
            </div>
          </div>
        )}
      </div>

      {comment.replies?.length > 0 && (
        <div className="mt-4 ml-6 space-y-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              articleName={articleName}
              onUpdate={onUpdate}
              onError={onError}
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CommentList = ({ comments, articleName, onUpdate, unavailable }) => {
  const [actionError, setActionError] = useState(null);

  const handleError = (message) => {
    setActionError(message);
    setTimeout(() => setActionError(null), 5000);
  };

  return (
    <section className="space-y-6 mb-8">
      <p className="eyebrow mb-2">{`// ${comments.length} comment${comments.length === 1 ? "" : "s"}`}</p>
      <h3 className="sm:text-2xl text-xl font-display font-semibold text-ink">Discussion</h3>

      {actionError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {actionError}
        </div>
      )}

      {unavailable ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-muted">
          Comments are temporarily unavailable. Please check back later.
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-muted">
          No comments yet. Be the first to share your thoughts.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              articleName={articleName}
              onUpdate={onUpdate}
              onError={handleError}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default CommentList;
