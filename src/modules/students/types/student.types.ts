export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'SUSPENDED' | 'DROPPED_OUT';
export type ScholarshipType = 'NONE' | 'FULL' | 'PARTIAL' | 'MERIT' | 'ATHLETIC';

export interface Student {
  id: string; // StudentProfile ID
  userId: string;
  studentNumber: string;
  enrollmentDate: string | null;
  status: StudentStatus;
  
  // Personal Info
  dateOfBirth: string | null;
  placeOfBirth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  
  // Academic Background
  baccalaureateType: string | null;
  baccalaureateYear: number | null;
  baccalaureateScore: number | null;
  scholarshipType: ScholarshipType | null;
  
  // Guardian Info
  guardianName: string | null;
  guardianRelation: string | null;
  guardianPhone: string | null;
  guardianEmail: string | null;
  
  // Medical Info
  bloodGroup: string | null;
  medicalConditions: string | null;

  createdAt: string;
  updatedAt: string;

  // Relations
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    isActive: boolean;
  };
}

export interface StudentListResponse {
  data: Student[];
  total: number;
}

export interface StudentFilterParams {
  status?: StudentStatus | '';
  scholarshipType?: ScholarshipType | '';
  search?: string;
  skip?: number;
  take?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}
