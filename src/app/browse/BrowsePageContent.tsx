'use client';

import { useState, useEffect } from 'react';
import { searchPrompts } from '@/lib/prompts-client';
import { PROMPT_CATEGORIES, PromptCategory, Prompt } from '@/data/schema';
import PromptGrid from '@/components/PromptGrid';
import SearchFilters from '@/components/SearchFilters';
import { useSearchParams } from 'next/navigation';

type FilterState = {
  query: string;
  category: PromptCategory | '';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | '';
  minRating: number | '';
};

export default function BrowsePageContent() {
  const searchParams = useSearchParams();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Get initial filters from URL params
  const [filters, setFilters] = useState<FilterState>({
    query: searchParams.get('query') || '',
    category: (searchParams.get('category') as PromptCategory) || '',
    difficulty: (searchParams.get('difficulty') as 'beginner' | 'intermediate' | 'advanced') || '',
    minRating: searchParams.get('minRating') ? Number(searchParams.get('minRating')) : '',
  });

  // Load prompts based on current filters
  const loadPrompts = async (page = 1) => {
    setLoading(true);
    try {
      const result = searchPrompts({
        query: filters.query,
        category: filters.category || undefined,
        difficulty: filters.difficulty || undefined,
        minRating: filters.minRating || undefined,
        page,
        limit: 12,
      });
      
      setPrompts(result.prompts);
      setTotalResults(result.total);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading prompts:', error);
      setPrompts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  // Load prompts on mount and filter changes
  useEffect(() => {
    loadPrompts(1);
  }, [filters]);

  // Handle search
  const handleSearch = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  // Handle category filter
  const handleCategoryFilter = (category: PromptCategory | '') => {
    setFilters(prev => ({ ...prev, category }));
  };

  // Handle difficulty filter
  const handleDifficultyFilter = (difficulty: 'beginner' | 'intermediate' | 'advanced' | '') => {
    setFilters(prev => ({ ...prev, difficulty }));
  };

  // Handle rating filter
  const handleRatingFilter = (minRating: number | '') => {
    setFilters(prev => ({ ...prev, minRating }));
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    loadPrompts(page);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = Math.ceil(totalResults / 12);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Browse Prompts
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover field-tested AI prompts from the community. Search, filter, and find exactly what you need.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <SearchFilters
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        onDifficultyFilter={handleDifficultyFilter}
        onRatingFilter={handleRatingFilter}
        currentQuery={filters.query}
        currentCategory={filters.category}
        currentDifficulty={filters.difficulty}
        currentRating={filters.minRating}
      />

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {loading ? 'Loading...' : `${totalResults} prompt${totalResults === 1 ? '' : 's'} found`}
            </h2>
            {filters.query && (
              <p className="text-sm text-gray-600 mt-1">
                Results for "{filters.query}"
              </p>
            )}
          </div>
          
          {/* Sort Options (Future Enhancement) */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="popular">Most Popular</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        {/* Prompt Grid */}
        <PromptGrid 
          prompts={prompts} 
          loading={loading}
          emptyMessage={
            filters.query || filters.category || filters.difficulty || filters.minRating
              ? "No prompts match your current filters. Try adjusting your search criteria."
              : "No prompts available yet. Be the first to submit one!"
          }
        />

        {/* Pagination */}
        {totalPages > 1 && !loading && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
