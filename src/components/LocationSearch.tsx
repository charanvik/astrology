import React, { useState, useEffect } from 'react';
import { MapPin, Search, Loader } from 'lucide-react';
import { searchLocations, LocationResult } from '../services/geocodingApi';

interface LocationSearchProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
  currentLat: number;
  currentLon: number;
}

export default function LocationSearch({ onLocationSelect, currentLat, currentLon }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim().length >= 3) {
        setLoading(true);
        try {
          const locations = await searchLocations(query);
          setResults(locations);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleLocationSelect = (location: LocationResult) => {
    onLocationSelect(location.lat, location.lon, location.name);
    setQuery(location.name);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-1">Search Location</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <Loader className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city or location..."
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent"
        />
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {results.map((location, index) => (
            <button
              key={index}
              onClick={() => handleLocationSelect(location)}
              className="w-full px-4 py-3 text-left hover:bg-olive-50 focus:bg-olive-50 focus:outline-none border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-olive-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {location.name}
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {location.display_name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <div className="mt-2 text-xs text-gray-500">
        Current: {currentLat.toFixed(4)}, {currentLon.toFixed(4)}
      </div>
    </div>
  );
}