"use client";

import { useEffect, useState, Suspense } from "react";
import { auth } from "../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { useRouter, useSearchParams } from "next/navigation";
import { Star } from "lucide-react";

interface Review {
  location: string;
  rating: number;
  count: number;
}

function RankingsContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [rankings, setRankings] = useState<Review[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') as "top" | "bottom" | null;

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

  useEffect(() => {
    if (!type || (type !== "top" && type !== "bottom")) {
      router.push('/');
      return;
    }

    const fetchRankings = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const reviews = querySnapshot.docs.map(doc => doc.data());
        
        // Group reviews by location and calculate average ratings
        const locationRatings = reviews.reduce((acc: { [key: string]: { sum: number; count: number } }, review) => {
          if (!acc[review.location]) {
            acc[review.location] = { sum: 0, count: 0 };
          }
          acc[review.location].sum += review.rating;
          acc[review.location].count += 1;
          return acc;
        }, {});

        // Convert to array and calculate averages
        const rankings = Object.entries(locationRatings).map(([location, data]) => ({
          location,
          rating: data.sum / data.count,
          count: data.count
        }));

        // Sort based on type
        rankings.sort((a, b) => 
          type === "top" ? b.rating - a.rating : a.rating - b.rating
        );

        setRankings(rankings);
      } catch (error) {
        console.error("Error fetching rankings:", error);
      }
    };

    fetchRankings();
  }, [type, router]);

  const renderStars = (rating: number) => {
    return (
      <span className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            fill={i < rating ? "currentColor" : "none"}
            stroke="currentColor"
            className="w-5 h-5 text-yellow-500"
          />
        ))}
      </span>
    );
  };

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

  if (!user || !type) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pt-20">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          {type === "top" ? "Top Rated Bathrooms" : "Bottom Rated Bathrooms"}
        </h2>
        <button
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Back to Home
        </button>
      </div>

      <div className="space-y-4">
        {rankings.map((ranking, index) => (
          <div key={ranking.location} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">
                  #{index + 1} {ranking.location}
                </h3>
                <p className="text-sm text-gray-500">
                  {ranking.count} {ranking.count === 1 ? 'review' : 'reviews'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {ranking.rating.toFixed(1)}
                </span>
                {renderStars(ranking.rating)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Rankings() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-700 text-lg mt-4">Loading...</p>
        </div>
      </div>
    }>
      <RankingsContent />
    </Suspense>
  );
} 