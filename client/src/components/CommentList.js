import React from "react";

const CommentList = ({ comments }) => {
  return (
    <section className="space-y-6 mb-8">
      <p className="eyebrow mb-2">{`// ${comments.length} comment${comments.length === 1 ? "" : "s"}`}</p>
      <h3 className="sm:text-2xl text-xl font-display font-semibold text-ink">
        Discussion
      </h3>

      {comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-white p-6 text-muted">
          No comments yet. Be the first to share your thoughts.
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border bg-white p-5 shadow-card"
            >
              <div className="flex items-center justify-between gap-4">
                <h4 className="text-base font-semibold text-ink">
                  {comment.username}
                </h4>
                <span className="font-mono text-xs text-slate-400">#{index + 1}</span>
              </div>
              <p className="mt-3 text-ink/80 leading-relaxed">{comment.text}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CommentList;
