import React from 'react';
import { HeroSection } from '../../components/landing/HeroSection';
import { ImpactMetricsBar } from '../../components/landing/ImpactMetricsBar';
import { InteractiveScenes } from '../../components/landing/InteractiveScenes';
import { ExecutiveInsights } from '../../components/landing/ExecutiveInsights';
import { PlatformArchitecture } from '../../components/landing/PlatformArchitecture';

export const LandingPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col">
      <HeroSection />
      <ImpactMetricsBar />
      <InteractiveScenes />
      <ExecutiveInsights />
      <PlatformArchitecture />
    </div>
  );
};
