import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { LeagueProvider } from './context/LeagueContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LeagueProvider>
      <App />
    </LeagueProvider>
  </StrictMode>
);
