import apiClient from './client';
import type { User } from '../types';

// ─── Response shapes matching the actual backend ───────────────────────────
// POST /auth/register → { success, message, data: { id, name, email, role } }
// POST /auth/login    → { success, message, data: { id, name, email, role }, token }

export interface AuthRegisterResponse {
  success: boolean;
  message?: string;
  data?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

export interface AuthLoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  data?: Pick<User, 'id' | 'name' | 'email' | 'role'>;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name?: string;
  role: 'PHOTOGRAPHER' | 'CLIENT';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthRegisterResponse> => {
    const { data } = await apiClient.post<AuthRegisterResponse>('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginPayload): Promise<AuthLoginResponse> => {
    const { data } = await apiClient.post<AuthLoginResponse>('/auth/login', payload);
    return data;
  },

  // GET /auth/profile — returns the authenticated user
  me: async (): Promise<{ success: boolean; user?: User; message?: string }> => {
    const { data } = await apiClient.get<{ success: boolean; user?: User; message?: string }>(
      '/auth/profile'
    );
    return data;
  },
};
