// API Response Types matching the server structure

export interface ApiPromptInput {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  description: string;
}

export interface ApiPromptModels {
  compatible: string[];
  recommended: string[];
}

export interface ApiPromptCvibe {
  tags: string[];
  inputs: ApiPromptInput[];
  models: ApiPromptModels;
  category: string;
  language?: string;
  framework?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface ApiPromptContent {
  cvibe: ApiPromptCvibe;
  author: string;
  prompt: string;
  license?: string;
  originalId?: string;
  description: string;
}

export interface ApiPromptResponse {
  id: string;
  name: string;
  readme: string;
  content: ApiPromptContent;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiPromptsListResponse {
  prompts: ApiPromptResponse[];
  total: number;
  limit: number;
  offset: number;
}

// Transformed types for the UI (simplified for MVP)
export interface BrowsePackage {
  id: string;
  name: string;
  description: string;
  updated: string;
  keywords: string[];
  author: string;
  category: string;
  difficulty: string;
  license: string;
  downloads: number;
}

// Search/Filter types
export interface SearchFilters {
  query?: string;
  category?: string;
  difficulty?: string;
  limit?: number;
  offset?: number;
}
