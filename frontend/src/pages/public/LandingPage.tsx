import React from 'react';
import { HeroSection } from '../../components/landing/HeroSection';
import { PlatformArchitecture } from '../../components/landing/PlatformArchitecture';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <PlatformArchitecture />
    </div>
  );
};
