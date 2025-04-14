export interface Building {
  name: string;
  bathrooms: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export const michiganBuildings: Building[] = [
  // Central Campus Buildings
  {
    name: "Michigan Union",
    bathrooms: ["1st Floor North", "1st Floor South", "2nd Floor", "Basement"],
    coordinates: { latitude: 42.2758, longitude: -83.7400 }
  },
  {
    name: "Shapiro Library",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2790, longitude: -83.7360 }
  },
  {
    name: "Mason Hall",
    bathrooms: ["1st Floor West", "1st Floor East", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2765, longitude: -83.7380 }
  },
  {
    name: "Angell Hall",
    bathrooms: ["1st Floor East", "1st Floor West", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2770, longitude: -83.7400 }
  },
  {
    name: "Hatcher Graduate Library",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2780, longitude: -83.7400 }
  },
  {
    name: "Modern Languages Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2750, longitude: -83.7400 }
  },
  {
    name: "Chemistry Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2800, longitude: -83.7400 }
  },
  {
    name: "Ross School of Business",
    bathrooms: ["Basement", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2730, longitude: -83.7379 }
  },
  {
    name: "Weiser Hall",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2760, longitude: -83.7400 }
  },
  {
    name: "Lorch Hall",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2770, longitude: -83.7400 }
  },
  {
    name: "Tisch Hall",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2760, longitude: -83.7400 }
  },
  {
    name: "School of Education",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2750, longitude: -83.7400 }
  },
  {
    name: "School of Social Work",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2740, longitude: -83.7400 }
  },
  {
    name: "School of Public Health",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2800, longitude: -83.7400 }
  },
  {
    name: "School of Nursing",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2810, longitude: -83.7400 }
  },
  {
    name: "School of Dentistry",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2820, longitude: -83.7400 }
  },
  {
    name: "School of Medicine",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2830, longitude: -83.7400 }
  },
  {
    name: "School of Law",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2840, longitude: -83.7400 }
  },
  {
    name: "School of Music",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2850, longitude: -83.7400 }
  },
  {
    name: "School of Art & Design",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2860, longitude: -83.7400 }
  },
  {
    name: "School of Architecture",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2870, longitude: -83.7400 }
  },
  {
    name: "School of Engineering",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2880, longitude: -83.7400 }
  },
  {
    name: "School of Information",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2890, longitude: -83.7400 }
  },
  {
    name: "School of Kinesiology",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2900, longitude: -83.7400 }
  },
  {
    name: "School of Public Policy",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2910, longitude: -83.7400 }
  },
  {
    name: "School of Natural Resources",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2920, longitude: -83.7400 }
  },
  {
    name: "School of Environment",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2930, longitude: -83.7400 }
  },
  {
    name: "School of Pharmacy",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2940, longitude: -83.7400 }
  },

  // North Campus Buildings
  {
    name: "Duderstadt Center",
    bathrooms: ["1st Floor (Mens)", "1st Floor (Gender Inclusive)", "2nd Floor North", "2nd Floor South", "3rd Floor North", "3rd Floor South"],
    coordinates: { latitude: 42.2930, longitude: -83.7100 }
  },
  {
    name: "Beyster Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2935, longitude: -83.7110 }
  },
  {
    name: "Bob and Betty Beyster Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2940, longitude: -83.7120 }
  },
  {
    name: "Chrysler Center",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2925, longitude: -83.7090 }
  },
  {
    name: "Cooley Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2915, longitude: -83.7080 }
  },
  {
    name: "EECS Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2758, longitude: -83.7375 }
  },
  {
    name: "Francois-Xavier Bagnoud Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2920, longitude: -83.7120 }
  },
  {
    name: "G.G. Brown Laboratory",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2910, longitude: -83.7110 }
  },

  {
    name: "Pierpont Commons",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2915, longitude: -83.7100 }
  },
  {
    name: "Stamps Auditorium",
    bathrooms: ["1st Floor", "2nd Floor"],
    coordinates: { latitude: 42.2910, longitude: -83.7120 }
  },

]; 