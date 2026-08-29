import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, LoginCredentials, AuthState } from '../types';
import { authService } from '../services/authService';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: { name: string; email: string; role: UserRole; teamName?: string }) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedUser = authService.getCurrentUser();
    const savedToken = authService.getToken() || 'mock_token_init';
    if (savedUser) {
      setUser(savedUser);
      setToken(savedToken);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const result = await authService.login(credentials);
      setUser(result.user);
      setToken(result.token);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: { name: string; email: string; role: UserRole; teamName?: string }) => {
    setIsLoading(true);
    try {
      const result = await authService.signup(data);
      setUser(result.user);
      setToken(result.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const switchRole = (role: UserRole) => {
    const updated = authService.switchRole(role);
    setUser(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        switchRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
