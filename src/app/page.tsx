"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import {
  signOut,
  User,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { db } from "../../firebaseConfig"; // Firestore instance
import { useRouter } from "next/navigation";

type ReviewView = "user" | "all";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [view, setView] = useState<ReviewView>("user");
  const router = useRouter();

  // Firebase auth persistance for session
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
    .then(() => {
      const unsubscribe = onAuthStateChanged(auth, (loggedInUser) => {
        setUser(loggedInUser);
        setLoading(false);
        if (!loggedInUser) {
          router.push('/auth/login');
        }
      });

      return () => unsubscribe();
    })
    .catch((err) => console.error("Auth persistance error:", err));
  }, [router]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      if (!user) return;

      try {
        let reviewsQuery;
        if (view === "user") {
          reviewsQuery = query(
            collection(db, "reviews"),
            where("user", "==", user.displayName || user.email || "Anonymous")
          );
        } else {
          reviewsQuery = collection(db, "reviews");
        }

        const querySnapshot = await getDocs(reviewsQuery);
        const fetchedReviews = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        // Sort reviews by timestamp (newest first)
        fetchedReviews.sort((a, b) => {
          const aTimestamp = (a as any).timestamp;
          const bTimestamp = (b as any).timestamp;
          return new Date(bTimestamp).getTime() - new Date(aTimestamp).getTime();
        });
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [user, view]);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          {/* Rotating spinner */}
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-700 text-lg mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 pt-20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">
            Welcome, {user.displayName || user.email}!
          </h2>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <button
            onClick={() => router.push('/submit-review')}
            className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition mb-4"
          >
            Submit a New Review
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => setView("user")}
              className={`flex-1 py-2 rounded-md transition ${
                view === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Your Reviews
            </button>
            <button
              onClick={() => setView("all")}
              className={`flex-1 py-2 rounded-md transition ${
                view === "all"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              All Reviews
            </button>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">
          {view === "user" ? "Your Reviews" : "All Reviews"}
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-600">
            {view === "user" 
              ? "You haven't submitted any reviews yet."
              : "No reviews have been submitted yet."}
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium">{review.location}</h4>
                    {view === "all" && (
                      <p className="text-sm text-gray-500">By: {review.user}</p>
                    )}
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
                    <img
                      src={review.imageUrl}
                      alt="Review photo"
                      className="max-h-64 w-auto rounded-md"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-3xl mx-auto flex justify-center space-x-4">
          <button
            onClick={() => router.push('/rankings/top')}
            className="flex-1 max-w-xs py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 transition"
          >
            Top Bathrooms
          </button>
          <button
            onClick={() => router.push('/rankings/bottom')}
            className="flex-1 max-w-xs py-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition"
          >
            Bottom Bathrooms
          </button>
        </div>
      </div>
    </div>
  );
}




