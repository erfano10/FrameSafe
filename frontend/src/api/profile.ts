import apiClient from './client';
import type { ApiResponse, PhotographerProfile } from '../types';

export interface UpdateProfilePayload {
  brandName: string;
  bio?: string;
  instagram?: string;
  whatsapp?: string;
  qrisUrl?: string;
}

export const profileApi = {
  get: async (): Promise<ApiResponse<PhotographerProfile>> => {
    const { data } = await apiClient.get<ApiResponse<PhotographerProfile>>('/profile');
    return data;
  },

  update: async (payload: UpdateProfilePayload): Promise<ApiResponse<PhotographerProfile>> => {
    const { data } = await apiClient.put<ApiResponse<PhotographerProfile>>('/profile', payload);
    return data;
  },
};
