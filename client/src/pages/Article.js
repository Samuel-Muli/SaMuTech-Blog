import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import articleContent from "./article-content"; // Import the article content

//components
import Articles from "../components/Articles";
import CommentList from "../components/CommentList";
import AddCommentForm from "../components/AddCommentForm";
import PageWithSidebar from "../components/PageWithSidebar";

//pages
import NotFound from "./NotFound";

const readTime = (paragraphs) => {
  const words = paragraphs.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

// Fisher-Yates shuffle — used to randomize which low-engagement articles show.
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Up to 8 related articles: the 4 with the most comments, plus 4 random
// picks from the least-commented ones. With fewer than 8 other articles
// available, it just returns what there is — nothing crashes, it simply
// won't fill all 8 slots until there's more content.
const pickRelatedArticles = (otherArticles, commentCounts) => {
  const withCounts = otherArticles.map((a) => ({
    ...a,
    commentCount: commentCounts[a.name] || 0,
  }));

  const sortedDesc = [...withCounts].sort((a, b) => b.commentCount - a.commentCount);
  const mostCommented = sortedDesc.slice(0, 4);
  const mostNames = new Set(mostCommented.map((a) => a.name));

  const remaining = withCounts.filter((a) => !mostNames.has(a.name));
  const sortedAsc = [...remaining].sort((a, b) => a.commentCount - b.commentCount);
  const lowPoolSize = Math.max(4, Math.min(8, remaining.length));
  const leastCommented = shuffle(sortedAsc.slice(0, lowPoolSize)).slice(0, 4);

  return [...mostCommented, ...leastCommented];
};

const EMPTY_ARTICLE_INFO = { comments: [], hasCommented: false };

const Article = () => {
  const { name } = useParams();
  const article = articleContent.find((a) => a.name === name);
  const [articleInfo, setArticleInfo] = useState(EMPTY_ARTICLE_INFO);
  const [commentsUnavailable, setCommentsUnavailable] = useState(false);
  const [commentCounts, setCommentCounts] = useState({});
  const commentsRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const result = await fetch(`/api/articles/${name}`);
        if (!result.ok) throw new Error("Request failed");
        const body = await result.json();
        if (cancelled) return;
        setArticleInfo(Array.isArray(body?.comments) ? body : EMPTY_ARTICLE_INFO);
        setCommentsUnavailable(false);
      } catch (err) {
        if (cancelled) return;
        setArticleInfo(EMPTY_ARTICLE_INFO);
        setCommentsUnavailable(true);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [name]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const result = await fetch("/api/comment-counts");
        const body = await result.json();
        setCommentCounts(body && typeof body === "object" ? body : {});
      } catch (err) {
        setCommentCounts({});
      }
    };
    fetchCounts();
  }, []);

  // All hooks above run on every render regardless of whether the article
  // exists, so the early return below never changes hook call order.

  const otherArticles = useMemo(
    () => articleContent.filter((a) => a.name !== name),
    [name]
  );
  const relatedArticles = useMemo(
    () => pickRelatedArticles(otherArticles, commentCounts),
    [otherArticles, commentCounts]
  );

  if (!article) {
    return <NotFound />;
  }

  return (
    <>
      <div className="bg-white border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-10">
          <nav className="font-mono text-xs text-slate-400 mb-5">
            <Link to="/articles-list" className="hover:text-amber">articles</Link>
            <span className="mx-1.5">/</span>
            <span className="text-muted">{article.name}</span>
          </nav>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink leading-tight">
            {article.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 font-mono text-xs text-muted">
            <span>{readTime(article.content)} min read</span>
            {article.tags?.[0] && (
              <>
                <span aria-hidden="true">·</span>
                <Link
                  to={`/articles-list?tag=${encodeURIComponent(article.tags[0])}`}
                  className="text-teal hover:text-teal/80"
                >
                  {article.tags[0]}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <PageWithSidebar articles={otherArticles}>
        <img
          src={article.thumbnail}
          alt={article.title}
          className="w-full h-64 object-cover rounded-2xl border border-border mb-8"
        />

        <div className="space-y-5">
          {article.content.map((paragraph, index) => (
            <p className="text-ink leading-relaxed" key={index}>
              {paragraph}
            </p>
          ))}
        </div>

        <div ref={commentsRef} className="mt-12 pt-10 border-t border-border">
          <CommentList
            comments={articleInfo.comments}
            articleName={name}
            onUpdate={setArticleInfo}
            unavailable={commentsUnavailable}
          />
          <AddCommentForm
            articleName={name}
            hasCommented={articleInfo.hasCommented}
            onUpdate={setArticleInfo}
            onAlreadyCommented={() => setArticleInfo((prev) => ({ ...prev, hasCommented: true }))}
            onPosted={() => commentsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          />
        </div>
      </PageWithSidebar>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <h2 className="font-display font-semibold text-2xl text-ink mb-6">
          Other articles you may like
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Articles articles={relatedArticles} />
        </div>
      </div>
    </>
  );
};

export default Article;
