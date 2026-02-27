import axios from 'axios';

const api = axios.create({
  baseURL: 'https://travelapp-server-tkn3.onrender.com/api', // Change to your backend URL (e.g., production URL)
});

// Add JWT token to headers if logged in
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;