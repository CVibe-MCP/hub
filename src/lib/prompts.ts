import { Prompt, PromptCategory, SearchParams, UploadPromptRequest } from '@/data/schema';
import fs from 'fs';
import path from 'path';

// In production, this would be a database
// For POC, we'll use the JSON file
const PROMPTS_FILE = path.join(process.cwd(), 'src/data/prompts.json');

// Load prompts from JSON file
export function loadPrompts(): Prompt[] {
  try {
    const data = fs.readFileSync(PROMPTS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading prompts:', error);
    return [];
  }
}

// Save prompts to JSON file
export function savePrompts(prompts: Prompt[]): void {
  try {
    fs.writeFileSync(PROMPTS_FILE, JSON.stringify(prompts, null, 2));
  } catch (error) {
    console.error('Error saving prompts:', error);
    throw new Error('Failed to save prompts');
  }
}

// Search prompts with filters
export function searchPrompts(params: SearchParams): { prompts: Prompt[], total: number } {
  const allPrompts = loadPrompts().filter(p => p.isPublished);
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

// Get prompt by ID
export function getPromptById(id: string): Prompt | null {
  const prompts = loadPrompts();
  const prompt = prompts.find(p => p.id === id && p.isPublished);
  return prompt || null;
}

// Get popular prompts
export function getPopularPrompts(limit: number = 10): Prompt[] {
  const prompts = loadPrompts().filter(p => p.isPublished);
  return prompts
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, limit);
}

// Get prompts by category
export function getPromptsByCategory(category: PromptCategory, limit?: number): Prompt[] {
  const prompts = loadPrompts().filter(p => p.isPublished && p.category === category);
  const sorted = prompts.sort((a, b) => b.rating - a.rating);
  return limit ? sorted.slice(0, limit) : sorted;
}

// Get prompts by author
export function getPromptsByAuthor(author: string): Prompt[] {
  const prompts = loadPrompts().filter(p => p.isPublished);
  return prompts
    .filter(prompt => prompt.author.toLowerCase() === author.toLowerCase())
    .sort((a, b) => b.downloads - a.downloads);
}

// Generate unique ID for new prompt
export function generatePromptId(name: string): string {
  const baseId = name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
  
  const timestamp = Date.now().toString(36);
  return `${baseId}-${timestamp}`;
}

// Add new prompt
export function addPrompt(promptData: UploadPromptRequest): Prompt {
  const prompts = loadPrompts();
  
  const newPrompt: Prompt = {
    id: generatePromptId(promptData.name),
    name: promptData.name,
    description: promptData.description,
    content: promptData.content,
    category: promptData.category,
    tags: promptData.tags,
    author: promptData.author,
    version: '1.0.0',
    downloads: 0,
    rating: 0,
    language: promptData.language,
    framework: promptData.framework,
    difficulty: promptData.difficulty,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    license: promptData.license,
    isPublished: true, // Auto-publish for POC
    authorEmail: promptData.authorEmail,
    sourceUrl: promptData.sourceUrl
  };

  prompts.push(newPrompt);
  savePrompts(prompts);
  
  return newPrompt;
}

// Get category statistics
export function getCategoryStats() {
  const prompts = loadPrompts().filter(p => p.isPublished);
  const stats = new Map<PromptCategory, { count: number; avgRating: number }>();

  prompts.forEach(prompt => {
    const current = stats.get(prompt.category) || { count: 0, avgRating: 0 };
    current.count++;
    current.avgRating = ((current.avgRating * (current.count - 1)) + prompt.rating) / current.count;
    stats.set(prompt.category, current);
  });

  return Object.fromEntries(stats);
}

// Get overall statistics
export function getOverallStats() {
  const prompts = loadPrompts().filter(p => p.isPublished);
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
