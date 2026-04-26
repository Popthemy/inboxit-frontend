import apiClient from "./client";

export interface User {
  id: string;
  email: string;
  fullname: string;
  firstName: string;
  lastName: string;
  gender: "M" | "F" | "other" | "";
  avatar?: string;
  company?: string;
  phoneNumber?: string;
  plan: "free" | "pro" | "enterprise";
  bio: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessExpires: number; // timestamp in ms
}

export interface AuthResponse {
  token: {
    accessToken: string;
    refreshToken: string;
    accessExpires: string; // backend might send as seconds or string
  };
}

export interface ProfileResponse {
  data: User;
}

const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await apiClient.post("/users/login/", credentials);
    return res.data;
  },

  signup: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword :string;
  }) => {
    const res = await apiClient.post("/users/signup/", userData);
    return res.data;
  },

  verifyEmailOtp: async (data: { email: string; otp: string }) => {
    const res = await apiClient.post(`/users/signup/verify-email-otp/?email=${data.email}`, data);
    return res.data;
  },

  resendEmailOtp: async (data: { email: string }) => {
    const res = await apiClient.post("/users/signup/email-resend-otp/", data);
    return res.data;
  },

  fetchMe: async (): Promise<ProfileResponse> => {
    const res = await apiClient.get("/users/me/");
    return res.data;
  },

  refresh: async (refreshToken: string) => {
    const res = await apiClient.post("/users/refresh/", {
      refresh: refreshToken,
    });
    return res.data;
  },

  logout: async () => {
    const res = await apiClient.post("/users/signout/");
    return res.data;
  },

  requestPasswordReset: async (data: { email: string }) => {
    const res = await apiClient.post("/users/password-reset/", data);
    return res.data;
  },

  verifyPasswordReset: async (data: {
    email: string;
    otp: string;
    password?: string;
    confirmPassword:string;
  }) => {
    const res = await apiClient.post(
      `/users/password-reset/verify-password-otp/?email=${data.email}`,
      {...data , newPassword: data.password, confirmNewPassword: data.confirmPassword },
    );
    return res.data;
  },

  updateProfile: async (id: string, profileData: Partial<User>) => {
    const res = await apiClient.patch(`/users/${id}/profiles/`, profileData);
    return res.data;
  },
};

export default authService;
