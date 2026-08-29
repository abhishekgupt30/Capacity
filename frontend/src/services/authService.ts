import { User, LoginCredentials } from '../types';
import { MOCK_CURRENT_USER, MOCK_MANAGER_USER } from '../data/mockData';
import { api } from './api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    try {
      // Try FastAPI backend endpoint first
      const data = await api.post<{ user: User; token: string }>('/auth/login', credentials);
      localStorage.setItem('capacita_auth_token', data.token);
      localStorage.setItem('capacita_current_user', JSON.stringify(data.user));
      return data;
    } catch {
      // Graceful mock fallback
      const isManager = credentials.role === 'manager' || credentials.email.toLowerCase().includes('sarah') || credentials.email.toLowerCase().includes('manager');
      const user = isManager ? MOCK_MANAGER_USER : MOCK_CURRENT_USER;
      const token = `mock_jwt_${user.id}_${Date.now()}`;
      
      localStorage.setItem('capacita_auth_token', token);
      localStorage.setItem('capacita_current_user', JSON.stringify(user));
      return { user, token };
    }
  },

  async signup(data: { name: string; email: string; role: 'employee' | 'manager'; teamName?: string }): Promise<{ user: User; token: string }> {
    try {
      const result = await api.post<{ user: User; token: string }>('/auth/signup', data);
      localStorage.setItem('capacita_auth_token', result.token);
      localStorage.setItem('capacita_current_user', JSON.stringify(result.user));
      return result;
    } catch {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: data.name || 'New User',
        email: data.email,
        role: data.role || 'employee',
        teamId: 'team_alpha_01',
        teamName: data.teamName || 'Alpha Engineering',
        title: data.role === 'manager' ? 'Engineering Lead' : 'Software Engineer',
        weeklyCapacity: 40,
        currentHours: 35
      };
      const token = `mock_jwt_${newUser.id}_${Date.now()}`;
      localStorage.setItem('capacita_auth_token', token);
      localStorage.setItem('capacita_current_user', JSON.stringify(newUser));
      return { user: newUser, token };
    }
  },

  getCurrentUser(): User | null {
    const saved = localStorage.getItem('capacita_current_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return MOCK_CURRENT_USER;
      }
    }
    return MOCK_CURRENT_USER;
  },

  getToken(): string | null {
    return localStorage.getItem('capacita_auth_token');
  },

  logout(): void {
    localStorage.removeItem('capacita_auth_token');
    localStorage.removeItem('capacita_current_user');
  },

  switchRole(targetRole: 'employee' | 'manager'): User {
    const user = targetRole === 'manager' ? MOCK_MANAGER_USER : MOCK_CURRENT_USER;
    localStorage.setItem('capacita_current_user', JSON.stringify(user));
    return user;
  }
};
