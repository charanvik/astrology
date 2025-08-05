import React, { useEffect, useRef } from 'react';

interface NavamsaPlanet {
  name: string;
  isRetro: string;
  current_sign: number;
  house_number: number;
}

interface NavamsaChartProps {
  planets: Record<string, NavamsaPlanet>;
}

export default function NavamsaChart({ planets }: NavamsaChartProps) {
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

    function parseNavamsaData(rawPlanetData: Record<string, NavamsaPlanet>) {
      const parsedData: Record<string, any> = {};
      for (const key in rawPlanetData) {
        const planet = rawPlanetData[key];
        if (planet && planet.current_sign) {
          parsedData[key] = {
            name: key,
            sign: planet.current_sign,
            house: planet.house_number,
            isRetro: planet.isRetro === 'true'
          };
        }
      }
      return parsedData;
    }

    function renderNavamsaChart(navamsaData: Record<string, any>) {
      // Group planets by house number
      const housesWithPlanets: Record<string, any[]> = {};
      for (const planetName in navamsaData) {
        // Skip Ascendant in Navamsha chart
        if (planetName === 'Ascendant') continue;
        
        const planet = navamsaData[planetName];
        // Move planets one house forward clockwise (add 1, wrap around at 12)
        const adjustedHouse = (planet.house % 12) + 1;
        const houseId = `house${adjustedHouse}`;
        if (!housesWithPlanets[houseId]) housesWithPlanets[houseId] = [];
        housesWithPlanets[houseId].push(planet);
      }

      // Render planets in each house
      for (let i = 1; i <= 12; i++) {
        const houseId = `house${i}`;
        const housePolygon = svg.querySelector(`#${houseId}`) as SVGPolygonElement;
        if (!housePolygon) continue;
        
        const bbox = housePolygon.getBBox();

        if (housesWithPlanets[houseId]) {
          const planetsInHouse = housesWithPlanets[houseId];
          planetsInHouse.forEach((planetInfo, index) => {
            const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            const centerX = bbox.x + bbox.width / 2;
            const startY = (bbox.y + bbox.height / 2) - ((planetsInHouse.length - 1) * 22) / 2;
            textElement.setAttribute('x', centerX.toString());
            textElement.setAttribute('y', (startY + (index * 22)).toString());
            
            textElement.textContent = `${planetSymbols[planetInfo.name as keyof typeof planetSymbols] || planetInfo.name} (${planetInfo.sign})`;
            
            textElement.classList.add('planet-label');
            if (planetInfo.name === "Ascendant") textElement.classList.add('ascendant-label');
            if (planetInfo.isRetro) textElement.classList.add('retrograde');
            svg.appendChild(textElement);
          });
        } else {
          // Show empty house marker
          const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          textElement.setAttribute('x', (bbox.x + bbox.width / 2).toString());
          textElement.setAttribute('y', (bbox.y + bbox.height / 2).toString());
          textElement.textContent = `H${i}`;
          textElement.classList.add('planet-label', 'empty-house-marker');
          svg.appendChild(textElement);
        }
      }
    }

    const navamsaData = parseNavamsaData(planets);
    renderNavamsaChart(navamsaData);
  }, [planets]);

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-1">Navamsha Chart</h2>
        <p className="text-gray-500 text-sm">D9 Chart</p>
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
                stroke: #808000;
                stroke-width: 2;
              }
              .planet-label {
                font-family: 'Arial', sans-serif;
                font-size: 13px;
                font-weight: bold;
                fill: #1e293b;
                text-anchor: middle;
                dominant-baseline: middle;
                pointer-events: none;
              }
              .planet-label.retrograde {
                fill: #dc2626;
              }
              .ascendant-label {
                fill: #16a34a;
              }
              .empty-house-marker {
                fill: #94a3b8;
                font-size: 16px;
              }
            `}
          </style>
          
          {/* The 12 houses of the Navamsha chart */}
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
        <div className="text-xs text-gray-600 space-y-2">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <span className="font-medium text-orange-600">Su</span> - Sun
            </div>
            <div>
              <span className="font-medium text-blue-400">Mo</span> - Moon
            </div>
            <div>
              <span className="font-medium text-red-600">Ma</span> - Mars
            </div>
            <div>
              <span className="font-medium text-green-600">Me</span> - Mercury
            </div>
            <div>
              <span className="font-medium text-yellow-600">Ju</span> - Jupiter
            </div>
            <div>
              <span className="font-medium text-pink-500">Ve</span> - Venus
            </div>
            <div>
              <span className="font-medium text-gray-700">Sa</span> - Saturn
            </div>
            <div>
              <span className="font-medium text-purple-600">Ra</span> - Rahu
            </div>
            <div>
              <span className="font-medium text-indigo-600">Ke</span> - Ketu
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-gray-300">
            <p className="text-xs text-gray-500">
              <span className="text-red-600 font-medium">Red</span> = Retrograde planets
            </p>
            </div>
          </div>
        </div>
      </div>
  );
}