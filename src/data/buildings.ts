export interface Building {
  name: string;
  bathrooms: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export const michiganBuildings: Building[] = [
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
    name: "Duderstadt Center",
    bathrooms: ["1st Floor (Mens)", "1st Floor (Gender Inclusive)", "2nd Floor North", "2nd Floor South", "3rd Floor North", "3rd Floor South"],
    coordinates: { latitude: 42.2930, longitude: -83.7100 }
  },
  {
    name: "Ross School of Business",
    bathrooms: ["Basement", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2900, longitude: -83.7150 }
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
  }
]; 