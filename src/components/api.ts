import axios from "axios";

const api_key: string = "a59a83da868ff0470ccc65776196cbf8";

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: api_key,
    language: "ru"
  }
});

export const fetchMovies = async (cancelToken: any) => {
  let randomPage = Math.floor(Math.random() * 500) + 1;
  const res = await api.get(`/discover/movie`, {
    params: { page: randomPage },
    cancelToken
  });
  return res.data;
};

export const fetchSeries = async (cancelToken: any) => {
  let randomPage = Math.floor(Math.random() * 500) + 1;
  const res = await api.get(`discover/tv`, {
    params: { page: randomPage },
    cancelToken
  });
  return res.data;
};

export const searchMulti = async (query: string | null, cancelToken: any) => {
  const res = await api.get(`search/multi`, {
    params: { query },
    cancelToken
  });
  return res.data;
};

export const fetchMediaDetails = async (media_type: "movie" | "tv", id: string, cancelToken: any) => {
  const res = await api.get(`/${media_type}/${id}`, {
    cancelToken
  });

  return res.data;
};

export const fetchMediaVideos = async (media_type: "movie" | "tv", id: string, cancelToken: any) => {
  const res = await api.get(`/${media_type}/${id}/videos`, {
    params: {
      language: "ru-RU",
    },
    cancelToken
  });

  return res.data;
}

export const fetchRandomMedia = async (media_type: "movie" | "tv", id: number, cancelToken: any) => {
  const res = await api.get(`/${media_type}/${id}`, {
    cancelToken
  });

  return res.data;
};

export const fetchMovieGenres = async (cancelToken: any) => {
  const res = await api.get(`/genre/movie/list`, {
    cancelToken,
  });

  return res.data;
};

export const fetchSerieGenres = async (cancelToken: any) => {
  const res = await api.get(`/genre/tv/list`, {
    cancelToken,
  });

  return res.data;
};

export const fetchMediaWithGenres = async (
    media_type: "movie" | "tv",
    genreIds: number[],
    page: number = 1,
    cancelToken: any,
    isAnime: boolean = false,
    min_rating: string | null,
  ) => {
  const genreString = genreIds.join("|");

  const params: any = {
    with_genres: genreString,
    sort_by: "popularity.desc",
    "vote_average.gte": min_rating === null ? 1 : Number(min_rating),
    "vote_count.gte": 100,
    page,
  };

  if (isAnime) {
    params.with_original_language = "ja";
  }

  const res = await api.get(`/discover/${media_type}`, {
    params,
    cancelToken
  });

  return res.data;
}