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

// Request interceptor to add the access token and request ID to headers
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = await storage.getAccessToken();

    // Add unique Request ID for tracing if not already present
    if (!config.headers['x-request-id']) {
      config.headers['x-request-id'] = generateUUID();
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and automatic refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 error and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getRefreshToken();
        const accessToken = await storage.getAccessToken();

        if (refreshToken) {
          // Attempt to refresh the token using introspection
          const response = await axios.get(`${BASE_URL}private/introspect`, {
            headers: {
              'X-Refresh-Token': refreshToken,
              'Authorization': `Bearer ${accessToken}`,
              'x-request-id': generateUUID(),
            },
          });

          if (response.data && response.data.access_token) {
            const { access_token, refresh_token } = response.data;
            await storage.saveTokens(access_token, refresh_token || refreshToken);

            // Update original request header and retry
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Auto-refresh failed:', refreshError);
        // Optional: clear tokens or navigate to login if refresh fails
        // await storage.clearTokens();
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
