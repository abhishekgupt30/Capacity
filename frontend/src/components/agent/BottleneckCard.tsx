import React from 'react';
import { BottleneckReport } from '../../types';
import { Button } from '../ui/Button';
import { AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BottleneckCardProps {
  bottleneck: BottleneckReport;
  onResolveClick: () => void;
  className?: string;
}

export const BottleneckCard: React.FC<BottleneckCardProps> = ({
  bottleneck,
  onResolveClick,
  className
}) => {
  return (
    <section className={cn(
      'architectural-border bg-[#f6f3f2] p-6 md:p-8 relative overflow-hidden font-sans',
      className
    )}>
      {/* Decorative architectural slant */}
      <div className="absolute top-0 right-0 w-64 h-full bg-[#cac6be]/20 skew-x-12 translate-x-16 pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex gap-4 md:gap-6 items-start">
          <div className="w-12 h-12 bg-[#497cff] text-white flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#ba1a1a] bg-[#ffdad6] px-2 py-0.5">
                CRITICAL BOTTLENECK
              </span>
              <span className="text-xs text-[#76767e] font-mono">
                POD: {bottleneck.podName}
              </span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold text-[#141a32] mb-2">
              {bottleneck.title}
            </h3>
            <p className="text-xs md:text-sm text-[#46464d] max-w-3xl leading-relaxed">
              {bottleneck.description}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-3 w-full lg:w-auto">
          <Button
            variant="primary"
            size="md"
            className="w-full lg:w-auto"
            onClick={onResolveClick}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Let Agent Resolve
          </Button>
        </div>
      </div>
    </section>
  );
};
