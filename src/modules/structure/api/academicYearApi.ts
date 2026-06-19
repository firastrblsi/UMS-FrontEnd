import { axiosInstance as apiClient } from '@/core/api/axios';

export interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAcademicYearPayload {
  name: string;
  isCurrent?: boolean;
  startDate: string;
  endDate: string;
}

export interface UpdateAcademicYearPayload {
  name?: string;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
}

export const academicYearApi = {
  getAcademicYears: async (params?: { skip?: number; take?: number; search?: string; filters?: string; sort?: string; order?: 'asc' | 'desc' }) => {
    const { data } = await apiClient.get<{ data: AcademicYear[]; total: number }>('/academic-years', { params });
    return data;
  },
  
  getAcademicYear: async (id: string) => {
    const { data } = await apiClient.get<AcademicYear>(`/academic-years/${id}`);
    return data;
  },
  
  createAcademicYear: async (payload: CreateAcademicYearPayload) => {
    const { data } = await apiClient.post<AcademicYear>('/academic-years', payload);
    return data;
  },
  
  updateAcademicYear: async (id: string, payload: UpdateAcademicYearPayload) => {
    const { data } = await apiClient.put<AcademicYear>(`/academic-years/${id}`, payload);
    return data;
  },
  
  deleteAcademicYear: async (id: string) => {
    await apiClient.delete(`/academic-years/${id}`);
  }
};
