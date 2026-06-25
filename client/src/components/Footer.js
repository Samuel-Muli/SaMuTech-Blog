import React from "react";
import { Link } from "react-router-dom";
import articleContent from "../pages/article-content";
import SubscribeForm from "./SubscribeForm";

const allTags = [...new Set(articleContent.flatMap((a) => a.tags || []))];

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.9.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const GlobeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18" />
    <path d="M12 3c2.4 2.4 3.8 5.7 3.8 9s-1.4 6.6-3.8 9c-2.4-2.4-3.8-5.7-3.8-9s1.4-6.6 3.8-9Z" />
  </svg>
);

const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.6 1.2 5 3.2 6.7-.1.9-.5 2.7-1.1 3.9-.1.2.1.5.4.4 1.4-.4 3.1-1.2 4-1.7 1.1.3 2.3.5 3.5.5 5.5 0 10-4.1 10-9.2S17.5 2 12 2Z" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12Z" />
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4 4h3.6l4.3 5.8L16.7 4H20l-6.6 8.1L20.4 20h-3.6l-4.6-6.2L6.9 20H3.5l7-8.6L4 4Z" />
  </svg>
);

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M4.5 3A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3h-15Zm2.5 6.2h2.8V18H7V9.2Zm1.4-4.4a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2ZM12.5 9.2h2.7v1.3h.04c.38-.7 1.3-1.5 2.7-1.5 2.9 0 3.4 1.9 3.4 4.4V18h-2.8v-3.9c0-1 0-2.2-1.4-2.2-1.4 0-1.6 1.1-1.6 2.2V18h-2.8V9.2Z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" {...props}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
);

const socialLinks = [
  { label: "Portfolio", href: "https://muli-samuel.onrender.com", Icon: GlobeIcon },
  { label: "WhatsApp", href: "https://wa.me/254705244235", Icon: WhatsAppIcon },
  { label: "Facebook", href: "https://web.facebook.com/samu.muli.92", Icon: FacebookIcon },
  { label: "X (Twitter)", href: "https://x.com/Kithome_SaMu", Icon: XIcon },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/muli-samuel-442259344", Icon: LinkedInIcon },
  { label: "Instagram", href: "https://www.instagram.com/dulcet265?igsh=ZGlsM2ViMWVnZWcx", Icon: InstagramIcon },
  { label: "GitHub", href: "https://github.com/Samuel-Muli", Icon: GithubIcon },
];

const FooterColumn = ({ label, children }) => (
  <div>
    <p className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-4">{`// ${label}`}</p>
    {children}
  </div>
);

const Footer = () => {
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
              href="https://github.com/Samuel-Muli/SaMuTech-Blog"
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
            <SubscribeForm variant="dark" />
          </FooterColumn>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="font-mono text-xs uppercase tracking-wider text-slate-500 mb-4 text-center sm:text-left">
            {"// elsewhere"}
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start gap-3">
            {socialLinks.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-amber hover:border-amber transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SaMuTech. All rights reserved.</p>
          <p className="font-mono">built with React &amp; Node.js</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
