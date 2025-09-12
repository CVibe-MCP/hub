import { ApiPromptInput } from '@/lib/types';

/**
 * Form data interface for building prompts
 */
export interface PromptFormData {
  // Basic metadata
  name: string;
  description: string;
  author: string;
  license: string;
  
  // Prompt content
  prompt: string;
  
  // Cvibe configuration
  tags: string[];
  category: string;
  language?: string;
  framework?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Dynamic inputs
  inputs: ApiPromptInput[];
  
  // Model compatibility
  models: {
    compatible: string[];
    recommended: string[];
  };
}

/**
 * Default form data
 */
export const defaultFormData: PromptFormData = {
  name: '',
  description: '',
  author: '',
  license: 'MIT',
  prompt: '',
  tags: [],
  category: '',
  language: '',
  framework: '',
  difficulty: 'beginner',
  inputs: [],
  models: {
    compatible: [],
    recommended: []
  }
};

/**
 * Available categories for prompts
 */
export const CATEGORIES = [
  'Code Generation',
  'Code Review',
  'Documentation',
  'Testing',
  'Debugging',
  'Refactoring',
  'Architecture',
  'Data Analysis',
  'DevOps',
  'Security',
  'UI/UX',
  'General',
  'Other'
];

/**
 * Available programming languages
 */
export const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'Clojure', 'Haskell',
  'SQL', 'HTML', 'CSS', 'Shell', 'PowerShell', 'YAML', 'JSON', 'XML'
];

/**
 * Available frameworks
 */
export const FRAMEWORKS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Express.js', 'FastAPI',
  'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'Flutter',
  'React Native', 'Ionic', 'Electron', 'Tailwind CSS', 'Bootstrap', 'Material-UI'
];

/**
 * Available AI models
 */
export const AI_MODELS = [
  'claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku', 'gpt-4', 'gpt-4-turbo',
  'gpt-3.5-turbo', 'gemini-pro', 'gemini-ultra', 'llama-2-70b', 'llama-2-13b',
  'codellama-34b', 'codellama-13b', 'mistral-7b', 'mixtral-8x7b'
];

/**
 * Input type options
 */
export const INPUT_TYPES: Array<ApiPromptInput['type']> = ['string', 'number', 'boolean', 'array', 'object'];

