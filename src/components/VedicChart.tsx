import React, { useEffect, useRef } from 'react';

interface Planet {
  name: string;
  fullDegree: number;
  normDegree: number;
  isRetro: string;
  current_sign: number;
}

interface VedicChartProps {
  planets: Record<string, Planet>;
}

export default function VedicChart({ planets }: VedicChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !planets) return;

    const svg = svgRef.current;
    
    // Clear existing planet labels
    const existingLabels = svg.querySelectorAll('.planet-label, .empty-house-marker');
    existingLabels.forEach(label => label.remove());

    const planetSymbols = { 
      "Ascendant": "As", 
      "Sun": "Su", 
      "Moon": "Mo", 
      "Mars": "Ma", 
      "Mercury": "Me", 
      "Jupiter": "Ju", 
      "Venus": "Ve", 
      "Saturn": "Sa", 
      "Rahu": "Ra", 
      "Ketu": "Ke" 
    };

    function parseAstroData(rawPlanetData: Record<string, Planet>) {
      const parsedData: Record<string, any> = {};
      for (const key in rawPlanetData) {
        const planet = rawPlanetData[key];
        if (planet && planet.current_sign) {
          parsedData[key] = {
            name: key,
            sign: planet.current_sign,
            isRetro: planet.isRetro === 'true',
            degree: planet.normDegree
          };
        }
      }
      return parsedData;
    }

    function createSignToHouseMap(ascendantSign: number) {
      const antiClockwiseHouseIds = [
        'house1', 'house2', 'house3', 'house4', 'house5', 'house6',
        'house7', 'house8', 'house9', 'house10', 'house11', 'house12'
      ];
      const signToHouseIdMap: Record<number, string> = {};
      for (let i = 0; i < 12; i++) {
        const signNumber = (ascendantSign - 1 + i) % 12 + 1;
        const physicalHouseId = antiClockwiseHouseIds[i];
        signToHouseIdMap[signNumber] = physicalHouseId;
      }
      return signToHouseIdMap;
    }

    function renderChart(astroData: Record<string, any>) {
      if (!astroData.Ascendant) {
        console.error("Ascendant data is missing.");
        return;
      }

      const ascendantSign = astroData.Ascendant.sign;
      const signToHouseMap = createSignToHouseMap(ascendantSign);

      const housesWithPlanets: Record<string, any[]> = {};
      for (const planetName in astroData) {
        const planet = astroData[planetName];
        const houseId = signToHouseMap[planet.sign];
        if (houseId) {
          if (!housesWithPlanets[houseId]) housesWithPlanets[houseId] = [];
          housesWithPlanets[houseId].push(planet);
        }
      }

      const houseIdToSignMap: Record<string, number> = {};
      for (const sign in signToHouseMap) {
        houseIdToSignMap[signToHouseMap[parseInt(sign)]] = parseInt(sign);
      }

      for (let i = 1; i <= 12; i++) {
        const houseId = `house${i}`;
        const housePolygon = svg.querySelector(`#${houseId}`) as SVGPolygonElement;
        if (!housePolygon) continue;
        
        const bbox = housePolygon.getBBox();

        if (housesWithPlanets[houseId]) {
          const planetsInHouse = housesWithPlanets[houseId];
          const displayedSignsInHouse = new Set();
          planetsInHouse.forEach((planetInfo, index) => {
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const centerX = bbox.x + bbox.width / 2;
            const startY = (bbox.y + bbox.height / 2) - ((planetsInHouse.length - 1) * 22) / 2;
            textElement.setAttribute('x', centerX.toString());
            textElement.setAttribute('y', (startY + (index * 22)).toString());
            
            if (displayedSignsInHouse.has(planetInfo.sign)) {
              textElement.textContent = `${planetSymbols[planetInfo.name as keyof typeof planetSymbols] || planetInfo.name} ${Math.round(planetInfo.degree)}°`;
            } else {
              textElement.textContent = `${planetSymbols[planetInfo.name as keyof typeof planetSymbols] || planetInfo.name} ${Math.round(planetInfo.degree)}° (${planetInfo.sign})`;
              displayedSignsInHouse.add(planetInfo.sign);
            }
            
            textElement.classList.add('planet-label');
            if (planetInfo.name === "Ascendant") textElement.classList.add('ascendant-label');
            if (planetInfo.isRetro) textElement.classList.add('retrograde');
            svg.appendChild(textElement);
          });
        } else {
          const signForThisHouse = houseIdToSignMap[houseId];
          const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textElement.setAttribute('x', (bbox.x + bbox.width / 2).toString());
          textElement.setAttribute('y', (bbox.y + bbox.height / 2).toString());
          textElement.textContent = `(${signForThisHouse})`;
          textElement.classList.add('planet-label', 'empty-house-marker');
          svg.appendChild(textElement);
        }
      }
    }

    const astroData = parseAstroData(planets);
    renderChart(astroData);
  }, [planets]);

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-black mb-1">Birth Chart</h2>
        <p className="text-gray-500 text-sm">Rashi Chart</p>
      </div>

      <div className="flex justify-center">
        <svg
          ref={svgRef}
          className="w-full max-w-lg h-auto bg-gray-50 rounded-lg border border-gray-200"
          viewBox="0 0 780 800"
          preserveAspectRatio="xMidYMid meet"
        >
          <style>
            {`
              .house {
                fill: #ffffff;
                stroke: #000000;
                stroke-width: 2;
              }
              .planet-label {
                font-family: 'Arial', sans-serif;
                font-size: 13px;
                font-weight: bold;
                fill: #000000;
                text-anchor: middle;
                dominant-baseline: middle;
                pointer-events: none;
              }
              .planet-label.retrograde {
                fill: #f97316;
              }
              .ascendant-label {
                fill: #f97316;
              }
              .empty-house-marker {
                fill: #94a3b8;
                font-size: 16px;
              }
            `}
          </style>
          
          {/* The 12 houses of the chart */}
          <polygon className="house" points="400,100 250,250 400,400 550,250" id="house1" />
          <polygon className="house" points="100,100 250,250 400,100" id="house2" />
          <polygon className="house" points="100,400 250,250 100,100" id="house3" />
          <polygon className="house" points="250,250 100,400 250,550 400,400" id="house4" />
          <polygon className="house" points="100,400 250,550 100,700" id="house5" />
          <polygon className="house" points="100,700 250,550 400,700" id="house6" />
          <polygon className="house" points="400,400 250,550 400,700 550,550" id="house7" />
          <polygon className="house" points="400,700 550,550 700,700" id="house8" />
          <polygon className="house" points="700,400 550,550 700,700" id="house9" />
          <polygon className="house" points="550,250 700,400 550,550 400,400" id="house10" />
          <polygon className="house" points="700,100 550,250 700,400" id="house11" />
          <polygon className="house" points="400,100 550,250 700,100" id="house12" />
        </svg>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs text-black space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="font-medium text-orange-500">As</span> - Ascendant
            </div>
            <div>
              <span className="font-medium text-orange-600">Su</span> - Sun
            </div>
            <div>
              <span className="font-medium text-black">Mo</span> - Moon
            </div>
            <div>
              <span className="font-medium text-orange-500">Ma</span> - Mars
            </div>
            <div>
              <span className="font-medium text-black">Me</span> - Mercury
            </div>
            <div>
              <span className="font-medium text-orange-500">Ju</span> - Jupiter
            </div>
            <div>
              <span className="font-medium text-black">Ve</span> - Venus
            </div>
            <div>
              <span className="font-medium text-orange-500">Sa</span> - Saturn
            </div>
            <div>
              <span className="font-medium text-black">Ra</span> - Rahu
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              <span className="text-orange-500 font-medium">Orange</span> = Retrograde planets
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}