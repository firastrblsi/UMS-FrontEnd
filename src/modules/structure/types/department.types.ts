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
  filters?: string;
}

