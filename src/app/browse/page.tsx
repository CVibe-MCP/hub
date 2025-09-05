'use client';

import Link from 'next/link';
import { Search, Filter, Download, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchBrowsePackages } from '@/lib/api';
import { BrowsePackage, SearchFilters } from '@/lib/types';

export default function BrowsePage() {
  const [packages, setPackages] = useState<BrowsePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Load packages
  const loadPackages = async (filters: SearchFilters = {}) => {
    try {
      setLoading(true);
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
    }
  };

  // Initial load
  useEffect(() => {
    loadPackages();
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadPackages({ 
      query: searchQuery.trim() || undefined,
      limit: 20 
    });
  };

  // Handle sort change
  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    // Note: API doesn't support sorting yet, but we keep the UI ready
    loadPackages({ 
      query: searchQuery.trim() || undefined,
      limit: 20 
    });
  };

  // Load more packages
  const loadMore = async () => {
    if (!hasMore || loading) return;
    
    try {
      setLoading(true);
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
      setLoading(false);
    }
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
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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
                        <span>👤 {pkg.author}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>📂 {pkg.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>Updated {pkg.updated}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>📄 {pkg.license}</span>
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

        {/* Load more */}
        {!loading && !error && hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loading}
              className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 inline mr-2" />
                  Loading...
                </>
              ) : (
                'Load more packages'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}