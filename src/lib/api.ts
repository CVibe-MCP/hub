import { ApiPromptsListResponse, ApiPromptResponse, ApiPromptCreateRequest, ApiPromptCreateResponse, BrowsePackage, SearchFilters } from './types';

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.cvibe.dev/api/v1';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// API Client
export class CvibeApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new ApiError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('Unable to connect to cvibe API. Please ensure the API server is running.');
      }
      
      throw new ApiError(`Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async searchPrompts(filters: SearchFilters = {}): Promise<ApiPromptsListResponse> {
    const params = new URLSearchParams();
    
    if (filters.query) params.append('search', filters.query);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset) params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const endpoint = `/prompts${queryString ? `?${queryString}` : ''}`;
    
    return this.request<ApiPromptsListResponse>(endpoint);
  }

  async getPrompt(id: string): Promise<ApiPromptResponse> {
    return this.request<ApiPromptResponse>(`/prompts/${id}`);
  }

  async createPrompt(promptData: ApiPromptCreateRequest): Promise<ApiPromptCreateResponse> {
    return this.request<ApiPromptCreateResponse>('/prompts', {
      method: 'POST',
      body: JSON.stringify(promptData),
    });
  }
}

// Transform API response to UI-friendly format
export function transformApiPromptToBrowsePackage(apiPrompt: ApiPromptResponse): BrowsePackage {
  const { content } = apiPrompt;
  
  // Calculate a relative time string (simplified)
  const updatedDate = new Date(apiPrompt.updatedAt);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
  
  let updated: string;
  if (diffInDays === 0) {
    updated = 'today';
  } else if (diffInDays === 1) {
    updated = '1 day ago';
  } else if (diffInDays < 7) {
    updated = `${diffInDays} days ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    updated = weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    updated = months === 1 ? '1 month ago' : `${months} months ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    updated = years === 1 ? '1 year ago' : `${years} years ago`;
  }

  return {
    id: apiPrompt.id,
    name: apiPrompt.name,
    description: content.description,
    updated,
    keywords: content.cvibe.tags,
    author: content.author,
    category: content.cvibe.category,
    difficulty: content.cvibe.difficulty,
    license: content.license || 'MIT',
    downloads: apiPrompt.downloads,
  };
}

// Default API client instance
export const apiClient = new CvibeApiClient();

// Utility functions for the browse page
export async function fetchBrowsePackages(filters: SearchFilters = {}): Promise<{
  packages: BrowsePackage[];
  total: number;
  hasMore: boolean;
}> {
  try {
    const response = await apiClient.searchPrompts(filters);

    const packages = response.prompts.map(transformApiPromptToBrowsePackage);
    const hasMore = (filters.offset || 0) + packages.length < response.total;

    return {
      packages,
      total: response.total,
      hasMore,
    };
  } catch (error) {
    console.error('Failed to fetch browse packages:', error);
    throw error;
  }
}
