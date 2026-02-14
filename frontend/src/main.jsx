import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

// Configure axios base URL from environment variable
// Normalize VITE_API_URL by removing a trailing `/api` if present so
// requests like `/api/auth/login` do not become `/api/api/auth/login`.
const envUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedBase = envUrl.replace(/\/api\/?$/i, '');
axios.defaults.baseURL = normalizedBase;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

