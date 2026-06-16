import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../utils/token";
import i18n from "@/i18n";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || "10000", 10);

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    const language = i18n.language?.split("-")[0] ?? "en";
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["Accept-Language"] = language;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

type QueueEntry = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};
let queue: QueueEntry[] = [];

function flushQueue(error: unknown, token: string | null): void {
  queue.forEach((entry) =>
    error ? entry.reject(error) : entry.resolve(token!),
  );
  queue = [];
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const is401 = error.response?.status === 401;
    const isRetried = original._retry;
    const isRefreshCall = original.url?.includes("/auth/refresh");

    if (!is401 || isRetried || isRefreshCall) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        queue.push({ resolve, reject });
      }).then((token) => {
        original.headers!.Authorization = `Bearer ${token}`;
        return axiosInstance(original);
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { data } = await axiosInstance.post<{ accessToken: string }>(
        "/auth/refresh",
      );

      setAccessToken(data.accessToken);
      flushQueue(null, data.accessToken);

      original.headers!.Authorization = `Bearer ${data.accessToken}`;
      return axiosInstance(original);
    } catch (refreshError) {
      flushQueue(refreshError, null);
      clearAccessToken();
      localStorage.removeItem("ums_user");
      window.location.href = "/auth/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosInstance;
