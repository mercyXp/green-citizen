import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  helperText?: string;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  success,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const inputClasses = `input ${
    error ? 'input-error' : success ? 'input-valid' : ''
  } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block mb-2 text-sm font-medium"
        >
          {label}
        </label>
      )}
      
      <input
        id={inputId}
        className={inputClasses}
        {...props}
      />
      
      {error && (
        <p className="error-message">{error}</p>
      )}
      
      {success && (
        <p className="success-message">{success}</p>
      )}
      
      {helperText && !error && !success && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default Input;