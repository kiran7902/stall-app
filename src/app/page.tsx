"use client";

import { useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import HomePage from "./Homepage";
import { db } from "../../firebaseConfig"; // Firestore instance
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

interface Review {
  id: string;
  user: string;
  location: string;
  rating: number;
  comment: string;
  timestamp: string;
  imageUrl?: string;
}

type ReviewView = "user" | "all";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false); // Tracks whether user is on sign-up screen\
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
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
    .catch((error) => console.error("Auth persistance error:", error));
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
        })) as Review[];
        
        // Sort reviews by timestamp (newest first)
        fetchedReviews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setReviews(fetchedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [user, view]);

  // Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed", error);
      setError("Google login failed. Please try again.");
    }
  };

  // Email/Password login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.error("Login failed", error);
      setError("Invalid email or password.");
    }
  };


  // Email Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
          const result = await createUserWithEmailAndPassword(auth, email, password);
  
          // Update the user's displayName with firstName and lastName
          await updateProfile(result.user, {
              displayName: `${firstName} ${lastName}`,
          });
  
          // Optionally, store additional user details in Firestore
          await setDoc(doc(db, "users", result.user.uid), {
              username,
              firstName,
              lastName,
              email
          });
  
          setUser(result.user); // Set user state after profile update
      } catch (error) {
          console.error("Sign-up failed", error);
          setError("Sign-up failed. Try a stronger password.");
      }
  };
  

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

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
                <div className="mb-2">{renderStars(review.rating)}</div>
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




