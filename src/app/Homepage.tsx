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

  // 🔥 Fetch reviews from Firestore when the page loads
  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(reviewsCollection);
      const reviewData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(reviewData);
    };

    fetchReviews();
  }, []);

  // ✅ Store the review in Firestore
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

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Welcome, {user.displayName || user.email}!</h2>
      <button onClick={handleLogout}>Logout</button>

      <h3>Leave a Restroom Review</h3>
      <input
        type="text"
        placeholder="Location (e.g., Michigan Union 2nd Floor)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        style={{ display: "block", margin: "10px auto" }}
      />
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>{num} Stars</option>
        ))}
      </select>
      <textarea
        placeholder="Leave your review..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        style={{ display: "block", margin: "10px auto", width: "80%" }}
      />
      <button onClick={handleSubmitReview}>Submit Review</button>

      <h3>Recent Reviews</h3>
      {reviews.length === 0 ? <p>No reviews yet.</p> : (
        reviews.map((review) => (
          <div key={review.id} style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
            <p><strong>{review.user}</strong> at <em>{review.location}</em></p>
            <p>⭐ {review.rating} Stars</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}
