// Client-side version of prompts utilities
// This works in the browser since it doesn't use Node.js fs module

import { Prompt, PromptCategory, SearchParams } from '@/data/schema';

// Import the JSON data directly (this works in browser)
import promptsData from '@/data/prompts.json';

// Cast the imported data to our Prompt type
const PROMPTS_REGISTRY: Prompt[] = promptsData as Prompt[];

// Search prompts with filters (client-side version)
export function searchPrompts(params: SearchParams): { prompts: Prompt[], total: number } {
  const allPrompts = PROMPTS_REGISTRY.filter(p => p.isPublished);
  let filtered = allPrompts;

  // Apply filters
  if (params.category) {
    filtered = filtered.filter(prompt => prompt.category === params.category);
  }

  if (params.difficulty) {
    filtered = filtered.filter(prompt => prompt.difficulty === params.difficulty);
  }

  if (params.minRating !== undefined) {
    filtered = filtered.filter(prompt => prompt.rating >= params.minRating!);
  }

  // Apply text search
  if (params.query) {
    const searchTerms = params.query.toLowerCase().split(' ');
    filtered = filtered.filter(prompt => {
      const searchableText = `${prompt.name} ${prompt.description} ${prompt.tags.join(' ')} ${prompt.author}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  // Sort by downloads (popularity)
  filtered = filtered.sort((a, b) => b.downloads - a.downloads);

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 12;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedPrompts = filtered.slice(startIndex, endIndex);

  return {
    prompts: paginatedPrompts,
    total: filtered.length
  };
}

// Get prompt by ID (client-side version)
export function getPromptById(id: string): Prompt | null {
  const prompt = PROMPTS_REGISTRY.find(p => p.id === id && p.isPublished);
  return prompt || null;
}

// Get popular prompts (client-side version)
export function getPopularPrompts(limit: number = 10): Prompt[] {
  const prompts = PROMPTS_REGISTRY.filter(p => p.isPublished);
  return prompts
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}

// Get prompts by category (client-side version)
export function getPromptsByCategory(category: PromptCategory, limit?: number): Prompt[] {
  const prompts = PROMPTS_REGISTRY.filter(p => p.isPublished && p.category === category);
  const sorted = prompts.sort((a, b) => b.rating - a.rating);
  return limit ? sorted.slice(0, limit) : sorted;
}

// Get overall statistics (client-side version)
export function getOverallStats() {
  const prompts = PROMPTS_REGISTRY.filter(p => p.isPublished);
  const totalPrompts = prompts.length;
  const totalDownloads = prompts.reduce((sum, p) => sum + p.downloads, 0);
  const avgRating = prompts.reduce((sum, p) => sum + p.rating, 0) / totalPrompts;
  const authors = new Set(prompts.map(p => p.author)).size;
  const categories = new Set(prompts.map(p => p.category)).size;

  return {
    totalPrompts,
    totalDownloads,
    avgRating: Number(avgRating.toFixed(1)),
    totalAuthors: authors,
    totalCategories: categories
  };
}
