import { forwardRef } from 'react';
import { clsx } from 'clsx';


const variantClasses = {
  primary: 'bg-[#1A1A2E] text-white hover:bg-[#16213E] active:bg-[#0F0F1A]',
  secondary: 'bg-[#E94560] text-white hover:bg-[#d63851] active:bg-[#c32e45]',
  ghost: 'bg-transparent text-[#1A1A2E] hover:bg-[#F8F9FA]',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  outline: 'border border-[#E0E0E0] text-[#1A1A2E] bg-white hover:bg-[#F8F9FA]',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-6 py-3 text-base rounded-xl',
};

export const Button = forwardRef(
  ({ variant = 'primary', size = 'md', loading, disabled, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E94560] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
