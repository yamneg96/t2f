import { create } from "zustand";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
  plan: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem("t2f_token"),
  user: (() => {
    try {
      const u = localStorage.getItem("t2f_user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  })(),
  isAuthenticated: !!localStorage.getItem("t2f_token"),
  setAuth: (token, user) => {
    localStorage.setItem("t2f_token", token);
    localStorage.setItem("t2f_user", JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem("t2f_token");
    localStorage.removeItem("t2f_user");
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
