import apiClient from './client';
import type { ApiResponse, Photo } from '../types';

export interface CreatePhotoPayload {
  albumId: string;
  previewUrl: string;
  highResUrl?: string;
  originalUrl?: string;
}

export interface UpdatePhotoPayload {
  previewUrl?: string;
  highResUrl?: string;
}

export const photosApi = {
  getByAlbum: async (albumId: string): Promise<ApiResponse<Photo[]>> => {
    const { data } = await apiClient.get<ApiResponse<Photo[]>>(`/photos/${albumId}/photos`);
    return data;
  },

  create: async (payload: CreatePhotoPayload): Promise<ApiResponse<Photo>> => {
    const { data } = await apiClient.post<ApiResponse<Photo>>('/photos', payload);
    return data;
  },

  update: async (id: string, payload: UpdatePhotoPayload): Promise<ApiResponse<Photo>> => {
    const { data } = await apiClient.put<ApiResponse<Photo>>(`/photos/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    const { data } = await apiClient.delete<ApiResponse<void>>(`/photos/${id}`);
    return data;
  },
};
