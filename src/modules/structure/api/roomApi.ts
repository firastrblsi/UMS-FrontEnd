import { BaseApi } from '@/core/api/baseApi';
import { axiosInstance } from '@/core/api/axios';
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
  filters?: string;
}

class RoomApi extends BaseApi {
  constructor() {
    super('/rooms');
  }

  getRooms(params: RoomFilterParams): Promise<RoomListResponse> {
    return this.getAll<RoomListResponse>(params as Record<string, unknown>);
  }

  async createRoom(data: Partial<Room>): Promise<Room> {
    const res = await axiosInstance.post<Room>(this.basePath, data);
    return res.data;
  }

  async updateRoom(id: string, data: Partial<Room>): Promise<Room> {
    const res = await axiosInstance.put<Room>(`${this.basePath}/${id}`, data);
    return res.data;
  }

  async deleteRoom(id: string): Promise<void> {
    await axiosInstance.delete<void>(`${this.basePath}/${id}`);
  }
}

export const roomApi = new RoomApi();
