import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css'; // <-- taruh style.css milikmu di folder src/

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
