'use client';

import { useRouter } from 'next/navigation';

type Props = {
  page: number;
  hasNext: boolean;
  q: string;
  status: string;
};

export default function Pagination({ page, hasNext, q, status }: Props) {
  const router = useRouter();

  return (
    <div className="fixed bottom-4 right-10 flex gap-x-4">
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
        disabled={!hasNext}
        onClick={() =>
          router.push(`/?q=${q}&page=${page + 1}&status=${status}`)
        }
      >
        Next
      </button>
    </div>
  );
}
