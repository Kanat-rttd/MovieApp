import axios from "axios";
import { useState, useContext } from "react";
import { fetchRandomMedia } from "./api";
import { MoviesType } from "../types/MoviesType";
import { Link } from "react-router-dom";
import no_image from "../assets/no_image.png";
import { FaFilm, FaRandom, FaHeart } from "react-icons/fa";
import { FavoritesContext } from "../context/FavoritesContext";

export default function Random() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [randomMovie, setRandomMovie] = useState<MoviesType | null>(null);

  const favoritesContext = useContext(FavoritesContext);
  
    if (!favoritesContext) {
      throw new Error("Favorites context error null")
    };
  
    const { setMedias, isFavorite } = favoritesContext;

  const media_type: "movie" | "tv" = "movie";

  const handleRandomCall = async () => {
    setIsLoading(true);
    setRandomMovie(null);
    const cancelToken = axios.CancelToken.source();

    let foundMovie = null;
    let attempts = 0;

    while (!foundMovie && attempts < 5) {
      let randomFilm = Math.floor(Math.random() * 1000000) + 1;

      try {
        const data = await fetchRandomMedia(media_type, randomFilm, cancelToken.token);
        if (data && data.poster_path && data.overview) {
          foundMovie = data;
          setRandomMovie(data);
          console.log(`random id: ${randomFilm}, data:`, data);
        }
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log("Запрос отменён");
          break;
        } else {
          console.error("Ошибка загрузки", error);
        }
        attempts++;
      }
    }

    setIsLoading(false);
  };

  return (
    <div className="pt-24 flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white px-6">
      {/* Заголовок */}
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <FaFilm className="text-red-500" size={30} /> Случайный фильм 🎥
      </h1>

      {/* Кнопка */}
      <button
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300 flex items-center gap-3"
        onClick={handleRandomCall}
      >
        <FaRandom size={22} /> {isLoading ? "Загрузка..." : "Получить"}
      </button>

      {/* Скелетон при загрузке */}
      {isLoading && (
        <div className="mt-6 w-72 h-96 bg-gray-700 animate-pulse rounded-lg"></div>
      )}

      {/* Карточка с фильмом */}
      {randomMovie && (
        <div key={randomMovie.id} className="mt-6 mb-6 bg-gray-800 p-5 rounded-lg shadow-lg w-72 flex flex-col items-center transition-all duration-300 hover:scale-105">
          <div className="relative">
            <FaHeart
              size={32}
              style={{
                fill: isFavorite(randomMovie.id) ? "red" : "white",
                stroke: "black",
                strokeWidth: "15px",
              }}
              className="absolute right-4 top-3 cursor-pointer transform transition-all duration-300 hover:scale-125 hover:shadow-lg"
              onClick={() => {
                setMedias((prev: MoviesType[]) => [...prev, randomMovie]);
                console.log("Сохраненные: ", randomMovie.title ?? randomMovie.name)
              }}
            />
            <Link to={`/media/${media_type}/${randomMovie.id}/${encodeURIComponent(randomMovie.title ?? randomMovie.name)}`}>
              <img
                className="w-72 h-96 object-cover rounded-lg"
                src={randomMovie.poster_path ? `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}` : no_image}
                alt={randomMovie.title ?? randomMovie.name}
              />
            </Link>
          </div>
          <h2 className="mt-3 text-xl font-bold">{randomMovie.title ?? randomMovie.name}</h2>
          <p className="text-gray-400 text-sm">{randomMovie.overview.slice(0, 100)}...</p>
          <span className="mt-2 text-yellow-400 font-semibold">★ {Number(randomMovie.vote_average)?.toFixed(1) ?? "N/A"}</span>
        </div>
      )}

      {/* Если фильм не загружен */}
      {!isLoading && !randomMovie && (
        <p className="mt-6 text-gray-400">Нажмите "Получить", чтобы найти случайный фильм.</p>
      )}
    </div>
  );
}
