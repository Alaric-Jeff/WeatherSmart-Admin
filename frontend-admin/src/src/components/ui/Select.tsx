import React from 'react';
interface SelectOption {
  value: string;
  label: string;
}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
}
export function Select({
  label,
  options,
  error,
  fullWidth = true,
  className = '',
  id,
  ...props
}: SelectProps) {
  const selectId = id || props.name || Math.random().toString(36).substr(2, 9);
  return <div className={`${fullWidth ? 'w-full' : ''} mb-4`}>
      {label && <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>}
      <select id={selectId} className={`
          block w-full rounded-md border-gray-300 shadow-sm 
          focus:border-blue-500 focus:ring-blue-500 sm:text-sm
          border p-2 bg-white
          ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          ${className}
        `} {...props}>
        {options.map(option => <option key={option.value} value={option.value}>
            {option.label}
          </option>)}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>;
}