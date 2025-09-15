'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, Package, Plus, Menu, X, Book } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems = [
    { href: '/browse', label: 'Browse prompts', icon: Package },
    { href: '/docs', label: 'Read the docs', icon: Book },
    { href: '/submit', label: 'Submit prompt', icon: Plus },
    { href: 'https://discord.gg/xtzRyfky', label: 'Community', external: true },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/browse?search=${encodeURIComponent(query)}`);
    } else {
      router.push('/browse');
    }
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center overflow-hidden">
            <img 
              src="/logo-light.png" 
              alt="Cvibe" 
              className="h-18 w-auto"
              style={{
                objectFit: 'contain',
                objectPosition: 'left center'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className={`inline-flex items-center space-x-1 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#007BFF]'
                      : 'text-gray-700 hover:text-[#007BFF]'
                  } ${item.external ? 'hover:text-[#5865F2]' : ''}`}
                >
                  {Icon && <Icon size={16} />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search prompts"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] w-48 text-sm"
                />
              </div>
            </form>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    className={`inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#007BFF]'
                        : 'text-gray-700 hover:text-[#007BFF]'
                    } ${item.external ? 'hover:text-[#5865F2]' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {Icon && <Icon size={16} />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search prompts"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}