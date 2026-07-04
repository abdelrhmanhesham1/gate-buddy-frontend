/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authAPI, userAPI } from "../../utils/Api.js";
import { DEFAULT_AVATAR } from "../config.js";

const AuthContext = createContext(null);

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem("user_profile");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const cacheUser = (u) => {
  if (!u) {
    localStorage.removeItem("user_profile");
    return;
  }
  localStorage.setItem(
    "user_profile",
    JSON.stringify({
      name: u.name,
      email: u.email,
      photo: u.photo || DEFAULT_AVATAR,
      id: u._id || u.id,
      role: u.role,
      preferences: u.preferences,
    })
  );
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readCachedUser());
  const [token, setToken] = useState(localStorage.getItem("auth_token"));
  const [loading, setLoading] = useState(!!localStorage.getItem("auth_token"));

  const setSession = useCallback((newToken, newUser) => {
    if (newToken) {
      localStorage.setItem("auth_token", newToken);
      setToken(newToken);
    }
    if (newUser) {
      cacheUser(newUser);
      setUser(readCachedUser());
    }
  }, []);

  const clearSession = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_profile");
    setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await userAPI.getMe();
      const u = res.data?.data?.user;
      if (u) {
        cacheUser(u);
        setUser(readCachedUser());
        return u;
      }
    } catch {
      /* handled by interceptor / session-expired */
    }
    return null;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch {
      /* even if the server call fails, clear locally */
    }
    clearSession();
  }, [clearSession]);

  // Hydrate the user from the server once on mount if a token exists.
  useEffect(() => {
    if (!localStorage.getItem("auth_token")) {
      setLoading(false);
      return;
    }
    let alive = true;
    (async () => {
      await refreshUser();
      if (alive) setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [refreshUser]);

  // React to a dead session raised by the axios interceptor.
  useEffect(() => {
    const onExpired = () => clearSession();
    window.addEventListener("gb:session-expired", onExpired);
    return () => window.removeEventListener("gb:session-expired", onExpired);
  }, [clearSession]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        setSession,
        clearSession,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
