import { BaseApi } from '@/core/api/baseApi';
import type { Curriculum } from '../types/university.types';

export interface CurriculumFilterParams {
  programId?: string;
  yearNumber?: number;
  termNumber?: number;
  skip?: number;
  take?: number;
  search?: string;
  filters?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CurriculumModuleDto {
  teachingModuleId: string;
  isMandatory?: boolean;
}

export interface CreateCurriculumDto {
  programId: string;
  yearNumber: number;
  termNumber: number;
  modules?: CurriculumModuleDto[];
}

export interface UpdateCurriculumDto {
  programId?: string;
  yearNumber?: number;
  termNumber?: number;
  modules?: CurriculumModuleDto[];
}

export interface CurriculumListResponse {
  data: Curriculum[];
  total: number;
}

import { axiosInstance } from '@/core/api/axios';

class CurriculumApi extends BaseApi {
  constructor() {
    super('/curriculums');
  }

  getCurriculums(params?: CurriculumFilterParams): Promise<CurriculumListResponse> {
    return this.getAll<CurriculumListResponse>(params as Record<string, unknown>);
  }

  async getCurriculum(id: string): Promise<Curriculum> {
    const res = await axiosInstance.get(`/curriculums/${id}`);
    return res.data;
  }

  async createCurriculum(data: CreateCurriculumDto): Promise<Curriculum> {
    const res = await axiosInstance.post('/curriculums', data);
    return res.data;
  }

  async updateCurriculum(id: string, data: UpdateCurriculumDto): Promise<Curriculum> {
    const res = await axiosInstance.put(`/curriculums/${id}`, data);
    return res.data;
  }

  async deleteCurriculum(id: string): Promise<void> {
    await axiosInstance.delete(`/curriculums/${id}`);
  }
}

export const curriculumApi = new CurriculumApi();
