import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Main from './components/Main';
import Favorites from './components/Favorites';
import MediaPage from './components/MediaPage';
import { MoviesType } from './types/MoviesType';
import Random from './components/Random';
import SearchPage from './components/SearchPage';
import axios from 'axios';
import { fetchMediaWithGenres, fetchMovies, fetchSeries } from './components/api';
import { FavoritesProvider } from './context/FavoritesContext';

type FiltersTypes = {
  media_types: string[],
  genres: {
    movie: number[]
    tv: number[]
  },
  min_rating: string | null,
  isAnime: boolean,
};

function App() {
  const [allMedia, setAllMedia] = useState<MoviesType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [filters, setFilters] = useState<FiltersTypes>({
    media_types: [],
    genres: { movie: [], tv: [] },
    min_rating: null,
    isAnime: false,
  })

  const [page, setPage] = useState<number>(1);

  const getData = (nextPage: number = 1, append: boolean = false) => {
    setIsLoading(true);
    const cancelToken = axios.CancelToken.source();

    const { media_types, genres, min_rating } = filters;

    // Если выбраны фильтры (media_types не пустой)
    if (media_types.length > 0) {
      const promises = media_types.map((type) =>
        fetchMediaWithGenres(
          type as "movie" | "tv",
          genres[type as "movie" | "tv"] || [],
          nextPage,
          cancelToken.token,
          filters.isAnime,
          min_rating,
        )
      );

      Promise.all(promises)
        .then((results) => {
          const newData = results.flatMap((result, index) =>
            result.results.map((item: MoviesType) => ({
              ...item,
              media_type: media_types[index],
            }))
          );
          setAllMedia((prev) => (append ? [...prev, ...newData] : newData));
          setPage(nextPage);
        })
        .catch((error) => {
          if (axios.isCancel(error)) console.log("Запрос отменён");
          else console.error("Ошибка загрузки", error);
        })
        .finally(() => setIsLoading(false));
    } else {
      Promise.all([
        fetchMovies(cancelToken.token),
        fetchSeries(cancelToken.token),
      ]).then(([movies, series]) => {
        const filteredMovies = movies.results.filter((movie: MoviesType) => movie.poster_path && movie.overview.length > 0);
        const filteredSeries = series.results.filter((serie: MoviesType) => serie.poster_path && serie.overview.length > 0);

        const allData = [
          ...filteredMovies.map((movie: MoviesType) => ({ ...movie, media_type: "movie" })),
          ...filteredSeries.map((serie: MoviesType) => ({ ...serie, media_type: "tv" })),
        ];

        // console.log(allData);
        setAllMedia(prevData => append ? [...prevData, ...allData] : allData);
        setPage(nextPage)
      }).catch(error => {
        if (axios.isCancel(error)) {
          console.log("Запрос отменён");
        } else {
          console.error("Ошибка загрузки", error)
        }
      }).finally(() => setIsLoading(false));
    }

    return () => cancelToken.cancel("Компонент размонтирован");
  };

  useEffect(() => {
    getData(1, false);

    return () => {
      console.log("Компонент размонтирован")
    }
  }, [filters]);

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Navbar setFilters={setFilters} />
        <Routes>
          <Route path='/' element={<Main allMedia={allMedia} setAllMedia={setAllMedia} isLoading={isLoading} getData={() => getData(page + 1, true)} />}></Route>
          <Route path='/favorites' element={<Favorites />}></Route>
          <Route path='/random' element={<Random />}></Route>
          <Route path='/media/:media_type/:id/:title' element={<MediaPage />}></Route>
          <Route path='/search' element={<SearchPage />}></Route>
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  )
}

export default App