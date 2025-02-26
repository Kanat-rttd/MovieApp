import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { MoviesType } from "../types/MoviesType";
import empty from '../assets/empty1.png';
import axios from "axios";
import { searchMulti } from "./api";
import { FaHeart } from "react-icons/fa";
import { FavoritesContext } from "../context/FavoritesContext";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState<MoviesType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const movieName: string | null = searchParams.get("q"); //получаем название которое ввел пользователь из строки url

  const favoritesContext = useContext(FavoritesContext);

  if (!favoritesContext) {
    throw new Error("Favorites context error null")
  };

  const { setMedias, isFavorite, removeFromFavorites } = favoritesContext;

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    setIsLoading(true);

    searchMulti(movieName, cancelToken.token)
      .then((data) => {
        setMovies(data.results)
      }).catch(error => {
        if (axios.isCancel(error)) {
          console.log("Запрос отменён");
        } else {
          console.error("Ошибка загрузки", error)
        }
      }).finally(() => setIsLoading(false));
  }, [movieName]);

  return (
    <div className="mt-28 p-4">
      {movies.length > 0 ? (
        <div className="grid grid-cols-4 gap-4">
          {movies.map((movie) => (
            <div>
              <div className="relative bg-gray-800 text-white p-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                <div className="absolute top-2 left-2 px-3 py-1 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  <h3 className="text-white text-sm font-bold">
                    {movie.media_type === "movie" ? "Фильм" : "Сериал"}
                  </h3>
                </div>
                <div>
                  <FaHeart
                    size={32}
                    style={{
                      fill: isFavorite(movie.id) ? "red" : "white",
                      stroke: "black",
                      strokeWidth: "15px",
                    }}
                    className="absolute right-8 top-6 cursor-pointer transform transition-all duration-300 hover:scale-125 hover:shadow-lg"
                    onClick={() => {
                      if (isFavorite(movie.id)) {
                        removeFromFavorites(movie.id);
                        console.log("Удалено из сохраненных", movie.title ?? movie.name);
                      } else {
                        setMedias((prev: MoviesType[]) => [...prev, movie])
                        console.log("Добавлено в сохраненные: ", movie.title ?? movie.name)
                      }
                    }}
                  />
                  <Link
                    to={`/media/${movie.media_type}/${movie.id}/${encodeURIComponent(movie.title ?? movie.name)}`}
                  >
                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="rounded-lg mb-2" />
                  </Link>
                </div>
                <h2 className="text-lg">{movie.title ?? movie.name}</h2>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <img src={empty} alt="nothing found" className="w-96 h-80 mb-4" />
          <p className="text-center text-2xl font-bold">
            К сожалению по&nbsp;вашему <br /> запросу ничего не&nbsp;найдено
          </p>
        </div>
      )}

      {isLoading &&
        Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="w-1/4 p-2 pb-4 flex flex-col items-center">
            <div className="bg-gray-300 w-72 h-76 animate-pulse rounded-lg"></div>
            <div className="bg-gray-300 h-6 w-56 mt-2 animate-pulse rounded"></div>
            <div className="bg-gray-300 h-4 w-32 mt-1 animate-pulse rounded"></div>
          </div>
        ))
      }
    </div>
  );
};
