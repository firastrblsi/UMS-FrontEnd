import { axiosInstance } from "./axios";
import type { AxiosRequestConfig } from "axios";

export class BaseApi {
  constructor(private readonly basePath: string) {}

  async getAll<T>(
    params?: Record<string, unknown>,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await axiosInstance.get<T>(this.basePath, {
      params,
      ...config,
    });
    return data;
  }

  async getOne<T>(id: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.get<T>(
      `${this.basePath}/${id}`,
      config,
    );
    return data;
  }

  async create<T>(body: unknown, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.post<T>(this.basePath, body, config);
    return data;
  }

  async update<T>(
    id: string,
    body: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await axiosInstance.patch<T>(
      `${this.basePath}/${id}`,
      body,
      config,
    );
    return data;
  }

  async remove<T>(id: string, config?: AxiosRequestConfig): Promise<T> {
    const { data } = await axiosInstance.delete<T>(
      `${this.basePath}/${id}`,
      config,
    );
    return data;
  }

  async custom<T>(
    method: "get" | "post" | "patch" | "put" | "delete",
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const { data } = await axiosInstance[method]<T>(path, body, config);
    return data;
  }
}
