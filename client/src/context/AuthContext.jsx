import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    try {
      return JSON.parse(atob(t.split(".")[1]));
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      try {
        setUser(JSON.parse(atob(token.split(".")[1])));
      } catch (e) {
        setUser(null);
      }
      localStorage.setItem("token", token);
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const login = (t) => setToken(t);
  const logout = () => setToken(null);

  const api = axios.create({ baseURL: "http://localhost:4000/api" });
  api.interceptors.request.use((cfg) => {
    const t = token || localStorage.getItem("token");
    if (t) cfg.headers.Authorization = `Bearer ${t}`;
    return cfg;
  });

  return (
    <AuthContext.Provider value={{ token, user, login, logout, api }}>
      {children}
    </AuthContext.Provider>
  );
}
