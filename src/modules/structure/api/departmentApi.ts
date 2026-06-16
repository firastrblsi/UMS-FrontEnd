import { BaseApi } from '@/core/api/baseApi';
import { DEPARTMENT_ENDPOINTS } from '@/core/api/endpoints';
import type { DepartmentListResponse, DepartmentListParams } from '../types/department.types';

class DepartmentApi extends BaseApi {
  constructor() {
    super(DEPARTMENT_ENDPOINTS.BASE);
  }

  getDepartments(params: DepartmentListParams): Promise<DepartmentListResponse> {
    return this.getAll<DepartmentListResponse>(params as Record<string, unknown>);
  }
}

export const departmentApi = new DepartmentApi();
