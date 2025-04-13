import { useState } from 'react';
import { michiganBuildings } from '@/data/buildings';

interface BathroomSelectionProps {
  onSelect: (building: string, bathroom: string) => void;
}

export default function BathroomSelection({ onSelect }: BathroomSelectionProps) {
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [selectedBathroom, setSelectedBathroom] = useState('');

  const handleBuildingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const building = e.target.value;
    setSelectedBuilding(building);
    setSelectedBathroom('');
  };

  const handleBathroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bathroom = e.target.value;
    setSelectedBathroom(bathroom);
    onSelect(selectedBuilding, bathroom);
  };

  const selectedBuildingData = michiganBuildings.find(
    (building) => building.name === selectedBuilding
  );

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="building" className="block text-sm font-medium text-gray-700">
          Building
        </label>
        <select
          id="building"
          value={selectedBuilding}
          onChange={handleBuildingChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
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
          <label htmlFor="bathroom" className="block text-sm font-medium text-gray-700">
            Bathroom
          </label>
          <select
            id="bathroom"
            value={selectedBathroom}
            onChange={handleBathroomChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select a bathroom</option>
            {selectedBuildingData?.bathrooms.map((bathroom) => (
              <option key={bathroom} value={bathroom}>
                {bathroom}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
} 