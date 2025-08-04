import React, { useState } from 'react';
import { Star, Sparkles } from 'lucide-react';
import BirthForm from './components/BirthForm';
import PlanetaryChart from './components/PlanetaryChart';
import VedicChart from './components/VedicChart';
import NavamsaChart from './components/NavamsaChart';
import { fetchPlanetaryData, fetchNavamsaData, BirthData, Planet, NavamsaPlanet } from './services/astrologyApi';

function App() {
  const [planets, setPlanets] = useState<Record<string, Planet> | null>(null);
  const [navamsaPlanets, setNavamsaPlanets] = useState<Record<string, NavamsaPlanet> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'modern' | 'traditional' | 'navamsha'>('modern');

  const handleFormSubmit = async (birthData: BirthData) => {
    setLoading(true);
    setError(null);
    
    try {
      const [planetaryData, navamsaData] = await Promise.all([
        fetchPlanetaryData(birthData),
        fetchNavamsaData(birthData)
      ]);
      setPlanets(planetaryData);
      setNavamsaPlanets(navamsaData);
    } catch (err) {
      setError('Failed to fetch planetary data. Please check your input and try again.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-olive-600 to-olive-700 text-white py-8 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Star className="w-10 h-10 text-orange-300" />
              <h1 className="text-4xl md:text-5xl font-bold">ASTRO MANJIT</h1>
              <Sparkles className="w-10 h-10 text-orange-300" />
            </div>
            <p className="text-xl text-olive-100">Vedic Astrology Planetary Calculator</p>
            <p className="text-olive-200 mt-2">Discover the cosmic influences at the moment of your birth</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-black mb-4">Planetary Position Calculator</h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              Enter your birth details below to discover the precise positions of all planets at the moment of your birth. 
              This ancient Vedic system provides insights into your personality, strengths, and life path through 
              the cosmic arrangement at your birth time.
            </p>
          </div>

          {/* Birth Form */}
          <BirthForm onSubmit={handleFormSubmit} loading={loading} />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800 font-semibold">⚠️ {error}</p>
              <p className="text-red-600 text-sm mt-2">
                Note: This demo uses mock data when the API is unavailable. Replace YOUR_API_KEY_HERE with a valid API key for live data.
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="inline-flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-olive-600"></div>
                <span className="text-lg text-gray-600">Calculating planetary positions...</span>
              </div>
            </div>
          )}

          {/* Planetary Chart */}
          {planets && navamsaPlanets && !loading && (
            <div className="animate-fade-in space-y-8">
              {/* View Toggle */}
              <div className="flex justify-center">
                <div className="bg-white rounded-lg p-2 shadow-lg border border-olive-200">
                  <div className="flex space-x-1">
                    <button
                      onClick={() => setViewMode('modern')}
                      className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                        viewMode === 'modern'
                          ? 'bg-olive-600 text-white shadow-md'
                          : 'text-olive-600 hover:bg-olive-50'
                      }`}
                    >
                      Modern View
                    </button>
                    <button
                      onClick={() => setViewMode('traditional')}
                      className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                        viewMode === 'traditional'
                          ? 'bg-olive-600 text-white shadow-md'
                          : 'text-olive-600 hover:bg-olive-50'
                      }`}
                    >
                      Birth Chart
                    </button>
                    <button
                      onClick={() => setViewMode('navamsha')}
                      className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                        viewMode === 'navamsha'
                          ? 'bg-olive-600 text-white shadow-md'
                          : 'text-olive-600 hover:bg-olive-50'
                      }`}
                    >
                      Navamsha Chart
                    </button>
                  </div>
                </div>
              </div>

              {/* Chart Display */}
              {viewMode === 'modern' && (
                <PlanetaryChart planets={planets} />
              )}
              {viewMode === 'traditional' && (
                <VedicChart planets={planets} />
              )}
              {viewMode === 'navamsha' && (
                <NavamsaChart planets={navamsaPlanets} />
              )}
            </div>
          )}

          {/* Footer Information */}
          <div className="bg-gradient-to-r from-olive-50 to-orange-50 rounded-lg p-8 border border-olive-200 mt-12">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-black mb-4">About Vedic Astrology</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
                <div className="space-y-2">
                  <h4 className="font-semibold text-olive-700">Ancient Wisdom</h4>
                  <p>Vedic astrology, or Jyotisha, is a 5,000-year-old system that uses precise mathematical calculations to determine planetary influences.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-orange-600">Sidereal System</h4>
                  <p>Unlike Western astrology, Vedic astrology uses the sidereal zodiac, which accounts for the precession of equinoxes.</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-olive-700">Spiritual Guidance</h4>
                  <p>The planetary positions offer insights into karma, dharma, and the soul's journey through this lifetime.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;