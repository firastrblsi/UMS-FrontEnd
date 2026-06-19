import { axiosInstance as apiClient } from '@/core/api/axios';

export interface Holiday {
  id: string;
  name: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHolidayPayload {
  name: string;
  date: string;
}

export interface UpdateHolidayPayload {
  name?: string;
  date?: string;
}

export const holidayApi = {
  getHolidays: async (params?: { skip?: number; take?: number; search?: string; filters?: string; sort?: string; order?: 'asc'|'desc' }) => {
    const { data } = await apiClient.get<{ data: Holiday[]; total: number }>('/holidays', { params });
    return data;
  },
  
  getHoliday: async (id: string) => {
    const { data } = await apiClient.get<Holiday>(`/holidays/${id}`);
    return data;
  },
  
  createHoliday: async (payload: CreateHolidayPayload) => {
    const { data } = await apiClient.post<Holiday>('/holidays', payload);
    return data;
  },
  
  updateHoliday: async (id: string, payload: UpdateHolidayPayload) => {
    const { data } = await apiClient.put<Holiday>(`/holidays/${id}`, payload);
    return data;
  },
  
  deleteHoliday: async (id: string) => {
    await apiClient.delete(`/holidays/${id}`);
  }
};
