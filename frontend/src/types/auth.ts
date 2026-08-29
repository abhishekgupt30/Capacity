export type UserRole = 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  teamId: string;
  teamName: string;
  title: string;
  avatarUrl?: string;
  weeklyCapacity: number; // typically 40h
  currentHours: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  role?: UserRole;
}
