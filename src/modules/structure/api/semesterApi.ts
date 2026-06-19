import { axiosInstance as apiClient } from '@/core/api/axios';
import type { AcademicYear } from './academicYearApi';

export interface Semester {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  examStartDate: string;
  academicYearId: string;
  academicYear?: AcademicYear;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSemesterPayload {
  name: string;
  startDate: string;
  endDate: string;
  registrationDeadline: string;
  examStartDate: string;
  academicYearId: string;
}

export interface UpdateSemesterPayload {
  name?: string;
  startDate?: string;
  endDate?: string;
  registrationDeadline?: string;
  examStartDate?: string;
  academicYearId?: string;
}

export const semesterApi = {
  getSemesters: async (params?: { skip?: number; take?: number; search?: string; filters?: string; sort?: string; order?: 'asc'|'desc' }) => {
    const { data } = await apiClient.get<{ data: Semester[]; total: number }>('/semesters', { params });
    return data;
  },
  
  getSemester: async (id: string) => {
    const { data } = await apiClient.get<Semester>(`/semesters/${id}`);
    return data;
  },
  
  createSemester: async (payload: CreateSemesterPayload) => {
    const { data } = await apiClient.post<Semester>('/semesters', payload);
    return data;
  },
  
  updateSemester: async (id: string, payload: UpdateSemesterPayload) => {
    const { data } = await apiClient.put<Semester>(`/semesters/${id}`, payload);
    return data;
  },
  
  deleteSemester: async (id: string) => {
    await apiClient.delete(`/semesters/${id}`);
  }
};
