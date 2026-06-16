import { useState, useCallback, useRef } from 'react';
import type { FetchDataParams } from '@/shared/ui/DataTable';
import type { Room } from '../types/university.types';
import type { RoomFilterParams } from '../api/roomApi';
import { roomApi } from '../api/roomApi';

export function useRooms(externalFilters: RoomFilterParams) {
  const [data, setData] = useState<Room[]>([]);
  const [rowCount, setRowCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const isFirstFetch = useRef(true);

  const filtersRef = useRef(externalFilters);
  filtersRef.current = externalFilters;

  const fetchRooms = useCallback(async (params: FetchDataParams) => {
    if (isFirstFetch.current) {
      setIsLoading(true);
    } else {
      setIsFetching(true);
    }

    try {
      const search = params.globalFilter?.trim();
      const result = await roomApi.getRooms({
        skip: params.page * params.pageSize,
        take: params.pageSize,
        ...(search ? { search } : {}),
        ...filtersRef.current,
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

  return { data, rowCount, isLoading, isFetching, fetchRooms };
}
