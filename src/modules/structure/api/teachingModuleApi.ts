import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
import type { TeachingModule } from '../types/university.types';

export interface TeachingModuleListParams {
  skip?: number;
  take?: number;
  search?: string;
  filters?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface TeachingModuleListResponse {
  data: TeachingModule[];
  total: number;
}

class TeachingModuleApi extends BaseApi {
  constructor() {
    super('/teaching-modules');
  }

  getTeachingModules(params: TeachingModuleListParams): Promise<TeachingModuleListResponse> {
    return this.getAll<TeachingModuleListResponse>(params as Record<string, unknown>);
  }

  async createTeachingModule(data: Partial<TeachingModule>): Promise<TeachingModule> {
    const res = await axiosInstance.post<TeachingModule>(this.basePath, data);
    return res.data;
  }

  async updateTeachingModule(id: string, data: Partial<TeachingModule>): Promise<TeachingModule> {
    const res = await axiosInstance.put<TeachingModule>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  async deleteTeachingModule(id: string): Promise<void> {
    await axiosInstance.delete<void>(`${this.basePath}/${id}`);
  }
}

export const teachingModuleApi = new TeachingModuleApi();
