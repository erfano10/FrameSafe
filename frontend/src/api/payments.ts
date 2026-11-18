import apiClient from './client';
import type { ApiResponse, Payment } from '../types';

export interface CreatePaymentPayload {
  purchaseId: string;
  proofUrl: string;
}

export const paymentsApi = {
  // Client submits payment proof
  create: async (payload: CreatePaymentPayload): Promise<ApiResponse<Payment>> => {
    const { data } = await apiClient.post<ApiResponse<Payment>>('/payments', payload);
    return data;
  },

  // Photographer views all payments
  getAll: async (): Promise<ApiResponse<Payment[]>> => {
    const { data } = await apiClient.get<ApiResponse<Payment[]>>('/payments');
    return data;
  },

  // Photographer approves payment
  approve: async (id: string): Promise<ApiResponse<Payment>> => {
    const { data } = await apiClient.patch<ApiResponse<Payment>>(`/payments/${id}/approve`);
    return data;
  },

  // Photographer rejects payment
  reject: async (id: string): Promise<ApiResponse<Payment>> => {
    const { data } = await apiClient.patch<ApiResponse<Payment>>(`/payments/${id}/reject`);
    return data;
  },
};
