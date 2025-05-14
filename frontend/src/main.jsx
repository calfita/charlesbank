import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { AuthProvider } from './context/AuthContext'; // ✅ importar

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> {/* ✅ envolver todo */}
      <App />
    </AuthProvider>
  </StrictMode>
);
