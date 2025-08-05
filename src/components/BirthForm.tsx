import React, { useState } from 'react';
import { Calendar, MapPin, Clock } from 'lucide-react';
import LocationSearch from './LocationSearch';

interface BirthData {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
  latitude: number;
  longitude: number;
  timezone: number;
}

interface BirthFormProps {
  onSubmit: (data: BirthData) => void;
  loading: boolean;
}

export default function BirthForm({ onSubmit, loading }: BirthFormProps) {
  const [formData, setFormData] = useState<BirthData>({
    year: 1990,
    month: 1,
    date: 1,
    hours: 12,
    minutes: 0,
    seconds: 0,
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof BirthData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lon
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Birth Details</h2>
        <p className="text-gray-500 text-sm">Enter your birth information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-olive-600 mb-2">
              <Calendar className="w-5 h-5" />
              <h3 className="font-medium text-sm">Date</h3>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Month</label>
              <input
                type="number"
                min="1"
                max="12"
                value={formData.month}
                onChange={(e) => handleInputChange('month', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
              <input
                type="number"
                min="1"
                max="31"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-olive-600 mb-2">
              <Clock className="w-5 h-5" />
              <h3 className="font-medium text-sm">Time</h3>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hours</label>
              <input
                type="number"
                min="0"
                max="23"
                value={formData.hours}
                onChange={(e) => handleInputChange('hours', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={formData.minutes}
                onChange={(e) => handleInputChange('minutes', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={formData.seconds}
                onChange={(e) => handleInputChange('seconds', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-olive-600 mb-2">
              <MapPin className="w-5 h-5" />
              <h3 className="font-medium text-sm">Location</h3>
            </div>
            
            <div>
              <LocationSearch
                onLocationSelect={handleLocationSelect}
                currentLat={formData.latitude}
                currentLon={formData.longitude}
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Timezone</label>
              <input
                type="number"
                step="0.5"
                value={formData.timezone}
                onChange={(e) => handleInputChange('timezone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive-500 focus:border-transparent text-sm"
                required
              />
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-olive-600 text-white px-6 py-3 rounded-lg hover:bg-olive-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-md w-full md:w-auto"
          >
            {loading ? 'Calculating...' : 'Calculate Chart'}
          </button>
        </div>
      </form>
    </div>
  );
}