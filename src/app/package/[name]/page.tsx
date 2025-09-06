'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Package, Calendar, User, Code2, Copy, Loader2, AlertCircle, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { apiClient } from '@/lib/api';
import { ApiPromptResponse } from '@/lib/types';

interface PageProps {
  params: Promise<{
    name: string;
  }>;
}

export default function PackagePage({ params }: PageProps) {
  const [name, setName] = useState<string>('');
  const [decodedName, setDecodedName] = useState<string>('');
  
  const [packageData, setPackageData] = useState<ApiPromptResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyStates, setCopyStates] = useState<{
    install: boolean;
    id: boolean;
    usage: boolean;
  }>({ install: false, id: false, usage: false });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle async params
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      const paramName = resolvedParams.name;
      setName(paramName);
      setDecodedName(decodeURIComponent(paramName));
    };
    resolveParams();
  }, [params]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!decodedName) return;
    const fetchPackage = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try to get by ID (if the name looks like an ID)
        if (decodedName.match(/^[a-zA-Z0-9_-]+$/)) {
          try {
            const response = await apiClient.getPrompt(decodedName);
            setPackageData(response);
            return;
          } catch (idError) {
            // If ID lookup fails, continue to search by name
          }
        }
        
        // Search by name
        const searchResponse = await apiClient.searchPrompts({ 
          query: decodedName,
          limit: 50 
        });
        
        // Find exact match by name
        const exactMatch = searchResponse.prompts.find(
          p => p.name.toLowerCase() === decodedName.toLowerCase()
        );
        
        if (exactMatch) {
          setPackageData(exactMatch);
        } else {
          // If no exact match, try partial match
          const partialMatch = searchResponse.prompts.find(
            p => p.name.toLowerCase().includes(decodedName.toLowerCase())
          );
          
          if (partialMatch) {
            setPackageData(partialMatch);
          } else {
            setError('Package not found');
          }
        }
      } catch (err) {
        console.error('Error fetching package:', err);
        setError(err instanceof Error ? err.message : 'Failed to load package');
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [decodedName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-[#007BFF]" />
            <span className="ml-2 text-gray-600">Loading package...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !packageData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Package not found</h3>
              <p className="text-gray-600 mb-4">
                {error || `Could not find package "${decodedName}"`}
              </p>
              <Link
                href="/browse"
                className="bg-[#007BFF] text-white px-4 py-2 rounded-lg hover:bg-[#0056b3] transition-colors"
              >
                Browse packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { content } = packageData;
  const cvibe = content.cvibe;

  // Calculate relative time
  const updatedDate = new Date(packageData.updatedAt);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let timeAgo: string;
  if (diffInDays === 0) {
    timeAgo = 'today';
  } else if (diffInDays === 1) {
    timeAgo = '1 day ago';
  } else if (diffInDays < 7) {
    timeAgo = `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    timeAgo = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    timeAgo = months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    timeAgo = years === 1 ? '1 year ago' : `${years} years ago`;
  }

  // Helper function to show toast and update copy state
  const showCopyFeedback = (type: 'install' | 'id' | 'usage', message: string) => {
    setCopyStates(prev => ({ ...prev, [type]: true }));
    setToastMessage(message);
    
    // Reset copy state after 2 seconds
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [type]: false }));
    }, 2000);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText(`cvibe get ${packageData?.id}`);
      showCopyFeedback('install', 'Install command copied to clipboard!');
    } catch (err) {
      setToastMessage('Failed to copy to clipboard');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(packageData?.id || '');
      showCopyFeedback('id', 'Package ID copied to clipboard!');
    } catch (err) {
      setToastMessage('Failed to copy to clipboard');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCopyUsage = async () => {
    try {
      await navigator.clipboard.writeText(`cvibe get ${packageData?.id}`);
      showCopyFeedback('usage', 'Usage command copied to clipboard!');
    } catch (err) {
      setToastMessage('Failed to copy to clipboard');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Link href="/" className="hover:text-[#007BFF]">cvibe</Link>
            <span>/</span>
            <span className="font-medium">{packageData.name}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {packageData.name}
              </h1>
              <p className="text-gray-600 text-lg mb-4">{content.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Updated {timeAgo}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User size={16} />
                  <span>{content.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Package size={16} />
                  <span>{cvibe.category}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900 mb-2">
                {cvibe.difficulty}
              </div>
              <div className="space-y-2">
                <button 
                  onClick={handleCopyInstall}
                  className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    copyStates.install 
                      ? 'bg-green-500 text-white' 
                      : 'bg-[#007BFF] text-white hover:bg-[#0056CC]'
                  }`}
                >
                  {copyStates.install ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copyStates.install ? 'Copied!' : 'Copy Install'}</span>
                </button>
                <button 
                  onClick={handleCopyId}
                  className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                    copyStates.id
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {copyStates.id ? <Check size={16} /> : <Code2 size={16} />}
                  <span>{copyStates.id ? 'Copied!' : 'Copy ID'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Usage */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Usage</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500 text-sm">Ask your AI:</span>
                    <code className="text-gray-900 font-medium">cvibe get {packageData.id}</code>
                  </div>
                  <button 
                    onClick={handleCopyUsage}
                    className={`transition-colors ${
                      copyStates.usage 
                        ? 'text-green-600' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    title="Copy to clipboard"
                  >
                    {copyStates.usage ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* README */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">README</h2>
              <div className="prose prose-sm max-w-none bg-white border border-gray-200 rounded-lg p-6">
                <div className="markdown-content">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({...props}) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0" {...props} />,
                      h2: ({...props}) => <h2 className="text-xl font-semibold text-gray-900 mb-3 mt-5 first:mt-0" {...props} />,
                      h3: ({...props}) => <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4 first:mt-0" {...props} />,
                      h4: ({...props}) => <h4 className="text-base font-semibold text-gray-900 mb-2 mt-3 first:mt-0" {...props} />,
                      p: ({...props}) => <p className="text-gray-700 mb-4 leading-relaxed" {...props} />,
                      ul: ({...props}) => <ul className="list-disc list-inside mb-4 text-gray-700 space-y-1" {...props} />,
                      ol: ({...props}) => <ol className="list-decimal list-inside mb-4 text-gray-700 space-y-1" {...props} />,
                      li: ({...props}) => <li className="leading-relaxed" {...props} />,
                      code: ({...props}) => {
                        const { children, className } = props;
                        const isInline = !className || !className.includes('language-');
                        return isInline ? (
                          <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props} />
                        ) : (
                          <code className="block bg-gray-50 text-gray-800 p-3 rounded-lg text-sm font-mono overflow-x-auto" {...props} />
                        );
                      },
                      pre: ({...props}) => <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto mb-4" {...props} />,
                      blockquote: ({...props}) => <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600 mb-4" {...props} />,
                      a: ({...props}) => <a className="text-blue-600 hover:text-blue-800 underline" {...props} />,
                      strong: ({...props}) => <strong className="font-semibold text-gray-900" {...props} />,
                      em: ({...props}) => <em className="italic" {...props} />,
                      table: ({...props}) => <table className="min-w-full border border-gray-200 rounded-lg mb-4" {...props} />,
                      thead: ({...props}) => <thead className="bg-gray-50" {...props} />,
                      th: ({...props}) => <th className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900" {...props} />,
                      td: ({...props}) => <td className="border border-gray-200 px-4 py-2 text-gray-700" {...props} />,
                    }}
                  >
                    {packageData.readme}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* Prompt Content */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Prompt Content</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {content.prompt}
                </pre>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Package Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID</span>
                    <code className="text-xs bg-gray-100 px-1 rounded">{packageData.id}</code>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">License</span>
                    <span className="font-medium">{content.license || 'MIT'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty</span>
                    <span className="font-medium">{cvibe.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium">{cvibe.category}</span>
                  </div>
                </div>
              </div>

              {/* Model Compatibility */}
              {(cvibe.models.recommended.length > 0 || cvibe.models.compatible.length > 0) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Model Compatibility</h3>
                  <div className="space-y-3 text-sm">
                    {cvibe.models.recommended.length > 0 && (
                      <div>
                        <span className="text-gray-600 block mb-1">Recommended:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvibe.models.recommended.map((model) => (
                            <span
                              key={model}
                              className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
                            >
                              {model}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {cvibe.models.compatible.length > 0 && (
                      <div>
                        <span className="text-gray-600 block mb-1">Compatible:</span>
                        <div className="flex flex-wrap gap-1">
                          {cvibe.models.compatible.map((model) => (
                            <span
                              key={model}
                              className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                            >
                              {model}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Required Inputs */}
              {cvibe.inputs.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Inputs</h3>
                  <div className="space-y-2">
                    {cvibe.inputs.map((input) => (
                      <div key={input.name} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <code className="text-sm font-medium text-blue-600">
                            {`{${input.name}}`}
                          </code>
                          <span className="text-xs text-gray-500">{input.type}</span>
                        </div>
                        <p className="text-xs text-gray-600">{input.description}</p>
                        {input.required && (
                          <span className="text-xs text-red-600">Required</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords/Tags */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {cvibe.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/browse?search=${encodeURIComponent(tag)}`}
                      className="bg-blue-50 text-[#007BFF] px-2 py-1 rounded text-xs hover:bg-blue-100 transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-bottom-2 duration-300">
            <Check size={16} className="text-green-400" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}
