import React, { useState } from "react";
import { Link } from "react-router-dom";
import articleContent from "../pages/article-content";

const allTags = [...new Set(articleContent.flatMap((a) => a.tags || []))];

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.9.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const FooterColumn = ({ label, children }) => (
  <div>
    <p className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-4">{`// ${label}`}</p>
    {children}
  </div>
);

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-ink text-slate-300 border-t-2 border-amber">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/10 text-amber font-mono text-sm font-semibold">
                {"</>"}
              </span>
              <span className="font-display font-semibold text-lg text-white">
                SaMu<span className="text-amber">Tech</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Practical tutorials on React, Node.js, and shipping full-stack JavaScript apps.
            </p>
            <a
              href="https://github.com/Samuel-Muli/SaMuTech"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              View source on GitHub
            </a>
          </div>

          <FooterColumn label="navigate">
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="hover:text-amber transition-colors">Home</Link></li>
              <li><Link to="/articles-list" className="hover:text-amber transition-colors">Articles</Link></li>
              <li><Link to="/about" className="hover:text-amber transition-colors">About</Link></li>
            </ul>
          </FooterColumn>

          <FooterColumn label="topics">
            <ul className="space-y-2.5 text-sm">
              {allTags.map((tag) => (
                <li key={tag}>
                  <Link
                    to={`/articles-list?tag=${encodeURIComponent(tag)}`}
                    className="hover:text-amber transition-colors"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn label="stay updated">
            {subscribed ? (
              <p className="text-sm text-teal font-medium">You're on the list — thanks!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber/50"
                />
                <button
                  type="submit"
                  className="w-full rounded-lg bg-amber px-3 py-2.5 text-sm font-semibold text-white hover:bg-amber-light transition-colors"
                >
                  Subscribe
                </button>
              </form>
            )}
          </FooterColumn>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SaMuTech. All rights reserved.</p>
          <p className="font-mono">built with React &amp; Node.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
