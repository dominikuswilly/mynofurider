import axios from 'axios';
import { storage } from '../utils/storage';

const BASE_URL = 'https://apinofudev.bengkelfajarjaya.com/api/mynofu/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token and refresh token to headers
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await storage.getAccessToken();
    const refreshToken = await storage.getRefreshToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    if (refreshToken) {
      config.headers['X-Refresh-Token'] = refreshToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
