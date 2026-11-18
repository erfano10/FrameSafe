import apiClient from './client';
import type { ApiResponse, Purchase } from '../types';

export interface CreatePurchasePayload {
  albumId: string;
}

export const purchasesApi = {
  create: async (payload: CreatePurchasePayload): Promise<ApiResponse<Purchase>> => {
    const { data } = await apiClient.post<ApiResponse<Purchase>>('/purchases', payload);
    return data;
  },

  // Client: get own purchases — handled via auth/me or future endpoint
  getMyPurchases: async (): Promise<ApiResponse<Purchase[]>> => {
    const { data } = await apiClient.get<ApiResponse<Purchase[]>>('/purchases');
    return data;
  },
};
