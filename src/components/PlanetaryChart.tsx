import React from 'react';
import { Star, Circle } from 'lucide-react';

interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
}

interface PlanetaryChartProps {
  planets: Record<string, Planet>;
}

const zodiacSigns = [
  '', // 0 index not used
  'मेष (Aries)', // 1
  'वृषभ (Taurus)', // 2
  'मिथुन (Gemini)', // 3
  'कर्क (Cancer)', // 4
  'सिंह (Leo)', // 5
  'कन्या (Virgo)', // 6
  'तुला (Libra)', // 7
  'वृश्चिक (Scorpio)', // 8
  'धनु (Sagittarius)', // 9
  'मकर (Capricorn)', // 10
  'कुम्भ (Aquarius)', // 11
  'मीन (Pisces)' // 12
];

const planetSymbols: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mars: '♂',
  Mercury: '☿',
  Jupiter: '♃',
  Venus: '♀',
  Saturn: '♄',
  Rahu: '☊',
  Ketu: '☋',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
  Ascendant: '↗'
};

const planetColors: Record<string, string> = {
  Sun: 'text-orange-600',
  Moon: 'text-blue-400',
  Mars: 'text-red-600',
  Mercury: 'text-green-600',
  Jupiter: 'text-yellow-600',
  Venus: 'text-pink-500',
  Saturn: 'text-gray-700',
  Rahu: 'text-purple-600',
  Ketu: 'text-indigo-600',
  Uranus: 'text-cyan-500',
  Neptune: 'text-blue-600',
  Pluto: 'text-gray-600',
  Ascendant: 'text-olive-600'
};

export default function PlanetaryChart({ planets }: PlanetaryChartProps) {
  const formatDegree = (degree: number) => {
    const deg = Math.floor(degree);
    const min = Math.floor((degree - deg) * 60);
    const sec = Math.floor(((degree - deg) * 60 - min) * 60);
    return `${deg}°${min}'${sec}"`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-olive-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-black mb-2">ग्रह स्थिति</h2>
        <p className="text-gray-600">Planetary Positions in Your Birth Chart</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(planets).map(([planetName, planetData]) => (
          <div
            key={planetName}
            className="bg-gradient-to-br from-white to-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-olive-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`text-3xl ${planetColors[planetName] || 'text-gray-600'} group-hover:scale-110 transition-transform duration-200`}>
                  {planetSymbols[planetName] || <Star className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-black">{planetName}</h3>
                  <p className="text-sm text-gray-500">
                    {zodiacSigns[planetData.current_sign] || 'Unknown Sign'}
                  </p>
                </div>
              </div>
              {planetData.isRetro === 'true' && (
                <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-semibold">
                  ℞ Retrograde
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Position:</span>
                <span className="font-mono text-sm bg-olive-100 px-2 py-1 rounded">
                  {formatDegree(planetData.normDegree)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Sign:</span>
                <span className="text-sm font-semibold text-olive-700">
                  Sign {planetData.current_sign}
                </span>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-olive-500 to-orange-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${(planetData.normDegree / 30) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-center">
                  {(planetData.normDegree / 30 * 100).toFixed(1)}% through sign
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-r from-olive-50 to-orange-50 rounded-lg border border-olive-200">
        <h3 className="text-xl font-bold text-black mb-3 flex items-center">
          <Circle className="w-5 h-5 mr-2 text-olive-600" />
          Chart Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Ascendant:</span> {zodiacSigns[planets.Ascendant?.current_sign]} at {formatDegree(planets.Ascendant?.normDegree)}
            </p>
          </div>
          <div>
            <p className="text-gray-700">
              <span className="font-semibold">Retrograde Planets:</span> {' '}
              {Object.entries(planets).filter(([_, data]) => data.isRetro === 'true').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}