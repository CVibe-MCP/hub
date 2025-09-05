'use client';

import { useState } from 'react';
import { PROMPT_CATEGORIES, CATEGORY_INFO, PromptCategory } from '@/data/schema';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchFiltersProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: PromptCategory | '') => void;
  onDifficultyFilter: (difficulty: 'beginner' | 'intermediate' | 'advanced' | '') => void;
  onRatingFilter: (minRating: number | '') => void;
  currentQuery?: string;
  currentCategory?: PromptCategory | '';
  currentDifficulty?: 'beginner' | 'intermediate' | 'advanced' | '';
  currentRating?: number | '';
}

export default function SearchFilters({
  onSearch,
  onCategoryFilter,
  onDifficultyFilter,
  onRatingFilter,
  currentQuery = '',
  currentCategory = '',
  currentDifficulty = '',
  currentRating = ''
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchValue, setSearchValue] = useState(currentQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  const clearAllFilters = () => {
    setSearchValue('');
    onSearch('');
    onCategoryFilter('');
    onDifficultyFilter('');
    onRatingFilter('');
  };

  const hasActiveFilters = currentQuery || currentCategory || currentDifficulty || currentRating;

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search Bar */}
        <div className="flex items-center space-x-4 mb-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search 
                size={20} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              <input
                type="text"
                placeholder="Search prompts by name, description, tags, or author..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
          </form>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "inline-flex items-center space-x-2 px-4 py-3 border rounded-lg text-sm font-medium transition-colors",
              showFilters || hasActiveFilters
                ? "border-blue-300 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            <Filter size={16} />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {[currentQuery, currentCategory, currentDifficulty, currentRating].filter(Boolean).length}
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <X size={16} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={currentCategory}
                  onChange={(e) => onCategoryFilter(e.target.value as PromptCategory | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Categories</option>
                  {PROMPT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {CATEGORY_INFO[category].icon} {CATEGORY_INFO[category].name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={currentDifficulty}
                  onChange={(e) => onDifficultyFilter(e.target.value as 'beginner' | 'intermediate' | 'advanced' | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">All Levels</option>
                  <option value="beginner">🟢 Beginner</option>
                  <option value="intermediate">🟡 Intermediate</option>
                  <option value="advanced">🔴 Advanced</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={currentRating}
                  onChange={(e) => onRatingFilter(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">⭐ 4.5+ Stars</option>
                  <option value="4.0">⭐ 4.0+ Stars</option>
                  <option value="3.5">⭐ 3.5+ Stars</option>
                  <option value="3.0">⭐ 3.0+ Stars</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-sm text-gray-600">Active filters:</span>
            
            {currentQuery && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                <span>Search: "{currentQuery}"</span>
                <button
                  onClick={() => {
                    setSearchValue('');
                    onSearch('');
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            
            {currentCategory && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
                <span>{CATEGORY_INFO[currentCategory].icon} {CATEGORY_INFO[currentCategory].name}</span>
                <button
                  onClick={() => onCategoryFilter('')}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            
            {currentDifficulty && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
                <span>{currentDifficulty}</span>
                <button
                  onClick={() => onDifficultyFilter('')}
                  className="text-green-600 hover:text-green-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}
            
            {currentRating && (
              <span className="inline-flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm">
                <span>{currentRating}+ stars</span>
                <button
                  onClick={() => onRatingFilter('')}
                  className="text-yellow-600 hover:text-yellow-800"
                >
                  <X size={14} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
