/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authAPI, userAPI } from "../../utils/Api.js";
import { DEFAULT_AVATAR } from "../config.js";

const AuthContext = createContext(null);

const isUrl = (p) => typeof p === "string" && /^https?:\/\//.test(p);

// Only a real URL or data URI is a usable photo; a bare filename like
// "default.jpg" (legacy default) falls back to the app's default avatar.
const usablePhoto = (p) =>
  typeof p === "string" && (isUrl(p) || p.startsWith("data:")) ? p : DEFAULT_AVATAR;

// Full user object for React state — keeps the photo (even a large base64 data
// URI) in memory so it displays.
const normalizeUser = (u) =>
  u
    ? {
        name: u.name,
        email: u.email,
        photo: usablePhoto(u.photo),
        id: u._id || u.id,
        role: u.role,
        preferences: u.preferences,
      }
    : null;

const readCachedUser = () => {
  try {
    const raw = localStorage.getItem("user_profile");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return { ...u, photo: usablePhoto(u.photo) };
  } catch {
    return null;
  }
};

// Lightweight localStorage cache — NEVER store a large base64 data-URI photo
// (localStorage quota is small; a real JPEG overflows it and throws). The full
// photo stays in memory and is re-fetched via GET /users/me on reload.
const cacheUserLight = (u) => {
  if (!u) {
    localStorage.removeItem("user_profile");
    return;
  }
  try {
    localStorage.setItem(
      "user_profile",
      JSON.stringify({
        name: u.name,
        email: u.email,
        photo: isUrl(u.photo) ? u.photo : null,
        id: u._id || u.id,
        role: u.role,
        preferences: u.preferences,
      })
    );
  } catch {
    /* quota exceeded — ignore; the photo lives in memory / is re-fetched */
  }
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
      cacheUserLight(newUser);
      setUser(normalizeUser(newUser));
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
        cacheUserLight(u);
        setUser(normalizeUser(u));
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
