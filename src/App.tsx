// src/App.tsx

import React from 'react';
import ThreeRiversMap from './components/ThreeRiversMap';
import './styles/map.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">三江并流地区地图</h1>
        <ThreeRiversMap />
      </div>
    </div>
  );
}

export default App;