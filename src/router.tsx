import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/layout";
import HomePage from "./pages/home";
import ArticleViewPage from "./pages/article-view";
import BookmarksPage from "./pages/bookmarks";
import About from "./pages/about";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "article", element: <ArticleViewPage /> },
      { path: "bookmarks", element: <BookmarksPage /> },
      { path: "about", element: <About /> },
    ],
  },
]);

export default router;
