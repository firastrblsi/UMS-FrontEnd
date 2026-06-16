import { BaseApi } from '@/core/api/baseApi';
import type { Program } from '../types/university.types';

export interface ProgramListResponse {
  data: Program[];
  total: number;
}

export interface ProgramFilterParams {
  departmentId?: string;
  degreeType?: 'BACHELOR' | 'MASTER' | 'PHD' | '';
  isActive?: boolean | '';
  search?: string;
  skip?: number;
  take?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

class ProgramApi extends BaseApi {
  constructor() {
    super('/programs');
  }

  getPrograms(params: ProgramFilterParams): Promise<ProgramListResponse> {
    return this.getAll<ProgramListResponse>(params as Record<string, unknown>);
  }
}

export const programApi = new ProgramApi();
