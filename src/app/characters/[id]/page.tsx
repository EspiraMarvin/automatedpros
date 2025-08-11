'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Character = {
  id: number;
  name: string;
  status: string;
  image: string;
};

export default function CharacterDetail() {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  // fetch character details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/character/${id}`);
        setCharacter(res.data);
      } catch (err) {
        console.error('Error fetching character:', err);
      }
    };

    fetchData();
  }, [id]);

  // load saved note
  useEffect(() => {
    const savedNote = localStorage.getItem(`note-${id}`);
    if (savedNote) setNote(savedNote);
  }, [id]);

  const validateNote = (text: string) => {
    if (!text.trim()) {
      return 'Note is required.';
    }
    if (text.length < 3) {
      return 'Note must be at least 3 characters.';
    }
    if (text.length > 200) {
      return 'Note cannot exceed 200 characters.';
    }
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validateNote(note);
    if (validationError) {
      setError(validationError);
      return;
    }

    localStorage.setItem(`note-${id}`, note);
    setSuccess('Note saved successfully!');
  };

  if (!character) {
    return <p className="text-center mt-8">Loading character...</p>;
  }

  return (
    <div className="p-4 mt-8 max-w-lg mx-auto">
      <div className="relative flex items-center mb-4">
        <button
          onClick={() => router.back()}
          className="absolute left-0 cursor-pointer"
        >
          ← Go Back
        </button>
        <h1 className="mx-auto text-2xl font-bold text-center">
          {character.name}
        </h1>
      </div>

      <Image
        className="w-48 h-48 rounded mx-auto"
        src={character.image}
        alt={character.name}
        width={128}
        height={128}
        priority
      />
      <p className="mb-4">
        Status: <strong>{character.status}</strong>
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block font-semibold">Note:</label>
        <textarea
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border rounded w-full p-2 dark:bg-gray-800"
          rows={4}
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save Note
        </button>
      </form>
    </div>
  );
}
