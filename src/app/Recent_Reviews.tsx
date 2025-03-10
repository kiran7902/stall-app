import React, { useEffect, useState, useMemo } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Star } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Review {
  id: string;
  user: string;
  location: string;
  rating: number | null;
  comment: string;
}

export default function RecentReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const reviewsCollection = collection(db, "reviews");
  
  const memoizedReviewsCollection = useMemo(() => reviewsCollection, []);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(memoizedReviewsCollection);
      const reviewData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(reviewData);
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <span className="flex">
        {[...Array(5)].map((_, i) => (
          <Star key={i} fill={i < rating ? "currentColor" : "none"} stroke="currentColor" />
        ))}
      </span>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-20">
      <Navbar />
      <h2 className="text-2xl font-semibold text-center mb-6">Recent Reviews</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-600 text-center">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border border-gray-300 rounded-lg p-4 mb-4">
            <p className="font-semibold">{review.user}</p>
            <p className="text-sm text-gray-600">at <em>{review.location}</em></p>
            <p className="text-yellow-500">{renderStars(review.rating ?? 0)}</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
