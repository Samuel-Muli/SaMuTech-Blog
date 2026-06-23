import React from "react";
import { Link } from "react-router-dom";
import articleContent from "./article-content";

//components
import PageWithSidebar from "../components/PageWithSidebar";
import Articles from "../components/Articles";

const Home = () => {
  const latest = articleContent.slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="bg-ink text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 lg:py-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
          <div>
            <p className="eyebrow text-teal mb-4">{"// welcome"}</p>
            <h1 className="font-display font-bold text-3xl sm:text-5xl leading-tight tracking-tight">
              Build things that ship,{" "}
              <span className="text-amber-light">not just demos.</span>
            </h1>
            <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
              SaMuTech is a tutorial blog for developers who want practical,
              full-stack JavaScript walkthroughs — React on the frontend,
              Node and Express on the backend, and the deployment steps
              tutorials usually skip.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/articles-list"
                className="inline-flex items-center rounded-full bg-amber px-6 py-3 text-sm font-semibold text-white hover:bg-amber-light transition-colors"
              >
                Browse articles
              </Link>
              <a
                href="#subscribe"
                className="inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white hover:border-white/40 transition-colors"
              >
                Subscribe for updates
              </a>
            </div>
          </div>

          {/* Decorative code panel */}
          <div className="hidden lg:block">
            <div className="rounded-2xl border border-white/10 bg-ink-soft shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-light/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-teal/70" />
                <span className="font-mono text-xs text-slate-400 ml-2">deploy.sh</span>
              </div>
              <pre className="font-mono text-sm leading-relaxed p-5 text-slate-300 overflow-x-auto">
<span className="text-slate-500">{'// build the frontend'}</span>{"\n"}
<span className="text-teal">npm</span> run build{"\n\n"}
<span className="text-slate-500">{'// start the api'}</span>{"\n"}
<span className="text-teal">node</span> server.js{"\n\n"}
<span className="text-amber-light">✓</span> ready on :8000
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Latest articles + sidebar */}
      <PageWithSidebar articles={articleContent}>
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl text-ink">Latest articles</h2>
          <Link to="/articles-list" className="text-sm font-medium text-amber hover:text-amber-light">
            View all →
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 gap-6">
          <Articles articles={latest} />
        </div>
      </PageWithSidebar>
    </>
  );
};

export default Home;
