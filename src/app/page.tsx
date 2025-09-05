import Link from 'next/link';
import { Search, Package, Users, Code, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Main Header - npm style */}
      <section className="bg-gradient-to-br from-blue-50 to-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Like npm, but for prompts
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Reusable, <strong>standardized</strong>, <strong>MCP-native</strong> prompts. Build better AI workflows with the <strong>community</strong>.
            </p>

            {/* Video Placeholder */}
            <div className="bg-gray-100 rounded-lg p-12 max-w-3xl mx-auto mb-8 border-2 border-dashed border-gray-300">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">See Cvibe in Action</h3>
                <p className="text-gray-600">Watch how to install and use prompts in 30 seconds</p>
                <button className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Play Demo Video
                </button>
              </div>
            </div>

            {/* Search Bar - npm style */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search packages"
                  className="w-full pl-12 pr-32 py-3 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#007BFF] text-white px-6 py-2 rounded-lg hover:bg-[#0056CC] transition-colors font-medium">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/browse"
              className="inline-flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-gray-400 transition-colors"
            >
              <Package size={16} />
              <span>Browse packages</span>
            </Link>
            <Link
              href="/publish"
              className="inline-flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:border-gray-400 transition-colors"
            >
              <Code size={16} />
              <span>Publish a package</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Value props - simple and clean */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            Prompt management for developers
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 text-[#007BFF] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reusable packages</h3>
              <p className="text-gray-600">
                No more copy-pasting prompts. Install and reuse with <code className="bg-gray-100 px-2 py-1 rounded text-sm">@username/package-name</code>
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 text-[#007BFF] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">MCP native</h3>
              <p className="text-gray-600">
                Built for Claude Code, Cursor, and other MCP-compatible tools. Drop into your workflow instantly.
              </p>
              {/* Tool compatibility badges */}
              <div className="flex justify-center items-center space-x-4 mt-3">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Claude Code</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Cursor</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Continue</span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-50 text-[#007BFF] rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community driven</h3>
              <p className="text-gray-600">
                Share your best prompts with the developer community. Discover what others are building.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            The problem with prompts today
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Scattered everywhere</h3>
              <p className="text-gray-600 text-sm">Google Docs, screenshots, Slack messages, random GitHub gists</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">No standards</h3>
              <p className="text-gray-600 text-sm">Every prompt is a one-off hack. No versioning, no consistency</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Reinventing wheels</h3>
              <p className="text-gray-600 text-sm">Everyone writes the same prompts over and over again</p>
            </div>
          </div>
        </div>
      </section>

      {/* Available prompts - real data */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Available prompts</h2>
            <Link
              href="/browse"
              className="inline-flex items-center space-x-2 text-[#007BFF] hover:text-[#0056CC] font-medium"
            >
              <span>Browse all</span>
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Package cards - real data without fake stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">React Component Generator Pro</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">v2.1.0</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Generate production-ready React components with TypeScript, tests, and documentation</p>
              <Link href="/browse" className="text-sm text-[#007BFF] hover:text-[#0056CC] font-medium">
                View details →
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">API Debug Detective</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">v1.5.2</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Systematically debug API issues with comprehensive analysis and solutions</p>
              <Link href="/browse" className="text-sm text-[#007BFF] hover:text-[#0056CC] font-medium">
                View details →
              </Link>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">SQL Query Optimizer Pro</h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">v3.0.1</span>
              </div>
              <p className="text-sm text-gray-600 mb-4">Analyze and optimize SQL queries for maximum performance</p>
              <Link href="/browse" className="text-sm text-[#007BFF] hover:text-[#0056CC] font-medium">
                View details →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to stop reinventing prompts?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the shared ecosystem where the best prompts are standardized and reusable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              className="inline-flex items-center justify-center space-x-2 bg-[#007BFF] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0056CC] transition-colors"
            >
              <Package size={18} />
              <span>Browse prompts</span>
            </Link>
            <Link
              href="/publish"
              className="inline-flex items-center justify-center space-x-2 border border-[#007BFF] text-[#007BFF] px-8 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <Code size={18} />
              <span>Contribute a prompt</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}