import { useParams } from "react-router-dom";
import { MoviesType } from "../types/MoviesType";
import { useEffect, useState } from "react";
import no_image from '../assets/no_image.png';
import axios from "axios";
import { fetchMediaDetails, fetchMediaVideos } from "./api";
import { VideosType } from "../types/MoviesType";

export default function MediaPage() {
  const { media_type, id } = useParams();
  const [media, setMedia] = useState<MoviesType | null>(null);
  const [videos, setVideos] = useState<VideosType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!id || !media_type) return;
    setLoading(true);
    const cancelToken = axios.CancelToken.source();

    Promise.all([
      fetchMediaDetails(media_type as "movie" | "tv", id, cancelToken.token),
      fetchMediaVideos(media_type as "movie" | "tv", id, cancelToken.token),
    ])
      .then(([media_info, videos]) => {
        setMedia(media_info);
        setVideos(videos.results);
      })
      .catch(error => {
        if (axios.isCancel(error)) {
          console.log("Запрос отменён");
        } else {
          console.error("Ошибка загрузки", error);
        }
      })
      .finally(() => setLoading(false));
  }, [id, media_type]);

  if (loading) return <div className="text-center text-white text-xl">Загрузка...</div>;
  if (!media) return <div className="text-center text-white text-xl">Фильм не найден</div>;

  const trailerOrTeaser = videos.find(video => video.type === "Trailer" || video.type === "Teaser");

  return (
    <div className="min-h-screen bg-gray-900 mt-24 text-white">
      {/* Контейнер с фоновым изображением */}
      <div
        className="relative pt-24 pb-10 bg-cover bg-center"
        style={{ backgroundImage: `url(https://image.tmdb.org/t/p/w1280${media.backdrop_path})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-10 flex flex-col md:flex-row gap-8">
          {/* Постер */}
          <div className="w-full md:w-1/3">
            <img
              className="rounded-lg shadow-lg w-full max-w-[300px] mx-auto md:mx-0"
              src={media.poster_path ? `https://image.tmdb.org/t/p/w500${media.poster_path}` : no_image}
              alt={media.title ?? media.name}
            />
          </div>

          {/* Информация */}
          <div className="w-full md:w-2/3 space-y-4">
            <h1 className="text-3xl sm:text-4xl font-bold">{media.title ?? media.name} <span className="text-gray-400">({media.original_title ?? media.original_name})</span></h1>
            <p className="italic text-gray-300 text-lg">{media.tagline || "Нет слогана"}</p>

            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg">Рейтинг</h3>
                <p className="text-xl font-bold text-yellow-400">{Number(media.vote_average).toFixed(1)} / 10</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg">Страны</h3>
                <p>{media.production_countries.length === 0 ? "Не предоставлено" : media.production_countries.map(c => c.name).join(", ")}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg">Языки</h3>
                <p>{media.spoken_languages.length === 0 ? "Не предоставлено" : media.spoken_languages.map(l => l.name).join(", ")}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg">Жанр</h3>
                <p>{media.genres.length === 0 ? "Не предоставлено" : media.genres.map(g => g.name).join(", ")}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg">Дата выхода</h3>
                <p>{media.release_date || "Не предоставлено"}</p>
              </div>
              {media_type === "tv" && (
                <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                  <h3 className="font-semibold text-lg">Сезоны</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {media.seasons.map(season => (
                      <p key={season.name}>{season.name} - {season.episode_count} серий</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h3 className="font-semibold text-lg">Описание</h3>
              <p className="text-gray-300">{media.overview || "Не предоставлено"}</p>
            </div>

            {media.production_companies.length > 0 && (
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold text-lg">Производство</h3>
                <p>{media.production_companies.map(company => company.name).join(", ")}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Видео-контейнер вне фона */}
      {trailerOrTeaser && (
        <div className="max-w-5xl mx-auto px-4 sm:px-10 py-8">
          <h3 className="text-2xl font-semibold mb-4 text-center text-white">Трейлер или тизер</h3>
          <div className="relative w-full max-w-3xl mx-auto rounded-lg overflow-hidden shadow-xl">
            <iframe
              className="w-full aspect-video"
              src={`https://www.youtube.com/embed/${trailerOrTeaser.key}`}
              title={trailerOrTeaser.name}
              style={{ border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}