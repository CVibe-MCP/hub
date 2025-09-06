'use client';

import Link from 'next/link';
import { Search, Filter, Download, Calendar, AlertCircle, Loader2, User, Folder, FileText } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchBrowsePackages } from '@/lib/api';
import { BrowsePackage, SearchFilters } from '@/lib/types';

function BrowsePageContent() {
  const searchParams = useSearchParams();
  const [packages, setPackages] = useState<BrowsePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSearchQueryRef = useRef<string>('');

  // Load packages
  const loadPackages = async (filters: SearchFilters = {}, isSearch = false) => {
    try {
      if (isSearch) {
        setIsSearching(true);
      } else {
        setLoading(true);
      }
      setError(null);
      const result = await fetchBrowsePackages(filters);
      setPackages(result.packages);
      setTotal(result.total);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load packages');
      setPackages([]);
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback((query: string) => {
    // Clear existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Don't search if query hasn't changed
    if (query === lastSearchQueryRef.current) {
      return;
    }

    const trimmedQuery = query.trim();
    
    // Set new timeout
    searchTimeoutRef.current = setTimeout(() => {
      lastSearchQueryRef.current = query;
      
      // Only search if query is empty (show all) or has at least 2 characters
      if (trimmedQuery === '' || trimmedQuery.length >= 2) {
        loadPackages({ 
          query: trimmedQuery || undefined,
          limit: 20 
        }, true);
      }
    }, 500); // 500ms debounce for better UX
  }, []);

  // Load more packages
  const loadMore = useCallback(async () => {
    if (!hasMore || loading || loadingMore) return;
    
    try {
      setLoadingMore(true);
      setError(null);
      const result = await fetchBrowsePackages({ 
        query: searchQuery.trim() || undefined,
        limit: 20,
        offset: packages.length 
      });
      setPackages(prev => [...prev, ...result.packages]);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more packages');
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, loading, loadingMore, searchQuery, packages.length]);

  // Handle URL search parameters
  useEffect(() => {
    const urlSearchQuery = searchParams.get('search') || '';
    setSearchQuery(urlSearchQuery);
    lastSearchQueryRef.current = urlSearchQuery;
    loadPackages({ 
      query: urlSearchQuery.trim() || undefined,
      limit: 20 
    });
  }, [searchParams]);

  // Initial load with proper pagination (only if no search params)
  useEffect(() => {
    if (!searchParams.get('search')) {
      loadPackages({ limit: 20 });
    }
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loading && !loadingMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [hasMore, loading, loadingMore, loadMore]);

  // Search effect - triggers debounced search when query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, debouncedSearch]);

  // Handle search form submission (immediate search)
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any pending debounced search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    // Perform immediate search
    lastSearchQueryRef.current = searchQuery;
    loadPackages({ 
      query: searchQuery.trim() || undefined,
      limit: 20 
    }, true);
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    // Clear any pending search timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    // Note: API doesn't support sorting yet, but we keep the UI ready
    lastSearchQueryRef.current = searchQuery;
    loadPackages({ 
      query: searchQuery.trim() || undefined,
      limit: 20 
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse packages
          </h1>
          <p className="text-gray-600">
            Discover and install prompt packages from the community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              {isSearching ? (
                <Loader2 size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#007BFF] animate-spin" />
              ) : (
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              )}
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
              />
            </div>
          </form>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter size={16} />
                <span>Filter</span>
              </button>
              
              <select 
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="relevance">Sort by relevance</option>
                <option value="updated">Sort by updated</option>
                <option value="name">Sort by name</option>
              </select>
            </div>
            
            {total > 0 && (
              <div className="text-sm text-gray-600">
                {packages.length} of {total} packages
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && packages.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-[#007BFF]" />
            <span className="ml-2 text-gray-600">Loading packages...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load packages</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => loadPackages()}
                className="bg-[#007BFF] text-white px-4 py-2 rounded-lg hover:bg-[#0056b3] transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && packages.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600">
              {searchQuery ? `No packages match "${searchQuery}"` : 'No packages available yet'}
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && !error && packages.length > 0 && (
          <div className="space-y-4">
            {packages.map((pkg) => (
              <Link
                key={pkg.id}
                href={`/package/${encodeURIComponent(pkg.name)}`}
                className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-[#007BFF]">
                        {pkg.name}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {pkg.difficulty}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{pkg.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <User size={16} />
                        <span>{pkg.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Folder size={16} />
                        <span>{pkg.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>Updated {pkg.updated}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FileText size={16} />
                        <span>{pkg.license}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {pkg.keywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Infinite scroll trigger and loading indicator */}
        {!error && hasMore && (
          <div ref={observerRef} className="text-center mt-8 py-4">
            {loadingMore && (
              <div className="flex items-center justify-center">
                <Loader2 className="animate-spin h-6 w-6 text-[#007BFF]" />
                <span className="ml-2 text-gray-600">Loading more packages...</span>
              </div>
            )}
          </div>
        )}

        {/* End of results indicator */}
        {!loading && !error && packages.length > 0 && !hasMore && (
          <div className="text-center mt-8 py-4">
            <p className="text-gray-500">You've reached the end of the results</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-[#007BFF]" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </div>
      </div>
    }>
      <BrowsePageContent />
    </Suspense>
  );
}