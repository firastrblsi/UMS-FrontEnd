import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
import { DEPARTMENT_ENDPOINTS } from '@/core/api/endpoints';
import type { DepartmentListResponse, DepartmentListParams, Department } from '../types/department.types';

class DepartmentApi extends BaseApi {
  constructor() {
    super(DEPARTMENT_ENDPOINTS.BASE);
  }

  getDepartments(params: DepartmentListParams): Promise<DepartmentListResponse> {
    return this.getAll<DepartmentListResponse>(params as Record<string, unknown>);
  }

  async createDepartment(data: Partial<Department>): Promise<Department> {
    const res = await axiosInstance.post<Department>(this.basePath, data);
    return res.data;
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    const res = await axiosInstance.put<Department>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  async deleteDepartment(id: string): Promise<void> {
    await axiosInstance.delete<void>(`${this.basePath}/${id}`);
  }
}

export const departmentApi = new DepartmentApi();
