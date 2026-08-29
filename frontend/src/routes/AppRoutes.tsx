import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
      <Route path="/employee" element={<EmployeeLayout />}>
        <Route index element={<EmployeeDashboard />} />
        <Route path="tasks" element={<EmployeeTasksPage />} />
        <Route path="tasks/new" element={<EmployeeTasksPage />} />
        <Route path="overtime" element={<EmployeeOvertimePage />} />
      </Route>

      {/* Manager Portal Routes */}
      <Route path="/manager" element={<ManagerLayout />}>
        <Route index element={<ManagerOverviewPage />} />
        <Route path="capacity" element={<ManagerCapacityPage />} />
        <Route path="tasks" element={<ManagerTasksPage />} />
        <Route path="overtime" element={<ManagerOvertimePage />} />
        <Route path="agent" element={<ManagerAgentPage />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
