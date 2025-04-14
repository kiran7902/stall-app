"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { michiganBuildings } from "@/data/buildings";

export default function BathroomsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
      setUser(loggedInUser);
      setLoading(false);
      if (!loggedInUser) {
        router.push('/auth/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-700 dark:text-gray-300 text-lg mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            All Bathrooms
          </h2>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>

        <div className="space-y-4">
          {michiganBuildings.map((building) => (
            <div 
              key={building.name} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{building.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {building.bathrooms.map((bathroom) => (
                  <button
                    key={bathroom}
                    onClick={() => router.push(`/bathrooms/${encodeURIComponent(building.name)}/${encodeURIComponent(bathroom)}`)}
                    className="text-left p-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition text-gray-900 dark:text-white"
                  >
                    {bathroom}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 