import { useContext, useMemo } from "react";
import getFavicon from "../utils/get-favicon";
import { BookmarkContext, CurrentArticleContext } from "../main";
import { Link } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { motion } from "framer-motion";

type ArticleProps = {
  title: string;
  source: string;
  url: string;
  createdOn: string;
};

const Article = ({ title, source, url, createdOn }: ArticleProps) => {
  const favicon = useMemo(() => getFavicon(source), [source]);
  const { setCurrentArticle } = useContext(CurrentArticleContext);

  const { toggleBookmark, isBookmark } = useContext(BookmarkContext);
  const date = useMemo(
    () => new Date(createdOn).toLocaleTimeString("en-GB"),
    [createdOn],
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{opacity: 100}}
      exit={{ opacity: 0 }}
      className="flex flex-row justify-between"
    >
      <Link
        to={`/article?url=${url}`}
        onClick={() => setCurrentArticle({ title, source, url, createdOn })}
        className="px-4 py-2 transition-colors visited:text-gray-400 active:bg-gray-200 active:dark:bg-slate-700"
      >
        <h2 className="text-2xl">{title}</h2>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <img src={favicon} className="h-[16px] w-[16px]" />
            <p>{source}</p>
          </div>
          <p>{date}</p>
        </div>
      </Link>
      <button
        onClick={() => toggleBookmark({ title, source, url, createdOn })}
        className="toucn flex flex-col items-start p-4 text-3xl text-blue-500 transition-colors active:bg-gray-200 active:dark:bg-slate-700"
      >
        {isBookmark(url) ? <FaBookmark /> : <FaRegBookmark />}
      </button>
    </motion.div>
  );
};

export default Article;
