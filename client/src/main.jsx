import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './app/App.jsx';
import './index.css';

// Auto-recover from stale chunks when a new deployment occurs
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();
  const lastReload = sessionStorage.getItem('chunk_reload_ts');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 4000) {
    sessionStorage.setItem('chunk_reload_ts', String(now));
    window.location.reload();
  }
});

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);