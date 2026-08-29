import React from 'react';
import { cn } from '../../utils/cn';

interface ScallopDividerProps {
  className?: string;
  position?: 'top' | 'bottom';
  count?: number;
}

export const ScallopDivider: React.FC<ScallopDividerProps> = ({
  className,
  position = 'bottom',
  count = 16
}) => {
  return (
    <div className={cn('w-full overflow-hidden flex select-none pointer-events-none', className)}>
      <div className="flex w-full justify-between items-center h-8 md:h-12 overflow-hidden">
        {Array.from({ length: count }).map((_, i) => {
          const isMidnight = i % 2 === 0;
          return (
            <div
              key={i}
              className={cn(
                'shrink-0 w-8 md:w-16 h-8 md:h-16',
                isMidnight ? 'bg-[#141a32]' : 'bg-[#497cff]',
                position === 'bottom'
                  ? 'rounded-b-full'
                  : 'rounded-t-full'
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
