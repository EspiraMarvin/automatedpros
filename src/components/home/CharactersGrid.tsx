'use client';

import CharacterSkeleton from '@/components/skeletons/CharacterSkeleton';
import CharacterPreviewCard from './CharacterPreviewCard';
import { Character } from '../../../typings';

type Props = {
  isLoading: boolean;
  isLoadingFavorites: boolean;
  displayedResults: Character[];
  favorites: number[];
  toggleFavorite: (id: number) => void;
  favoritesFilter: boolean;
  isError: boolean;
  refetch: () => void;
  isFavoritesError: boolean;
  refetchFavorites: () => void;
};

export default function CharactersGrid({
  isLoading,
  isLoadingFavorites,
  displayedResults,
  favorites,
  toggleFavorite,
  favoritesFilter,
  isError,
  refetch,
  isFavoritesError,
  refetchFavorites,
}: Props) {
  return (
    <>
      {(isLoading || isLoadingFavorites) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <CharacterSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && !isLoadingFavorites && displayedResults.length === 0 && (
        <p className="text-center mt-4">
          {favoritesFilter
            ? 'No favorite characters found.'
            : 'No results found.'}
        </p>
      )}

      {isError && !isLoadingFavorites && (
        <p className="text-center">
          Error loading data.{' '}
          <button
            className="cursor-pointer border-2 px-4 ml-6 rounded-md"
            onClick={() => refetch()}
          >
            Retry
          </button>
        </p>
      )}

      {isFavoritesError && (
        <p className="text-center">
          Error loading favorites.{' '}
          <button
            className="cursor-pointer border-2 px-4 ml-6 rounded-md"
            onClick={() => refetchFavorites()}
          >
            Retry
          </button>
        </p>
      )}

      <div className="flex-1 overflow-y-auto" style={{ height: '80vh' }}>
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-4
            p-4
          "
        >
          {displayedResults?.map((char: Character) => (
            <CharacterPreviewCard
              key={char.id}
              char={char}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      </div>
    </>
  );
}
