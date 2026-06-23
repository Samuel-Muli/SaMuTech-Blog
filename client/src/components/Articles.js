import React from "react";
import { Link } from "react-router-dom";

const Articles = ({ articles }) => {
  return (
    <>
      {articles.map((article, index) => (
        <article
          key={article.name || index}
          className="group bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:-translate-y-0.5 hover:shadow-lg transition-all"
        >
          <Link to={`/articles/${article.name}`} className="block overflow-hidden">
            <img
              className="h-44 w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
              src={article.thumbnail}
              alt={article.title}
            />
          </Link>
          <div className="p-5">
            {article.tags?.[0] && (
              <span className="font-mono text-[11px] uppercase tracking-wide text-teal mb-2 inline-block">
                {article.tags[0]}
              </span>
            )}
            <Link to={`/articles/${article.name}`}>
              <h2 className="font-display font-semibold text-lg text-ink mb-2 group-hover:text-amber transition-colors">
                {article.title}
              </h2>
            </Link>
            <p className="text-sm text-muted leading-relaxed mb-4">
              {article.content[0].substring(0, 110)}...
            </p>
            <Link
              to={`/articles/${article.name}`}
              className="inline-flex items-center gap-1 text-sm font-semibold text-amber hover:text-amber-light"
            >
              Read more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </article>
      ))}
    </>
  );
};

export default Articles;
