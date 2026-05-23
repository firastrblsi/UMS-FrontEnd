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
};
