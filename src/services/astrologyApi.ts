export interface BirthData {
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

export interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
}

export interface NavamsaPlanet {
  name: string;
  isRetro: string;
  current_sign: number;
  house_number: number;
}

export interface NavamsaApiResponse {
  statusCode: number;
  output: Record<string, NavamsaPlanet>;
}

export interface ApiResponse {
  statusCode: number;
  input: BirthData & {
    config: {
      observation_point: string;
      ayanamsha: string;
    };
  };
  output: any[];
}

export async function fetchPlanetaryData(birthData: BirthData): Promise<Record<string, Planet>> {
  const requestBody = {
    ...birthData,
    settings: {
      observation_point: "topocentric",
      ayanamsha: "lahiri"
    }
  };

  try {
    const response = await fetch('https://json.freeastrologyapi.com/planets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'y9Jkhkq1ot9iLwQTCqicG7FlllPYblPR47F8kCxT'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ApiResponse = await response.json();
    
    // Extract planets data from the second object in the output array
    if (data.output && data.output.length > 1) {
      const planets = data.output[1] as Record<string, Planet>;
      // Filter out Uranus, Neptune, and Pluto
      const filteredPlanets: Record<string, Planet> = {};
      for (const [key, planet] of Object.entries(planets)) {
        if (!['Uranus', 'Neptune', 'Pluto'].includes(key)) {
          filteredPlanets[key] = planet;
        }
      }
      return filteredPlanets;
    } else {
      throw new Error('Invalid API response format');
    }
  } catch (error) {
    console.error('Error fetching planetary data:', error);
    
    // Return mock data for demonstration purposes
    return {
      Ascendant: {
        name: "Ascendant",
        fullDegree: 260.152,
        normDegree: 20.152,
        isRetro: "false",
        current_sign: 9
      },
      Sun: {
        name: "Sun",
        fullDegree: 114.608,
        normDegree: 24.608,
        isRetro: "false",
        current_sign: 4
      },
      Moon: {
        name: "Moon",
        fullDegree: 285.033,
        normDegree: 15.033,
        isRetro: "false",
        current_sign: 10
      },
      Mars: {
        name: "Mars",
        fullDegree: 30.510,
        normDegree: 0.510,
        isRetro: "false",
        current_sign: 2
      },
      Mercury: {
        name: "Mercury",
        fullDegree: 137.236,
        normDegree: 17.236,
        isRetro: "false",
        current_sign: 5
      },
      Jupiter: {
        name: "Jupiter",
        fullDegree: 344.252,
        normDegree: 14.252,
        isRetro: "true",
        current_sign: 12
      },
      Venus: {
        name: "Venus",
        fullDegree: 95.458,
        normDegree: 5.458,
        isRetro: "false",
        current_sign: 4
      },
      Saturn: {
        name: "Saturn",
        fullDegree: 297.966,
        normDegree: 27.966,
        isRetro: "true",
        current_sign: 10
      },
      Rahu: {
        name: "Rahu",
        fullDegree: 23.585,
        normDegree: 23.585,
        isRetro: "true",
        current_sign: 1
      },
      Ketu: {
        name: "Ketu",
        fullDegree: 203.585,
        normDegree: 23.585,
        isRetro: "true",
        current_sign: 7
      }
    };
  }
}

export async function fetchNavamsaData(birthData: BirthData): Promise<Record<string, NavamsaPlanet>> {
  const requestBody = {
    ...birthData,
    settings: {
      observation_point: "topocentric",
      ayanamsha: "lahiri"
    }
  };

  try {
    const response = await fetch('https://json.freeastrologyapi.com/navamsa-chart-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'y9Jkhkq1ot9iLwQTCqicG7FlllPYblPR47F8kCxT'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: NavamsaApiResponse = await response.json();
    
    // Convert the numbered keys to planet names
    const navamsaData: Record<string, NavamsaPlanet> = {};
    Object.values(data.output).forEach((planet) => {
      // Filter out Uranus, Neptune, and Pluto
      if (!['Uranus', 'Neptune', 'Pluto'].includes(planet.name)) {
        navamsaData[planet.name] = planet;
      }
    });
    
    return navamsaData;
  } catch (error) {
    console.error('Error fetching Navamsha data:', error);
    
    // Return mock data for demonstration purposes (without outer planets)
    return {
      Ascendant: {
        name: "Ascendant",
        isRetro: "false",
        current_sign: 2,
        house_number: 1
      },
      Sun: {
        name: "Sun",
        isRetro: "false",
        current_sign: 5,
        house_number: 4
      },
      Moon: {
        name: "Moon",
        isRetro: "false",
        current_sign: 3,
        house_number: 2
      },
      Mars: {
        name: "Mars",
        isRetro: "false",
        current_sign: 10,
        house_number: 9
      },
      Mercury: {
        name: "Mercury",
        isRetro: "false",
        current_sign: 11,
        house_number: 10
      },
      Jupiter: {
        name: "Jupiter",
        isRetro: "false",
        current_sign: 8,
        house_number: 7
      },
      Venus: {
        name: "Venus",
        isRetro: "false",
        current_sign: 5,
        house_number: 4
      },
      Saturn: {
        name: "Saturn",
        isRetro: "false",
        current_sign: 6,
        house_number: 5
      },
      Rahu: {
        name: "Rahu",
        isRetro: "true",
        current_sign: 12,
        house_number: 11
      },
      Ketu: {
        name: "Ketu",
        isRetro: "true",
        current_sign: 6,
        house_number: 5
      }
    };
  }
}