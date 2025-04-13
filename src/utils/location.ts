import { Building, michiganBuildings } from "@/data/buildings";

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export function findNearestBuilding(latitude: number, longitude: number): Building | null {
  if (!michiganBuildings.length) return null;

  let nearestBuilding = michiganBuildings[0];
  let shortestDistance = calculateDistance(
    latitude,
    longitude,
    nearestBuilding.coordinates?.latitude || 0,
    nearestBuilding.coordinates?.longitude || 0
  );

  for (const building of michiganBuildings) {
    if (!building.coordinates) continue;

    const distance = calculateDistance(
      latitude,
      longitude,
      building.coordinates.latitude,
      building.coordinates.longitude
    );

    if (distance < shortestDistance) {
      shortestDistance = distance;
      nearestBuilding = building;
    }
  }

  return nearestBuilding;
}

export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
} 