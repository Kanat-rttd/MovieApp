import { NavLink } from "react-router-dom";
import { FaBookmark, FaDice, FaSearch, FaBars, FaTimes } from "react-icons/fa";
import logo2 from "../assets/logo2.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Filter from "./Filter";

type NavbarProps = {
  setFilters: React.Dispatch<React.SetStateAction<{ media_types: string[], genres: { movie: number[], tv: number[] }, min_rating: string | null, isAnime: boolean }>>;
};

export default function Navbar({ setFilters }: NavbarProps) {
  const [input, setInput] = useState<string>("");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigate(`/search?q=${encodeURIComponent(input)}`)
      setInput("");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex flex-col items-center gap-4 bg-neutral-800 text-white">

      {/* основной контейнер навбара */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full px-4 py-2 sm:py-0 gap-4">
        {/* логотип */}
        <div className="flex items-center justify-between w-full sm:w-auto">
          <NavLink to="/" className="flex items-center">
            <img className="w-16 h-16 sm:w-24 sm:h-24" src={logo2} alt="#" />
            <h1 className="text-lg sm:text-2xl sm:font-semibold ml-2">CINEMA PRODUCTION</h1>
          </NavLink>
          {/* гамбургер меню */}
          <button
            className="sm:hidden text-white focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {!isMenuOpen ? <FaBars size={24} /> : <FaTimes size={24} />}
          </button>
        </div>
        {/* ссылки и поиск */}
        <div className={`${isMenuOpen ? "flex" : "hidden"} sm:flex flex-col sm:flex-row items-center gap-6 w-full `}>
          <NavLink
            className={({ isActive }) =>
              isActive
                ? "relative group transition duration-300 ease-in-out hover:text-red-500 text-red-500 font-bold"
                : "relative group transition duration-300 ease-in-out hover:text-red-500 text-white"
            }
            to="/favorites">
            <div className="flex items-center sm:text-lg sm:font-semibold">
              <FaBookmark className="mr-1" />
              Сохраненные
            </div>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-400 transition-all duration-300 group-hover:w-full"></span>
          </NavLink>

          <NavLink
            className={({ isActive }) =>
              isActive
                ? "relative group transition duration-300 ease-in-out hover:text-red-500 text-red-500 font-bold"
                : "relative group transition duration-300 ease-in-out hover:text-red-500 text-white"
            }
            to="/random">
            <div className="flex items-center sm:text-lg sm:font-semibold">
              <FaDice className="mr-1" />
              Рандомный фильм
            </div>
            <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-400 transition-all duration-300 group-hover:w-full"></span>
          </NavLink>

          <div className="relative w-full sm:w-96">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} color="grey" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="p-4 pl-10 w-full sm:w-96 rounded-2xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300 sm:font-medium"
              type="text"
              placeholder="Поиск фильма..."
            />
          </div>

        </div>
      </div>

      {/* <div className="flex justify-evenly items-center gap-6 text-lg font-semibold">
        <NavLink to="/">
          <div className="flex items-center">
            <img className="w-24 h-24" src={logo2} alt="#" />
            <h1 className="text-xl">CINEMA PRODUCTION</h1>
          </div>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? "relative group transition duration-300 ease-in-out hover:text-red-500 text-red-500 font-bold"
              : "relative group transition duration-300 ease-in-out hover:text-red-500 text-white"
          }
          to="/favorites">
          <div className="flex items-center ">
            <FaBookmark className="mr-1" />
            Сохраненные
          </div>
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-400 transition-all duration-300 group-hover:w-full"></span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            isActive
              ? "relative group transition duration-300 ease-in-out hover:text-red-500 text-red-500 font-bold"
              : "relative group transition duration-300 ease-in-out hover:text-red-500 text-white"
          }
          to="/random">
          <div className="flex items-center ">
            <FaDice className="mr-1" />
            Рандомный фильм
          </div>
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-red-400 transition-all duration-300 group-hover:w-full"></span>
        </NavLink>

        <div className="relative w-96">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" size={20} color="grey" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="p-4 pl-10 w-96 rounded-2xl border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-300"
            type="text"
            placeholder="Поиск фильма..."
          />
        </div>
      </div> */}

      <Filter setFilters={setFilters} />
    </div>
  )
}