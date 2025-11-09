import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(undefined);

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    const bootstrap = async () => {
      try {
        const { user: currentUser } = await authService.fetchCurrentUser();
        if (!isMounted) return;
        setUser(currentUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } catch (error) {
        if (!isMounted) return;
        console.error('[AuthProvider] bootstrap failed', error);
        setToken(null);
        setUser(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const persistSession = useCallback((authPayload) => {
    setUser(authPayload.user);
    setToken(authPayload.token);
    localStorage.setItem(TOKEN_STORAGE_KEY, authPayload.token);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authPayload.user));
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  const handleLogin = useCallback(
    async (credentials) => {
      const data = await authService.login(credentials);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const handleRegister = useCallback(
    async (credentials) => {
      const data = await authService.register(credentials);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const handleLogout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: !!user && !!token,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
    }),
    [user, token, loading, handleLogin, handleRegister, handleLogout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
