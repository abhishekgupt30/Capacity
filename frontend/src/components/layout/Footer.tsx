import React from 'react';
import { ScallopDivider } from '../ui/ScallopDivider';

interface FooterProps {
  showScallop?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ showScallop = true }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full mt-auto relative font-sans">
      {/* Scallop Accent Divider */}
      {showScallop && <ScallopDivider position="bottom" count={24} />}

      <div className="bg-[#f0eded] w-full border-t border-[#141a32]/15">
        <div className="max-w-[1440px] mx-auto px-4 md:px-12 py-10 md:py-12 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="font-serif text-2xl font-bold text-[#141a32] tracking-tight">
              Capacita.ai
            </div>

          </div>

          <div className="pt-6 border-t border-[#141a32]/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs text-[#46464d]">
            <p>
              © {currentYear} Capacita.ai. Precision Optimization for the Intelligent Enterprise.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
