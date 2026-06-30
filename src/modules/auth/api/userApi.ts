import { axiosInstance } from "@/core/api/axios";
import type { User } from "../types/auth";

export interface UpdateMePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  nationality?: string;
}

export const userApi = {
  getMe(): Promise<User> {
    return axiosInstance.get<User>("/users/me").then((r) => r.data);
  },

  updateMe(data: UpdateMePayload): Promise<User> {
    return axiosInstance.patch<User>("/users/me", data).then((r) => r.data);
  },

  uploadProfilePicture(userId: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    return axiosInstance.post(`/users/${userId}/profile-picture`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  changePassword(data: { currentPassword: string; newPassword: string }): Promise<{ message: string }> {
    return axiosInstance.post("/auth/change-password", data).then((r) => r.data);
  },
};
