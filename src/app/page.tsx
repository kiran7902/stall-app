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
import { collection, getDocs, query, where, doc, updateDoc, arrayUnion, deleteDoc } from "firebase/firestore"; 
import { db } from "../../firebaseConfig"; // Firestore instance
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { Heart, MessageSquare, Trash2 } from "lucide-react";

interface Reply {
  id: string;
  user: string;
  comment: string;
  timestamp: string;
}

interface Review {
  id: string;
  user: string;
  location: string;
  rating: number;
  comment: string;
  timestamp: string;
  imageUrl?: string;
  isAnonymous: boolean;
  likes: string[]; // Array of user IDs who liked the review
  replies: Reply[];
}

type ReviewView = "user" | "all";
type SortOption = "newest" | "oldest" | "mostLiked";

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [view, setView] = useState<ReviewView>("user");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [lastTapTime, setLastTapTime] = useState(0);
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
          ...doc.data(),
          likes: doc.data().likes || [],
          replies: doc.data().replies || []
        })) as Review[];
        
        // Sort reviews based on selected option
        fetchedReviews.sort((a, b) => {
          switch (sortBy) {
            case "newest":
              return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            case "oldest":
              return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            case "mostLiked":
              return b.likes.length - a.likes.length;
            default:
              return 0;
          }
        });
        
        setReviews(fetchedReviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [user, view, sortBy]);

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const handleLike = async (reviewId: string) => {
    if (!user) return;
    
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const review = reviews.find(r => r.id === reviewId);
      
      if (!review) return;
      
      const isLiked = review.likes.includes(user.uid);
      const newLikes = isLiked 
        ? review.likes.filter(id => id !== user.uid)
        : [...review.likes, user.uid];
      
      await updateDoc(reviewRef, { likes: newLikes });
      
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, likes: newLikes }
          : r
      ));
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleReply = async (reviewId: string) => {
    if (!user || !replyText.trim()) return;
    
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const newReply: Reply = {
        id: Date.now().toString(),
        user: user.displayName || user.email || "Anonymous",
        comment: replyText,
        timestamp: new Date().toISOString()
      };
      
      await updateDoc(reviewRef, {
        replies: arrayUnion(newReply)
      });
      
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, replies: [...r.replies, newReply] }
          : r
      ));
      
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  const handleDoubleTap = (reviewId: string) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    if (tapLength < 300 && tapLength > 0) {
      handleLike(reviewId);
    }
    setLastTapTime(currentTime);
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user) return;
    
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      await deleteDoc(reviewRef);
      
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleDeleteReply = async (reviewId: string, replyId: string) => {
    if (!user) return;
    
    try {
      const reviewRef = doc(db, "reviews", reviewId);
      const review = reviews.find(r => r.id === reviewId);
      
      if (!review) return;
      
      const updatedReplies = review.replies.filter(reply => reply.id !== replyId);
      await updateDoc(reviewRef, { replies: updatedReplies });
      
      setReviews(reviews.map(r => 
        r.id === reviewId 
          ? { ...r, replies: updatedReplies }
          : r
      ));
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
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
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
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

          <div className="flex flex-col gap-4 mb-4">
            <div className="flex space-x-4">
              <button
                onClick={() => setView("user")}
                className={`flex-1 py-2 rounded-md transition ${
                  view === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                Your Reviews
              </button>
              <button
                onClick={() => setView("all")}
                className={`flex-1 py-2 rounded-md transition ${
                  view === "all"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                All Reviews
              </button>
            </div>
            <div className="flex justify-end items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-48 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="mostLiked">Most Liked</option>
              </select>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
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
              <div 
                key={review.id} 
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800"
                onTouchStart={() => handleDoubleTap(review.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-lg text-gray-900 dark:text-white">{review.location}</h4>
                    {view === "all" && (
                      <p className="text-sm text-gray-500 dark:text-gray-400">By: {review.user}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </span>
                    {(view === "user" || review.user === user?.displayName || review.user === user?.email) && (
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition"
                        title="Delete review"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-2xl ${
                        i < review.rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-base">{review.comment}</p>
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

                <div className="flex items-center gap-6 mt-4">
                  <button
                    onClick={() => handleLike(review.id)}
                    className={`flex items-center gap-2 text-sm ${
                      review.likes.includes(user?.uid || '') 
                        ? 'text-red-500' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <Heart
                      size={20}
                      fill={review.likes.includes(user?.uid || '') ? 'currentColor' : 'none'}
                    />
                    <span className="text-base">{review.likes.length}</span>
                  </button>
                  
                  <button
                    onClick={() => setReplyingTo(replyingTo === review.id ? null : review.id)}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <MessageSquare size={20} />
                    <span className="text-base">{review.replies.length}</span>
                  </button>
                </div>

                {replyingTo === review.id && (
                  <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md mb-2 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      rows={3}
                    />
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleReply(review.id)}
                        disabled={!replyText.trim()}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md text-base disabled:opacity-50"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {review.replies.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {review.replies.map((reply) => (
                      <div key={reply.id} className="pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{reply.user}</p>
                            {(reply.user === user?.displayName || reply.user === user?.email) && (
                              <button
                                onClick={() => handleDeleteReply(review.id, reply.id)}
                                className="p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition"
                                title="Delete reply"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(reply.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{reply.comment}</p>
                      </div>
                    ))}
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
            onClick={() => router.push('/bathrooms')}
            className="flex-1 max-w-xs py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition"
          >
            All Bathrooms
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




