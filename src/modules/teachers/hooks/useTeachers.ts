import { useState, useCallback, useRef } from 'react';
import type { FetchDataParams } from '@/shared/ui/DataTable';
import type { Teacher, TeacherFilterParams } from '../types/teacher.types';
import { teacherApi } from '../api/teacherApi';

export function useTeachers(externalFilters: TeacherFilterParams) {
  const [data, setData] = useState<Teacher[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const isFirstFetch = useRef(true);

  // Ref so the stable fetchTeachers callback always reads the latest filters
  const filtersRef = useRef(externalFilters);
  filtersRef.current = externalFilters;

  const fetchTeachers = useCallback(async (params: FetchDataParams) => {
    if (isFirstFetch.current) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const { departmentId, status } = filtersRef.current || {};
      const isActive = status === 'active' ? true : status === 'inactive' ? false : undefined;
      const search = params.globalFilter?.trim() || undefined;
      const filters = params.columnFilters?.length ? JSON.stringify(params.columnFilters) : undefined;
      const result = await teacherApi.getTeachers({
        skip: params.page * params.pageSize,
        take: params.pageSize,
        ...(search ? { search } : {}),
        ...(departmentId ? { departmentId } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
        ...(filters ? { filters } : {}),
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

  return { data, rowCount, isLoading, isFetching, fetchTeachers };
}
