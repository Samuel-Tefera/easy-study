import api from './api';
import type { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  loginWithGoogle: async (code: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/google', { code });
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await api.post<User>('/auth/signup', credentials);
    return response.data;
  },

  me: async (): Promise<User> => {
    const response = await api.get<User>('/users/me');
    return response.data;
  },
};
