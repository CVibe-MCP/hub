'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Package, Plus, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/browse', label: 'Browse packages' },
    { href: '/publish', label: 'Publish' },
    { href: '/docs', label: 'Docs' },
    { href: 'https://discord.gg/xtzRyfky', label: 'Community', external: true },
  ];

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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                className={`inline-flex items-center space-x-1 text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-[#007BFF]'
                    : 'text-gray-700 hover:text-[#007BFF]'
                } ${item.external ? 'hover:text-[#5865F2]' : ''}`}
              >
                {item.icon && <item.icon size={16} />}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search packages"
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] w-48 text-sm"
              />
            </div>
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
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  className={`inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-[#007BFF]'
                      : 'text-gray-700 hover:text-[#007BFF]'
                  } ${item.external ? 'hover:text-[#5865F2]' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon && <item.icon size={16} />}
                  <span>{item.label}</span>
                </Link>
              ))}
              
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search packages"
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}