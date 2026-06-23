import { useState } from "react";
import React from "react";

const AddCommentForm = ({ articleName, setArticleInfo }) => {
  const [username, setUsername] = useState("");
  const [commentText, setCommentText] = useState("");

  const addComments = async (event) => {
    event.preventDefault();

    if (!username.trim() || !commentText.trim()) {
      return;
    }

    const result = await fetch(`/api/articles/${articleName}/add-comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, text: commentText }),
    });

    if (!result.ok) {
      const errorBody = await result.json();
      console.error("Comment submit failed:", errorBody);
      return;
    }

    const body = await result.json();
    setArticleInfo(body);
    setUsername("");
    setCommentText("");
  };

  return (
    <form
      onSubmit={addComments}
      className="bg-white shadow-card rounded-2xl px-6 py-6 sm:px-8 border border-border"
    >
      <p className="eyebrow mb-2">{"// add yours"}</p>
      <h3 className="text-xl font-display font-semibold mb-4 text-ink">Add a comment</h3>

      <label className="block text-sm font-medium text-ink mb-2">
        Name
      </label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full rounded-lg border border-border bg-paper px-4 py-3 text-ink focus:border-amber focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber/30"
        placeholder="Your name"
      />

      <label className="block text-sm font-medium text-ink mt-4 mb-2">
        Comment
      </label>
      <textarea
        rows="5"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        className="w-full rounded-lg border border-border bg-paper px-4 py-3 text-ink focus:border-amber focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber/30"
        placeholder="Write your comment here"
      />

      <button
        type="submit"
        className="mt-5 inline-flex items-center justify-center rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-light focus:outline-none focus:ring-2 focus:ring-amber/50 focus:ring-offset-2"
      >
        Post comment
      </button>
    </form>
  );
};

export default AddCommentForm;
