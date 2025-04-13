import { useState, useEffect } from 'react';
import { Building, michiganBuildings } from '@/data/buildings';
import { getCurrentLocation, findNearestBuilding } from '@/utils/location';

interface BathroomSelectionProps {
  onSelect: (building: string, floor: string) => void;
}

export default function BathroomSelection({ onSelect }: BathroomSelectionProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<string>('');
  const [nearestBuilding, setNearestBuilding] = useState<Building | null>(null);
  const [locationError, setLocationError] = useState<string>('');

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
      } catch (error) {
        setLocationError('Unable to access your location. Please enable location services for better recommendations.');
      }
    };

    getLocation();
  }, []);

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBuilding(e.target.value);
    setSelectedFloor('');
  };

  const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFloor(e.target.value);
    onSelect(selectedBuilding, e.target.value);
  };

  const getFloors = () => {
    const building = michiganBuildings.find(b => b.name === selectedBuilding);
    return building ? building.bathrooms : [];
  };

  return (
    <div className="space-y-4">
      {locationError && (
        <div className="text-yellow-600 text-sm">
          {locationError}
        </div>
      )}
      
      {nearestBuilding && (
        <div className="bg-blue-50 p-3 rounded-md">
          <p className="text-sm text-blue-800">
            Based on your location, we recommend: <strong>{nearestBuilding.name}</strong>
          </p>
        </div>
      )}

      <div>
        <label htmlFor="building" className="block text-sm font-medium text-gray-700">
          Select Building
        </label>
        <select
          id="building"
          value={selectedBuilding}
          onChange={handleBuildingChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a building</option>
          {michiganBuildings.map((building) => (
            <option key={building.name} value={building.name}>
              {building.name}
            </option>
          ))}
        </select>
      </div>

      {selectedBuilding && (
        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700">
            Select Floor
          </label>
          <select
            id="floor"
            value={selectedFloor}
            onChange={handleFloorChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">Select a floor</option>
            {getFloors().map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 