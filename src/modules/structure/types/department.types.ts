export interface Department {
  id: string;
  name: string;
  code: string;
  chief: string;
  studentsCount: number;
  teachersCount: number;
  status: 'active' | 'inactive';
  createdAt: string;
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
  { id: '1',  name: 'Computer Science',       code: 'CS',    chief: 'Dr. Ahmed Benali',       studentsCount: 245, teachersCount: 18, status: 'active',   createdAt: '2020-09-01' },
  { id: '2',  name: 'Mathematics',            code: 'MATH',  chief: 'Dr. Fatima Zahra',        studentsCount: 180, teachersCount: 14, status: 'active',   createdAt: '2020-09-01' },
  { id: '3',  name: 'Physics',                code: 'PHY',   chief: 'Dr. Omar Kaddour',        studentsCount: 120, teachersCount: 10, status: 'active',   createdAt: '2021-09-01' },
  { id: '4',  name: 'Chemistry',              code: 'CHEM',  chief: 'Dr. Sara Mansour',        studentsCount: 95,  teachersCount: 8,  status: 'inactive', createdAt: '2021-09-01' },
  { id: '5',  name: 'Biology',                code: 'BIO',   chief: 'Dr. Karim Hadj',          studentsCount: 110, teachersCount: 9,  status: 'active',   createdAt: '2021-09-01' },
  { id: '6',  name: 'Civil Engineering',      code: 'CE',    chief: 'Dr. Nadia Bouchama',      studentsCount: 210, teachersCount: 20, status: 'active',   createdAt: '2019-09-01' },
  { id: '7',  name: 'Electrical Engineering', code: 'EE',    chief: 'Dr. Youssef Tlemceni',    studentsCount: 190, teachersCount: 16, status: 'active',   createdAt: '2019-09-01' },
  { id: '8',  name: 'Mechanical Engineering', code: 'ME',    chief: 'Dr. Amina Larbi',         studentsCount: 175, teachersCount: 15, status: 'active',   createdAt: '2019-09-01' },
  { id: '9',  name: 'Architecture',           code: 'ARCH',  chief: 'Dr. Hassan Filali',       studentsCount: 88,  teachersCount: 7,  status: 'inactive', createdAt: '2022-09-01' },
  { id: '10', name: 'Economics',              code: 'ECON',  chief: 'Dr. Leila Bensalem',      studentsCount: 230, teachersCount: 17, status: 'active',   createdAt: '2020-09-01' },
  { id: '11', name: 'Management',             code: 'MGT',   chief: 'Dr. Rachid Boudjema',     studentsCount: 300, teachersCount: 22, status: 'active',   createdAt: '2019-09-01' },
  { id: '12', name: 'Law',                    code: 'LAW',   chief: 'Dr. Zineb Chikhi',        studentsCount: 260, teachersCount: 19, status: 'active',   createdAt: '2020-09-01' },
  { id: '13', name: 'Arabic Literature',      code: 'ARLIT', chief: 'Dr. Mohamed Cherif',      studentsCount: 145, teachersCount: 12, status: 'active',   createdAt: '2020-09-01' },
  { id: '14', name: 'French Literature',      code: 'FRLIT', chief: 'Dr. Isabelle Moreau',     studentsCount: 98,  teachersCount: 8,  status: 'inactive', createdAt: '2021-09-01' },
  { id: '15', name: 'English Studies',        code: 'ENG',   chief: 'Dr. Sofia Benhamida',     studentsCount: 165, teachersCount: 13, status: 'active',   createdAt: '2021-09-01' },
  { id: '16', name: 'History',                code: 'HIST',  chief: 'Dr. Abdelkader Meziane',  studentsCount: 112, teachersCount: 9,  status: 'active',   createdAt: '2022-09-01' },
  { id: '17', name: 'Geography',              code: 'GEO',   chief: 'Dr. Meriem Bouras',       studentsCount: 90,  teachersCount: 7,  status: 'active',   createdAt: '2022-09-01' },
  { id: '18', name: 'Philosophy',             code: 'PHIL',  chief: 'Dr. Kamal Belkacem',      studentsCount: 75,  teachersCount: 6,  status: 'inactive', createdAt: '2023-09-01' },
  { id: '19', name: 'Psychology',             code: 'PSYCH', chief: 'Dr. Nassima Hamidi',      studentsCount: 135, teachersCount: 11, status: 'active',   createdAt: '2022-09-01' },
  { id: '20', name: 'Sociology',              code: 'SOC',   chief: 'Dr. Tarek Kellil',        studentsCount: 88,  teachersCount: 7,  status: 'active',   createdAt: '2023-09-01' },
  { id: '21', name: 'Agronomy',               code: 'AGRO',  chief: 'Dr. Brahim Zerrouki',     studentsCount: 102, teachersCount: 9,  status: 'active',   createdAt: '2021-09-01' },
  { id: '22', name: 'Veterinary Medicine',    code: 'VET',   chief: 'Dr. Samira Boukhalfa',    studentsCount: 68,  teachersCount: 8,  status: 'inactive', createdAt: '2023-09-01' },
  { id: '23', name: 'Pharmacy',               code: 'PHARM', chief: 'Dr. Adel Hamici',         studentsCount: 140, teachersCount: 12, status: 'active',   createdAt: '2020-09-01' },
  { id: '24', name: 'Medicine',               code: 'MED',   chief: 'Dr. Farida Semane',       studentsCount: 320, teachersCount: 35, status: 'active',   createdAt: '2019-09-01' },
  { id: '25', name: 'Dentistry',              code: 'DENT',  chief: 'Dr. Mounir Ait Ahmed',    studentsCount: 85,  teachersCount: 10, status: 'active',   createdAt: '2021-09-01' },
];
