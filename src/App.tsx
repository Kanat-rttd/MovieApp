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
import axios, { all } from 'axios';
import { fetchMovies, fetchSeries } from './components/api';
import { FavoritesProvider } from './context/FavoritesContext';

function App() {
  const [allMedia, setAllMedia] = useState<MoviesType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getData = () => {
    setIsLoading(true);
    const cancelToken = axios.CancelToken.source();

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

      console.log(allData)
      setAllMedia(prevData => [...prevData, ...allData])
    }).catch(error => {
      if (axios.isCancel(error)) {
        console.log("Запрос отменён");
      } else {
        console.error("Ошибка загрузки", error)
      }
    }).finally(() => setIsLoading(false));

    return () => cancelToken.cancel("Компонент размонтирован");
  };

  useEffect(() => {
    getData();

    return () => {
      console.log("Компонент размонтирован")
    }
  }, []);

  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Main allMedia={allMedia} setAllMedia={setAllMedia} isLoading={isLoading} getData={getData} />}></Route>
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