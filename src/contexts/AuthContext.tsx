import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  company?: string;
  plan: "free" | "pro" | "enterprise";
  createdAt: string;
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp in ms
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USER: User = {
  id: "usr_m0ck_1a2b3c4d",
  email: "john@example.com",
  name: "John Doe",
  company: "Acme Inc.",
  plan: "pro",
  createdAt: "2026-01-15T10:00:00Z",
};

// Mock JWT generation (simulates 30min expiry)
function generateMockTokens(): AuthTokens {
  const now = Date.now();
  return {
    accessToken: `eyJ_mock_access_${now}`,
    refreshToken: `eyJ_mock_refresh_${now}`,
    expiresAt: now + 30 * 60 * 1000, // 30 minutes
  };
}

function setCookie(name: string, value: string, minutes: number) {
  const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Strict`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = getCookie("inboxit_refresh");
    if (!refreshToken) {
      setUser(null);
      setTokens(null);
      return;
    }
    // Simulate API call to refresh
    await new Promise((r) => setTimeout(r, 300));
    const newTokens = generateMockTokens();
    setTokens(newTokens);
    setCookie("inboxit_access", newTokens.accessToken, 30);
    setCookie("inboxit_refresh", newTokens.refreshToken, 7 * 24 * 60);
    setCookie("inboxit_expires", String(newTokens.expiresAt), 30);
  }, []);

  // Initialize from cookies
  useEffect(() => {
    const accessToken = getCookie("inboxit_access");
    const refreshToken = getCookie("inboxit_refresh");
    const expiresAt = getCookie("inboxit_expires");

    if (accessToken && refreshToken && expiresAt) {
      const exp = Number(expiresAt);
      if (Date.now() < exp) {
        setTokens({ accessToken, refreshToken, expiresAt: exp });
        setUser(MOCK_USER);
      } else {
        // Token expired — try refresh
        refreshAccessToken().then(() => setUser(MOCK_USER));
      }
    }
    setIsLoading(false);
  }, [refreshAccessToken]);

  // Auto-refresh before expiry
  useEffect(() => {
    if (!tokens) return;
    const timeUntilExpiry = tokens.expiresAt - Date.now() - 60000; // refresh 1min before
    if (timeUntilExpiry <= 0) {
      refreshAccessToken();
      return;
    }
    const timer = setTimeout(refreshAccessToken, timeUntilExpiry);
    return () => clearTimeout(timer);
  }, [tokens, refreshAccessToken]);

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newTokens = generateMockTokens();
    setTokens(newTokens);
    setUser({ ...MOCK_USER, email });
    setCookie("inboxit_access", newTokens.accessToken, 30);
    setCookie("inboxit_refresh", newTokens.refreshToken, 7 * 24 * 60);
    setCookie("inboxit_expires", String(newTokens.expiresAt), 30);
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, _password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const newTokens = generateMockTokens();
    setTokens(newTokens);
    setUser({ ...MOCK_USER, name, email, createdAt: new Date().toISOString() });
    setCookie("inboxit_access", newTokens.accessToken, 30);
    setCookie("inboxit_refresh", newTokens.refreshToken, 7 * 24 * 60);
    setCookie("inboxit_expires", String(newTokens.expiresAt), 30);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setTokens(null);
    deleteCookie("inboxit_access");
    deleteCookie("inboxit_refresh");
    deleteCookie("inboxit_expires");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
