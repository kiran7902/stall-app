// Work in progress but want to eventually display ranked list of all bathrooms here


import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";

interface Review {
  location: string;
  rating: number;
}

interface BathroomRating {
  location: string;
  averageRating: number | null;
  totalReviews: number;
}

// Use the same building data structure from HomePage
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

export default function Bathrooms() {
  const [bathroomRatings, setBathroomRatings] = useState<BathroomRating[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Get all reviews from Firestore
        const reviewsCollection = collection(db, "reviews");
        const snapshot = await getDocs(reviewsCollection);
        const reviews = snapshot.docs.map(doc => doc.data() as Review);

        // Create a list of all possible bathrooms from the buildings data
        const allBathrooms = michiganBuildings.flatMap(building => 
          building.bathrooms.map(bathroom => `${building.name} - ${bathroom}`)
        );

        // Calculate average ratings for each bathroom
        const ratingsMap = new Map<string, { total: number; count: number }>();

        // Initialize all known bathrooms with zero counts
        allBathrooms.forEach(bathroom => {
          ratingsMap.set(bathroom, { total: 0, count: 0 });
        });

        // Add up all ratings from reviews
        reviews.forEach(review => {
          const current = ratingsMap.get(review.location) || { total: 0, count: 0 };
          ratingsMap.set(review.location, {
            total: current.total + review.rating,
            count: current.count + 1
          });
        });

        // Convert to array and calculate averages
        const ratings: BathroomRating[] = Array.from(ratingsMap.entries()).map(([location, stats]) => ({
          location,
          averageRating: stats.count > 0 ? stats.total / stats.count : null,
          totalReviews: stats.count
        }));

        // Add any reviewed bathrooms that weren't in our original list
        reviews.forEach(review => {
          if (!ratings.some(r => r.location === review.location)) {
            const stats = ratingsMap.get(review.location) || { total: 0, count: 0 };
            ratings.push({
              location: review.location,
              averageRating: stats.count > 0 ? stats.total / stats.count : null,
              totalReviews: stats.count
            });
          }
        });

        // Sort by average rating (null ratings at the end)
        ratings.sort((a, b) => {
          if (a.averageRating === null && b.averageRating === null) return 0;
          if (a.averageRating === null) return 1;
          if (b.averageRating === null) return -1;
          return b.averageRating - a.averageRating;
        });

        setBathroomRatings(ratings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const renderStars = (rating: number) => {
    const fullStars = "⭐".repeat(Math.round(rating));
    const emptyStars = "☆".repeat(5 - Math.round(rating));
    return fullStars + emptyStars;
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-center">Loading bathroom ratings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">
        Michigan Campus Bathroom Ratings
      </h2>
      
      <div className="grid gap-4">
        {bathroomRatings.map((bathroom) => (
          <div 
            key={bathroom.location} 
            className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition duration-200"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{bathroom.location}</h3>
                <p className="text-sm text-gray-600">
                  {bathroom.totalReviews} {bathroom.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
              <div className="text-right">
                {bathroom.averageRating !== null ? (
                  <>
                    <p className="text-yellow-500">
                      {renderStars(bathroom.averageRating)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {bathroom.averageRating.toFixed(1)} / 5.0
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500 italic">No ratings yet</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}