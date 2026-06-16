// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  PROFILE: "/auth/profile",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
};

// User endpoints
export const USER_ENDPOINTS = {
  GET_ALL: "/users",
  GET_BY_ID: (id: string) => `/users/${id}`,
  CREATE: "/users",
  UPDATE: (id: string) => `/users/${id}`,
  DELETE: (id: string) => `/users/${id}`,
};

// Students endpoints
export const STUDENT_ENDPOINTS = {
  GET_ALL: "/students",
  GET_BY_ID: (id: string) => `/students/${id}`,
  CREATE: "/students",
  UPDATE: (id: string) => `/students/${id}`,
  DELETE: (id: string) => `/students/${id}`,
};

// Classes endpoints
export const CLASS_ENDPOINTS = {
  GET_ALL: "/classes",
  GET_BY_ID: (id: string) => `/classes/${id}`,
  CREATE: "/classes",
  UPDATE: (id: string) => `/classes/${id}`,
  DELETE: (id: string) => `/classes/${id}`,
};

// Teacher endpoints
export const TEACHER_ENDPOINTS = {
  BASE: "/teachers",
};

// Department endpoints
export const DEPARTMENT_ENDPOINTS = {
  BASE: "/departments",
  GET_ALL: "/departments",
  GET_BY_ID: (id: string) => `/departments/${id}`,
  CREATE: "/departments",
  UPDATE: (id: string) => `/departments/${id}`,
  DELETE: (id: string) => `/departments/${id}`,
};
