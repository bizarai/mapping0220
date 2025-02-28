// src/components/ThreeRiversMap.tsx

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Point {
  name: string;
  coordinates: [number, number];
  elevation?: string;
  type: 'mountain' | 'town' | 'accommodation';
}

interface River {
  name: string;
  color: string;
  coordinates: [number, number][];
}

const ThreeRiversMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string>('');

  const points: Point[] = [
    {
      name: "梅里雪山",
      coordinates: [98.68, 28.36],
      elevation: "6740m",
      type: "mountain"
    },
    {
      name: "白马雪山",
      coordinates: [98.95, 28.45],
      elevation: "4292m",
      type: "mountain"
    },
    {
      name: "玉龙雪山",
      coordinates: [99.15, 28.25],
      elevation: "5596m",
      type: "mountain"
    },
    // Add more points as needed
  ];

  const rivers: River[] = [
    {
      name: "澜沧江",
      color: "#2563EB",
      coordinates: [
        [98.6, 28.6],
        [98.65, 28.4],
        [98.7, 28.2]
      ]
    },
    {
      name: "怒江",
      color: "#059669",
      coordinates: [
        [98.8, 28.6],
        [98.85, 28.4],
        [98.9, 28.2]
      ]
    },
    {
      name: "金沙江",
      color: "#92400E",
      coordinates: [
        [99.0, 28.6],
        [99.05, 28.4],
        [99.1, 28.2]
      ]
    }
  ];

  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;

    try {
      const token = process.env.REACT_APP_MAPBOX_TOKEN;
      if (!token) {
        throw new Error('Mapbox token not found');
      }

      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [98.8, 28.4],
        zoom: 9,
        maxBounds: [[98.4, 28.0], [99.2, 28.8]]
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        // Add rivers
        rivers.forEach((river, index) => {
          if (!map.current) return;

          map.current.addSource(`river-${index}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: { name: river.name },
              geometry: {
                type: 'LineString',
                coordinates: river.coordinates
              }
            }
          });

          map.current.addLayer({
            id: `river-${index}`,
            type: 'line',
            source: `river-${index}`,
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': river.color,
              'line-width': 3
            }
          });
        });

        // Add points
        points.forEach(point => {
          const el = document.createElement('div');
          el.className = `marker ${point.type}`;
          
          new mapboxgl.Marker(el)
            .setLngLat(point.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <h3 class="text-lg font-semibold">${point.name}</h3>
                  ${point.elevation ? `<p class="text-sm">海拔: ${point.elevation}</p>` : ''}
                `)
            )
            .addTo(map.current);
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-[600px] rounded-lg shadow-lg"
      />
      <div className="mt-4 p-4 bg-white rounded shadow">
        <h3 className="text-lg font-semibold mb-2">图例 Legend</h3>
        <div className="flex flex-wrap gap-4">
          {rivers.map((river, index) => (
            <div key={index} className="flex items-center">
              <div 
                className="w-4 h-4 rounded mr-2" 
                style={{ backgroundColor: river.color }}
              />
              <span>{river.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThreeRiversMap;