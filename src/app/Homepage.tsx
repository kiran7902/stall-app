import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { db } from "../../firebaseConfig"; // Firestore instance
import { collection, addDoc, getDocs } from "firebase/firestore";

interface Review {
  id: string;
  user: string;
  location: string;
  rating: number;
  comment: string;
}

export default function HomePage({ user, handleLogout }: { user: User; handleLogout: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviewsCollection = collection(db, "reviews"); // Firestore collection reference

  // Fetch reviews from Firestore when the page loads
  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(reviewsCollection);
      const reviewData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(reviewData);
    };

    fetchReviews();
  }, []);

  // Store the review in Firestore
  const handleSubmitReview = async () => {
    if (!location || !comment) return;

    const newReview = {
      user: user.displayName || user.email || "Anonymous",
      location,
      rating,
      comment,
    };

    try {
      const docRef = await addDoc(reviewsCollection, newReview); // Save to Firestore
      setReviews([{ id: docRef.id, ...newReview }, ...reviews]); // Update UI
    } catch (error) {
      console.error("Error adding review:", error);
    }

    // Reset form
    setLocation("");
    setRating(5);
    setComment("");
  };

  // Render stars based on rating
  const renderStars = (rating: number) => {
    const fullStars = "⭐".repeat(rating);
    const emptyStars = "☆".repeat(5 - rating);
    return fullStars + emptyStars;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Welcome, {user.displayName || user.email}!
      </h2>
      <button
        onClick={handleLogout}
        className="w-full py-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition duration-200 mb-6"
      >
        Logout
      </button>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Leave a Restroom Review</h3>
        <input
          type="text"
          placeholder="Location (e.g., Michigan Union 2nd Floor)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-4"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-4"
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num} Stars
            </option>
          ))}
        </select>
        <textarea
          placeholder="Leave your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-4"
        />
        <button
          onClick={handleSubmitReview}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200"
        >
          Submit Review
        </button>
      </div>

      <h3 className="text-xl font-semibold mb-4">Recent Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-600">No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border border-gray-300 rounded-lg p-4 mb-4">
            <p className="font-semibold">{review.user}</p>
            <p className="text-sm text-gray-600">at <em>{review.location}</em></p>
            <p className="text-yellow-500">
              {/* Render stars based on rating */}
              {renderStars(review.rating)}
            </p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
