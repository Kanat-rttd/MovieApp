import { useEffect, useState } from "react";
import { fetchMovieGenres, fetchSerieGenres } from "./api";
import axios from "axios";
import { MovieGenresType } from "../types/GenresType";
import { FaChevronDown, FaChevronUp, } from "react-icons/fa";
import { useLocation } from "react-router-dom";

type FilterPropsType = {
  setFilters: React.Dispatch<React.SetStateAction<{ genres: {movie: number[], tv: number[]}, min_rating: string | null }>>;
}

export default function Filter({ setFilters }: FilterPropsType) {

  const [isActive, setIsActive] = useState<boolean>(false);
  const [isActiveMovie, setIsActiveMovie] = useState<boolean>(false);
  const [isActiveSerie, setIsActiveSerie] = useState<boolean>(false);

  const [fetchedMovieGenres, setFetchedMovieGenres] = useState<MovieGenresType[] | null>(null);
  const [fetchedSerieGenres, setFetchedSerieGenres] = useState<MovieGenresType[] | null>(null);

  const [movieGenresToFetch, setMovieGenresToFetch] = useState<number[]>([]);
  const [serieGenresToFetch, setSerieGenresToFetch] = useState<number[]>([]);

  const [selectedRating, setSelectedRating] = useState<string>("1");
  // const [hasRatingChanged, setHasRatingChanged] = useState<boolean>(false);

  const location = useLocation();

  const handleArrowDownClick = () => {
    setIsActive(true);
  };

  const handleArrowUpClick = () => {
    setIsActive(false);
  };

  const handleArrowDownMovie = () => {
    setIsActiveMovie(true);
    setIsActiveSerie(false);
  };

  const handleArrowDownSerie = () => {
    setIsActiveSerie(true);
    setIsActiveMovie(false);
  };

  const handleArrowUpMovie = () => {
    setIsActiveMovie(false);
  };

  const handleArrowUpSerie = () => {
    setIsActiveSerie(false);
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRating = e.target.value;
    setSelectedRating(newRating);
    console.log("Выбранный рейтинг: ", newRating);
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    fetchMovieGenres(cancelToken.token)
      .then(data => {
        setFetchedMovieGenres(data.genres);
        // console.log(data.genres);
      }).catch(error => {
        if (axios.isCancel(error)) {
          console.log("Запрос отменён");
        } else {
          console.error("Ошибка загрузки", error);
        }
      });

    fetchSerieGenres(cancelToken.token)
      .then(data => {
        setFetchedSerieGenres(data.genres);
        // console.log(data.genres);
      }).catch(error => {
        if (axios.isCancel(error)) {
          console.log("Запрос отменён");
        } else {
          console.error("Ошибка загрузки", error);
        }
      })

  }, []);

  const handleApply = () => {
    setFilters({
      genres: {
        movie: isActiveMovie ? movieGenresToFetch : [],
        tv: isActiveSerie ? serieGenresToFetch : [],
      },
      min_rating: selectedRating,
    });

    setMovieGenresToFetch([]);
    setSerieGenresToFetch([]);

    setIsActive(false);
  };

  const showFilterArrow = location.pathname === '/';

  return (
    <div className="relative w-full">
      {!isActive && showFilterArrow && (
        <div onClick={handleArrowDownClick} className="absolute left-1/2 transform -translate-x-1/2 z-50 cursor-pointer">
          <FaChevronDown size={28} className="text-gray-800 hover:text-red-500 transition-colors duration-300" />
        </div>
      )}

      {isActive && (
        <div className="abolute top-24 left-0 w-full bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 shadow-lg p-2 text-white z-40">

          <div>
            {/* Дивы с надписями и стрелками */}
            <div className="flex items-center justify-around">
              <div className="flex items-center">
                <h2 className="text-xl mr-1">Фильмы</h2>
                {isActiveMovie ? (
                  <FaChevronUp
                    onClick={handleArrowUpMovie}
                    size={20}
                    className="mt-1 text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  />
                ) : (
                  <FaChevronDown
                    onClick={handleArrowDownMovie}
                    size={20}
                    className="mt-1 text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  />
                )}
              </div>

              <div className="flex items-center">
                <h2 className="text-xl mr-1">Сериалы</h2>
                {isActiveSerie && (
                  <FaChevronUp
                    onClick={handleArrowUpSerie}
                    size={20}
                    className="mt-1 text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  />
                )}
                {!isActiveSerie && (
                  <FaChevronDown
                    onClick={handleArrowDownSerie}
                    size={20}
                    className="mt-1 text-black hover:text-red-500 transition-colors duration-300 cursor-pointer"
                  />
                )}
              </div>
            </div>

            {/* дивы с жанрами медиа типов */}
            <div className="my-4 ml-10">
              {/* жанры фильмов */}
              <div>
                {isActiveMovie && (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {fetchedMovieGenres?.map((genre) => (
                        <div key={genre.id} className="flex items-center">
                          <input
                            id={`genre-${genre.id}`}
                            type="checkbox"
                            className="cursor-pointer accent-red-500 h-4 w-4"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMovieGenresToFetch(prev => [...prev, genre.id]);
                              } else {
                                setMovieGenresToFetch(prev => prev.filter(id => id !== genre.id))
                              }
                              console.log(genre.id)
                            }}
                          />
                          <label
                            htmlFor={`genre-${genre.id}`}
                            className="ml-2 text-sm hover:text-red-400 transition-colors duration-200"
                          >
                            {genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-center gap-6 mt-5">
                      <div>
                        <label htmlFor="rating-select" className="mr-2">Минимальная оценка</label>
                        <select
                          name="rating"
                          id="rating"
                          value={selectedRating}
                          onChange={handleRatingChange}
                          className="text-black p-1 rounded-lg"
                        >
                         <option value="" disabled>Выберите рейтинг</option> 
                         {Array.from({length: 9}, (_, i) => i + 1).map(rating => (
                          <option key={rating} value={rating}>
                            {rating}
                          </option>
                         ))}
                        </select>
                      </div>

                      <button
                        onClick={handleApply}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow-md transition duration-300"
                      >
                        Применить
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow-md transition duration-300">
                        Сбросить
                      </button>
                    </div>

                  </div>
                )}
              </div>
              {/* Жанры фильмов конец */}

              {/* Жанры сериалов */}
              <div>
                {isActiveSerie && (
                  <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {fetchedSerieGenres?.map((genre) => (
                        <div key={genre.id} className="flex items-center">
                          <input
                            id={`genre-${genre.id}`}
                            type="checkbox"
                            className="cursor-pointer accent-red-500 h-4 w-4"
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSerieGenresToFetch(prev => [...prev, genre.id]);
                              } else {
                                setSerieGenresToFetch(prev => prev.filter(id => id !== genre.id))
                              }
                              console.log(genre.id)
                            }}
                          />
                          <label
                            htmlFor={`genre-${genre.id}`}
                            className="ml-2 text-sm hover:text-red-400 transition-colors duration-200"
                          >
                            {genre.name.charAt(0).toUpperCase() + genre.name.slice(1)}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-center gap-6 mt-5">
                      <button
                        onClick={handleApply}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow-md transition duration-300"
                      >
                        Применить
                      </button>
                      <button className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow-md transition duration-300">
                        Сбросить
                      </button>
                    </div>

                  </div>
                )}
              </div>
              {/* жанры сериалов конец */}
            </div>

          </div>

          {/* Иконка закрытия */}
          <div
            onClick={handleArrowUpClick}
            className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 cursor-pointer z-50"
            style={{ bottom: "-1.5rem" }}
          >
            <FaChevronUp
              size={28}
              className="text-gray-800 hover:text-red-500 transition-colors duration-300"
            />
          </div>
        </div>
      )}
    </div>
  )
}
