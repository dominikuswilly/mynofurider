import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { storage } from '../utils/storage';
import apiClient from '../api/client';

interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const accessToken = await storage.getAccessToken();
      const refreshToken = await storage.getRefreshToken();

      if (accessToken || refreshToken) {
        try {
          // Introspect token
          const response = await apiClient.get('public/introspect', {
            headers: refreshToken ? { 'X-Refresh-Token': refreshToken } : {}
          });
          
          if (response.data) {
            if (response.data.access_token) {
              await storage.saveTokens(response.data.access_token, response.data.refresh_token || refreshToken || '');
            }
            setIsLoggedIn(true);
          }
        } catch (e) {
          if (refreshToken) {
            setIsLoggedIn(true);
          } else {
            setIsLoggedIn(false);
          }
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (accessToken: string, refreshToken: string) => {
    await storage.saveTokens(accessToken, refreshToken);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await storage.clearTokens();
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
