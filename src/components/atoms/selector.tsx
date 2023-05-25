import React from 'react';

interface SelectorOption {
  value: string;
  label: string;
}

interface SelectorProps {
  options: SelectorOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string | (() => void);
}

export function Selector(props: SelectorProps) {
  const { options, value, onChange, label, error } = props;

  return (
    <div className="mb-4 dark:text-white dark:border-steel w-fill">
      {label && (
        <label
          htmlFor="selector"
          className="block text-gray-700 dark:text-steel font-medium mb-1"
        >
          {label}
        </label>
      )}
      <select
        id="selector"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border-2 border-b-8 border-black p-2 dark:bg-slate dark:border-steel ${
          error ? 'border-red-500' : 'border-2 border-b-8 border-black p-2'
        } px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 w-full`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
