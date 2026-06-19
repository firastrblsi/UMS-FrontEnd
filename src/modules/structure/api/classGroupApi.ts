import { axiosInstance as apiClient } from '@/core/api/axios';
import type { Program } from '../types/university.types';
import type { AcademicYear } from './academicYearApi';

export interface ClassGroup {
  id: string;
  name: string;
  capacity: number;
  programId: string;
  academicYearId: string;
  program?: Program;
  academicYear?: AcademicYear;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassGroupPayload {
  name: string;
  capacity: number;
  programId: string;
  academicYearId: string;
}

export interface UpdateClassGroupPayload {
  name?: string;
  capacity?: number;
  programId?: string;
  academicYearId?: string;
}

export const classGroupApi = {
  getClassGroups: async (params?: { skip?: number; take?: number; programId?: string; search?: string; filters?: string; sort?: string; order?: 'asc'|'desc' }) => {
    const { data } = await apiClient.get<{ data: ClassGroup[]; total: number }>('/class-groups', { params });
    return data;
  },
  
  getClassGroup: async (id: string) => {
    const { data } = await apiClient.get<ClassGroup>(`/class-groups/${id}`);
    return data;
  },
  
  createClassGroup: async (payload: CreateClassGroupPayload) => {
    const { data } = await apiClient.post<ClassGroup>('/class-groups', payload);
    return data;
  },
  
  updateClassGroup: async (id: string, payload: UpdateClassGroupPayload) => {
    const { data } = await apiClient.put<ClassGroup>(`/class-groups/${id}`, payload);
    return data;
  },
  
  deleteClassGroup: async (id: string) => {
    await apiClient.delete(`/class-groups/${id}`);
  }
};
