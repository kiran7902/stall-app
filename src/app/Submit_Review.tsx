import React, { useState, useMemo } from "react";
import { User } from "firebase/auth";
import { db } from "../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";

interface Building {
  name: string;
  bathrooms: string[];
}

const michiganBuildings: Building[] = [
  { name: "Michigan Union", bathrooms: ["1st Floor North", "1st Floor South", "2nd Floor", "Basement"] },
  { name: "Shapiro Library", bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"] },
  { name: "Mason Hall", bathrooms: ["1st Floor West", "1st Floor East", "2nd Floor", "3rd Floor"] },
  { name: "Duderstadt Center", bathrooms: ["1st Floor (Mens)", "1st Floor (Gender Inclusive)", "2nd Floor North", "2nd Floor South"] },
  { name: "Ross School of Business", bathrooms: ["Basement", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"] },
];

export default function SubmitReview({ user }: { user: User }) {
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedBathroom, setSelectedBathroom] = useState("");
  const [customBuilding, setCustomBuilding] = useState("");
  const [customBathroom, setCustomBathroom] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  const reviewsCollection = useMemo(() => collection(db, "reviews"), []);

  const getAvailableBathrooms = () => {
    return michiganBuildings.find((b) => b.name === selectedBuilding)?.bathrooms || [];
  };

  const getLocationString = () => {
    if (selectedBuilding === "Other") {
      return `${customBuilding} - ${customBathroom}`;
    }
    return `${selectedBuilding} - ${selectedBathroom === "Other" ? customBathroom : selectedBathroom}`;
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
      await addDoc(reviewsCollection, newReview);
    } catch (error) {
      console.error("Error adding review:", error);
    }

    setSelectedBuilding("");
    setSelectedBathroom("");
    setCustomBuilding("");
    setCustomBathroom("");
    setRating(null);
    setComment("");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-20">
      <Navbar />
      <h2 className="text-2xl font-semibold text-center mb-6">Leave a Restroom Review</h2>
      <select value={selectedBuilding} onChange={(e) => setSelectedBuilding(e.target.value)} className="block w-full p-3 border rounded-lg mb-2">
        <option value="">Select a Building</option>
        {michiganBuildings.map((building) => (
          <option key={building.name} value={building.name}>{building.name}</option>
        ))}
        <option value="Other">Other</option>
      </select>
      {selectedBuilding === "Other" && <input type="text" placeholder="Enter Building Name" value={customBuilding} onChange={(e) => setCustomBuilding(e.target.value)} className="block w-full p-3 border rounded-lg" />}
      {selectedBuilding && (
        <select value={selectedBathroom} onChange={(e) => setSelectedBathroom(e.target.value)} className="block w-full p-3 border rounded-lg mb-2">
          <option value="">Select a Bathroom</option>
          {selectedBuilding !== "Other" && getAvailableBathrooms().map((bathroom) => (
            <option key={bathroom} value={bathroom}>{bathroom}</option>
          ))}
          <option value="Other">Other</option>
        </select>
      )}
      {(selectedBathroom === "Other" || selectedBuilding === "Other") && <input type="text" placeholder="Enter Bathroom Location" value={customBathroom} onChange={(e) => setCustomBathroom(e.target.value)} className="block w-full p-3 border rounded-lg" />}
      <StarRating rating={rating} setRating={setRating} />
      <textarea placeholder="Leave your review..." value={comment} onChange={(e) => setComment(e.target.value)} className="block w-full p-3 border rounded-lg mb-4" />
      <button onClick={handleSubmitReview} disabled={!selectedBuilding || !selectedBathroom || !comment} className="w-full py-2 bg-blue-500 text-white font-bold rounded-md">Submit Review</button>
    </div>
  );
}
