"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { apiClient } from "@/services/api-client";
import {
  getAccessToken,
  getRefreshToken,
} from "@/features/auth/auth-storage";

import type {
  UserRole,
  UserStatus,
} from "@/constants/roles";

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;

  setUser: (user: AuthUser | null) => void;

  refreshUser: () => Promise<AuthUser | null>;

  logout: () => Promise<void>;
}

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  );

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    useCallback(async (): Promise<AuthUser | null> => {
      try {
        const response =
          await apiClient.get<{
            success: boolean;
            message: string;
            data: AuthUser;
          }>("/auth/me");

        const currentUser =
          response.data.data;

        setUser(currentUser);

        return currentUser;
      } catch {
        setUser(null);

        return null;
      }
    }, []);

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error(
        "UniCore logout error:",
        error,
      );
    } finally {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    const initializeAuth =
      async () => {
        try {
          const accessToken =
            getAccessToken();

          const refreshToken =
            getRefreshToken();

          if (
            !accessToken &&
            !refreshToken
          ) {
            if (mounted) {
              setUser(null);
              setLoading(false);
            }

            return;
          }

          await refreshUser();
        } finally {
          if (mounted) {
            setLoading(false);
          }
        }
      };

    void initializeAuth();

    return () => {
      mounted = false;
    };
  }, [refreshUser]);

  const value =
    useMemo<AuthContextValue>(
      () => ({
        user,
        loading,
        isAuthenticated:
          Boolean(user),
        setUser,
        refreshUser,
        logout,
      }),
      [
        user,
        loading,
        refreshUser,
        logout,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider.",
    );
  }

  return context;
}