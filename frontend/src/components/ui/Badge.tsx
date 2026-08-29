import React from 'react';
import { cn } from '../../utils/cn';
import { CapacityStatus, TaskPriority, TaskStatus, OvertimeStatus } from '../../types';
import { getCapacityStatusTheme, getCapacityStatusLabel } from '../../utils/capacity';

export interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'default' | 'capacity' | 'priority' | 'status' | 'outline';
  capacityStatus?: CapacityStatus;
  priority?: TaskPriority;
  taskStatus?: TaskStatus;
  overtimeStatus?: OvertimeStatus;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  capacityStatus,
  priority,
  taskStatus,
  overtimeStatus,
  className,
  size = 'md'
}) => {
  const sizeStyles = size === 'sm' 
    ? 'text-[10px] px-2 py-0.5 tracking-wider font-semibold' 
    : 'text-[11px] px-2.5 py-1 tracking-wider font-semibold';

  // Capacity status rendering
  if (variant === 'capacity' && capacityStatus) {
    const theme = getCapacityStatusTheme(capacityStatus);
    const label = children || getCapacityStatusLabel(capacityStatus);
    return (
      <span className={cn(
        'inline-flex items-center uppercase border border-current/20 rounded-none font-sans',
        theme.badgeBg,
        theme.badgeText,
        sizeStyles,
        className
      )}>
        <span className="w-1.5 h-1.5 rounded-full mr-1.5 shrink-0" style={{ backgroundColor: theme.accentHex }} />
        {label}
      </span>
    );
  }

  // Priority rendering
  if (variant === 'priority' && priority) {
    const priorityConfig = {
      critical: 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30',
      high: 'bg-amber-100 text-amber-900 border-amber-300',
      medium: 'bg-blue-50 text-[#003ea8] border-blue-200',
      low: 'bg-[#f0eded] text-[#46464d] border-[#c6c6ce]'
    };
    return (
      <span className={cn(
        'inline-flex items-center uppercase border rounded-none font-sans',
        priorityConfig[priority],
        sizeStyles,
        className
      )}>
        {children || priority}
      </span>
    );
  }

  // Task Status rendering
  if (variant === 'status' && taskStatus) {
    const statusConfig = {
      todo: 'bg-[#f6f3f2] text-[#46464d] border-[#76767e]/20',
      in_progress: 'bg-[#dce1ff] text-[#141a32] border-[#141a32]/20',
      review: 'bg-amber-50 text-amber-800 border-amber-300',
      completed: 'bg-green-50 text-[#1b873f] border-green-300'
    };
    const labels = {
      todo: 'To Do',
      in_progress: 'In Progress',
      review: 'Review Required',
      completed: 'Completed'
    };
    return (
      <span className={cn(
        'inline-flex items-center uppercase border rounded-none font-sans',
        statusConfig[taskStatus],
        sizeStyles,
        className
      )}>
        {children || labels[taskStatus]}
      </span>
    );
  }

  // Overtime Status
  if (overtimeStatus) {
    const otConfig = {
      pending: 'bg-amber-50 text-amber-800 border-amber-300',
      approved: 'bg-green-50 text-[#1b873f] border-green-300',
      rejected: 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30'
    };
    return (
      <span className={cn(
        'inline-flex items-center uppercase border rounded-none font-sans',
        otConfig[overtimeStatus],
        sizeStyles,
        className
      )}>
        {children || overtimeStatus}
      </span>
    );
  }

  return (
    <span className={cn(
      'inline-flex items-center uppercase border border-[#141a32]/20 bg-[#ffffff] text-[#141a32] rounded-none font-sans',
      sizeStyles,
      className
    )}>
      {children}
    </span>
  );
};
