import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
import { TEACHER_ENDPOINTS } from '@/core/api/endpoints';
import type { TeacherListResponse, TeacherListParams } from '../types/teacher.types';

export interface CreateTeacherPayload {
  // User fields
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  nationality?: string;
  profilePictureFile?: File;

  // Profile fields
  employeeId?: string;
  title?: string;
  departmentId?: string;
  specialization?: string;
  highestDegree?: string;
  degreeField?: string;
  degreeInstitution?: string;
  contractType?: string;
  hireDate?: string;
  endDate?: string;
  officeRoom?: string;
  officeHours?: string;
  professionalEmail?: string;
  bio?: string;
}

export interface UpdateTeacherPayload extends Partial<CreateTeacherPayload> {}

class TeacherApi extends BaseApi {
  constructor() {
    super(TEACHER_ENDPOINTS.BASE);
  }

  getTeachers(params: TeacherListParams): Promise<TeacherListResponse> {
    return this.getAll<TeacherListResponse>(params as Record<string, unknown>);
  }

  async getProfileByUserId(userId: string): Promise<any> {
    const res = await axiosInstance.get(`/teacher-profiles/user/${userId}`);
    return res.data;
  }

  async createTeacher(data: CreateTeacherPayload): Promise<void> {
    // 1. Create User
    const userPayload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      gender: data.gender,
      nationality: data.nationality,
      role: 'TEACHER',
    };

    const userRes = await axiosInstance.post('/users', userPayload);
    const userId = userRes.data.id;

    if (data.profilePictureFile) {
      await this.uploadProfilePicture(userId, data.profilePictureFile);
    }

    // 2. Create Profile
    const profilePayload = {
      userId,
      employeeId: data.employeeId,
      title: data.title,
      departmentId: data.departmentId,
      specialization: data.specialization,
      highestDegree: data.highestDegree,
      degreeField: data.degreeField,
      degreeInstitution: data.degreeInstitution,
      contractType: data.contractType,
      hireDate: data.hireDate ? (data.hireDate.includes('T') ? data.hireDate : `${data.hireDate}T00:00:00Z`) : data.hireDate,
      endDate: data.endDate ? (data.endDate.includes('T') ? data.endDate : `${data.endDate}T00:00:00Z`) : data.endDate,
      officeRoom: data.officeRoom,
      officeHours: data.officeHours,
      professionalEmail: data.professionalEmail,
      bio: data.bio,
    };

    await axiosInstance.post('/teacher-profiles', profilePayload);
  }

  async updateTeacher(profileId: string, userId: string, data: UpdateTeacherPayload): Promise<void> {
    // 1. Update User Details
    if (data.email || data.firstName || data.lastName || data.phone || data.gender || data.nationality) {
      const userPayload = {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        gender: data.gender,
        nationality: data.nationality,
      };
      await axiosInstance.put(`/users/${userId}`, userPayload);
    }

    // 2. Update Profile Details
    const profilePayload = {
      employeeId: data.employeeId,
      title: data.title,
      departmentId: data.departmentId,
      specialization: data.specialization,
      highestDegree: data.highestDegree,
      degreeField: data.degreeField,
      degreeInstitution: data.degreeInstitution,
      contractType: data.contractType,
      hireDate: data.hireDate ? (data.hireDate.includes('T') ? data.hireDate : `${data.hireDate}T00:00:00Z`) : data.hireDate,
      endDate: data.endDate ? (data.endDate.includes('T') ? data.endDate : `${data.endDate}T00:00:00Z`) : data.endDate,
      officeRoom: data.officeRoom,
      officeHours: data.officeHours,
      professionalEmail: data.professionalEmail,
      bio: data.bio,
    };

    // Remove undefined fields
    Object.keys(profilePayload).forEach(key => {
      if ((profilePayload as any)[key] === undefined) {
        delete (profilePayload as any)[key];
      }
    });

    await axiosInstance.put(`/teacher-profiles/${profileId}`, profilePayload);
  }

  async uploadProfilePicture(userId: string, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
    await axiosInstance.post(`/users/${userId}/profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  deactivateUser(userId: string): Promise<void> {
    return axiosInstance.patch(`/users/${userId}/deactivate`);
  }

  reactivateUser(userId: string): Promise<void> {
    return axiosInstance.patch(`/users/${userId}/reactivate`);
  }
}

export const teacherApi = new TeacherApi();
