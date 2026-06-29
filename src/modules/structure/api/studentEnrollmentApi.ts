import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';

export interface StudentEnrollment {
  id: string;
  studentId: string;
  courseSectionId: string;
  enrollmentDate: string;
  status: string;
  student?: {
    id: string;
    userId: string;
    studentNumber: string;
    user?: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface StudentEnrollmentListParams {
  skip?: number;
  take?: number;
  search?: string;
  filters?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface StudentEnrollmentListResponse {
  data: StudentEnrollment[];
  total: number;
}

export interface CreateStudentEnrollmentDto {
  studentId: string;
  courseSectionId: string;
  status?: string;
}

export interface BulkEnrollClassGroupDto {
  courseSectionId: string;
}

class StudentEnrollmentApi extends BaseApi {
  constructor() {
    super('/student-enrollments');
  }

  getEnrollments(params: StudentEnrollmentListParams): Promise<StudentEnrollmentListResponse> {
    return this.getAll<StudentEnrollmentListResponse>(params as Record<string, unknown>);
  }

  async enrollStudent(data: CreateStudentEnrollmentDto): Promise<StudentEnrollment> {
    const res = await axiosInstance.post<StudentEnrollment>(this.basePath, data);
    return res.data;
  }

  async bulkEnrollClassGroup(data: BulkEnrollClassGroupDto): Promise<{ count: number; message: string }> {
    const res = await axiosInstance.post<{ count: number; message: string }>(`${this.basePath}/bulk-class-group`, data);
    return res.data;
  }

  async unenrollStudent(id: string): Promise<void> {
    await axiosInstance.delete(`${this.basePath}/${id}`);
  }
}

export const studentEnrollmentApi = new StudentEnrollmentApi();
