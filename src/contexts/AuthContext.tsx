import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import authService, {type User, type AuthTokens } from "@/services/authService";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName:string, email: string, password: string,confirmPassword:string) => Promise<void>;
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
  resendEmailOtp: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  verifyPasswordReset: (email: string, otp: string, password: string,confirmPassword: string ) => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

function setCookie(name: string, value: string, expires: number) {
  const expiresDate = new Date(expires).toUTCString();
  document.cookie = `${name}=${value}; expires=${expiresDate}; path=/; SameSite=Strict`;
}

export function getCookie(name: string): string | null {
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
  const navigate = useNavigate();

  const saveCookies = useCallback((token: any) => {
    const newTokens: AuthTokens = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      accessExpires: Date.now() + Number(token.accessExpires || 3600) * 1000,
    };

    setTokens(newTokens);
    setCookie("inboxit_access", newTokens.accessToken, newTokens.accessExpires);
    setCookie(
      "inboxit_refresh",
      newTokens.refreshToken,
      Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days for refresh token
    );
    setCookie("inboxit_expires", String(newTokens.accessExpires), newTokens.accessExpires);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await authService.fetchMe();
      if (!res || !res.data) {
        throw new Error("Invalid profile response");
      }
      const data = res.data;

      setUser({
        ...data,
        createdAt: new Date(data.createdAt).toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
      });
    } catch (err: any) {
      console.error("Profile fetch error:", err.response || err);
      // If profile fetch fails, we might have an invalid token
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setTokens(null);
      deleteCookie("inboxit_access");
      deleteCookie("inboxit_refresh");
      deleteCookie("inboxit_expires");
      navigate("/login");
    }
  }, [navigate]);

  const refreshAccessToken = useCallback(async () => {
    const refreshToken = getCookie("inboxit_refresh");
    if (!refreshToken) {
      logout();
      return;
    }
    try {
      const res = await authService.refresh(refreshToken);
      const { token } = res;
      saveCookies(token);
    } catch (err) {
      console.error("Token refresh error:", err);
      logout();
    }
  }, [logout, saveCookies]);

  // Initialize from cookies
  useEffect(() => {
    const initAuth = async () => {
      try {
        const accessToken = getCookie("inboxit_access");
        const refreshToken = getCookie("inboxit_refresh");
        const accessExpires = getCookie("inboxit_expires");

        if (accessToken && refreshToken && accessExpires) {
          const exp = Number(accessExpires);
          if (Date.now() < exp) {
            setTokens({ accessToken, refreshToken, accessExpires: exp });
            await fetchProfile();
          } else {
            await refreshAccessToken();
          }
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, [refreshAccessToken, fetchProfile]);

  // Auto-refresh before expiry
  useEffect(() => {
    if (!tokens) return;
    const timeUntilExpiry = tokens.accessExpires - Date.now() - 60000; // refresh 1min before
    if (timeUntilExpiry <= 0) {
      refreshAccessToken();
      return;
    }
    const timer = setTimeout(refreshAccessToken, timeUntilExpiry);
    return () => clearTimeout(timer);
  }, [tokens, refreshAccessToken]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await authService.login({ email, password });
      const { token } = res;
      saveCookies(token);
      await fetchProfile();
    } catch (err: any) {
      const responseData = err.response?.data || {};
      const specificError =
        responseData?.data?.non_field_errors?.[0] ||
        responseData?.detail ||
        "Authentication Failed";
      throw new Error(specificError);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (firstName: string, lastName: string ,email: string, password: string, confirmPassword:string) => {
    setIsLoading(true);
    console.log(`signup ${firstName}, ${password}`)
    try {
      await authService.signup({ firstName, lastName, email, password, confirmPassword });
      console.log(`signup after${firstName}, ${password}`)
      // Signup usually requires OTP verification next
    } catch (error: any) {
      const serverMessage =
        error.response?.data?.message ||
        error.message ||
        "Account creation failed.";

      // 2. IMPORTANT: You must throw a NEW error with just the string
      // This allows your component to use 'err.message'
      throw new Error(serverMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    setIsLoading(true);
    try {
      const res = await authService.verifyEmailOtp({ email, otp });
      const { token } = res;
      if (token) {
        saveCookies(token);
        await fetchProfile();
      }
    } catch (err: any) {
      
      const responseData =
      err.response?.data?.message || err.response?.data || "Verification Failed";
      console.log("auth context verfiy",JSON.stringify(responseData));
      throw new Error(responseData);
    } finally {
      setIsLoading(false);
    }
  };

  const resendEmailOtp = async (email: string) => {
    try {
      await authService.resendEmailOtp({ email });
    } catch (err: any) {
      const responseData =
      err.response?.data?.message || err.response?.data || {};
      
      console.log(`debug resend emailOTP ${JSON.stringify(responseData)}`)
      throw new Error(responseData?.detail || "Failed to resend OTP");
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await authService.requestPasswordReset({ email });
    } catch (err: any) {
      const responseData = err.response?.data || {};
      throw new Error(responseData?.detail || "Password reset request failed");
    }
  };

  const verifyPasswordReset = async (email: string, otp: string, password: string, confirmPassword) => {
    try {
      await authService.verifyPasswordReset({ email, otp, password, confirmPassword });
    } catch (err: any) {
      const responseData =
        err.response?.data?.message ||
        err.response?.data|| "Password reset verification failed"
      console.log("auth context password reset", JSON.stringify(responseData));
      throw new Error(responseData );
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    if (!user) return;
    try {
      await authService.updateProfile(user.id, profileData);
      await fetchProfile();
    } catch (err: any) {
      const responseData = err.response?.data || {};
      throw new Error(responseData?.detail || "Failed to update profile");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        tokens,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        verifyEmailOtp,
        resendEmailOtp,
        logout,
        refreshAccessToken,
        requestPasswordReset,
        verifyPasswordReset,
        updateProfile,
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
