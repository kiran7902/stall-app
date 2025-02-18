import { useEffect, useState } from "react";
import { User } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

interface Review {
  id: string;
  user: string;
  location: string;
  rating: number;
  comment: string;
}

// Add building data structure
interface Building {
  name: string;
  bathrooms: string[];
}

const michiganBuildings: Building[] = [
  {
    name: "Michigan Union",
    bathrooms: ["1st Floor North", "1st Floor South", "2nd Floor", "Basement"]
  },
  {
    name: "Shapiro Library",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"]
  },
  {
    name: "Mason Hall",
    bathrooms: ["1st Floor West", "1st Floor East", "2nd Floor", "3rd Floor"]
  },
  // Add more buildings as needed
];

export default function HomePage({ user, handleLogout }: { user: User; handleLogout: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedBathroom, setSelectedBathroom] = useState("");
  const [customBuilding, setCustomBuilding] = useState("");
  const [customBathroom, setCustomBathroom] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const reviewsCollection = collection(db, "reviews");

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(reviewsCollection);
      const reviewData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(reviewData);
    };

    fetchReviews();
  }, []);

  // Reset bathroom selection when building changes
  useEffect(() => {
    setSelectedBathroom("");
    setCustomBathroom("");
  }, [selectedBuilding]);

  // Get available bathrooms for selected building
  const getAvailableBathrooms = () => {
    const building = michiganBuildings.find(b => b.name === selectedBuilding);
    return building ? building.bathrooms : [];
  };

  // Get final location string
  const getLocationString = () => {
    if (selectedBuilding === "Other") {
      return `${customBuilding} - ${customBathroom}`;
    }
    return `${selectedBuilding} - ${selectedBathroom === "Other" ? customBathroom : selectedBathroom}`;
  };

  const handleSubmitReview = async () => {
    const location = getLocationString();
    if (!location || !comment) return;

    const newReview = {
      user: user.displayName || user.email || "Anonymous",
      location,
      rating,
      comment,
    };

    try {
      const docRef = await addDoc(reviewsCollection, newReview);
      setReviews([{ id: docRef.id, ...newReview }, ...reviews]);
    } catch (error) {
      console.error("Error adding review:", error);
    }

    // Reset form
    setSelectedBuilding("");
    setSelectedBathroom("");
    setCustomBuilding("");
    setCustomBathroom("");
    setRating(5);
    setComment("");
  };

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
        
        {/* Building Selection */}
        <div className="mb-4">
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-2"
          >
            <option value="">Select a Building</option>
            {michiganBuildings.map((building) => (
              <option key={building.name} value={building.name}>
                {building.name}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>

          {selectedBuilding === "Other" && (
            <input
              type="text"
              placeholder="Enter Building Name"
              value={customBuilding}
              onChange={(e) => setCustomBuilding(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          )}
        </div>

        {/* Bathroom Selection */}
        {selectedBuilding && (
          <div className="mb-4">
            <select
              value={selectedBathroom}
              onChange={(e) => setSelectedBathroom(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-2"
            >
              <option value="">Select a Bathroom</option>
              {selectedBuilding !== "Other" &&
                getAvailableBathrooms().map((bathroom) => (
                  <option key={bathroom} value={bathroom}>
                    {bathroom}
                  </option>
                ))}
              <option value="Other">Other</option>
            </select>

            {(selectedBathroom === "Other" || selectedBuilding === "Other") && (
              <input
                type="text"
                placeholder="Enter Bathroom Location"
                value={customBathroom}
                onChange={(e) => setCustomBathroom(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            )}
          </div>
        )}

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
          disabled={!selectedBuilding || !selectedBathroom || !comment}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            <p className="text-yellow-500">{renderStars(review.rating)}</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}