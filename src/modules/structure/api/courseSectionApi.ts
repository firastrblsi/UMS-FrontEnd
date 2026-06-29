import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
import type { CourseSection } from '../types/university.types';

export interface CourseSectionListParams {
  skip?: number;
  take?: number;
  search?: string;
  filters?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface CourseSectionListResponse {
  data: CourseSection[];
  total: number;
}

class CourseSectionApi extends BaseApi {
  constructor() {
    super('/course-sections');
  }

  getCourseSections(params: CourseSectionListParams): Promise<CourseSectionListResponse> {
    return this.getAll<CourseSectionListResponse>(params as Record<string, unknown>);
  }

  async createCourseSection(data: Partial<CourseSection>): Promise<CourseSection> {
    const res = await axiosInstance.post<CourseSection>(this.basePath, data);
    return res.data;
  }

  async updateCourseSection(id: string, data: Partial<CourseSection>): Promise<CourseSection> {
    const res = await axiosInstance.put<CourseSection>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  async deleteCourseSection(id: string): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }

  async getCourseSectionById(id: string): Promise<CourseSection> {
    const res = await axiosInstance.get<CourseSection>(`${this.basePath}/${id}`);
    return res.data;
  }
}

export const courseSectionApi = new CourseSectionApi();
