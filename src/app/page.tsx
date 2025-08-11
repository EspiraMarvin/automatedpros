'use client';

import { lazy, Suspense } from 'react';
const HomeContent = lazy(() => import('@/components/home/HomeContent'));

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
