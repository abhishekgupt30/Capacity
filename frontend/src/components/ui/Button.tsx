import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium uppercase tracking-wider transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-[#141a32] disabled:opacity-50 disabled:cursor-not-allowed rounded-none font-sans select-none';

  const variantStyles = {
    primary: 'bg-[#497cff] text-white hover:bg-[#3b66d4] active:bg-[#2d52b3] border border-[#497cff] shadow-sm',
    secondary: 'bg-transparent text-[#141a32] border border-[#141a32]/25 hover:bg-[#f0eded] hover:border-[#141a32] active:bg-[#eae7e7]',
    outline: 'bg-[#ffffff] text-[#141a32] border border-[#141a32]/20 hover:bg-[#f6f3f2] hover:border-[#141a32]/40',
    danger: 'bg-[#ba1a1a] text-white hover:bg-[#991515] border border-[#ba1a1a]',
    ghost: 'bg-transparent text-[#46464d] hover:text-[#141a32] hover:bg-[#f0eded]/50',
    success: 'bg-[#1b873f] text-white hover:bg-[#156e33] border border-[#1b873f]'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-3.5 py-1.5 gap-1.5 font-semibold tracking-wider',
    md: 'text-[13px] px-5 py-2.5 gap-2 font-semibold tracking-wider',
    lg: 'text-[14px] px-7 py-3.5 gap-2.5 font-semibold tracking-widest'
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
