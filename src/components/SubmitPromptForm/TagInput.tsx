'use client';

import React, { useState } from 'react';
import { X, Star } from 'lucide-react';

export interface TagInputProps {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
  placeholder: string;
  suggestions?: string[];
  recommendedTags?: string[];
  onToggleRecommended?: (tag: string) => void;
  emptyMessage?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  placeholder,
  suggestions = [],
  recommendedTags = [],
  onToggleRecommended,
  emptyMessage = "No tags added yet.",
  className = "",
  error,
  required = false
}) => {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      onAddTag(input.trim());
      setInput('');
      setShowSuggestions(false);
    }
  };

  const getFilteredSuggestions = () => {
    if (!input.trim()) {
      // Show all available suggestions when no input, excluding already selected ones
      return suggestions.filter(suggestion => 
        !tags.includes(suggestion)
      ).slice(0, 8);
    }
    return suggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(input.toLowerCase()) &&
      !tags.includes(suggestion)
    ).slice(0, 5);
  };

  const hasRecommendedFeature = onToggleRecommended && recommendedTags;

  return (
    <div className={className}>
      {/* Input with Autocomplete */}
      <div className="relative mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setShowSuggestions(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 transition-colors ${
            error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-200 focus:ring-blue-500 focus:border-blue-500'
          }`}
        />
        
        {/* Autocomplete Suggestions */}
        {showSuggestions && getFilteredSuggestions().length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
            {getFilteredSuggestions().map(suggestion => (
              <button
                key={suggestion}
                type="button"
                onClick={() => {
                  onAddTag(suggestion);
                  setInput('');
                  setShowSuggestions(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100 last:border-b-0"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {tags.map(tag => {
          const isRecommended = hasRecommendedFeature && recommendedTags.includes(tag);
          const isRegularTag = !hasRecommendedFeature;
          
          return (
            <div
              key={tag}
              className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                isRegularTag
                  ? 'bg-purple-50 text-purple-800 border-purple-200 shadow-sm'
                  : isRecommended 
                    ? 'bg-green-50 text-green-800 border-green-200' 
                    : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              <span className={isRegularTag ? 'font-mono' : ''}>
                {isRegularTag && '#'}{tag}
                {isRecommended && <span className="ml-1 text-xs">(Recommended)</span>}
              </span>
              
              {/* Star button (only for models) */}
              {hasRecommendedFeature && (
                <button
                  type="button"
                  onClick={() => onToggleRecommended!(tag)}
                  className={`transition-colors ${
                    isRecommended 
                      ? 'text-green-600 hover:text-green-800' 
                      : 'text-gray-400 hover:text-yellow-500'
                  }`}
                  title={isRecommended ? 'Remove from recommended' : 'Mark as recommended'}
                >
                  <Star size={14} fill={isRecommended ? 'currentColor' : 'none'} />
                </button>
              )}
              
              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Remove tag"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
        
        {tags.length === 0 && (
          <p className={`text-sm italic ${error ? 'text-red-500' : 'text-gray-500'}`}>
            {error || emptyMessage}
          </p>
        )}
      </div>

      {/* Error message */}
      {error && tags.length > 0 && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};
