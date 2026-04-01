import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:5079/api' : 'https://travelapp-server-tkn3.onrender.com/api'),
});

// Add JWT token to headers if logged in
api.interceptors.request.use((config) => {
 const token = localStorage.getItem('token'); // ✅ correct;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;