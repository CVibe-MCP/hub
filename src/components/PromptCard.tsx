import Link from 'next/link';
import { Prompt, CATEGORY_INFO } from '@/data/schema';
import { formatNumber, formatRelativeTime } from '@/lib/utils';
import { 
  Star, 
  Download, 
  User, 
  Calendar, 
  Tag,
  Copy,
  ArrowRight 
} from 'lucide-react';

interface PromptCardProps {
  prompt: Prompt;
  showFullDescription?: boolean;
}

export default function PromptCard({ prompt, showFullDescription = false }: PromptCardProps) {
  const categoryInfo = CATEGORY_INFO[prompt.category];
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-lg group">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <Link href={`/prompt/${prompt.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {prompt.name}
              </h3>
            </Link>
            <p className="text-sm text-gray-600 mt-1">v{prompt.version}</p>
          </div>
          
          {/* Category Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryInfo.color} shrink-0 ml-2`}>
            <span className="mr-1">{categoryInfo.icon}</span>
            {categoryInfo.name}
          </span>
        </div>

        {/* Description */}
        <p className={`text-gray-700 text-sm leading-relaxed ${showFullDescription ? '' : 'line-clamp-3'}`}>
          {prompt.description}
        </p>
      </div>

      {/* Tags */}
      {prompt.tags.length > 0 && (
        <div className="px-6 pb-4">
          <div className="flex flex-wrap gap-1.5">
            {prompt.tags.slice(0, 4).map((tag) => (
              <span 
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
              >
                <Tag size={12} className="mr-1" />
                {tag}
              </span>
            ))}
            {prompt.tags.length > 4 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{prompt.tags.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            {/* Author */}
            <div className="flex items-center space-x-1">
              <User size={14} />
              <span>{prompt.author}</span>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <Star size={14} fill="currentColor" className="text-yellow-400" />
              <span>{prompt.rating}</span>
            </div>
            
            {/* Downloads */}
            <div className="flex items-center space-x-1">
              <Download size={14} />
              <span>{formatNumber(prompt.downloads)}</span>
            </div>
          </div>

          {/* Updated Date */}
          <div className="flex items-center space-x-1 text-xs">
            <Calendar size={12} />
            <span>{formatRelativeTime(prompt.updatedAt)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 py-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Difficulty Badge */}
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              prompt.difficulty === 'beginner' 
                ? 'bg-green-100 text-green-700'
                : prompt.difficulty === 'intermediate'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}>
              {prompt.difficulty}
            </span>
            
            {/* License */}
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
              {prompt.license}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Copy prompt"
            >
              <Copy size={16} />
            </button>
            
            <Link
              href={`/prompt/${prompt.id}`}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>View</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}