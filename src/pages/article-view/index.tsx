import { useContext, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaGlobeAmericas as BrowserIcon } from "react-icons/fa";
import { FaShareAlt as ShareIcon } from "react-icons/fa";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { IoArrowBack as BackIcon } from "react-icons/io5";
import { BookmarkContext, CurrentArticleContext } from "../../main";
import { Article } from "../../types";

const ArticleViewPage = () => {
  const [searchParams, _] = useSearchParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const url = useMemo(() => searchParams.get("url"), [searchParams]);
  if (!url) return;

  return (
    <div className="flex h-full flex-col bg-white">
      <iframe src={url} ref={iframeRef} className="h-full w-full" />
      <Panel />
    </div>
  );
};

const Panel = () => {
  const { currentArticle } = useContext(CurrentArticleContext);
  const { toggleBookmark, isBookmark } = useContext(BookmarkContext);

  return (
    <div className="flex w-full items-center justify-evenly bg-gray-50 px-2 py-4 text-3xl text-gray-700 dark:bg-slate-800 dark:text-gray-200">
      <Link to="/">
        <BackIcon className="text-4xl" />
      </Link>
      <a target="_blank" href={currentArticle?.url}>
        <BrowserIcon />
      </a>
      <button onClick={() => toggleBookmark(currentArticle || ({} as Article))}>
        {isBookmark(currentArticle?.url ?? "") ? (
          <FaBookmark />
        ) : (
          <FaRegBookmark />
        )}
      </button>
      <button
        onClick={() => {
          try {
            navigator.share({
              url: currentArticle?.url,
              title: currentArticle?.title,
              text: currentArticle?.url,
            });
          } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") {
              console.error(err.name, err.message);
            }
          }
        }}
      >
        <ShareIcon />
      </button>
    </div>
  );
};

export default ArticleViewPage;
