import { useState, useCallback, useRef } from 'react';
import type { FetchDataParams } from '@/shared/ui/DataTable';
import type { Student, StudentFilterParams } from '../types/student.types';
import { studentApi } from '../api/studentApi';

export function useStudents(externalFilters: StudentFilterParams) {
  const [data, setData] = useState<Student[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const isFirstFetch = useRef(true);

  const filtersRef = useRef(externalFilters);
  filtersRef.current = externalFilters;

  const fetchStudents = useCallback(async (params: FetchDataParams) => {
    if (isFirstFetch.current) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const { status, scholarshipType } = filtersRef.current;
      const search = params.globalFilter?.trim();
      const result = await studentApi.getStudents({
        skip: params.page * params.pageSize,
        take: params.pageSize,
        ...(search ? { search } : {}),
        ...(status ? { status } : {}),
        ...(scholarshipType ? { scholarshipType } : {}),
        ...(params.sorting[0]
          ? { sort: params.sorting[0].id, order: params.sorting[0].desc ? 'desc' : 'asc' }
          : {}),
      });
      setData(result.data);
      setRowCount(result.total);
    } catch {
      setData([]);
      setRowCount(0);
    } finally {
      isFirstFetch.current = false;
      setIsLoading(false);
      setIsFetching(false);
    }
  }, []);

  return { data, rowCount, isLoading, isFetching, fetchStudents };
}
