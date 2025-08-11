'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { useFavorites } from '@/hooks/useFavorites';
import CharacterSkeleton from '@/components/skeletons/CharacterSkeleton';
import { normalizeText } from './helpers/utils';

type Character = {
  id: number;
  name: string;
  status: string;
  image: string;
};

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get('q') || '';
  const page = Number(searchParams.get('page') || '1');
  const status = searchParams.get('status') || '';
  const sort = searchParams.get('sort') || '';
  const favoritesFilter = searchParams.get('favorites') === 'true';

  const [search, setSearch] = useState(q);
  const debouncedSearch = useDebounce(search, 500);
  const { favorites, toggleFavorite } = useFavorites();

  // update query params when search input change
  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('q', debouncedSearch);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['characters', { q, page, status }],
    queryFn: async ({ signal }) => {
      const res = await api.get('/character', {
        params: {
          name: q,
          page,
          status: status || undefined,
        },
        signal, // abort when query is invalidated
      });
      return res.data;
    },
    placeholderData: keepPreviousData, // keep showing old data while new one is loading
    enabled: !favoritesFilter, // doesn't make a req when showing only favorite characters
  });

  // fetch favorite characters
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
        signal,
      }); // fetching an array of character ids [1, 3]
      return Array.isArray(res.data) ? res.data : [res.data];
    },
    enabled: favoritesFilter && favorites.length > 0,
  });

  const displayedResults = useMemo(() => {
    let results: Character[] = [];

    const normalizedSearch = normalizeText(q);

    if (favoritesFilter) {
      // Here we use favoritesData instead of current page's data so it works across pages
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

    // sorting
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

  const toggleFavoritesFilter = () => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (favoritesFilter) {
      params.delete('favorites');
    } else {
      params.set('favorites', 'true');
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const updateStatusFilter = (newStatus: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (newStatus) {
      params.set('status', newStatus);
    } else {
      params.delete('status');
    }
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
  };

  const updateSort = (newSort: string) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    if (newSort) {
      params.set('sort', newSort);
    } else {
      params.delete('sort');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="px-3">
      <h1 className="text-lg font-bold mb-4 mt-2 text-center">
        Rick & Morty Explorer
      </h1>

      <div className="flex flex-wrap gap-2 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search characters..."
          className="border rounded px-3 py-2 w-full sm:flex-1 dark:bg-gray-800"
        />

        {/* status filter */}
        <select
          value={status}
          onChange={(e) => updateStatusFilter(e.target.value)}
          className="border rounded px-3 py-2.5 w-full sm:w-auto dark:bg-gray-800"
        >
          <option value="">All Status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        {/* mame sorting */}
        <select
          value={sort}
          onChange={(e) => updateSort(e.target.value)}
          className="border rounded px-3 py-2.5 w-full sm:w-auto dark:bg-gray-800"
        >
          <option value="">Sort</option>
          <option value="name-asc">Name (Asc)</option>
          <option value="name-desc">Name (Desc)</option>
        </select>

        {/* toggle favorite */}
        <button
          onClick={toggleFavoritesFilter}
          className={`flex flex-row whitespace-nowrap px-2.5 py-2.5 rounded cursor-pointer w-full sm:w-auto ${
            favoritesFilter
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          {favoritesFilter ? 'Show All' : 'Show Favorites'}
        </button>
      </div>

      {/* loading skeletons */}
      {(isLoading || isLoadingFavorites) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <CharacterSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading &&
        !isLoadingFavorites &&
        displayedResults.length === 0 &&
        search.trim() && (
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
            <div
              key={char.id}
              className="border rounded p-2 flex flex-col items-center dark:bg-gray-800 group cursor-pointer"
            >
              <a href={`/characters/${char.id}`}>
                <Image
                  src={char.image}
                  alt={char.name}
                  width={128}
                  height={128}
                  className="transition-opacity duration-300 group-hover:opacity-70 rounded-md"
                  priority
                />
              </a>
              <Link
                href={`/characters/${char.id}`}
                className="block cursor-pointer"
              >
                <h2 className="mt-2 font-semibold">{char.name}</h2>
                <p className="text-sm text-center">{char.status}</p>
              </Link>

              <button
                onClick={() => toggleFavorite(char.id)}
                className={`mt-2 px-2 py-1 rounded cursor-pointer ${
                  favorites.includes(char.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                {favorites.includes(char.id) ? '★ Favorite' : '☆ Favorite'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {!favoritesFilter && (
        <div className="fixed bottom-4 right-8 flex gap-x-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black
            cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            disabled={page <= 1}
            onClick={() =>
              router.push(`/?q=${q}&page=${page - 1}&status=${status}`)
            }
          >
            Previous
          </button>
          <button
            className="px-8 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black
            cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!data?.info?.next}
            onClick={() =>
              router.push(`/?q=${q}&page=${page + 1}&status=${status}`)
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
