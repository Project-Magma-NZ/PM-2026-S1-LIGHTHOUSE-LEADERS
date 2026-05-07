import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authApi from "../services/auth";
import type { Me, LoginRequest, SignupRequest } from "../services/auth";

type AuthState = {
  user: Me | null;
  loading: boolean;
  isAuthenticated: boolean;
  refresh: () => Promise<void>;
  login: (payload: LoginRequest) => Promise<Me>;
  signup: (payload: SignupRequest) => Promise<Me>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    try {
      const u = await authApi.me();
      setUser(u);
    } catch {
      setUser(null);
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  async function login(payload: LoginRequest) {
    const u = await authApi.login(payload);
    setUser(u);
    return u;
  }

  async function signup(payload: SignupRequest) {
    // Backend currently sets cookie on signup; still set user for completeness
    const u = await authApi.signup(payload);
    setUser(u);
    return u;
  }

  async function logout() {
    await authApi.logout();
    setUser(null);
  }

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      refresh,
      login,
      signup,
      logout,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}