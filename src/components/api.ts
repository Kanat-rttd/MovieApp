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
}