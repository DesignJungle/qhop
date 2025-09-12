import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QHopProvider } from './contexts/QHopContext';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <QHopProvider>
      <App />
    </QHopProvider>
  </React.StrictMode>
);