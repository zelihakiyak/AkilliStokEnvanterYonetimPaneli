import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/apiClient';

export type UserType = {
  id:       number;
  fullName: string;
  email:    string;
  role:     string;
};

type AuthState = {
  user:      UserType | null;
  token:     string   | null;
  isLoading: boolean;
};

type AuthContextType = AuthState & {
  login:      (email: string, password: string) => Promise<boolean>;
  logout:     () => Promise<void>;
  updateUser: (partial: Partial<UserType>) => Promise<void>;
  isAdmin:    boolean;
};

const TOKEN_KEY = '@akillistok_token';
const USER_KEY  = '@akillistok_user';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,      setUser]      = useState<UserType | null>(null);
  const [token,     setToken]     = useState<string   | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (savedToken && savedUser) {
          const parsedUser: UserType = JSON.parse(savedUser);
          setToken(savedToken);
          setUser(parsedUser);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        }
      } catch {
        await Promise.all([
          AsyncStorage.removeItem(TOKEN_KEY),
          AsyncStorage.removeItem(USER_KEY),
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/Users/login', { email, password });
      const { token: newToken, id, fullName, role, email: userEmail } = res.data;
      const loggedUser: UserType = { id, fullName, email: userEmail, role };
      await Promise.all([
        AsyncStorage.setItem(TOKEN_KEY, newToken),
        AsyncStorage.setItem(USER_KEY,  JSON.stringify(loggedUser)),
      ]);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setToken(newToken);
      setUser(loggedUser);
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Sunucuya baglanamadi.';
      Alert.alert('Giris Hatasi', msg);
      return false;
    }
  }, []);

  const updateUser = useCallback(async (partial: Partial<UserType>) => {
    setUser(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      AsyncStorage.setItem(USER_KEY, JSON.stringify(updated)).catch(() => {});
      return updated;
    });
  }, []);

  const logout = useCallback(async () => {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(USER_KEY),
    ]);
    delete apiClient.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
