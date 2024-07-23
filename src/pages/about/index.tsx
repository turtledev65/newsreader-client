import { IoArrowBack as BackIcon } from "react-icons/io5";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Link to="/">
        <BackIcon className="absolute left-2 top-2 text-4xl" />
      </Link>
      <h1 className="text-4xl font-bold text-slate-800 dark:text-white">
        News Reader
      </h1>
      <p className="text-gray-400">Version 1.0</p>
    </div>
  );
};

export default About;
