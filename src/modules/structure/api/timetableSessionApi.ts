import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
import type { TimetableSession } from '../types/university.types';

export interface TimetableSessionListParams {
  skip?: number;
  take?: number;
  search?: string;
  filters?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface TimetableSessionListResponse {
  data: TimetableSession[];
  total: number;
}

export interface GenerateTimetableDto {
  courseSectionId: string;
  roomId: string;
  startDate: string;
  endDate: string;
  daysOfWeek: number[];
  startTime: string;
  endTime: string;
  type: 'LECTURE' | 'TUTORIAL' | 'PRACTICAL' | 'EXAM' | 'SEMINAR';
}

class TimetableSessionApi extends BaseApi {
  constructor() {
    super('/timetable-sessions');
  }

  async getTimetableSessions(params: TimetableSessionListParams): Promise<TimetableSessionListResponse> {
    const queryParams: any = { skip: params.skip, take: params.take };
    if (params.filters) {
      try {
        const parsedFilters = JSON.parse(params.filters);
        parsedFilters.forEach((f: any) => {
          queryParams[f.id] = f.value;
        });
      } catch (e) {}
    }
    const res = await axiosInstance.get(this.basePath, { params: queryParams });
    
    // The backend GetTimetableSessionsHandler returns a raw array of TimetableSession
    if (Array.isArray(res.data)) {
      return { data: res.data, total: res.data.length };
    }
    
    // Fallback if backend gets updated to return paginated format
    return res.data;
  }

  async generateTimetableSessions(data: GenerateTimetableDto): Promise<{ generated: number }> {
    const res = await axiosInstance.post<{ generated: number }>(this.basePath, data);
    return res.data;
  }

  async updateTimetableSession(id: string, data: Partial<TimetableSession>): Promise<TimetableSession> {
    const res = await axiosInstance.put<TimetableSession>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  async deleteTimetableSession(id: string): Promise<void> {
    await axiosInstance.delete<void>(`${this.basePath}/${id}`);
  }
}

export const timetableSessionApi = new TimetableSessionApi();
