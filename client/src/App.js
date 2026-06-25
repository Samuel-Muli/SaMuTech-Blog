import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
//pages
import Home from "./pages/Home";
import ArticleList from "./pages/ArticleList";
import Article from "./pages/Article";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

//components
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/articles-list" element={<ArticleList />} />
          <Route path="/articles/:name" element={<Article />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
