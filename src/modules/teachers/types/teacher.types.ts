export type TeacherTitle = 'PROF' | 'DR' | 'MR' | 'MRS' | 'MS';
export type HighestDegree = 'PHD' | 'MASTER' | 'BACHELOR' | 'OTHER';
export type ContractType = 'PERMANENT' | 'CONTRACT' | 'PART_TIME' | 'VISITING';

export interface Teacher {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Profile fields
  employeeId: string | null;
  title: TeacherTitle | null;
  departmentId: string | null;
  departmentName: string | null;
  specialization: string | null;
  highestDegree: HighestDegree | null;
  degreeField: string | null;
  degreeInstitution: string | null;
  contractType: ContractType | null;
  hireDate: string | null;
  endDate: string | null;
  officeRoom: string | null;
  officeHours: string | null;
  professionalEmail: string | null;
  bio: string | null;
}

export interface TeacherListResponse {
  data: Teacher[];
  total: number;
}

export interface TeacherListParams {
  skip?: number;
  take?: number;
  search?: string;
  isActive?: boolean;
  title?: TeacherTitle;
  contractType?: ContractType;
  departmentId?: string;
  specialization?: string;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface TeacherFilterParams {
  status?: 'active' | 'inactive' | '';
  title?: TeacherTitle | '';
  contractType?: ContractType | '';
  specialization?: string;
  departmentId?: string;
}
