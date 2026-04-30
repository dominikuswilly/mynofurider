export interface User {
  id: string;
  username: string;
  email: string;
  role: 'rider';
  token?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: 'success' | 'error';
}
