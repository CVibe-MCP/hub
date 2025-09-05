// TypeScript interfaces and types for Cvibe Hub

export interface Prompt {
  // Core fields (from existing MCP)
  id: string;
  name: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  author: string;
  version: string;
  downloads: number;
  rating: number;
  
  // Additional metadata
  language?: string;
  framework?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  createdAt: string;
  updatedAt: string;
  license: string;
  
  // Hub-specific fields
  isPublished: boolean;
  authorEmail?: string; // For contact/verification
  sourceUrl?: string; // Link to original if applicable
}

export const PROMPT_CATEGORIES = [
  'code-generation',
  'debugging',
  'documentation',
  'testing',
  'refactoring',
  'architecture',
  'security',
  'performance',
  'ui-ux',
  'data-analysis',
  'devops',
  'api-design',
  'database',
  'mobile',
  'web',
  'machine-learning',
  'general'
] as const;

export type PromptCategory = typeof PROMPT_CATEGORIES[number];

// API response types
export interface PromptsResponse {
  prompts: Prompt[];
  total: number;
  page: number;
  limit: number;
}

export interface SearchParams {
  query?: string;
  category?: PromptCategory;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  minRating?: number;
  page?: number;
  limit?: number;
}

export interface UploadPromptRequest {
  name: string;
  description: string;
  content: string;
  category: PromptCategory;
  tags: string[];
  author: string;
  authorEmail?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language?: string;
  framework?: string;
  license: string;
  sourceUrl?: string;
}

// Category metadata for display
export interface CategoryInfo {
  id: PromptCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const CATEGORY_INFO: Record<PromptCategory, CategoryInfo> = {
  'code-generation': {
    id: 'code-generation',
    name: 'Code Generation',
    description: 'Generate production-ready code',
    icon: '🔨',
    color: 'bg-blue-100 text-blue-800'
  },
  'debugging': {
    id: 'debugging',
    name: 'Debugging',
    description: 'Systematic debugging and troubleshooting',
    icon: '🐛',
    color: 'bg-red-100 text-red-800'
  },
  'documentation': {
    id: 'documentation',
    name: 'Documentation',
    description: 'Create comprehensive docs and guides',
    icon: '📖',
    color: 'bg-green-100 text-green-800'
  },
  'testing': {
    id: 'testing',
    name: 'Testing',
    description: 'Test strategies and implementation',
    icon: '🧪',
    color: 'bg-purple-100 text-purple-800'
  },
  'refactoring': {
    id: 'refactoring',
    name: 'Refactoring',
    description: 'Code improvement and optimization',
    icon: '♻️',
    color: 'bg-yellow-100 text-yellow-800'
  },
  'architecture': {
    id: 'architecture',
    name: 'Architecture',
    description: 'System design and architecture decisions',
    icon: '🏗️',
    color: 'bg-indigo-100 text-indigo-800'
  },
  'security': {
    id: 'security',
    name: 'Security',
    description: 'Security analysis and hardening',
    icon: '🔒',
    color: 'bg-gray-100 text-gray-800'
  },
  'performance': {
    id: 'performance',
    name: 'Performance',
    description: 'Performance optimization techniques',
    icon: '⚡',
    color: 'bg-orange-100 text-orange-800'
  },
  'ui-ux': {
    id: 'ui-ux',
    name: 'UI/UX',
    description: 'User interface and experience design',
    icon: '🎨',
    color: 'bg-pink-100 text-pink-800'
  },
  'data-analysis': {
    id: 'data-analysis',
    name: 'Data Analysis',
    description: 'Data processing and insights',
    icon: '📊',
    color: 'bg-cyan-100 text-cyan-800'
  },
  'devops': {
    id: 'devops',
    name: 'DevOps',
    description: 'Deployment and infrastructure automation',
    icon: '🚀',
    color: 'bg-emerald-100 text-emerald-800'
  },
  'api-design': {
    id: 'api-design',
    name: 'API Design',
    description: 'API development and documentation',
    icon: '🔌',
    color: 'bg-violet-100 text-violet-800'
  },
  'database': {
    id: 'database',
    name: 'Database',
    description: 'Database design and optimization',
    icon: '🗄️',
    color: 'bg-teal-100 text-teal-800'
  },
  'mobile': {
    id: 'mobile',
    name: 'Mobile',
    description: 'Mobile app development',
    icon: '📱',
    color: 'bg-rose-100 text-rose-800'
  },
  'web': {
    id: 'web',
    name: 'Web',
    description: 'Web development and frameworks',
    icon: '🌐',
    color: 'bg-sky-100 text-sky-800'
  },
  'machine-learning': {
    id: 'machine-learning',
    name: 'Machine Learning',
    description: 'ML/AI model development',
    icon: '🤖',
    color: 'bg-amber-100 text-amber-800'
  },
  'general': {
    id: 'general',
    name: 'General',
    description: 'Multi-purpose and utility prompts',
    icon: '🔧',
    color: 'bg-slate-100 text-slate-800'
  }
};
