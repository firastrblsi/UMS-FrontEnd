import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
import type { Course } from '../types/university.types';

export interface CourseListParams {
  skip?: number;
  take?: number;
  search?: string;
  filters?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CourseListResponse {
  data: Course[];
  total: number;
}

class CourseApi extends BaseApi {
  constructor() {
    super('/courses');
  }

  getCourses(params: CourseListParams): Promise<CourseListResponse> {
    return this.getAll<CourseListResponse>(params as Record<string, unknown>);
  }

  async createCourse(data: Partial<Course>): Promise<Course> {
    const res = await axiosInstance.post<Course>(this.basePath, data);
    return res.data;
  }

  async updateCourse(id: string, data: Partial<Course>): Promise<Course> {
    const res = await axiosInstance.put<Course>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  async deleteCourse(id: string): Promise<void> {
    await axiosInstance.delete<void>(`${this.basePath}/${id}`);
  }
}

export const courseApi = new CourseApi();
