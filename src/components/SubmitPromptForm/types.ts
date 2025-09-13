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
  description: '', // Optional field - can be empty
  author: '',
  license: 'MIT',
  prompt: '',
  tags: ['general'], // min(1) - provide default tag
  category: 'General', // min(1) - provide default category
  language: undefined, // optional field should be undefined, not empty string
  framework: undefined, // optional field should be undefined, not empty string
  difficulty: 'beginner',
  inputs: [], // can be empty array according to schema
  models: {
    compatible: ['claude-sonnet-4'], // min(1) - provide default compatible model
    recommended: ['claude-sonnet-4'] // min(1) - provide default recommended model
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
  'codellama-34b', 'codellama-13b', 'mistral-7b', 'mixtral-8x7b', 'claude-sonnet-4',
];

/**
 * Input type options
 */
export const INPUT_TYPES: Array<ApiPromptInput['type']> = ['string', 'number', 'boolean', 'array', 'object'];

/**
 * Available license options with human-friendly descriptions
 */
export const LICENSES = [
  { value: 'MIT', description: 'Anyone can use freely' },
  { value: 'Apache-2.0', description: 'Free use with extra protection' },
  { value: 'GPL-3.0', description: 'Free but must share improvements' },
  { value: 'BSD-3-Clause', description: 'Free but must give credit' },
  { value: 'CC0-1.0', description: 'Belongs to the public' },
  { value: 'ISC', description: 'Super simple and free' },
  { value: 'MPL-2.0', description: 'Mix of free and protected' },
  { value: 'LGPL-3.0', description: 'Free for libraries' },
  { value: 'Unlicense', description: 'No restrictions at all' },
];

/**
 * Difficulty options with descriptive labels
 */
export const DIFFICULTY_OPTIONS = [
  { value: 'beginner', label: 'Beginner-friendly prompt' },
  { value: 'intermediate', label: 'Good for experienced users' },
  { value: 'advanced', label: 'Use with care' }
];

/**
 * Language options with "Any" option
 */
export const LANGUAGE_OPTIONS = [
  { value: '', label: 'Any programming language' },
  ...LANGUAGES.map(lang => ({ value: lang, label: lang }))
];

/**
 * Framework options with "Any" option
 */
export const FRAMEWORK_OPTIONS = [
  { value: '', label: 'Any software framework' },
  ...FRAMEWORKS.map(framework => ({ value: framework, label: framework }))
];

/**
 * Category options
 */
export const CATEGORY_OPTIONS = CATEGORIES.map(category => ({ value: category, label: category }));

