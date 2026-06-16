export type RoomType = 'CLASSROOM' | 'LABORATORY' | 'AMPHITHEATER' | 'MEETING_ROOM' | 'OFFICE' | 'OTHER';

export interface Program {
  id: string;
  name: string;
  code: string;
  description: string | null;
  degreeType: 'BACHELOR' | 'MASTER' | 'PHD';
  departmentId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Semester {
  id: string;
  name: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  programId: string;
  academicYearId: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  type: RoomType;
  building: string | null;
  floor: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Holiday {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  academicYearId: string;
  createdAt: string;
  updatedAt: string;
}
