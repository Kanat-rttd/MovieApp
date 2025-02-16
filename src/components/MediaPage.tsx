import { useParams } from "react-router-dom";
import { MoviesType } from "../types/MoviesType";
import { useEffect, useState } from "react";
import no_image from '../assets/no_image.png'
import axios from "axios";
import { fetchMediaDetails } from "./api";

export default function FilmPage() {
  const { media_type, id } = useParams();

  const [media, setMedia] = useState<MoviesType | null>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id || !media_type) return;
    setLoading(true)
    const cancelToken = axios.CancelToken.source();

    fetchMediaDetails(media_type as "movie" | "tv", id, cancelToken.token)
    .then((data) => {
      setMedia(data);
    }).catch(error => {
      if (axios.isCancel(error)) {
        console.log("Запрос отменён");
      } else {
        console.error("Ошибка загрузки", error);
      }
    }).finally(() => setLoading(false))
  }, [id]);

  if (loading) return <div className="text-center text-white text-xl">Загрузка...</div>;
  if (!media) return <div className="text-center text-white text-xl">Фильм не найден</div>;

  return (
    <div
      className="relative mt-24 min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="relative z-10 max-w-5xl mx-auto p-10 flex flex-col md:flex-row gap-8">
        {/* Левая часть: Постер */}
        <div className="w-full md:w-1/3">
          <img className="rounded-lg shadow-lg w-full"
            src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : no_image}
            alt={media.title} />
        </div>

        {/* Правая часть: Информация */}
        <div className="w-full md:w-2/3 space-y-4">
          <h1 className="text-4xl font-bold">{media.title ?? media.name} ({media.original_title ?? media.original_name})</h1>
          <p className="italic text-gray-300">{media.tagline || "Нет слогана"}</p>

          <div className="flex flex-wrap gap-4">
            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg">Рейтинг</h3>
              <p className="text-xl font-bold text-yellow-400">{Number(media.vote_average).toFixed(1)} / 10</p>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg">Страны производства</h3>
              {media.production_countries.length === 0
                ? (
                  <p>Не предоставлено</p>
                )
                : (
                  <p>{media.production_countries.map((c) => c.name).join(", ")}</p>
                )}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg">Языки</h3>
              {media.production_countries.length === 0
                ? (
                  <p>Не предоставлено</p>
                )
                : (
                  <p>{media.spoken_languages.map((l) => l.name).join(", ")}</p>
                )}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg">Жанр</h3>
              {media.genres.length === 0
                ? (
                  <p>Не предоставлено</p>
                )
                : (
                  <p>{media.genres.map((g) => g.name).join(", ")}</p>
                )}
            </div>

            {media_type === "tv"
              ? (
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="font-semibold text-lg">Продолжительность</h3>
                  <div className="grid geid-cols-2">
                    {media.seasons.map(season => (
                      <p key={season.name}>{season.name} - {season.episode_count} серий</p>
                    ))}
                  </div>
                </div>
              )
              : (
                null
              )}
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h3 className="font-semibold text-lg">Описание</h3>
            {media.overview.length === 0
              ? (
                <p>Не предоставлено</p>
              )
              : (
                <p className="text-gray-300">{media.overview}</p>
              )}
          </div>

          {media.production_companies.length === 0
            ? (
              null
            )
            : (
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg">Производство</h3>
                <p>{media.production_companies.map((company) => company.name).join(", ")}</p>

              </div>
            )}

        </div>
      </div>
    </div>
  );
}


// if (!id || !media_type) return;
//     setLoading(true);

//     const endpoint = media_type === "movie"
//       ? `https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}&language=ru`
//       : `https://api.themoviedb.org/3/tv/${id}?api_key=${api_key}&language=ru`;

//     fetch(endpoint)
//       .then((res) => res.json())
//       .then((data) => {
//         setMedia(data);
//         setLoading(false);
//         console.log(data)
//       }).catch((error) => {
//         setLoading(false);
//         console.error("Ошибка загрузки: ", error);
//       });