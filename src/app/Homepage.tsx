import React, { use, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Star } from "lucide-react"; // to change star icons

interface Review {
  id: string;
  user: string;
  location: string;
  rating: number | null;
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
  {
    name: "Duderstadt Center",
    bathrooms: ["1st Floor (Mens)", "1st Floor (Gender Inclusive)", "2nd Floor North", "2nd Floor South", "3rd Floor North", "3rd Floor South" ]
  },
  // Add more buildings as needed
];

export default function HomePage({ user, handleLogout }: { user: User; handleLogout: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedBathroom, setSelectedBathroom] = useState("");
  const [customBuilding, setCustomBuilding] = useState("");
  const [customBathroom, setCustomBathroom] = useState("");
  const [rating, setRating] = useState<number | null>(null);
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

  // Define star rating props type for rating function
  interface StarRatingProps {
    rating: number | null;
    setRating: (rating: number) => void;
  }
  
  const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
    const [hovered, setHovered] = useState<number | null>(null);
  
    return (
      <div className="flex space-x-2 mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onClick={() => setRating(num)}
            onMouseEnter={() => setHovered(num)}
            onMouseLeave={() => setHovered(null)}
            className="text-yellow-500 text-3xl cursor-pointer transition duration-200"
          >
            <Star
              size={32}
              fill={num <= (hovered ?? rating ?? 0) ? "gold" : "none"}
              stroke="gold"
            />
          </button>
        ))}
      </div>
    );
  };

  
  const handleSubmitReview = async () => {
    const location = getLocationString();
    if (!location || !comment || rating === null) return;

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
    setRating(null);
    setComment("");
  };

const renderStars = (rating: number) => {
  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <Star key={i} fill={i < rating ? "currentColor" : "none"} stroke="currentColor" />
      ))}
    </div>
  );
};

  useEffect(() => {
    console.log("Selected Rating:", rating);
  }, [rating]);
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
        {/** 
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
        */}
        <StarRating rating={rating} setRating={setRating} />
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
            <p className="text-yellow-500">{renderStars(review.rating ?? 0)}</p>
            <p>{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

