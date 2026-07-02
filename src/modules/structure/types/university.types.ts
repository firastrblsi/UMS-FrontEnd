export type RoomType = 'CLASSROOM' | 'LAB' | 'EXAM_HALL' | 'AMPHITHEATER' | 'MEETING_ROOM' | 'OFFICE' | 'OTHER';

export interface Program {
  id: string;
  name: string;
  code: string;
  description: string | null;
  degreeType: 'BACHELOR' | 'MASTER' | 'DIPLOMA' | 'CERTIFICATE';
  departmentId: string;
  totalCredits: number;
  numberOfSemesters: number;
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
  floor: number | null;
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

export interface TeachingModule {
  id: string;
  name: string;
  code: string;
  description: string | null;
  departmentId: string;
  department?: { id: string; name: string };
  coefficient: number;
  totalCredits: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string | null;
  teachingModuleId: string;
  teachingModule?: TeachingModule;
  credits: number;
  coefficient: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CurriculumModule {
  id: string;
  curriculumId: string;
  teachingModuleId: string;
  isMandatory: boolean;
  teachingModule?: TeachingModule;
}

export interface Curriculum {
  id: string;
  programId: string;
  yearNumber: number;
  termNumber: number;
  program?: Program;
  modules?: CurriculumModule[];
}
export interface CourseSection {
  id: string;
  courseId: string;
  semesterId: string;
  classGroupId: string;
  teacherId?: string;

  course?: Course;
  semester?: Semester;
  classGroup?: ClassGroup;
  // teacher?: TeacherProfile; // We might not have TeacherProfile defined yet, use any or add it if needed
  teacher?: any;
}

export interface TimetableSession {
  id: string;
  courseSectionId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'LECTURE' | 'TUTORIAL' | 'PRACTICAL' | 'EXAM' | 'SEMINAR';
  createdAt: string;
  updatedAt: string;
  courseSection?: CourseSection;
  room?: Room;
}
