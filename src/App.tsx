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
  const [viewMode, setViewMode] = useState<'birth' | 'navamsha'>('birth');

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
    <div className="min-h-screen bg-gray-50">
      {/* Android-style Header */}
      <header className="bg-olive-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Star className="w-8 h-8 text-orange-300" />
              <h1 className="text-2xl font-bold">Astro Manjit</h1>
            </div>
            <Sparkles className="w-6 h-6 text-orange-300" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Birth Form */}
          <BirthForm onSubmit={handleFormSubmit} loading={loading} />

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-olive-600"></div>
                <span className="text-gray-600">Calculating...</span>
              </div>
            </div>
          )}

          {/* Planetary Chart */}
          {planets && navamsaPlanets && !loading && (
            <div className="animate-fade-in space-y-6">
              {/* View Toggle */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex">
                  <button
                    onClick={() => setViewMode('birth')}
                    className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                      viewMode === 'birth'
                        ? 'bg-olive-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    } rounded-l-lg`}
                  >
                    Birth Chart
                  </button>
                  <button
                    onClick={() => setViewMode('navamsha')}
                    className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
                      viewMode === 'navamsha'
                        ? 'bg-olive-600 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    } rounded-r-lg`}
                  >
                    Navamsha Chart
                  </button>
                </div>
              </div>

              {/* Chart Display */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {viewMode === 'birth' && (
                  <VedicChart planets={planets} />
                )}
                {viewMode === 'navamsha' && (
                  <NavamsaChart planets={navamsaPlanets} />
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;