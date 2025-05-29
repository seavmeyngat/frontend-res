
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://pse-restaurant-be.final25.psewmad.org/api',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;



