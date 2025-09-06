'use client';

import Link from 'next/link';
import { Search, Package, Users, Code, ArrowRight, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchBrowsePackages } from '@/lib/api';
import { BrowsePackage } from '@/lib/types';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
  const [featuredPackages, setFeaturedPackages] = useState<BrowsePackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);

  // Load featured packages
  useEffect(() => {
    const loadFeaturedPackages = async () => {
      try {
        setPackagesLoading(true);
        const result = await fetchBrowsePackages({ limit: 3 });
        setFeaturedPackages(result.packages);
      } catch (error) {
        console.error('Failed to load featured packages:', error);
        setFeaturedPackages([]);
      } finally {
        setPackagesLoading(false);
      }
    };

    loadFeaturedPackages();
  }, []);

  // Auto-clear success messages after 5 seconds
  useEffect(() => {
    if (message && messageType === 'success') {
      const timer = setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, messageType]);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Successfully subscribed!');
        setMessageType('success');
        setEmail('');
      } else {
        setMessage(data.error || 'Failed to subscribe. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                No more copy-pasting prompts. Install and reuse.
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

          {/* Package cards - real data from server */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {packagesLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))
            ) : featuredPackages.length > 0 ? (
              featuredPackages.map((pkg) => (
                <div key={pkg.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{pkg.name}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {pkg.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/package/${encodeURIComponent(pkg.name)}`} 
                      className="text-sm text-[#007BFF] hover:text-[#0056CC] font-medium"
                    >
                      View details →
                    </Link>
                    <span className="text-xs text-gray-500">by {pkg.author}</span>
                  </div>
                </div>
              ))
            ) : (
              // Fallback when no packages available
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500">No packages available yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Join the community
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Connect with developers building better AI workflows with prompts
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50 rounded-lg p-8">
              <div className="w-12 h-12 bg-[#007BFF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Discord Community</h3>
              <p className="text-gray-600 mb-6">
                Join real-time discussions, share prompts, and get help from fellow developers
              </p>
              <a
                href="https://discord.gg/xtzRyfky"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-[#5865F2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#4752C4] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Join Discord</span>
              </a>
            </div>

            <div className="bg-blue-50 rounded-lg p-8">
              <div className="w-12 h-12 bg-[#007BFF] text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Newsletter Updates</h3>
              <p className="text-gray-600 mb-6">
                Stay updated on new prompts, community highlights, and platform updates
              </p>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] disabled:opacity-50"
                />
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#007BFF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0056CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                </button>
                {message && (
                  <div className={`p-3 rounded-lg text-sm font-medium ${
                    messageType === 'success' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {messageType === 'success' && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {message}
                      </div>
                    )}
                    {messageType === 'error' && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {message}
                      </div>
                    )}
                  </div>
                )}
              </form>
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
          </div>
        </div>
      </section>
    </div>
  );
}