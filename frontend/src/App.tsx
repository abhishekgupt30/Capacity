/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CapacityProvider } from './context/CapacityContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CapacityProvider>
          <AppRoutes />
        </CapacityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

