export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  refresh_expires_in: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'rider';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}
