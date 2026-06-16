export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentListResponse {
  data: Department[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DepartmentListParams {
  skip?: number;
  take?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
}

export const DUMMY_DEPARTMENTS: Department[] = [
  { id: '1',  name: 'Computer Science',       code: 'CS',    description: 'CS Department', isActive: true,   createdAt: '2020-09-01', updatedAt: '2020-09-01' },
  { id: '2',  name: 'Mathematics',            code: 'MATH',  description: 'Math Department', isActive: true,   createdAt: '2020-09-01', updatedAt: '2020-09-01' },
  { id: '3',  name: 'Physics',                code: 'PHY',   description: 'Physics Department', isActive: true,   createdAt: '2021-09-01', updatedAt: '2020-09-01' },
  { id: '4',  name: 'Chemistry',              code: 'CHEM',  description: 'Chemistry Department', isActive: false, createdAt: '2021-09-01', updatedAt: '2020-09-01' },
  { id: '5',  name: 'Biology',                code: 'BIO',   description: 'Biology Department', isActive: true,   createdAt: '2021-09-01', updatedAt: '2020-09-01' },
  { id: '6',  name: 'Civil Engineering',      code: 'CE',    description: 'Civil Engineering', isActive: true,   createdAt: '2019-09-01', updatedAt: '2020-09-01' },
  { id: '7',  name: 'Electrical Engineering', code: 'EE',    description: 'Electrical Engineering', isActive: true,   createdAt: '2019-09-01', updatedAt: '2020-09-01' },
  { id: '8',  name: 'Mechanical Engineering', code: 'ME',    description: 'Mechanical Engineering', isActive: true,   createdAt: '2019-09-01', updatedAt: '2020-09-01' },
  { id: '9',  name: 'Architecture',           code: 'ARCH',  description: 'Architecture Department', isActive: false, createdAt: '2022-09-01', updatedAt: '2020-09-01' },
  { id: '10', name: 'Economics',              code: 'ECON',  description: 'Economics Department', isActive: true,   createdAt: '2020-09-01', updatedAt: '2020-09-01' },
  { id: '11', name: 'Management',             code: 'MGT',   description: 'Management Department', isActive: true,   createdAt: '2019-09-01', updatedAt: '2020-09-01' },
  { id: '12', name: 'Law',                    code: 'LAW',   description: 'Law Department', isActive: true,   createdAt: '2020-09-01', updatedAt: '2020-09-01' },
  { id: '13', name: 'Arabic Literature',      code: 'ARLIT', description: 'Arabic Literature', isActive: true,   createdAt: '2020-09-01', updatedAt: '2020-09-01' },
  { id: '14', name: 'French Literature',      code: 'FRLIT', description: 'French Literature', isActive: false, createdAt: '2021-09-01', updatedAt: '2020-09-01' },
  { id: '15', name: 'English Studies',        code: 'ENG',   description: 'English Studies', isActive: true,   createdAt: '2021-09-01', updatedAt: '2020-09-01' },
  { id: '16', name: 'History',                code: 'HIST',  description: 'History Department', isActive: true,   createdAt: '2022-09-01', updatedAt: '2020-09-01' },
  { id: '17', name: 'Geography',              code: 'GEO',   description: 'Geography Department', isActive: true,   createdAt: '2022-09-01', updatedAt: '2020-09-01' },
  { id: '18', name: 'Philosophy',             code: 'PHIL',  description: 'Philosophy Department', isActive: false, createdAt: '2023-09-01', updatedAt: '2020-09-01' },
  { id: '19', name: 'Psychology',             code: 'PSYCH', description: 'Psychology Department', isActive: true,   createdAt: '2022-09-01', updatedAt: '2020-09-01' },
  { id: '20', name: 'Sociology',              code: 'SOC',   description: 'Sociology Department', isActive: true,   createdAt: '2023-09-01', updatedAt: '2020-09-01' },
  { id: '21', name: 'Agronomy',               code: 'AGRO',  description: 'Agronomy Department', isActive: true,   createdAt: '2021-09-01', updatedAt: '2020-09-01' },
  { id: '22', name: 'Veterinary Medicine',    code: 'VET',   description: 'Veterinary Medicine', isActive: false, createdAt: '2023-09-01', updatedAt: '2020-09-01' },
  { id: '23', name: 'Pharmacy',               code: 'PHARM', description: 'Pharmacy Department', isActive: true,   createdAt: '2020-09-01', updatedAt: '2020-09-01' },
  { id: '24', name: 'Medicine',               code: 'MED',   description: 'Medicine Department', isActive: true,   createdAt: '2019-09-01', updatedAt: '2020-09-01' },
  { id: '25', name: 'Dentistry',              code: 'DENT',  description: 'Dentistry Department', isActive: true,   createdAt: '2021-09-01', updatedAt: '2020-09-01' },
];
