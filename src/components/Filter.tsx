import { useEffect, useState } from "react";
import { fetchMovieGenres, fetchSerieGenres } from "./api";
import axios from "axios";
import { MovieGenresType } from "../types/GenresType";
import { FaChevronDown, FaChevronUp, } from "react-icons/fa";
import { useLocation } from "react-router-dom";

type FilterPropsType = {
  setFilters: React.Dispatch<React.SetStateAction<
    {
      media_types: string[],
      genres: { movie: number[], tv: number[] },
      min_rating: string | null,
      isAnime: boolean,
    }>>;
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

  const [isAnime, setIsAnime] = useState<boolean>(false);

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
    const hasMovieFilters = isActiveMovie && (movieGenresToFetch.length > 0 || selectedRating !== "1");
    const hasSerieFilters = isActiveSerie && (serieGenresToFetch.length > 0 || selectedRating !== "1");

    const animeGenreId = 16;

    // Определяем, для каких типов медиа выбраны фильтры
    const mediaTypes = [];
    if (hasMovieFilters) mediaTypes.push("movie");
    if (hasSerieFilters) mediaTypes.push("tv");

    setFilters({
      media_types: mediaTypes, // Новое поле
      genres: {
        movie: isAnime ? [animeGenreId] : (hasMovieFilters ? movieGenresToFetch : []),
        tv: isAnime ? [animeGenreId] : (hasSerieFilters ? serieGenresToFetch : []),
      },
      min_rating: selectedRating === "1" ? null : selectedRating,
      isAnime: isAnime
    });

    setMovieGenresToFetch([]);
    setSerieGenresToFetch([]);
    setIsActive(false);
  };

  const handleReset = () => {
    setMovieGenresToFetch([]);
    setSerieGenresToFetch([]);
    setIsAnime(false);
    setSelectedRating("1");
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
                <h2 className="text-xl mr-1">{isActiveMovie ? <span className="text-red-500">Фильмы</span> : <span>Фильмы</span>}</h2>
                {isActiveMovie ? (
                  <FaChevronUp
                    onClick={handleArrowUpMovie}
                    size={20}
                    className="mt-1 text-red-500 transition-colors duration-300 cursor-pointer"
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
                <h2 className="text-xl mr-1">{isActiveSerie ? <span className="text-red-500">Сериалы</span> : <span>Сериалы</span>}</h2>
                {isActiveSerie && (
                  <FaChevronUp
                    onClick={handleArrowUpSerie}
                    size={20}
                    className="mt-1 text-red-500 transition-colors duration-300 cursor-pointer"
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
                            checked={movieGenresToFetch.includes(genre.id)}
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

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-5">
                      <div className="flex flex-col md:block">
                        <label htmlFor="rating-select" className="mr-2">Минимальная оценка</label>
                        <select
                          name="rating"
                          id="rating"
                          value={selectedRating}
                          onChange={handleRatingChange}
                          className="text-black p-1 rounded-lg"
                        >
                          <option value="" disabled>Выберите рейтинг</option>
                          {Array.from({ length: 9 }, (_, i) => i + 1).map(rating => (
                            <option key={rating} value={rating}>
                              {rating}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          id="anime-filter"
                          checked={isAnime}
                          onChange={(e) => setIsAnime(e.target.checked)}
                          className="cursor-pointer accent-red-500 h-4 w-4"
                        />
                        <label htmlFor="anime-filter" className="ml-2">Только аниме</label>
                      </div>

                      <button
                        onClick={handleApply}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow-md transition duration-300"
                      >
                        Применить
                      </button>
                      <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow-md transition duration-300">
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
                            checked={serieGenresToFetch.includes(genre.id)}
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

                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-5">
                      <div className="flex flex-col md:block">
                        <label htmlFor="rating-select" className="mr-2">Минимальная оценка</label>
                        <select
                          name="rating"
                          id="rating"
                          value={selectedRating}
                          onChange={handleRatingChange}
                          className="text-black p-1 rounded-lg"
                        >
                          <option value="" disabled>Выберите рейтинг</option>
                          {Array.from({ length: 9 }, (_, i) => i + 1).map(rating => (
                            <option key={rating} value={rating}>
                              {rating}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          id="anime-filter"
                          checked={isAnime}
                          onChange={(e) => setIsAnime(e.target.checked)}
                          className="cursor-pointer accent-red-500 h-4 w-4"
                        />
                        <label htmlFor="anime-filter" className="ml-2">Только аниме</label>
                      </div>

                      <button
                        onClick={handleApply}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow-md transition duration-300"
                      >
                        Применить
                      </button>
                      <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-5 py-2 rounded-lg font-semibold tracking-wide shadow-md transition duration-300">
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
