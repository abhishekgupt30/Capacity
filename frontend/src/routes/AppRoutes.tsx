import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PublicLayout } from '../layouts/PublicLayout';
import { EmployeeLayout } from '../layouts/EmployeeLayout';
import { ManagerLayout } from '../layouts/ManagerLayout';

// Public Pages
import { LandingPage } from '../pages/public/LandingPage';
import { LoginPage } from '../pages/public/LoginPage';
import { SignupPage } from '../pages/public/SignupPage';

// Employee Pages
import { EmployeeDashboard } from '../pages/employee/EmployeeDashboard';
import { EmployeeTasksPage } from '../pages/employee/EmployeeTasksPage';
import { EmployeeOvertimePage } from '../pages/employee/EmployeeOvertimePage';

// Manager Pages
import { ManagerOverviewPage } from '../pages/manager/ManagerOverviewPage';
import { ManagerCapacityPage } from '../pages/manager/ManagerCapacityPage';
import { ManagerTasksPage } from '../pages/manager/ManagerTasksPage';
import { ManagerOvertimePage } from '../pages/manager/ManagerOvertimePage';
import { ManagerAgentPage } from '../pages/manager/ManagerAgentPage';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRole?: 'manager' | 'employee';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'manager' ? '/manager' : '/employee'} replace />;
  }

  return children;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      {/* Employee Portal Routes */}
      <Route
        path="/employee"
        element={
          <ProtectedRoute allowedRole="employee">
            <EmployeeLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<EmployeeDashboard />} />
        <Route path="tasks" element={<EmployeeTasksPage />} />
        <Route path="tasks/new" element={<EmployeeTasksPage />} />
        <Route path="overtime" element={<EmployeeOvertimePage />} />
      </Route>

      {/* Manager Portal Routes */}
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRole="manager">
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerOverviewPage />} />
        <Route path="capacity" element={<ManagerCapacityPage />} />
        <Route path="tasks" element={<ManagerTasksPage />} />
        <Route path="overtime" element={<ManagerOvertimePage />} />
        <Route path="agent" element={<ManagerAgentPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
