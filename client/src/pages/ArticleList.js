import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import articleContent from "./article-content";

//components
import Articles from "../components/Articles";
import PageWithSidebar from "../components/PageWithSidebar";

const ArticlesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const activeTag = searchParams.get("tag") || "";

  // If the URL changes while already on this page (e.g. clicking a topic
  // link in the sidebar/footer while viewing the list), pick up the new
  // search term too.
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = articleContent;
    if (activeTag) {
      result = result.filter((article) => (article.tags || []).includes(activeTag));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((article) => article.title.toLowerCase().includes(q));
    }
    return result;
  }, [search, activeTag]);

  const clearTag = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("tag");
    setSearchParams(next);
  };

  return (
    <>
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <p className="eyebrow text-teal mb-2">{"// articles"}</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink">
            All tutorials
          </h1>
          <p className="mt-2 text-muted">
            {articleContent.length} articles, filterable by topic or search.
          </p>
          {activeTag && (
            <button
              onClick={clearTag}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-teal-50 text-teal px-4 py-1.5 text-sm font-medium hover:bg-teal/10 transition-colors"
            >
              Filtering by: {activeTag} <span aria-hidden="true">✕</span>
            </button>
          )}
        </div>
      </div>

      <PageWithSidebar articles={articleContent} searchValue={search} onSearchChange={setSearch}>
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-white p-10 text-center text-muted">
            No articles match{search ? ` "${search}"` : ""}
            {activeTag ? ` in ${activeTag}` : ""}. Try a different search term
            {activeTag ? " or clear the topic filter" : ""}.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            <Articles articles={filtered} />
          </div>
        )}
      </PageWithSidebar>
    </>
  );
};

export default ArticlesList;
