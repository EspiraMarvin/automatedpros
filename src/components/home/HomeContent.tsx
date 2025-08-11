'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useMemo } from 'react';
import { useFavorites } from '@/hooks/useFavorites';
import { normalizeText } from '@/app/helpers/utils';
import { Character } from '../../../typings';
import CharactersGrid from './CharactersGrid';
import Filters from './Filters';
import Pagination from './Pagination';

export default function HomeContent() {
  const searchParams = useSearchParams();

  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || '1');
  const status = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || '';
  const favoritesFilter = searchParams.get('favorites') === 'true';

  const { favorites, toggleFavorite } = useFavorites();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['characters', { q, page, status }],
    queryFn: async ({ signal }) => {
      const res = await api.get('/character', {
        params: {
          name: q,
          page,
          status: status || undefined,
        },
        signal,
      });
      return res.data;
    },
    placeholderData: keepPreviousData, // keep showing old data while new one is loading
    enabled: !favoritesFilter, // don't make a req when showing only favorite characters
  });

  const {
    data: favoritesData,
    isLoading: isLoadingFavorites,
    isError: isFavoritesError,
    refetch: refetchFavorites,
  } = useQuery({
    queryKey: ['favoriteCharacters', favorites],
    queryFn: async ({ signal }) => {
      if (favorites.length === 0) return [];
      const res = await api.get(`/character/${favorites.join(',')}`, {
        // fetch data from array of character ids
        signal,
      });
      return Array.isArray(res.data) ? res.data : [res.data];
    },
    enabled: favoritesFilter && favorites.length > 0,
  });

  const displayedResults = useMemo(() => {
    let results: Character[] = [];

    const normalizedSearch = normalizeText(q);

    if (favoritesFilter) {
      const allFavoriteChars = favoritesData || [];

      results = allFavoriteChars.filter((char) =>
        normalizeText(char.name).includes(normalizedSearch)
      );

      if (status) {
        results = results.filter(
          (char) => normalizeText(char.status) === normalizeText(status)
        );
      }
    } else {
      results = (data?.results || []).filter((char: { name: string }) =>
        normalizeText(char.name).includes(normalizedSearch)
      );

      if (status) {
        results = results.filter(
          (char) => normalizeText(char.status) === normalizeText(status)
        );
      }
    }

    if (sort === 'name-asc') {
      results = [...results].sort((a, b) =>
        normalizeText(a.name).localeCompare(normalizeText(b.name))
      );
    } else if (sort === 'name-desc') {
      results = [...results].sort((a, b) =>
        normalizeText(b.name).localeCompare(normalizeText(a.name))
      );
    }

    return results;
  }, [data, favoritesFilter, favoritesData, q, status, sort]);

  return (
    <div className="px-3">
      <h1 className="text-lg font-bold mb-4 mt-2 text-center">
        Rick & Morty Explorer
      </h1>

      <Filters status={status} sort={sort} favoritesFilter={favoritesFilter} />

      <CharactersGrid
        isLoading={isLoading}
        isLoadingFavorites={isLoadingFavorites}
        displayedResults={displayedResults}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        favoritesFilter={favoritesFilter}
        isError={isError}
        refetch={refetch}
        isFavoritesError={isFavoritesError}
        refetchFavorites={refetchFavorites}
      />

      {!favoritesFilter && (
        <Pagination
          page={page}
          hasNext={!!data?.info?.next}
          q={q}
          status={status}
        />
      )}
    </div>
  );
}
