import api from './api';
import type { User } from '../types/auth';


export const authService = {

  registerSession: async (accessToken: string): Promise<{ user: User }> => {
    const response = await api.post<{ user: User }>(
      '/auth/session',
      {
        access_token: accessToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  },
};
