import { useContext } from "react";
import { BookmarkContext } from "../../main";
import { AnimatePresence } from "framer-motion";
import Article from "../../components/article";
import { IoArrowBack as BackIcon } from "react-icons/io5";
import { Link } from "react-router-dom";

const BookmarksPage = () => {
  const { bookmarks } = useContext(BookmarkContext);

  return (
    <>
      <nav className="sticky top-0 flex items-center gap-4 px-2 py-4">
        <Link to="/">
          <BackIcon className="text-3xl" />
        </Link>
        <h1 className="sticky top-0 bg-gray-50 text-4xl font-bold dark:bg-slate-800">
          Salvate
        </h1>
      </nav>
      <AnimatePresence>
        {bookmarks.map(bookmark => (
          <Article
            url={bookmark.url}
            title={bookmark.title}
            source={bookmark.source}
            createdOn={bookmark.createdOn}
            key={bookmark.url}
          />
        ))}
      </AnimatePresence>
    </>
  );
};

export default BookmarksPage;
