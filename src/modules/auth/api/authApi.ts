import { axiosInstance } from "../../../core/api/axios";
import type { LoginRequest, LoginResponse, User } from "../types/auth";

const BASE = "/auth";

export const authApi = {
  login(payload: LoginRequest): Promise<LoginResponse> {
    return axiosInstance
      .post<LoginResponse>(`${BASE}/login`, payload)
      .then((r) => r.data);
  },

  refresh(): Promise<{ accessToken: string; user: User }> {
    return axiosInstance
      .post<{ accessToken: string; user: User }>(`${BASE}/refresh`)
      .then((r) => r.data);
  },

  logout(): Promise<void> {
    return axiosInstance.post(`${BASE}/logout`);
  },

  forgotPassword(email: string): Promise<void> {
    return axiosInstance.post(`${BASE}/forgot-password`, { email });
  },

  resetPassword(token: string, newPassword: string): Promise<void> {
    return axiosInstance.post(`${BASE}/reset-password`, { token, newPassword });
  },

  activateAccount(token: string, password: string): Promise<void> {
    return axiosInstance.post(`${BASE}/activate`, { token, password });
  },
};
