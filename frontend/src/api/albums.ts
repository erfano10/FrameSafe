import apiClient from './client';
import type { ApiResponse, Album, AlbumStatus } from '../types';

export interface CreateAlbumPayload {
  title: string;
  description?: string;
  clientName?: string;
}

export interface UpdateAlbumPayload {
  title?: string;
  description?: string;
  clientName?: string;
}

export const albumsApi = {
  getAll: async (): Promise<ApiResponse<Album[]>> => {
    const { data } = await apiClient.get<ApiResponse<Album[]>>('/albums');
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Album>> => {
    const { data } = await apiClient.get<ApiResponse<Album>>(`/albums/${id}`);
    return data;
  },

  create: async (payload: CreateAlbumPayload): Promise<ApiResponse<Album>> => {
    const { data } = await apiClient.post<ApiResponse<Album>>('/albums', payload);
    return data;
  },

  update: async (id: string, payload: UpdateAlbumPayload): Promise<ApiResponse<Album>> => {
    const { data } = await apiClient.put<ApiResponse<Album>>(`/albums/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/albums/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: AlbumStatus): Promise<ApiResponse<Album>> => {
    const { data } = await apiClient.patch<ApiResponse<Album>>(`/albums/${id}/status`, { status });
    return data;
  },
};
