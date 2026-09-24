"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from "./auth-storage";
import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
  refreshToken as refreshTokenRequest,
} from "./auth.service";
import type {
  AuthUser,
  LoginInput,
  LoginResponse,
} from "./auth.types";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCurrentUser = async () => {
    const accessToken = getAccessToken();

    if (!accessToken) {
      setUser(null);
      return;
    }

    try {
      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    async function initializeAuth() {
      try {
        await loadCurrentUser();
      } finally {
        setIsLoading(false);
      }
    }

    void initializeAuth();
  }, []);

  const login = async (input: LoginInput) => {
    const response: LoginResponse =
      await loginRequest(input);

    setAuthTokens(
      response.accessToken,
      response.refreshToken,
    );

    const currentUser = await getCurrentUser();

    setUser(currentUser);
  };

  const refreshSession = async () => {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearAuthTokens();
      setUser(null);
      return;
    }

    try {
      const response = await refreshTokenRequest({
        refreshToken,
      });

      setAuthTokens(
        response.accessToken,
        response.refreshToken,
      );

      const currentUser = await getCurrentUser();

      setUser(currentUser);
    } catch {
      clearAuthTokens();
      setUser(null);
    }
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();

    try {
      if (refreshToken) {
        await logoutRequest(refreshToken);
      }
    } finally {
      clearAuthTokens();
      setUser(null);
    }
  };

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider.",
    );
  }

  return context;
}