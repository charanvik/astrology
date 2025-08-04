export interface LocationResult {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
  display_name: string;
}

export async function searchLocations(query: string): Promise<LocationResult[]> {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    return data.map((item: any) => ({
      name: item.display_name.split(',')[0],
      country: item.address?.country || '',
      state: item.address?.state || '',
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      display_name: item.display_name
    }));
  } catch (error) {
    console.error('Error fetching location data:', error);
    return [];
  }
}