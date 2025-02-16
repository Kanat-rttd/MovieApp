export type MoviesType = {
  id: number
  title: string
  name: string
  overview: string
  poster_path: string
  release_date: string
  vote_average: string
  tagline: string
  original_title: string
  original_name: string
  backdrop_path: string
  media_type: string
  production_companies: ProductionCompanies[]
  production_countries: ProductionCountries[]
  spoken_languages: SpokenLanguages[]
  genres: Genres[]
  seasons: Seasons[]
}

type ProductionCompanies = {
  id: number
  name: string
};

type ProductionCountries = {
  iso_3166_1: string
  name: string
};

type SpokenLanguages = {
  name: string
};

type Genres = {
  id: number
  name: string
};

type Seasons = {
  name: string
  episode_count: number
}