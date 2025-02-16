import { createContext, useState } from "react";
import { MoviesType } from "../types/MoviesType";

type FavoritesContextType = {
  medias: MoviesType[]
  setMedias: React.Dispatch<React.SetStateAction<MoviesType[]>>
  isFavorite: (mediaID: number) => boolean
  removeFromFavorites: (mediaID: number) => void
};

type FavoritesChildrenProviderProps = {
  children: React.ReactNode
};

export const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({children}: FavoritesChildrenProviderProps) {
  const [medias, setMedias] = useState<MoviesType[]>([]);

  const isFavorite = (mediaID: number) => {
    return medias.some((media) => media.id === mediaID);
  };

  const removeFromFavorites = (mediaID: number) => {
    setMedias(currentState => currentState.filter(media => media.id !== mediaID));
  }

  return (
    <FavoritesContext.Provider value={{medias, setMedias, isFavorite, removeFromFavorites}}>
      {children}
    </FavoritesContext.Provider>
  );
};