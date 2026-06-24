import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import articleContent from "../pages/article-content";
import SubscribeForm from "./SubscribeForm";

const allTags = [...new Set(articleContent.flatMap((a) => a.tags || []))];

const SidebarSection = ({ label, children, id }) => (
  <section id={id} className="bg-white border border-border rounded-2xl p-5 shadow-card">
    <p className="eyebrow mb-4">{`// ${label}`}</p>
    {children}
  </section>
);

const SearchIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

/**
 * Search behaves in two modes:
 * - Controlled (on the Articles list page): the parent owns the value and
 *   filters live as the user types.
 * - Uncontrolled (everywhere else): the sidebar owns its own input and, on
 *   submit, navigates to the Articles list with the query in the URL so the
 *   search actually works from any page, not just the list page.
 */
const Sidebar = ({ articles = [], searchValue, onSearchChange }) => {
  const navigate = useNavigate();
  const controlled = typeof onSearchChange === "function";
  const [localQuery, setLocalQuery] = useState("");
  const popular = articles.slice(0, 3);

  const inputValue = controlled ? searchValue : localQuery;

  const handleChange = (value) => {
    if (controlled) {
      onSearchChange(value);
    } else {
      setLocalQuery(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (controlled) return; // already filtering live on this page
    const q = localQuery.trim();
    navigate(q ? `/articles-list?q=${encodeURIComponent(q)}` : "/articles-list");
  };

  return (
    <aside className="space-y-6">
      <SidebarSection label="search" id="search">
        <form onSubmit={handleSubmit} className="relative">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={inputValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Find a tutorial..."
            className="w-full rounded-lg border border-border bg-paper pl-9 pr-3 py-2.5 text-sm text-ink placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber/40 focus:border-amber"
          />
        </form>
        {!controlled && (
          <p className="mt-2 font-mono text-[11px] text-slate-400">press enter to search</p>
        )}
      </SidebarSection>

      <SidebarSection label="topics">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Link
              key={tag}
              to={`/articles-list?tag=${encodeURIComponent(tag)}`}
              className="font-mono text-xs px-3 py-1.5 rounded-full border border-border text-muted hover:border-teal hover:text-teal transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>
      </SidebarSection>

      {popular.length > 0 && (
        <SidebarSection label="popular">
          <ul className="space-y-4">
            {popular.map((article) => (
              <li key={article.name}>
                <Link to={`/articles/${article.name}`} className="group flex gap-3 items-start">
                  <img
                    src={article.thumbnail}
                    alt=""
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border"
                  />
                  <span className="text-sm font-medium text-ink leading-snug group-hover:text-amber transition-colors">
                    {article.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </SidebarSection>
      )}

      <SidebarSection label="subscribe" id="subscribe">
        <p className="text-sm text-muted mb-4">
          One email a week. New tutorials, no fluff.
        </p>
        <SubscribeForm variant="light" />
      </SidebarSection>
    </aside>
  );
};

export default Sidebar;
