"use client";

import { useEffect, useState } from "react";
import { auth } from "../../../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../../firebaseConfig";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { use } from "react";

interface Review {
  id: string;
  user: string;
  location: string;
  rating: number;
  comment: string;
  timestamp: string;
  imageUrl?: string;
}

export default function BathroomPage({ params }: { params: Promise<{ building: string; bathroom: string }> }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const router = useRouter();
  const { building, bathroom } = use(params);
  const location = `${decodeURIComponent(building)} - ${decodeURIComponent(bathroom)}`;

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
    const fetchReviews = async () => {
      try {
        const reviewsQuery = query(
          collection(db, "reviews"),
          where("location", "==", location)
        );
        const querySnapshot = await getDocs(reviewsQuery);
        const fetchedReviews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Review[];
        
        // Sort reviews by timestamp (newest first)
        fetchedReviews.sort((a, b) => {
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        });
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [location]);

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
            {location}
          </h2>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Back to Home
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => router.push('/submit-review')}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition mb-4"
          >
            Submit a Review
          </button>
        </div>

        <h3 className="text-xl font-semibold mb-4">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review this bathroom!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-500">By: {review.user}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">{review.comment}</p>
                {review.imageUrl && (
                  <div className="mt-2">
                    <Image
                      src={review.imageUrl}
                      alt="Review photo"
                      width={500}
                      height={300}
                      className="w-full h-auto rounded-md object-cover"
                      unoptimized
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 