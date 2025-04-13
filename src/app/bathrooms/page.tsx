"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useRouter } from "next/navigation";
import { Building, michiganBuildings } from "@/data/buildings";

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
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-700 text-lg mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            All Bathrooms
          </h2>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>

        <div className="space-y-6">
          {michiganBuildings.map((building) => (
            <div key={building.name} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-3">{building.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {building.bathrooms.map((bathroom) => (
                  <button
                    key={bathroom}
                    onClick={() => router.push(`/bathrooms/${encodeURIComponent(building.name)}/${encodeURIComponent(bathroom)}`)}
                    className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition"
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