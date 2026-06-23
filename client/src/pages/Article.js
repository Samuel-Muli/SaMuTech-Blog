import React from "react";
import { Link, useParams } from "react-router-dom";
import articleContent from "./article-content"; // Import the article content
import { useState, useEffect } from "react";

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

const Article = () => {
  const { name } = useParams();
  const article = articleContent.find((article) => article.name === name);
  const [articleInfo, setArticleInfo] = useState({ comments: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetch(`/api/articles/${name}`);
        const body = await result.json();
        setArticleInfo(Array.isArray(body?.comments) ? body : { comments: [] });
      } catch (err) {
        setArticleInfo({ comments: [] });
      }
    };
    fetchData();
  }, [name]);

  if (!article) {
    return <NotFound />;
  }
  const otherArticles = articleContent.filter((a) => a.name !== name);

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

        <div className="mt-12 pt-10 border-t border-border">
          <CommentList comments={articleInfo.comments} />
          <AddCommentForm articleName={name} setArticleInfo={setArticleInfo} />
        </div>
      </PageWithSidebar>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14">
        <h2 className="font-display font-semibold text-2xl text-ink mb-6">
          Other articles you may like
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Articles articles={otherArticles} />
        </div>
      </div>
    </>
  );
};

export default Article;
