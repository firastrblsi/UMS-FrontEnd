import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
import type { Program } from '../types/university.types';

export interface ProgramListResponse {
  data: Program[];
  total: number;
}

export interface ProgramFilterParams {
  departmentId?: string;
  degreeType?: 'BACHELOR' | 'MASTER' | 'DIPLOMA' | 'CERTIFICATE' | '';
  isActive?: boolean | '';
  search?: string;
  skip?: number;
  take?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  filters?: string;
}

class ProgramApi extends BaseApi {
  constructor() {
    super('/programs');
  }

  getPrograms(params: ProgramFilterParams): Promise<ProgramListResponse> {
    return this.getAll<ProgramListResponse>(params as Record<string, unknown>);
  }

  async createProgram(data: Partial<Program>): Promise<Program> {
    const res = await axiosInstance.post<Program>(this.basePath, data);
    return res.data;
  }

  async updateProgram(id: string, data: Partial<Program>): Promise<Program> {
    const res = await axiosInstance.put<Program>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  async deleteProgram(id: string): Promise<void> {
    await axiosInstance.delete<void>(`${this.basePath}/${id}`);
  }
}

export const programApi = new ProgramApi();
