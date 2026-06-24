import React from "react";

const GithubIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.9.57.1.78-.25.78-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.77.11 3.06.74.8 1.18 1.83 1.18 3.09 0 4.43-2.69 5.41-5.25 5.69.41.36.78 1.07.78 2.15 0 1.56-.01 2.81-.01 3.19 0 .31.21.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
  </svg>
);

const Topbar = () => {
  return (
    <div className="bg-ink text-slate-300 font-mono text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between">
        <p className="truncate">
          <span className="text-teal">$</span> tutorials --stack=react,node,deploy
          <span className="hidden sm:inline text-slate-500"> · new posts weekly</span>
        </p>
        <a
          href="https://github.com/Samuel-Muli/SaMuTech-Blog"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors shrink-0 ml-4"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Star on GitHub</span>
        </a>
      </div>
    </div>
  );
};

export default Topbar;
