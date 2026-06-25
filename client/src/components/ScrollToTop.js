import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// React Router doesn't reset scroll position on navigation by itself —
// without this, clicking a link while scrolled down (e.g. "other articles
// you may like" at the bottom of an article) lands you scrolled to the
// same pixel position on the new page instead of at the top.
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
