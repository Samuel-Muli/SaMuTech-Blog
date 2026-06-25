import React, { useEffect, useState } from "react";

const WHATSAPP_URL = "https://wa.me/254705244235";

const ArrowUpIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
);

const ChatIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 2C6.5 2 2 6.1 2 11.2c0 2.6 1.2 5 3.2 6.7-.1.9-.5 2.7-1.1 3.9-.1.2.1.5.4.4 1.4-.4 3.1-1.2 4-1.7 1.1.3 2.3.5 3.5.5 5.5 0 10-4.1 10-9.2S17.5 2 12 2Z" />
  </svg>
);

const FloatingActions = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed right-5 bottom-5 z-50 flex flex-col items-center gap-3">
      {showBackToTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          title="Back to top"
          className="w-11 h-11 rounded-full bg-ink text-white shadow-lg flex items-center justify-center hover:bg-ink-soft transition-colors"
        >
          <ArrowUpIcon className="w-5 h-5" />
        </button>
      )}

      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg flex items-center justify-center hover:brightness-105 transition"
      >
        <ChatIcon className="w-6 h-6" />
      </a>
    </div>
  );
};

export default FloatingActions;
