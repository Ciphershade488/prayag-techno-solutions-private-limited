import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, authStorage, AdminUser } from '@/lib/api';

export interface AuthContextType {
  user: AdminUser | null;
  isAuthed: boolean;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<{ token: string; user: AdminUser }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = authStorage.getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.getCurrentUser();
      if (res?.user) {
        setUser(res.user);
      } else {
        authStorage.clearToken();
        setUser(null);
      }
    } catch {
      authStorage.clearToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (identifier: string, password: string) => {
    const isEmail = identifier.includes('@');
    const res = await api.login({
      email: isEmail ? identifier : undefined,
      username: !isEmail ? identifier : undefined,
      password,
    });

    if (res?.token && res?.user) {
      authStorage.setToken(res.token);
      setUser(res.user);
      return { token: res.token, user: res.user };
    }

    throw new Error('Authentication response did not contain expected credentials.');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (err) {
      console.warn('Logout server notification warning:', err);
    } finally {
      authStorage.clearToken();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthed: Boolean(user),
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default AuthContext;
