import React from 'react';
import { cn } from '../../utils/cn';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
  variant?: 'default' | 'alert' | 'highlight';
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon,
  trend,
  variant = 'default',
  className,
  onClick
}) => {
  const isAlert = variant === 'alert';
  const isHighlight = variant === 'highlight';

  return (
    <div
      onClick={onClick}
      className={cn(
        'architectural-border p-6 md:p-8 flex flex-col justify-between relative transition-all duration-200',
        isAlert ? 'bg-[#ffdad6]/20 border-[#ba1a1a]/30' : isHighlight ? 'bg-[#f0eded]' : 'bg-[#ffffff]',
        onClick ? 'cursor-pointer hover:border-[#497cff] hover:shadow-sm' : '',
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={cn(
          'font-sans text-[11px] uppercase tracking-widest block font-medium',
          isAlert ? 'text-[#ba1a1a]' : 'text-[#46464d]'
        )}>
          {label}
        </span>
        {icon && (
          <div className={cn(
            'text-2xl',
            isAlert ? 'text-[#ba1a1a]' : 'text-[#141a32]'
          )}>
            {icon}
          </div>
        )}
      </div>

      <div className="my-2">
        <div className={cn(
          'font-serif text-3xl md:text-5xl font-bold tracking-tight leading-none',
          isAlert ? 'text-[#ba1a1a]' : 'text-[#141a32]'
        )}>
          {value}
        </div>
        {subtext && (
          <p className="font-sans text-xs text-[#76767e] mt-2 uppercase tracking-wider">
            {subtext}
          </p>
        )}
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-[#141a32]/10 flex items-center justify-between text-xs">
          <span className={cn(
            'font-medium tracking-wide',
            trend.isPositive ? 'text-[#1b873f]' : 'text-[#ba1a1a]'
          )}>
            {trend.value}
          </span>
          <span className="text-[10px] text-[#76767e] uppercase">vs last cycle</span>
        </div>
      )}
    </div>
  );
};
