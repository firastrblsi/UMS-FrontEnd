import { useState, useCallback, useRef } from 'react';
import type { FetchDataParams } from '@/shared/ui/DataTable';
import type { Department } from '../types/department.types';
import { departmentApi } from '../api/departmentApi';

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
      const search = params.globalFilter?.trim();
      const filters = params.columnFilters?.length ? JSON.stringify(params.columnFilters) : undefined;
      const result = await departmentApi.getDepartments({
        skip: params.page * params.pageSize,
        take: params.pageSize,
        ...(search ? { search } : {}),
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

  return { data, rowCount, isLoading, isFetching, fetchDepartments };
}
