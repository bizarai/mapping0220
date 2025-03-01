// src/index.tsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/main.css'; // This now imports map.css
import App from './App';

// This ensures we get the correct root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  // Create root element if it doesn't exist (shouldn't happen, but just in case)
  const newRoot = document.createElement('div');
  newRoot.id = 'root';
  document.body.appendChild(newRoot);
  console.warn('Root element was not found, created a new one.');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
