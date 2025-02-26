import { Link, useLocation } from "react-router-dom";
import { MoviesType } from "../types/MoviesType";
import no_image from '../assets/no_image.png';
import { useContext, useEffect } from "react";
import { FaHeart } from "react-icons/fa";
import { FavoritesContext } from "../context/FavoritesContext";

type MoviesPropsType = {
  allMedia: MoviesType[],
  setAllMedia: React.Dispatch<React.SetStateAction<MoviesType[]>>
  isLoading: boolean
  getData: () => (nextPage?: number, append?: boolean) => void
}

export default function Main({ allMedia, isLoading, getData }: MoviesPropsType) {
  const location = useLocation();

  const favoritesContext = useContext(FavoritesContext);

  if (!favoritesContext) {
    throw new Error("Favorites context error null")
  };

  const { setMedias, isFavorite, removeFromFavorites } = favoritesContext;

  const getAnotherData = () => {
    getData()
  };

  useEffect(() => {
    // Проверяем, есть ли сохранённое положение скролла
    const savedScrollPosition = sessionStorage.getItem("scrollPosition");

    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition, 10));
    }

    // Перед уходом со страницы сохраняем положение прокрутки
    const handleScroll = () => {
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  const itemsPerRow = 4; // 
  const lastRowItems = allMedia.length % itemsPerRow;
  const skeletonsToCompleteRow = lastRowItems === 0 ? 0 : itemsPerRow - lastRowItems;
  const totalSkeletons = isLoading ? skeletonsToCompleteRow + itemsPerRow : 0;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 mt-28 pt-4 mb-10 gap-4">
        {allMedia.map((media) => (
          <div
            key={media.id}
            className="p-2 pb-4 flex flex-col items-center animate-fade-in"
          >
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <div className="absolute top-2 left-2 px-3 py-1 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <h3 className="text-white text-sm font-bold">
                  {media.media_type === "movie" ? "Фильм" : "Сериал"}
                </h3>
              </div>

              <div>
                <FaHeart
                  size={32}
                  style={{
                    fill: isFavorite(media.id) ? "red" : "white",
                    stroke: "black",
                    strokeWidth: "15px",
                  }}
                  className="absolute right-8 top-6 cursor-pointer transform transition-all duration-300 hover:scale-125 hover:shadow-lg"
                  onClick={() => {
                    if (isFavorite(media.id)) {
                      removeFromFavorites(media.id);
                      console.log("Удалено из сохраненных", media.title ?? media.name);
                    } else {
                      setMedias((prev: MoviesType[]) => [...prev, media])
                      console.log("Добавлено в сохраненные: ", media.title ?? media.name)
                    }
                  }}
                />
                <Link
                  to={`/media/${media.media_type}/${media.id}/${encodeURIComponent(media.title ?? media.name)}`}
                >
                  <img
                    className="w-full h-76 object-cover cursor-pointer rounded-t-lg"
                    src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : no_image}
                    alt={media.title ?? media.name}
                  />
                </Link>
              </div>

              <div className="mt-3 max-w-56 flex flex-col items-start">
                <span className="text-base font-bold text-transparent bg-clip-text text-white w-full">{media.title ?? media.name}</span>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-yellow-500">★ {Number(media.vote_average).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Skeleton Loader при загрузке */}
        {isLoading &&
          Array.from({ length: totalSkeletons }).map((_, index) => (
            <div key={`skeleton-${index}`} className="p-2 pb-4 flex flex-col items-center">
              <div className="bg-gray-300 w-full h-76 animate-pulse rounded-lg"></div>
              <div className="bg-gray-300 h-6 w-56 mt-2 animate-pulse rounded"></div>
              <div className="bg-gray-300 h-4 w-32 mt-1 animate-pulse rounded"></div>
            </div>
          ))}
      </div>

      {/* Кнопка "Загрузить еще" */}
      <div className="text-center m-auto w-36 h-12 bg-gray-600 p-3 rounded-lg mb-4 mt-4">
        <button onClick={getAnotherData} className="text-white">
          {isLoading ? "Загрузка..." : "Загрузить еще"}
        </button>
      </div>

    </div>

  );
}