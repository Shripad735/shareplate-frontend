import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:9000/',
  baseURL: 'https://shareplate-backend-brv517daq-shripad-khandares-projects.vercel.app',
  withCredentials: true, // Include cookies
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;