"use client";

import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import StarRating from "@/components/StarRating";
import ImageUpload from "@/components/ImageUpload";
import { useRouter } from "next/navigation";
import { Building, michiganBuildings } from "@/data/buildings";
import { getCurrentLocation, findNearestBuilding } from "@/utils/location";
import { onAuthStateChanged } from "firebase/auth";

export default function SubmitReview() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedBuilding, setSelectedBuilding] = useState("");
  const [selectedBathroom, setSelectedBathroom] = useState("");
  const [customBuilding, setCustomBuilding] = useState("");
  const [customBathroom, setCustomBathroom] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [nearestBuilding, setNearestBuilding] = useState<Building | null>(null);
  const [locationError, setLocationError] = useState<string>("");

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
    const getLocation = async () => {
      try {
        const location = await getCurrentLocation();
        if (location) {
          const nearest = findNearestBuilding(location.latitude, location.longitude);
          setNearestBuilding(nearest);
          if (nearest) {
            setSelectedBuilding(nearest.name);
          }
        }
      } catch {
        setLocationError('Unable to access your location. Please enable location services for better recommendations.');
      }
    };

    getLocation();
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
    if (!user) return;
    
    const location = getLocationString();
    if (!location || !comment || rating === 0) return;

    const newReview = {
      user: user.displayName || user.email || "Anonymous",
      location,
      rating,
      comment,
      imageUrl,
      timestamp: new Date().toISOString()
    };

    try {
      await addDoc(collection(db, "reviews"), newReview);
      router.push('/');
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

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
    return null; // Will be redirected by the useEffect
  }

  return (
    <div className="max-w-3xl mx-auto p-6 pt-20">
      <h2 className="text-2xl font-semibold text-center mb-6">Submit a New Review</h2>
      
      <div className="mb-6">
        {locationError && (
          <div className="text-yellow-600 text-sm mb-4">
            {locationError}
          </div>
        )}
        
        {nearestBuilding && (
          <div className="bg-blue-50 p-3 rounded-md mb-4">
            <p className="text-sm text-blue-800">
              Based on your location, we recommend: <strong>{nearestBuilding.name}</strong>
            </p>
          </div>
        )}

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

        <StarRating rating={rating} setRating={setRating} />
        
        <textarea
          placeholder="Leave your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-4"
        />

        <div className="mb-4">
          <ImageUpload
            onImageUpload={(url) => {
              setImageUrl(url);
              setUploadError("");
            }}
            onError={(error) => setUploadError(error)}
          />
          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}
        </div>

        <button
          onClick={handleSubmitReview}
          disabled={!selectedBuilding || !selectedBathroom || !comment || rating === 0}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
} 