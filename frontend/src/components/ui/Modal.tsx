import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
  className
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#141a32]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={cn(
        'relative w-full bg-[#fcf9f8] architectural-border shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden rounded-none animate-in fade-in zoom-in-95 duration-150',
        maxWidthClasses[maxWidth],
        className
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 architectural-border-b bg-[#ffffff]">
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#141a32]">
              {title}
            </h3>
            {subtitle && (
              <p className="font-sans text-xs text-[#76767e] uppercase tracking-wider mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#76767e] hover:text-[#141a32] hover:bg-[#f0eded] transition-colors rounded-none"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-grow font-sans text-[#1b1b1c]">
          {children}
        </div>
      </div>
    </div>
  );
};
