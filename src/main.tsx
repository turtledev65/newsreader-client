import "./index.css";

import React, {
  createContext,
  Dispatch,
  PropsWithChildren,
  useCallback,
  useState,
} from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RouterProvider } from "react-router-dom";
import router from "./router.tsx";
import { Article } from "./types";
import useLocalStorage from "./hooks/useLocalStorage.tsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      retry: 0,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

type CurrentArticleContextType = {
  currentArticle: Article | undefined;
  setCurrentArticle: Dispatch<React.SetStateAction<Article | undefined>>;
};
export const CurrentArticleContext = createContext<CurrentArticleContextType>(
  {} as CurrentArticleContextType,
);
const CurrentArticleProvider = ({ children }: PropsWithChildren) => {
  const [currentArticle, setCurrentArticle] = useState<Article | undefined>();

  return (
    <CurrentArticleContext.Provider
      value={{ currentArticle, setCurrentArticle }}
    >
      {children}
    </CurrentArticleContext.Provider>
  );
};

type BookmarkContextType = {
  bookmarks: Article[];
  toggleBookmark: (article: Article) => void;
  addBookmark: (article: Article) => void;
  removeBookmark: (article: Article) => void;
  isBookmark: (url: string) => boolean;
};
export const BookmarkContext = createContext<BookmarkContextType>(
  {} as BookmarkContextType,
);
const BookmarkProvider = ({ children }: PropsWithChildren) => {
  const [bookmarks, setBookmarks] = useLocalStorage<Article[]>("bookmarks", []);

  const isBookmark = useCallback(
    (url: string) => {
      return bookmarks.some(article => article.url === url);
    },
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    (article: Article) => {
      if (isBookmark(article.url)) removeBookmark(article);
      else addBookmark(article);
    },
    [bookmarks],
  );

  const addBookmark = useCallback(
    (article: Article) => {
      setBookmarks(prev => [...prev, article]);
    },
    [bookmarks],
  );

  const removeBookmark = useCallback(
    (article: Article) => {
      setBookmarks(prev => prev.filter(i => i.url !== article.url));
    },
    [bookmarks],
  );

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        toggleBookmark,
        addBookmark,
        removeBookmark,
        isBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <CurrentArticleProvider>
        <BookmarkProvider>
          <RouterProvider router={router} />
        </BookmarkProvider>
      </CurrentArticleProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
