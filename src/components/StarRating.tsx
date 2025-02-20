"use client";

import { useState } from "react";
import { Star } from "lucide-react";

  // Define star rating props type for rating function
  interface StarRatingProps {
    rating: number | null;
    setRating: (rating: number) => void;
  }

// Star rating function component
  // Handles hovering and shading status of star inputs on rating
  const StarRating: React.FC<StarRatingProps> = ({ rating, setRating }) => {
    const [hovered, setHovered] = useState<number | null>(null);
    return (
      <div className="flex space-x-2 mb-4">
        {// 5 stars, map each star to some val num
        // when hovering highlight star and prior
        // When clicked, select num for rating and stop
        // hovering feature
        }
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

  export default StarRating;