import React from 'react';
import { cn } from '../../utils/cn';

interface PageHeaderProps {
  title: string | React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  tag?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className,
  tag
}) => {
  return (
    <header className={cn('flex flex-col md:flex-row justify-between items-start md:items-end gap-6 architectural-border-b pb-8', className)}>
      <div className="max-w-3xl">
        {tag && (
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-[#76767e] block mb-2">
            {tag}
          </span>
        )}
        <h1 className="font-serif text-4xl md:text-6xl font-bold text-[#141a32] tracking-tight leading-[1.1] mb-3">
          {title}
        </h1>
        {description && (
          <p className="font-sans text-base md:text-lg text-[#46464d] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </header>
  );
};
