import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Navbar from './components/Navbar';
import Main from './components/Main';
import Favorites from './components/Favorites';
import AboutUs from './components/AboutUs';
import MediaPage from './components/MediaPage';
import { MoviesType } from './types/MoviesType';
import Random from './components/Random';
import SearchPage from './components/SearchPage';
import axios from 'axios';
import { fetchMediaWithGenres, fetchMovies, fetchSeries } from './components/api';
import { FavoritesProvider } from './context/FavoritesContext';

type FiltersTypes = {
  genres: {
    movie: number[]
    tv: number[]
  },
  min_rating: string | null
};

function App() {
  const [allMedia, setAllMedia] = useState<MoviesType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // const [selectedGenres, setSelectedGenres] = useState<{ movie: number[], tv: number[] }>({
  //   movie: [],
  //   tv: [],
  // });

  const [filters, setFilters] = useState<FiltersTypes>({
    genres: {movie: [], tv: []},
    min_rating: null,
  })

  const [page, setPage] = useState<number>(1);

  const getData = (nextPage: number = 1, append: boolean = false) => {
    setIsLoading(true);
    const cancelToken = axios.CancelToken.source();

    if (filters.genres.movie.length > 0 || filters.genres.tv.length > 0) {
      Promise.all([
        filters.genres.movie.length > 0 
        ? fetchMediaWithGenres("movie", filters.genres.movie, nextPage, cancelToken.token, filters.min_rating) 
        : Promise.resolve({ results: [] }),

        filters.genres.tv.length > 0 
        ? fetchMediaWithGenres("tv", filters.genres.tv, nextPage, cancelToken.token, filters.min_rating) 
        : Promise.resolve({ results: [] }),
      ])
        .then(([movies, series]) => {
          const filteredMovies = movies.results.map((movie: MoviesType) => ({ ...movie, media_type: "movie" }));
          const filteredSeries = series.results.map((serie: MoviesType) => ({ ...serie, media_type: "tv" }));

          const newData = [...filteredMovies, ...filteredSeries];

          console.log(newData)

          setAllMedia((prev) => (append ? [...prev, ...newData] : newData));
          setPage(nextPage)
        })
        .catch(error => {
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
  }, [filters.genres]);

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Navbar setFilters={setFilters} />
        <Routes>
          <Route path='/' element={<Main allMedia={allMedia} setAllMedia={setAllMedia} isLoading={isLoading} getData={() => getData(page+1, true)} />}></Route>
          <Route path='/favorites' element={<Favorites />}></Route>
          <Route path='/about-us' element={<AboutUs />}></Route>
          <Route path='/random' element={<Random />}></Route>
          <Route path='/media/:media_type/:id/:title' element={<MediaPage />}></Route>
          <Route path='/search' element={<SearchPage />}></Route>
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  )
}

export default App