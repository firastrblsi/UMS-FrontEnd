import { BaseApi } from '@/core/api/baseApi';
import type { Room, RoomType } from '../types/university.types';

export interface RoomListResponse {
  data: Room[];
  total: number;
}

export interface RoomFilterParams {
  type?: RoomType | '';
  building?: string;
  isActive?: boolean | '';
  search?: string;
  skip?: number;
  take?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

class RoomApi extends BaseApi {
  constructor() {
    super('/rooms');
  }

  getRooms(params: RoomFilterParams): Promise<RoomListResponse> {
    return this.getAll<RoomListResponse>(params as Record<string, unknown>);
  }
}

export const roomApi = new RoomApi();
