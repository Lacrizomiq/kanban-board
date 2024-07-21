"use client";

import { useState, useEffect, createContext, useContext } from "react";
import api from "@/lib/api";
import { User } from "@/schemas";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };
interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/users/me")
        .then((response) => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem("token");
          delete api.defaults.headers.common["Authorization"];
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<{ token: string; user: User }>(
      "/users/login",
      { email, password }
    );
    localStorage.setItem("token", response.data.token);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    setUser(response.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const signup = async (email: string, password: string, name: string) => {
    const response = await api.post<{ token: string; user: User }>(
      "/users/register",
      {
        email,
        password,
        name,
      }
    );
    localStorage.setItem("token", response.data.token);
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.token}`;
    setUser(response.data.user);
  };

  const value = { user, login, logout, signup };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
