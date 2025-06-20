// api.ts
import axios from 'axios';
import { getAccessToken } from './Auth/tokenService';


const api = axios.create({
  baseURL: process.env.BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
