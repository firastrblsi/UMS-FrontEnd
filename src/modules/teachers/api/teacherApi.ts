import { BaseApi } from '@/core/api/baseApi';
import { TEACHER_ENDPOINTS } from '@/core/api/endpoints';
import type { TeacherListResponse, TeacherListParams } from '../types/teacher.types';

class TeacherApi extends BaseApi {
  constructor() {
    super(TEACHER_ENDPOINTS.BASE);
  }

  getTeachers(params: TeacherListParams): Promise<TeacherListResponse> {
    return this.getAll<TeacherListResponse>(params as Record<string, unknown>);
  }
}

export const teacherApi = new TeacherApi();
