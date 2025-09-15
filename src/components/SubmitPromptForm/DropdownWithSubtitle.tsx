'use client';

import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface DropdownOption {
  value: string;
  label?: string;
  description?: string;
}

export interface DropdownWithSubtitleProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  colorScheme?: 'purple' | 'blue' | 'green' | 'orange' | 'red' | 'gray';
  className?: string;
  style?: React.CSSProperties;
}

const colorSchemes = {
  purple: {
    background: 'from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100',
    text: 'text-purple-700',
    border: 'border-purple-200 hover:border-purple-300 focus:ring-purple-500 focus:border-purple-500',
    chevron: 'text-purple-500',
    secondaryText: 'text-purple-600'
  },
  blue: {
    background: 'from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100',
    text: 'text-blue-700',
    border: 'border-blue-200 hover:border-blue-300 focus:ring-blue-500 focus:border-blue-500',
    chevron: 'text-blue-500',
    secondaryText: 'text-blue-600'
  },
  green: {
    background: 'from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100',
    text: 'text-green-700',
    border: 'border-green-200 hover:border-green-300 focus:ring-green-500 focus:border-green-500',
    chevron: 'text-green-500',
    secondaryText: 'text-green-600'
  },
  orange: {
    background: 'from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100',
    text: 'text-orange-700',
    border: 'border-orange-200 hover:border-orange-300 focus:ring-orange-500 focus:border-orange-500',
    chevron: 'text-orange-500',
    secondaryText: 'text-orange-600'
  },
  red: {
    background: 'from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100',
    text: 'text-red-700',
    border: 'border-red-200 hover:border-red-300 focus:ring-red-500 focus:border-red-500',
    chevron: 'text-red-500',
    secondaryText: 'text-red-600'
  },
  gray: {
    background: 'from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100',
    text: 'text-gray-700',
    border: 'border-gray-200 hover:border-gray-300 focus:ring-gray-500 focus:border-gray-500',
    chevron: 'text-gray-500',
    secondaryText: 'text-gray-600'
  }
};

export const DropdownWithSubtitle: React.FC<DropdownWithSubtitleProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  colorScheme = 'purple',
  className = '',
  style = {}
}) => {
  const colors = colorSchemes[colorScheme];
  const selectedOption = options.find(opt => opt.value === value);
  const displayLabel = selectedOption?.label || selectedOption?.value || placeholder;
  const hasDescription = selectedOption?.description;

  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none bg-gradient-to-r ${colors.background} text-transparent px-4 py-3 pr-6 rounded-xl border ${colors.border} cursor-pointer transition-all duration-200 shadow-sm hover:shadow-lg font-medium text-sm`}
        style={{
          height: hasDescription ? '52px' : '44px',
          width: `${Math.max(displayLabel.length * 0.6 + 5, 8)}em`,
          ...style
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label || option.value}
            {option.description ? ` • ${option.description}` : ''}
          </option>
        ))}
      </select>
      
      <div className="absolute left-4 top-1 pointer-events-none" style={{ maxWidth: 'calc(100% - 3rem)' }}>
        {hasDescription ? (
          // Two-line layout for options with descriptions (License)
          <>
            <div className={`${colors.text} font-mono font-semibold text-sm leading-tight whitespace-nowrap overflow-hidden text-ellipsis`}>
              {displayLabel}
            </div>
            <div className={`${colors.secondaryText} text-xs leading-tight mt-0.5 overflow-hidden text-ellipsis`} style={{ fontSize: '10px' }}>
              {selectedOption?.description}
            </div>
          </>
        ) : (
          // Single-line layout for options without descriptions (Category, Difficulty, etc.)
          <div className={`${colors.text} font-medium text-sm leading-tight whitespace-nowrap flex items-center h-full overflow-hidden text-ellipsis`} style={{ paddingTop: '12px' }}>
            {displayLabel}
          </div>
        )}
      </div>
      
      <ChevronDown 
        size={14} 
        className={`absolute right-1.5 top-1/2 transform -translate-y-1/2 ${colors.chevron} pointer-events-none`}
      />
    </div>
  );
};
