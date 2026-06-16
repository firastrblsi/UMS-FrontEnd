export type Role = "ADMIN" | "TEACHER" | "STUDENT";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  nationality: string | null;
  isActive: boolean;
  profilePictureId: string | null;
  profilePicture?: {
    id: string;
    url: string;
    publicId: string;
  } | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}
