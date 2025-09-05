import Link from 'next/link';
import { Search, Filter, Download, Calendar } from 'lucide-react';

export default function BrowsePage() {
  // Mock data - replace with real data later
  const packages = [
    {
      name: '@example/code-reviewer',
      version: '1.2.0',
      description: 'Comprehensive code review prompts for multiple languages',
      downloads: '1.2k',
      updated: '2 days ago',
      keywords: ['code-review', 'javascript', 'typescript'],
    },
    {
      name: '@example/ts-refactor', 
      version: '2.1.4',
      description: 'TypeScript refactoring and modernization prompts',
      downloads: '856',
      updated: '5 days ago',
      keywords: ['typescript', 'refactoring', 'modernization'],
    },
    {
      name: '@example/docs-writer',
      version: '1.0.8', 
      description: 'Generate comprehensive documentation for your codebase',
      downloads: '2.3k',
      updated: '1 week ago',
      keywords: ['documentation', 'jsdoc', 'markdown'],
    },
  ];

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
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search packages..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
              <Filter size={16} />
              <span>Filter</span>
            </button>
            
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Sort by relevance</option>
              <option>Sort by downloads</option>
              <option>Sort by updated</option>
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {packages.map((pkg) => (
            <Link
              key={pkg.name}
              href={`/package/${pkg.name.replace('@', '%40')}`}
              className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-[#007BFF]">
                      {pkg.name}
                    </h3>
                    <span className="text-sm text-gray-500">v{pkg.version}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{pkg.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Download size={16} />
                      <span>{pkg.downloads} weekly downloads</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>Updated {pkg.updated}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
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

        {/* Load more */}
        <div className="text-center mt-8">
          <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Load more packages
          </button>
        </div>
      </div>
    </div>
  );
}