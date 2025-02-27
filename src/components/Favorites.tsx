import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import no_image from "../assets/no_image.png";
import empty from '../assets/empty1.png';

export default function Favorites() {
  const favoritesContext = useContext(FavoritesContext);

  if (!favoritesContext) {
    throw new Error("Favorites context error null")
  };

  const { medias, removeFromFavorites } = favoritesContext;

  return (
    <div>
      {medias.length > 0
        ? (
          <div className="rounded-lg flex flex-wrap justify-center content-center mt-24 pt-4 mb-10">
            {medias.map((media) => (
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
                        fill: "red",
                        stroke: "black",
                        strokeWidth: "15px",
                      }}
                      className="absolute right-8 top-6 cursor-pointer transform transition-all duration-300 hover:scale-125 hover:shadow-lg"
                      onClick={() => {
                        removeFromFavorites(media.id);
                        console.log("Удалено id: ", media.id)
                      }}
                    />
                    <Link
                      to={`/media/${media.media_type}/${media.id}/${encodeURIComponent(media.title ?? media.name)}`}
                    >
                      <img
                        className="w-72 h-76 object-cover cursor-pointer rounded-t-lg"
                        src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : no_image}
                        alt={media.title ?? media.name}
                      />
                    </Link>
                  </div>

                  <div className="mt-3 max-w-56 flex flex-col items-start">
                    <span className="text-base font-bold text-transparent bg-clip-text text-white">{media.title ?? media.name}</span>
                    <div className="flex items-center mt-2">
                      <span className="text-sm text-yellow-500">★ {Number(media.vote_average).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )
        : (
          <div className="flex flex-col items-center justify-center mt-44">
            <img src={empty} alt="nothing found" className="w-96 h-80 mb-4" />
            <p className="text-center text-2xl font-bold">
              К сожалению <br /> здесь пока пусто
            </p>
          </div>
        )
      }

    </div>
  )
}
