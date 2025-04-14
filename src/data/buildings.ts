export interface Building {
  name: string;
  bathrooms: string[];
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // Optional distance property
}

export const michiganBuildings: Building[] = [
  // Central Campus Buildings
  {
    name: "Michigan Union",
    bathrooms: ["1st Floor North", "1st Floor South", "2nd Floor", "Basement"],
    coordinates: { latitude: 42.2750, longitude: -83.7417 }
  },
  {
    name: "Shapiro Library",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2755412, longitude: -83.7372693 }
  },
  {
    name: "Mason Hall",
    bathrooms: ["1st Floor West", "1st Floor East", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2771, longitude: -83.7394 }
  },
  {
    name: "Angell Hall",
    bathrooms: ["1st Floor East", "1st Floor West", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2766, longitude: -83.7397 }
  },
  {
    name: "Hatcher Graduate Library",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2763, longitude: -83.7380 }
  },
  {
    name: "Modern Languages Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2799078, longitude:-83.7393258 }
  },
  {
    name: "Chemistry Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2776926, longitude: -83.7367749 }
  },
  {
    name: "Ross School of Business",
    bathrooms: ["Basement", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2730, longitude: -83.7379 }
  },
  {
    name: "Weiser Hall",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2768036, longitude:-83.7364063 }
  },
  {
    name: "Lorch Hall",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2740154, longitude:-83.7381202 }
  },
  {
    name: "Tisch Hall",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2763624, longitude: -83.7405976 }
  },
  {
    name: "Marsal Family School of Education",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2742034, longitude:-83.7361772 }
  },
  {
    name: "School of Social Work",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2746802, longitude:-83.7367994 }
  },
  {
    name: "School of Public Health",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.280969, longitude:-83.7308906 }
  },
  {
    name: "School of Nursing",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2850851, longitude: -83.7388538 }
  },
  {
    name: "School of Dentistry",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.279079, longitude:-83.7365237 }
  },

  {
    name: "Law Library",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2738314, longitude:-83.7393607 }
  },
  {
    name: "School of Music",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2898042, longitude: -83.7209688 }
  },

  {
    name: "Taubman College of Architecture and Urban Planning",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2893595, longitude: -83.7174332 }
  },

  {
    name: "School of Kinesiology",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2783676, longitude:-83.7391293 }
  },
  {
    name: "Gerald R. Ford School of Public Policy",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2723551, longitude: -83.7403587 }
  },

  // North Campus Buildings
  {
    name: "Duderstadt Center",
    bathrooms: ["1st Floor (Mens)", "1st Floor (Gender Inclusive)", "2nd Floor North", "2nd Floor South", "3rd Floor North", "3rd Floor South"],
    coordinates: { latitude: 42.2911733, longitude: -83.715983 }
  },
  {
    name: "Bob and Betty Beyster Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2929475, longitude:-83.7166477 }
  },
  {
    name: "Chrysler Center",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2906364, longitude: -83.7168295 }
  },

  {
    name: "EECS Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2924735, longitude: -83.7140423 }
  },
  {
    name: "Francois-Xavier Bagnoud Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2936874, longitude: -83.7123786 }
  },
  {
    name: "G.G. Brown Laboratory",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],
    coordinates: { latitude: 42.2932626, longitude:-83.7138866 }
  },

  {
    name: "Pierpont Commons",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2911547, longitude:-83.7177679 }
  },
  {
    name: "Stamps Auditorium",
    bathrooms: ["Penny W. Stamps Auditorium"],
    coordinates: { latitude: 42.2899446, longitude: -83.7175171 }
  },
  {
    name: "Michigan League",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.279055, longitude:-83.7375197}
  },
  {
    name: "Dow Building",
    bathrooms: ["1st Floor", "2nd Floor", "3rd Floor"],
    coordinates: { latitude: 42.2930322, longitude:-83.7154082}
  },


  

]; 