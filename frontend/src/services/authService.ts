import { User, LoginCredentials } from '../types';
import { api } from './api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    // Send standard login credentials
    const data = await api.post<{ user: User; token: string }>('/auth/login', {
      email: credentials.email,
      password: credentials.password || 'password123',
      role: credentials.role
    });
    localStorage.setItem('capacita_auth_token', data.token);
    localStorage.setItem('capacita_current_user', JSON.stringify(data.user));
    return data;
  },

  async signup(data: { name: string; email: string; role: 'employee' | 'manager'; team_name?: string; password?: string }): Promise<{ user: User; token: string }> {
    const result = await api.post<{ user: User; token: string }>('/auth/signup', {
      name: data.name,
      email: data.email,
      password: data.password || 'password123',
      role: data.role,
      team_name: data.team_name || 'Alpha Engineering'
    });
    localStorage.setItem('capacita_auth_token', result.token);
    localStorage.setItem('capacita_current_user', JSON.stringify(result.user));
    return result;
  },

  getCurrentUser(): User | null {
    const saved = localStorage.getItem('capacita_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  },

  getToken(): string | null {
    return localStorage.getItem('capacita_auth_token');
  },

  logout(): void {
    localStorage.removeItem('capacita_auth_token');
    localStorage.removeItem('capacita_current_user');
  },

};
