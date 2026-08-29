import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const EmployeeLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcf9f8] text-[#1b1b1c]">
      <Navbar />
      <main className="flex-grow max-w-[1440px] w-full mx-auto px-4 md:px-12 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer showScallop={false} />
    </div>
  );
};
