'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

type Props = {
  status: string;
  sort: string;
  favoritesFilter: boolean;
};

export default function Filters({ status, sort, favoritesFilter }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const [search, setSearch] = useState(q);
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('q', debouncedSearch);
    params.set('page', '1');
    router.push(`/?${params.toString()}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

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
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search characters..."
        className="border rounded px-3 py-2 w-full sm:flex-1 dark:bg-gray-800"
      />

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

      <select
        value={sort}
        onChange={(e) => updateSort(e.target.value)}
        className="border rounded px-3 py-2.5 w-full sm:w-auto dark:bg-gray-800"
      >
        <option value="">Sort</option>
        <option value="name-asc">Name (Asc)</option>
        <option value="name-desc">Name (Desc)</option>
      </select>

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
  );
}
