"use client";

import React, { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { auth, db } from "../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import StarRating from "@/components/StarRating";
import ImageUpload from "@/components/ImageUpload";
import { useRouter } from "next/navigation";
import { Building, michiganBuildings } from "@/data/buildings";
import { getCurrentLocation } from "@/utils/location";
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
  const [locationError, setLocationError] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [sortedBuildings, setSortedBuildings] = useState<Building[]>([]);

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
      // Default to alphabetical sorting
      const alphabeticalBuildings = [...michiganBuildings].sort((a, b) => 
        a.name.localeCompare(b.name)
      );
      setSortedBuildings(alphabeticalBuildings);
      setSelectedBuilding(alphabeticalBuildings[0].name);

      try {
        const location = await getCurrentLocation();
        if (location) {
          // Sort all buildings by distance
          const buildingsWithDistance = michiganBuildings
            .filter(building => building.coordinates) // Only include buildings with coordinates
            .map(building => ({
              ...building,
              distance: calculateDistance(
                location.latitude,
                location.longitude,
                building.coordinates.latitude,
                building.coordinates.longitude
              )
            }));

          buildingsWithDistance.sort((a, b) => a.distance - b.distance);
          setSortedBuildings(buildingsWithDistance);
          
          // Set the closest building as the default selection
          if (buildingsWithDistance.length > 0) {
            setSelectedBuilding(buildingsWithDistance[0].name);
          }
        }
      } catch {
        setLocationError('Unable to access your location. Buildings are sorted alphabetically.');
      }
    };

    getLocation();
  }, []);

  // Helper function to calculate distance between two points in miles
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3958.8; // Radius of the Earth in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in miles
  };

  // Reset bathroom selection when building changes
  useEffect(() => {
    setSelectedBathroom("");
    setCustomBathroom("");
  }, [selectedBuilding]);

  // Get available bathrooms for selected building
  const getAvailableBathrooms = () => {
    if (selectedBuilding === "Other") return [];
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
      user: isAnonymous ? "Anonymous" : (user.displayName || user.email || "Anonymous"),
      location,
      rating,
      comment,
      imageUrl,
      timestamp: new Date().toISOString(),
      isAnonymous,
      likes: [],
      replies: []
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 pt-20">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-900 dark:text-white">Submit a New Review</h2>
      
      <div className="mb-6">
        {locationError && (
          <div className="text-yellow-600 dark:text-yellow-400 text-sm mb-4">
            {locationError}
          </div>
        )}

        {/* Building Selection */}
        <div className="mb-4">
          <label className="block text-base font-semibold text-gray-900 dark:text-white mb-2">
            Select a Building (Sorted Closest to Furthest)
          </label>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            {sortedBuildings.map((building) => (
              <option key={building.name} value={building.name} className="bg-white dark:bg-gray-700">
                {building.name} {building.distance ? `(${building.distance.toFixed(1)} mi)` : ''}
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
              className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          )}
        </div>

        {/* Bathroom Selection */}
        {selectedBuilding && (
          <div className="mb-4">
            <select
              value={selectedBathroom}
              onChange={(e) => setSelectedBathroom(e.target.value)}
              className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">Select a Bathroom</option>
              {getAvailableBathrooms().map((bathroom) => (
                <option key={bathroom} value={bathroom} className="bg-white dark:bg-gray-700">
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
                className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            )}
          </div>
        )}

        <StarRating rating={rating} setRating={setRating} />
        
        <textarea
          placeholder="Leave your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows={4}
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
            <p className="text-red-500 dark:text-red-400 text-sm mt-2">{uploadError}</p>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Post anonymously</span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnonymous}
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isAnonymous ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnonymous ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        <button
          onClick={handleSubmitReview}
          disabled={!selectedBuilding || !selectedBathroom || !comment || rating === 0}
          className="w-full py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Submit Review
        </button>
      </div>
    </div>
  );
} 