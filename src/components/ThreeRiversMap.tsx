// src/components/ThreeRiversMap.tsx

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface Point {
  name: string;
  coordinates: [number, number];
  elevation?: string;
  type: 'mountain' | 'town' | 'accommodation';
  description?: string;
}

interface River {
  name: string;
  color: string;
  coordinates: [number, number][];
  description?: string;
}

const ThreeRiversMap: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string>('');
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);

  // Points of interest data - expanded with more realistic data
  const points: Point[] = [
    {
      name: "梅里雪山 (Meili Snow Mountain)",
      coordinates: [98.68, 28.36],
      elevation: "6740m",
      type: "mountain",
      description: "Sacred mountain in Tibetan Buddhism and the highest peak in Yunnan Province."
    },
    {
      name: "白马雪山 (Baima Snow Mountain)",
      coordinates: [98.95, 28.45],
      elevation: "4292m",
      type: "mountain",
      description: "Important ecological reserve with rich biodiversity."
    },
    {
      name: "玉龙雪山 (Jade Dragon Snow Mountain)",
      coordinates: [99.15, 28.25],
      elevation: "5596m",
      type: "mountain",
      description: "Famous mountain near Lijiang, with glacier views."
    },
    {
      name: "香格里拉 (Shangri-La)",
      coordinates: [99.04, 28.50],
      type: "town",
      description: "Major cultural hub in the Three Rivers area."
    },
    {
      name: "丽江古城 (Lijiang Old Town)",
      coordinates: [99.15, 28.20],
      type: "town",
      description: "UNESCO World Heritage site with traditional architecture."
    },
    {
      name: "泸沽湖 (Lugu Lake)",
      coordinates: [98.70, 28.20],
      type: "accommodation",
      description: "Beautiful lake with traditional Mosuo culture villages."
    }
  ];

  // River data with more realistic coordinates
  const rivers: River[] = [
    {
      name: "澜沧江 (Lancang River/Mekong)",
      color: "#2563EB",
      description: "Flows through Southeast Asia to Vietnam",
      coordinates: [
        [98.65, 28.60],
        [98.67, 28.50],
        [98.70, 28.40],
        [98.75, 28.30],
        [98.78, 28.20],
        [98.80, 28.10]
      ]
    },
    {
      name: "怒江 (Nu River/Salween)",
      color: "#059669",
      description: "Flows through Myanmar to the Andaman Sea",
      coordinates: [
        [98.85, 28.70],
        [98.87, 28.60],
        [98.90, 28.50],
        [98.95, 28.40],
        [98.97, 28.30],
        [99.00, 28.20]
      ]
    },
    {
      name: "金沙江 (Jinsha River/Upper Yangtze)",
      color: "#92400E",
      description: "Becomes the Yangtze River further east",
      coordinates: [
        [99.10, 28.70],
        [99.12, 28.60],
        [99.15, 28.50],
        [99.18, 28.40],
        [99.20, 28.30],
        [99.25, 28.20]
      ]
    }
  ];

  // Handle map initialization
  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;

    try {
      // Use a public token for demo purposes
      // In production, you should use your own token stored in .env file
      const token = 'pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2tocXhkamViMGpzeDJ4bWZtcnIxcDhhcCJ9.aGZ-9PZDAkbgFbDAaP3zKw';
      
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [98.95, 28.40], // Centered between the three rivers
        zoom: 8,
        maxBounds: [[98.4, 28.0], [99.5, 28.8]] // Limit panning
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add scale
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 200,
        unit: 'metric'
      }), 'bottom-left');

      map.current.on('load', () => {
        setMapLoaded(true);
        
        // Add rivers
        rivers.forEach((river, index) => {
          if (!map.current) return;

          map.current.addSource(`river-${index}`, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: { 
                name: river.name,
                description: river.description 
              },
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
              'line-width': 5,
              'line-opacity': 0.8
            }
          });
          
          // Add river labels
          map.current.addLayer({
            id: `river-label-${index}`,
            type: 'symbol',
            source: `river-${index}`,
            layout: {
              'text-field': river.name.split(' ')[0],
              'text-font': ['Open Sans Bold'],
              'text-size': 14,
              'text-offset': [0, 1],
              'text-anchor': 'top',
              'symbol-placement': 'line-center'
            },
            paint: {
              'text-color': river.color,
              'text-halo-color': '#fff',
              'text-halo-width': 2
            }
          });
        });

        // Add points of interest
        points.forEach(point => {
          if (!map.current) return;
          
          const el = document.createElement('div');
          el.className = `marker ${point.type}`;
          
          new mapboxgl.Marker(el)
            .setLngLat(point.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25, closeButton: true })
                .setHTML(`
                  <h3 class="popup-title">${point.name}</h3>
                  ${point.elevation ? `<p class="popup-elevation">Elevation: ${point.elevation}</p>` : ''}
                  ${point.description ? `<p class="popup-description">${point.description}</p>` : ''}
                `)
            )
            .addTo(map.current);
        });
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize map');
      console.error('Map initialization error:', err);
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Handle errors
  if (error) {
    return (
      <div className="map-error">
        <h3>Map Error</h3>
        <p>{error}</p>
        <p>Please check your Mapbox token and try again.</p>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div 
        ref={mapContainer} 
        className="map-display"
      />
      <div className="map-legend">
        <h3 className="legend-title">图例 Legend</h3>
        
        <div className="legend-section">
          <h4>Rivers</h4>
          <div className="legend-items">
            {rivers.map((river, index) => (
              <div key={`river-${index}`} className="legend-item">
                <div 
                  className="legend-color" 
                  style={{ backgroundColor: river.color }}
                />
                <span className="legend-label">{river.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="legend-section">
          <h4>Points of Interest</h4>
          <div className="legend-items">
            <div className="legend-item">
              <div className="legend-marker mountain"></div>
              <span className="legend-label">Mountains</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker town"></div>
              <span className="legend-label">Towns</span>
            </div>
            <div className="legend-item">
              <div className="legend-marker accommodation"></div>
              <span className="legend-label">Accommodations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreeRiversMap;
