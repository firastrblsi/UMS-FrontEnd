import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
import type { StudentListResponse, StudentFilterParams } from '../types/student.types';

export interface CreateStudentPayload {
  // User fields
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  nationality?: string;
  profilePictureFile?: File;

  // Profile fields
  studentNumber?: string;
  programId?: string;
  classGroupId?: string;
  nationalId?: string;
  scholarshipType?: 'NONE' | 'PARTIAL' | 'FULL' | 'MERIT';
  status?: 'ENROLLED' | 'SUSPENDED' | 'GRADUATED' | 'WITHDRAWN' | 'DEFERRED';
  baccalaureateField?: string;
  baccalaureateGrade?: string;
  baccalaureateYear?: number;
  currentYearNumber?: number;
  enrollmentDate?: string;
  expectedGradDate?: string;
  actualGradDate?: string;
  guardianName?: string;
  guardianEmail?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  hasMedicalNeeds?: boolean;
  medicalNotes?: string;
  previousInstitution?: string;
  transportMode?: string;
}

export interface UpdateStudentPayload extends Partial<CreateStudentPayload> {}

class StudentApi extends BaseApi {
  constructor() {
    super('/student-profiles');
  }

  getStudents(params: StudentFilterParams): Promise<StudentListResponse> {
    return this.getAll<StudentListResponse>(params as Record<string, unknown>);
  }

  async getProfileByUserId(userId: string): Promise<any> {
    const res = await axiosInstance.get(`/student-profiles/user/${userId}`);
    return res.data;
  }

  async createStudent(data: CreateStudentPayload): Promise<void> {
    // 1. Create User
    const userPayload = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      gender: data.gender,
      nationality: data.nationality,
      role: 'STUDENT',
    };

    const userRes = await axiosInstance.post('/users', userPayload);
    const userId = userRes.data.id;

    // Optional: Upload Profile Picture if provided
    if (data.profilePictureFile) {
      await this.uploadProfilePicture(userId, data.profilePictureFile);
    }

    // 2. Create Profile
    const profilePayload = {
      userId,
      studentNumber: data.studentNumber,
      programId: data.programId,
      classGroupId: data.classGroupId,
      nationalId: data.nationalId,
      scholarshipType: data.scholarshipType,
      status: data.status,
      baccalaureateField: data.baccalaureateField,
      baccalaureateGrade: data.baccalaureateGrade,
      baccalaureateYear: data.baccalaureateYear ? Number(data.baccalaureateYear) : undefined,
      currentYearNumber: data.currentYearNumber ? Number(data.currentYearNumber) : undefined,
      enrollmentDate: data.enrollmentDate ? (data.enrollmentDate.includes('T') ? data.enrollmentDate : `${data.enrollmentDate}T00:00:00Z`) : data.enrollmentDate,
      expectedGradDate: data.expectedGradDate ? (data.expectedGradDate.includes('T') ? data.expectedGradDate : `${data.expectedGradDate}T00:00:00Z`) : data.expectedGradDate,
      actualGradDate: data.actualGradDate ? (data.actualGradDate.includes('T') ? data.actualGradDate : `${data.actualGradDate}T00:00:00Z`) : data.actualGradDate,
      guardianName: data.guardianName,
      guardianEmail: data.guardianEmail,
      guardianPhone: data.guardianPhone,
      guardianRelation: data.guardianRelation,
      hasMedicalNeeds: data.hasMedicalNeeds,
      medicalNotes: data.medicalNotes,
      previousInstitution: data.previousInstitution,
      transportMode: data.transportMode,
    };

    await axiosInstance.post('/student-profiles', profilePayload);
  }
  async updateStudent(profileId: string, userId: string, data: UpdateStudentPayload): Promise<void> {
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
      studentNumber: data.studentNumber,
      programId: data.programId,
      classGroupId: data.classGroupId,
      nationalId: data.nationalId,
      scholarshipType: data.scholarshipType,
      status: data.status,
      baccalaureateField: data.baccalaureateField,
      baccalaureateGrade: data.baccalaureateGrade,
      baccalaureateYear: data.baccalaureateYear ? Number(data.baccalaureateYear) : undefined,
      currentYearNumber: data.currentYearNumber ? Number(data.currentYearNumber) : undefined,
      enrollmentDate: data.enrollmentDate ? (data.enrollmentDate.includes('T') ? data.enrollmentDate : `${data.enrollmentDate}T00:00:00Z`) : data.enrollmentDate,
      expectedGradDate: data.expectedGradDate ? (data.expectedGradDate.includes('T') ? data.expectedGradDate : `${data.expectedGradDate}T00:00:00Z`) : data.expectedGradDate,
      actualGradDate: data.actualGradDate ? (data.actualGradDate.includes('T') ? data.actualGradDate : `${data.actualGradDate}T00:00:00Z`) : data.actualGradDate,
      guardianName: data.guardianName,
      guardianEmail: data.guardianEmail,
      guardianPhone: data.guardianPhone,
      guardianRelation: data.guardianRelation,
      hasMedicalNeeds: data.hasMedicalNeeds,
      medicalNotes: data.medicalNotes,
      previousInstitution: data.previousInstitution,
      transportMode: data.transportMode,
    };

    // Remove undefined fields to not overwrite with undefined if backend uses PATCH semantics for PUT
    Object.keys(profilePayload).forEach(key => {
      if ((profilePayload as any)[key] === undefined) {
        delete (profilePayload as any)[key];
      }
    });

    await axiosInstance.put(`/student-profiles/${profileId}`, profilePayload);
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

export const studentApi = new StudentApi();
