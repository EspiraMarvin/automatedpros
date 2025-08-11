'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Character } from '../../../typings';

type Props = {
  char: Character;
  favorites: number[];
  toggleFavorite: (id: number) => void;
};

export default function CharacterPreviewCard({
  char,
  favorites,
  toggleFavorite,
}: Props) {
  const isFavorite = favorites.includes(char.id);

  return (
    <div className="border rounded p-2 flex flex-col items-center dark:bg-gray-800 group cursor-pointer">
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
      <Link href={`/characters/${char.id}`} className="block cursor-pointer">
        <h2 className="mt-2 font-semibold">{char.name}</h2>
        <p className="text-sm text-center">{char.status}</p>
      </Link>

      <button
        onClick={() => toggleFavorite(char.id)}
        className={`mt-2 px-2 py-1 rounded cursor-pointer ${
          isFavorite ? 'bg-red-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        {isFavorite ? '★ Favorite' : '☆ Favorite'}
      </button>
    </div>
  );
}
