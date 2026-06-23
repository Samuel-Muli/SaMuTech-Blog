import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-16 bg-paper">
      <section className="w-full max-w-xl rounded-3xl border border-border bg-white p-10 shadow-card sm:p-12 text-center">
        <span className="inline-flex items-center rounded-full bg-ink px-4 py-1.5 font-mono text-xs text-amber-light">
          ERR_404
        </span>
        <h1 className="mt-8 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          This page doesn't exist.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          The page you were looking for has moved or never existed. Let's
          get you back to the articles.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white shadow hover:bg-amber-light transition-colors"
          >
            Return home
          </Link>
          <Link
            to="/articles-list"
            className="inline-flex items-center justify-center rounded-full border border-border bg-white px-6 py-3 text-sm font-semibold text-ink hover:border-amber transition-colors"
          >
            Browse articles
          </Link>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
