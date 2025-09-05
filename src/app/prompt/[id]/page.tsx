import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPromptById, getPromptsByCategory } from '@/lib/prompts-client';
import { CATEGORY_INFO, Prompt } from '@/data/schema';
import { formatNumber, formatRelativeTime } from '@/lib/utils';
import { 
  ArrowLeft, 
  Download, 
  Star, 
  User, 
  Calendar, 
  Tag, 
  ExternalLink
} from 'lucide-react';
import CopyButton from '@/components/CopyButton';

// 🔥 NEXT.JS FEATURE: Dynamic Route Props
// The [id] folder name becomes a parameter!
interface PromptDetailPageProps {
  params: Promise<{
    id: string; // This comes from the URL: /prompt/[id]
  }>;
}

export default async function PromptDetailPage({ params }: PromptDetailPageProps) {
  // 🔥 NEXT.JS 15 FEATURE: params must be awaited
  const { id } = await params;
  
  // Get the prompt by ID from URL
  const prompt = getPromptById(id);

  // 🔥 NEXT.JS FEATURE: notFound() function
  // Shows 404 page if prompt doesn't exist
  if (!prompt) {
    notFound();
  }

  // Get related prompts from same category (get more to ensure we have enough after filtering)
  const relatedPrompts = getPromptsByCategory(prompt.category, 6)
    .filter(p => p.id !== prompt.id) // Don't include current prompt
    .slice(0, 3); // Take max 3 for clean layout

  const categoryInfo = CATEGORY_INFO[prompt.category];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/browse"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Browse</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {prompt.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {prompt.description}
              </p>
              
              {/* Category Badge */}
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${categoryInfo.color}`}>
                <span className="mr-1">{categoryInfo.icon}</span>
                {categoryInfo.name}
              </span>
            </div>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Star size={16} fill="currentColor" className="text-yellow-400" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{prompt.rating}</div>
              <div className="text-xs text-gray-600">Rating</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Download size={16} className="text-blue-500" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{formatNumber(prompt.downloads)}</div>
              <div className="text-xs text-gray-600">Downloads</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <User size={16} className="text-green-500" />
              </div>
              <div className="text-lg font-semibold text-gray-900">{prompt.author}</div>
              <div className="text-xs text-gray-600">Author</div>
            </div>
            
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center mb-1">
                <Calendar size={16} className="text-purple-500" />
              </div>
              <div className="text-lg font-semibold text-gray-900">v{prompt.version}</div>
              <div className="text-xs text-gray-600">Version</div>
            </div>
          </div>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {prompt.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-sm font-medium"
                  >
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <span className="font-medium">Difficulty:</span>{' '}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ml-1 ${
                prompt.difficulty === 'beginner' 
                  ? 'bg-green-100 text-green-700'
                  : prompt.difficulty === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-red-100 text-red-700'
              }`}>
                {prompt.difficulty}
              </span>
            </div>
            <div>
              <span className="font-medium">License:</span> {prompt.license}
            </div>
            <div>
              <span className="font-medium">Updated:</span> {formatRelativeTime(prompt.updatedAt)}
            </div>
          </div>
        </div>

        {/* Prompt Content */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Prompt Content</h2>
            <CopyButton content={prompt.content} />
          </div>
          
          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-6 font-mono text-sm leading-relaxed whitespace-pre-wrap border">
              {prompt.content}
            </div>
          </div>
        </div>

        {/* Related Prompts */}
        {relatedPrompts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related Prompts
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPrompts.map((relatedPrompt) => (
                <RelatedPromptCard key={relatedPrompt.id} prompt={relatedPrompt} />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <CopyButton 
              content={prompt.content}
              className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              showIcon={true}
            />
            
            <Link
              href="/browse"
              className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <ArrowLeft size={16} />
              <span>Browse More Prompts</span>
            </Link>

            {prompt.sourceUrl && (
              <a
                href={prompt.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <ExternalLink size={16} />
                <span>View Source</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Simplified card component for related prompts section
function RelatedPromptCard({ prompt }: { prompt: Prompt }) {
  const categoryInfo = CATEGORY_INFO[prompt.category];
  
  return (
    <Link href={`/prompt/${prompt.id}`} className="block">
      <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 p-4 h-full group cursor-pointer">
        {/* Header with category badge */}
        <div className="flex items-start gap-2 mb-2">
          <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 flex-1">
            {prompt.name}
          </h3>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color} shrink-0`}>
            {categoryInfo.icon}
          </span>
        </div>

        {/* Description - more compact */}
        <p className="text-gray-600 text-xs line-clamp-2 mb-2 leading-relaxed">
          {prompt.description}
        </p>

        {/* Compact stats row */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <User size={10} />
              <span className="truncate max-w-[60px]">{prompt.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Star size={10} fill="currentColor" className="text-yellow-400" />
              <span>{prompt.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-1 text-gray-400">
            <Download size={10} />
            <span>{formatNumber(prompt.downloads)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

