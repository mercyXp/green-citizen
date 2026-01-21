import React from 'react';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode;
  className?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export interface FormGroupProps {
  children: React.ReactNode;
  className?: string;
}

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  success?: string;
  className?: string;
}

export interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  success?: string;
  className?: string;
}

export interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  success?: string;
  className?: string;
  children: React.ReactNode;
}

export interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

export interface FormHelperProps {
  children: React.ReactNode;
  className?: string;
}

// Main Form Component
export const Form: React.FC<FormProps> & {
  Group: React.FC<FormGroupProps>;
  Label: React.FC<FormLabelProps>;
  Input: React.FC<FormInputProps>;
  Textarea: React.FC<FormTextareaProps>;
  Select: React.FC<FormSelectProps>;
  Error: React.FC<FormErrorProps>;
  Helper: React.FC<FormHelperProps>;
} = ({ children, className = '', onSubmit, ...props }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form 
      className={`space-y-6 ${className}`}
      onSubmit={handleSubmit}
      {...props}
    >
      {children}
    </form>
  );
};

// Form Group - wraps label + input + error/helper
const FormGroup: React.FC<FormGroupProps> = ({ children, className = '' }) => (
  <div className={`w-full ${className}`}>
    {children}
  </div>
);

// Form Label
const FormLabel: React.FC<FormLabelProps> = ({ 
  children, 
  required = false,
  className = '',
  ...props 
}) => (
  <label 
    className={`block mb-2 text-sm font-medium ${className}`}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

// Form Input
const FormInput: React.FC<FormInputProps> = ({
  error,
  success,
  className = '',
  ...props
}) => {
  const inputClasses = `input ${
    error ? 'input-error' : success ? 'input-valid' : ''
  } ${className}`;

  return (
    <input
      className={inputClasses}
      {...props}
    />
  );
};

// Form Textarea
const FormTextarea: React.FC<FormTextareaProps> = ({
  error,
  success,
  className = '',
  ...props
}) => {
  const textareaClasses = `input ${
    error ? 'input-error' : success ? 'input-valid' : ''
  } ${className}`;

  return (
    <textarea
      className={textareaClasses}
      {...props}
    />
  );
};

// Form Select
const FormSelect: React.FC<FormSelectProps> = ({
  error,
  success,
  className = '',
  children,
  ...props
}) => {
  const selectClasses = `input ${
    error ? 'input-error' : success ? 'input-valid' : ''
  } ${className}`;

  return (
    <select
      className={selectClasses}
      {...props}
    >
      {children}
    </select>
  );
};

// Form Error Message
const FormError: React.FC<FormErrorProps> = ({ children, className = '' }) => (
  <p className={`error-message ${className}`}>
    {children}
  </p>
);

// Form Helper Text
const FormHelper: React.FC<FormHelperProps> = ({ children, className = '' }) => (
  <p className={`mt-1 text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

// Attach subcomponents
Form.Group = FormGroup;
Form.Label = FormLabel;
Form.Input = FormInput;
Form.Textarea = FormTextarea;
Form.Select = FormSelect;
Form.Error = FormError;
Form.Helper = FormHelper;

export default Form;