import { useState, useCallback, useRef, useEffect } from 'react';
import type { FetchDataParams } from '@/shared/ui/DataTable';
import type { TimetableSession } from '../types/university.types';
import type { TimetableSessionListParams } from '../api/timetableSessionApi';
import { timetableSessionApi } from '../api/timetableSessionApi';

export function useTimetableSessions(externalFilters: TimetableSessionListParams = {}) {
  const [data, setData] = useState<TimetableSession[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const isFirstFetch = useRef(true);

  const filtersRef = useRef(externalFilters);
  useEffect(() => {
    filtersRef.current = externalFilters;
    fetchSessions();
  }, [JSON.stringify(externalFilters)]);

  const fetchSessions = useCallback(async (params?: FetchDataParams) => {
    if (isFirstFetch.current) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const skip = params ? params.page * params.pageSize : 0;
      const take = params ? params.pageSize : 1000;
      const search = params?.globalFilter?.trim();
      
      const result = await timetableSessionApi.getTimetableSessions({
        skip,
        take,
        ...(search ? { search } : {}),
        ...filtersRef.current,
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

  return { data, rowCount, isLoading, isFetching, fetchSessions };
}
