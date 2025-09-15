// src/components/Input.tsx
import React, { forwardRef } from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  variant?: 'default' | 'filled' | 'outline';
  inputSize?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label, 
  error, 
  variant = 'default', 
  inputSize = 'md',
  className = '',
  ...props 
}, ref) => {
  const baseClasses = "w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-white focus:border-transparent";
  
  const variantClasses = {
    default: "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white",
    filled: "border border-transparent bg-gray-100 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-800 focus:border-gray-300 dark:focus:border-gray-600 text-gray-900 dark:text-white",
    outline: "border-2 border-gray-300 dark:border-gray-600 bg-transparent focus:border-gray-500 dark:focus:border-gray-400 text-gray-900 dark:text-white"
  };
  
  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-3 text-base rounded-xl",
    lg: "px-6 py-4 text-lg rounded-xl"
  };

  const errorClasses = error ? "border-red-500 dark:border-red-400 focus:ring-red-500 dark:focus:ring-red-400" : "";

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        ref={ref}
        {...props}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[inputSize]} ${errorClasses} ${className}`}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
