import { useState, useCallback, useRef } from 'react';
import type { FetchDataParams } from '@/shared/ui/DataTable';
import type { Department } from '../types/department.types';
import { DUMMY_DEPARTMENTS } from '../types/department.types';

// Simulates server-side filtering, sorting, and pagination on dummy data.
// Replace the body of fetchDepartments with a real API call once the backend is ready:
//   const result = await departmentApi.getDepartments({ page, pageSize, sort, order, search });
//   setData(result.data); setRowCount(result.total);
function mockFetch(params: FetchDataParams): Promise<{ data: Department[]; total: number }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let rows = [...DUMMY_DEPARTMENTS];

      // Global text search
      if (params.globalFilter) {
        const q = params.globalFilter.toLowerCase();
        rows = rows.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.code.toLowerCase().includes(q) ||
            (d.description && d.description.toLowerCase().includes(q)),
        );
      }

      // Column filters
      for (const { id, value } of params.columnFilters) {
        if (!value) continue;
        const v = String(value).toLowerCase();
        rows = rows.filter((d) => {
          const cell = String(d[id as keyof Department] ?? '').toLowerCase();
          return cell.includes(v);
        });
      }

      // Sorting (single-column)
      if (params.sorting.length > 0) {
        const { id, desc } = params.sorting[0];
        rows.sort((a, b) => {
          const av = String(a[id as keyof Department] ?? '');
          const bv = String(b[id as keyof Department] ?? '');
          const cmp = av.localeCompare(bv, undefined, { numeric: true });
          return desc ? -cmp : cmp;
        });
      }

      const total = rows.length;
      const start = params.page * params.pageSize;
      resolve({ data: rows.slice(start, start + params.pageSize), total });
    }, 400);
  });
}

export function useDepartments() {
  const [data, setData] = useState<Department[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const isFirstFetch = useRef(true);

  const fetchDepartments = useCallback(async (params: FetchDataParams) => {
    if (isFirstFetch.current) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const result = await mockFetch(params);
      setData(result.data);
      setRowCount(result.total);
    } finally {
      isFirstFetch.current = false;
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  return { data, rowCount, isLoading, isFetching, fetchDepartments };
}
