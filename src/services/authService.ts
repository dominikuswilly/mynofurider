import apiClient from '../api/client';
import { ApiResponse, User } from '../types';

export const authService = {
  login: async (username: string, password: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/auth/login', {
      username,
      password,
    });
    return response.data;
  },
  
  logout: async () => {
    // Logic for logout
  },
};
