import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Article as ArticleType } from "../../types";
import { IoSearch as SearchIcon } from "react-icons/io5";
import { SlOptionsVertical as OptionsIcon } from "react-icons/sl";
import { useCallback, useEffect, useMemo, useState } from "react";
import getFavicon from "../../utils/get-favicon";
import useLocalStorage from "../../hooks/useLocalStorage";
import Article from "../../components/article";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";

const HomePage = () => {
  const [source, setSource] = useLocalStorage("source", "");
  const [timeframe, setTimeFrame] = useLocalStorage("timeframe", "last-24h");

  const favicon = useMemo(() => getFavicon(source), [source]);

  const queryClient = useQueryClient();
  const {
    data: articles,
    isLoading,
    error,
  } = useQuery<ArticleType[]>({
    queryKey: ["articles"],
    queryFn: async () => {
      const jsonValue = await fetch(
        `https://news-reader-api.onrender.com/api/${timeframe}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ source }),
        },
      );
      if (!jsonValue.ok) throw new Error(await jsonValue.text());
      const res = await jsonValue.json();
      return res;
    },
  });

  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [filteredArticles, setFilteredArticles] = useState<
    ArticleType[] | undefined
  >(articles);

  const updateFilteredArticles = useCallback(
    debounce((search: string, articles?: ArticleType[]) => {
      const result = getFilteredArticles(search, articles);
      setFilteredArticles(result);
    }, 700),
    [],
  );

  useEffect(() => {
    if (!isSearching) setFilteredArticles(articles);
    updateFilteredArticles(search, articles);
  }, [articles, search, isSearching]);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["articles"] });
  }, [source, timeframe]);

  return (
    <>
      <div className="sticky left-0 top-0 bg-gray-50 px-2 py-4 dark:bg-slate-800">
        <div className="flex items-center justify-between gap-6">
          <div className="flex w-full items-center gap-2">
            {source && <img src={favicon} />}
            <select
              value={source}
              onChange={e => setSource(e.target.value)}
              className="w-full bg-transparent text-4xl font-bold text-black outline-none dark:text-white"
            >
              <option value="">Toate Știrile</option>
              <option value="www.digi24.ro">Digi24</option>
              <option value="www.realitatea.net">Realitatea</option>
              <option value="www.b1tv.ro">B1</option>
            </select>
          </div>
          <div className="flex items-center gap-2 text-3xl">
            <SearchIcon
              onClick={() => setIsSearching(prev => !prev)}
              className="text-gray-700 dark:text-white"
            />
            <OptionsButton />
          </div>
        </div>
        <select
          value={timeframe}
          onChange={e => setTimeFrame(e.target.value)}
          className="text-md bg-transparent font-bold text-gray-500 outline-none dark:text-gray-400"
        >
          <option value="last-hour">Ultima oră</option>
          <option value="last-24h">Ultimele 24 ore</option>
          <option value="last-48h">Ultimele 48 ore</option>
          <option value="last-week">Ultima săptămână</option>
        </select>
        {isSearching && (
          <motion.input
            value={search}
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") {
                e.currentTarget.blur();
                if (!search.trim()) setIsSearching(false);
              }
            }}
            autoFocus
            className="w-full border-b-2 border-b-gray-200 bg-transparent text-lg outline-none dark:border-b-gray-600"
          />
        )}
      </div>
      {isLoading && (
        <div className="grid h-full place-items-center">
          <svg
            aria-hidden="true"
            className="h-8 w-8 animate-spin fill-blue-600 text-gray-200 dark:text-gray-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
      {error ? (
        <div className="grid h-full place-items-center">
          <p className="text-2xl font-bold text-red-500">{error.message}</p>
        </div>
      ) : (
        <AnimatePresence>
          {filteredArticles?.map(article => (
            <Article
              title={article.title}
              source={article.source}
              url={article.url}
              createdOn={article.createdOn}
              key={article.url}
            />
          ))}
        </AnimatePresence>
      )}
    </>
  );
};

const OptionsButton = () => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <OptionsIcon
        className="text-2xl"
        onClick={() => setVisible(prev => !prev)}
      />
      <AnimatePresence>
        {visible && (
          <motion.div
            layout
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            className="absolute right-0 top-full mt-2 flex flex-col overflow-hidden bg-gray-100 text-lg dark:bg-slate-900"
          >
            <Link
              to="/bookmarks"
              className="px-4 py-2 active:bg-gray-200 active:dark:bg-slate-700"
            >
              Salvate
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 active:bg-gray-200 active:dark:bg-slate-700"
            >
              Despre
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function getFilteredArticles(search: string, articles?: ArticleType[]) {
  if (!articles) return [];

  const parsedSearch = search.trim().toLowerCase();
  if (!parsedSearch) return articles;

  const out = [];
  for (const article of articles) {
    if (article.title.toLowerCase().trim().indexOf(parsedSearch) >= 0)
      out.push(article);
  }

  return out;
}

export default HomePage;
