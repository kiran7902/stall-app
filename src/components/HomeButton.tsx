"use client";

import { useRouter } from 'next/navigation';
import { Home } from 'lucide-react';
import { use } from 'react';

export default function HomeButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push('/')}
      className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
      aria-label="Go to home page"
    >
      <Home className="w-5 h-5 text-gray-700" />
    </button>
  );
} 