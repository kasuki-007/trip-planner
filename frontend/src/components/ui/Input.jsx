import { forwardRef } from 'react';
import { clsx } from 'clsx';


export const Input = forwardRef(
  ({ label, error, helperText, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1A2E]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-3 py-2 text-sm rounded-lg border bg-white text-[#1A1A2E] placeholder-[#6B7280] transition-all duration-150 outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560] disabled:opacity-50 disabled:cursor-not-allowed',
            error ? 'border-red-500 focus:ring-red-300' : 'border-[#E0E0E0]',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
        {!error && helperText && <p className="text-xs text-[#6B7280]">{helperText}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';


export const Textarea = forwardRef(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1A2E]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={3}
          className={clsx(
            'w-full px-3 py-2 text-sm rounded-lg border bg-white text-[#1A1A2E] placeholder-[#6B7280] resize-none transition-all outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]',
            error ? 'border-red-500' : 'border-[#E0E0E0]',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';



export const Select = forwardRef(
  ({ label, error, options, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-[#1A1A2E]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-3 py-2 text-sm rounded-lg border bg-white text-[#1A1A2E] outline-none focus:ring-2 focus:ring-[#E94560]/30 focus:border-[#E94560]',
            error ? 'border-red-500' : 'border-[#E0E0E0]',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
