import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem("token") || null);

  // Save in localStorage whenever user or token changes
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");

    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [user, token]);

  // Login handler
  const login = useCallback((u, t) => {
    setUser(u);
    setToken(t);
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook
export function useAuth() {
  return useContext(AuthContext);
}
