export type UserRole = 'manager' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team_id: string;
  team_name: string;
  title: string;
  avatar_url?: string;
  weekly_capacity: number;
  current_hours: number;
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
