import axios from 'axios';
import { storage } from '../utils/storage';
import { generateUUID } from '../utils/uuid';

const BASE_URL = 'https://apinofudev.bengkelfajarjaya.com/api/mynofu/';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token, refresh token, and request ID to headers
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await storage.getAccessToken();
    const refreshToken = await storage.getRefreshToken();

    // Add unique Request ID for tracing
    config.headers['X-Request-ID'] = generateUUID();

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
