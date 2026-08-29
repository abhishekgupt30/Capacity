import React from 'react';
import { cn } from '../../utils/cn';
import { CapacityStatus } from '../../types';
import { getCapacityStatus, getCapacityStatusTheme } from '../../utils/capacity';
import { formatHours } from '../../utils/formatting';

export interface CapacityMeterProps {
  allocatedHours: number;
  capacityHours?: number;
  label?: string;
  sublabel?: string;
  showDetails?: boolean;
  showTicks?: boolean;
  size?: 'sm' | 'md' | 'lg';
  status?: CapacityStatus;
  variant?: 'architectural' | 'simple';
  className?: string;
}

export const CapacityMeter: React.FC<CapacityMeterProps> = ({
  allocatedHours,
  capacityHours = 40,
  label,
  sublabel,
  showDetails = true,
  showTicks = true,
  size = 'md',
  status: explicitStatus,
  variant = 'architectural',
  className
}) => {
  const calculatedStatus = explicitStatus || getCapacityStatus(allocatedHours, capacityHours);
  const theme = getCapacityStatusTheme(calculatedStatus);
  const percentage = capacityHours > 0 ? (allocatedHours / capacityHours) * 100 : 0;
  const clampedPercentage = Math.min(percentage, 100);
  const isOverloaded = allocatedHours > capacityHours;

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-8'
  };

  return (
    <div className={cn('w-full flex flex-col gap-1.5', className)}>
      {showDetails && (
        <div className="flex justify-between items-end">
          <div>
            {label && (
              <span className="font-sans text-[11px] uppercase tracking-widest text-[#46464d] block mb-0.5">
                {label}
              </span>
            )}
            {sublabel && (
              <span className="font-serif text-lg font-bold text-[#141a32]">
                {sublabel}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className={cn('font-sans font-bold text-sm tracking-tight', isOverloaded ? 'text-[#ba1a1a]' : 'text-[#141a32]')}>
              {formatHours(allocatedHours)} / {formatHours(capacityHours)}
            </span>
            <span className="text-[11px] text-[#76767e] ml-1 font-sans">
              ({Math.round(percentage)}%)
            </span>
          </div>
        </div>
      )}

      {/* Progress Track */}
      <div className={cn(
        'relative w-full border border-[#141a32]/15 bg-[#ffffff] overflow-hidden flex',
        heightClasses[size]
      )}>
        {/* Segment Markers / Ticks */}
        {showTicks && size === 'lg' && (
          <div className="absolute inset-0 flex justify-between px-[25%] w-full pointer-events-none opacity-25 z-10">
            <div className="w-px h-full bg-[#141a32]"></div>
            <div className="w-px h-full bg-[#141a32]"></div>
            <div className="w-px h-full bg-[#141a32]"></div>
          </div>
        )}

        {/* Animated Bar Fill */}
        <div
          className="h-full transition-all duration-700 ease-out"
          style={{
            width: `${clampedPercentage}%`,
            backgroundColor: theme.barColor
          }}
        />

        {/* Overload Extension Stripe (if over 100%) */}
        {isOverloaded && (
          <div 
            className="h-full bg-[#ba1a1a] opacity-90 animate-pulse"
            style={{ width: `${Math.min(percentage - 100, 30)}%` }}
          />
        )}
      </div>

      {size === 'lg' && (
        <div className="flex justify-between mt-1 font-sans text-[11px] text-[#76767e] uppercase tracking-wider">
          <span>Base Load (0h)</span>
          <span>Target Band (28-34h)</span>
          <span>Peak Threshold ({capacityHours}h)</span>
        </div>
      )}
    </div>
  );
};
