'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { PersonPojo } from 'src/services/rest-api/app-api/types';
import { useGetProfile } from 'src/core/auth/hooks/use-profile';

interface AuthUser {
  token: string;
  profile: PersonPojo | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const { profile, isLoading: isProfileLoading } = useGetProfile();

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('mono_token');
    if (stored) setToken(stored);
    setIsHydrated(true);
  }, []);

  // Sync token to localStorage whenever it changes
  useEffect(() => {
    if (!isHydrated) return;
    if (token) {
      localStorage.setItem('mono_token', token);
    } else {
      localStorage.removeItem('mono_token');
    }
  }, [token, isHydrated]);

  const login = useCallback((newToken: string) => {
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    localStorage.removeItem('mono_token');
    localStorage.removeItem('mono_user');
  }, []);

  const isLoading = !isHydrated || isProfileLoading;

  return (
    <AuthContext.Provider
      value={{
        user: token
          ? { token, profile: profile ?? null }
          : null,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
