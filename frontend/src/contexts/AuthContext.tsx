// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  signIn: (user: User, token: string) => void;
  signOut: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("@App:user");
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("@App:token");
  });

  const signIn = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem("@App:token", token);
    localStorage.setItem("@App:user", JSON.stringify(user));
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("@App:token");
    localStorage.removeItem("@App:user");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, signIn, signOut, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
