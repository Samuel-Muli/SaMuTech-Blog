import React from "react";
import articleContent from "./article-content";
import PageWithSidebar from "../components/PageWithSidebar";

const About = () => {
  return (
    <>
      <div className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <p className="eyebrow text-teal mb-2">{"// about"}</p>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-ink">
            Hi, I'm Samuel.
          </h1>
        </div>
      </div>

      <PageWithSidebar articles={articleContent}>
        <div className="prose-content space-y-5 text-ink leading-relaxed max-w-2xl">
          <p>
            I started SaMuTech to write the kind of tutorial I wish I could
            find when I was learning to build full-stack apps: practical,
            end-to-end, and honest about the parts most guides skip — like
            actually deploying what you built.
          </p>
          <p>
            Every article here follows the same idea: build something real,
            explain the "why" behind each decision, and leave you with code
            you can actually run, not just read.
          </p>

          <div className="rounded-2xl border border-border bg-white p-6 mt-8 shadow-card">
            <p className="eyebrow mb-3">{"// what you'll find here"}</p>
            <ul className="space-y-2 text-ink">
              <li>→ React tutorials — components, hooks, and state management</li>
              <li>→ Node.js &amp; Express — building APIs from scratch</li>
              <li>→ Deployment &amp; DevOps — getting your project live</li>
            </ul>
          </div>

          <p className="pt-4">
            Got a topic you'd like covered, or feedback on an article?
            Open an issue on{" "}
            <a
              href="https://github.com/Samuel-Muli/SaMuTech"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber font-semibold hover:text-amber-light"
            >
              GitHub
            </a>{" "}
            — I read every one.
          </p>
        </div>
      </PageWithSidebar>
    </>
  );
};

export default About;
