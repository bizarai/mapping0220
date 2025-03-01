// src/App.tsx

import React from 'react';
import ThreeRiversMap from './components/ThreeRiversMap';
import './styles/map.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>三江并流地区地图 (Three Rivers Map)</h1>
      </header>
      <main>
        <ThreeRiversMap />
      </main>
      <footer className="app-footer">
        <p>© 2025 Three Rivers Mapping Project</p>
      </footer>
    </div>
  );
}

export default App;
