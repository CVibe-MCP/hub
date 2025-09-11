'use client';

import React, { useState, useCallback } from 'react';
import { Plus, X, AlertCircle, Loader2, Tag, Code, FileText, Hash, Globe, ChevronLeft, ChevronRight, Check } from 'lucide-react';
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
 * Validation errors interface
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Props for the PromptForm component
 */
export interface PromptFormProps {
  /** Initial form data (for editing existing prompts) */
  initialData?: Partial<PromptFormData>;
  /** Whether the form is in loading/submitting state */
  isSubmitting?: boolean;
  /** Callback function called when form is submitted with valid data */
  onSubmit: (data: PromptFormData) => void | Promise<void>;
  /** Optional callback for when form is cancelled */
  onCancel?: () => void;
  /** Optional CSS class name for custom styling */
  className?: string;
}

/**
 * Default form data
 */
const defaultFormData: PromptFormData = {
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
 * Wizard step configuration
 */
interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  fields: string[];
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'basic',
    title: 'Basic Info',
    description: 'Package name, author, and description',
    icon: FileText,
    fields: ['name', 'author', 'license', 'description']
  },
  {
    id: 'prompt',
    title: 'Prompt Content',
    description: 'Write your prompt and define inputs',
    icon: Code,
    fields: ['prompt', 'inputs']
  },
  {
    id: 'configuration',
    title: 'Configuration',
    description: 'Category, difficulty, and technical details',
    icon: Hash,
    fields: ['category', 'difficulty', 'language', 'framework']
  },
  {
    id: 'tags',
    title: 'Tags & Models',
    description: 'Add tags and specify AI model compatibility',
    icon: Tag,
    fields: ['tags', 'models']
  }
];

/**
 * Available categories for prompts
 */
const CATEGORIES = [
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
const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'C', 'Go', 'Rust',
  'PHP', 'Ruby', 'Swift', 'Kotlin', 'Dart', 'Scala', 'Clojure', 'Haskell',
  'SQL', 'HTML', 'CSS', 'Shell', 'PowerShell', 'YAML', 'JSON', 'XML'
];

/**
 * Available frameworks
 */
const FRAMEWORKS = [
  'React', 'Vue', 'Angular', 'Next.js', 'Nuxt.js', 'Svelte', 'Express.js', 'FastAPI',
  'Django', 'Flask', 'Spring', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'Flutter',
  'React Native', 'Ionic', 'Electron', 'Tailwind CSS', 'Bootstrap', 'Material-UI'
];

/**
 * Available AI models
 */
const AI_MODELS = [
  'claude-3.5-sonnet', 'claude-3-opus', 'claude-3-haiku', 'gpt-4', 'gpt-4-turbo',
  'gpt-3.5-turbo', 'gemini-pro', 'gemini-ultra', 'llama-2-70b', 'llama-2-13b',
  'codellama-34b', 'codellama-13b', 'mistral-7b', 'mixtral-8x7b'
];

/**
 * Input type options
 */
const INPUT_TYPES: Array<ApiPromptInput['type']> = ['string', 'number', 'boolean', 'array', 'object'];

/**
 * PromptForm Component - Wizard-based form for creating prompt packages
 */
export const PromptForm: React.FC<PromptFormProps> = ({
  initialData = {},
  isSubmitting = false,
  onSubmit,
  onCancel,
  className = ''
}) => {
  // Form state
  const [formData, setFormData] = useState<PromptFormData>({
    ...defaultFormData,
    ...initialData
  });
  
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [newTag, setNewTag] = useState('');
  const [newCompatibleModel, setNewCompatibleModel] = useState('');
  const [newRecommendedModel, setNewRecommendedModel] = useState('');
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  /**
   * Update form field value
   */
  const updateField = useCallback((field: keyof PromptFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  /**
   * Add a new tag
   */
  const addTag = useCallback(() => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      updateField('tags', [...formData.tags, tag]);
      setNewTag('');
    }
  }, [newTag, formData.tags, updateField]);

  /**
   * Remove a tag
   */
  const removeTag = useCallback((tagToRemove: string) => {
    updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  }, [formData.tags, updateField]);

  /**
   * Add a new input field
   */
  const addInput = useCallback(() => {
    const newInput: ApiPromptInput = {
      name: '',
      type: 'string',
      required: false,
      description: ''
    };
    updateField('inputs', [...formData.inputs, newInput]);
  }, [formData.inputs, updateField]);

  /**
   * Update an input field
   */
  const updateInput = useCallback((index: number, field: keyof ApiPromptInput, value: any) => {
    const updatedInputs = formData.inputs.map((input, i) => 
      i === index ? { ...input, [field]: value } : input
    );
    updateField('inputs', updatedInputs);
  }, [formData.inputs, updateField]);

  /**
   * Remove an input field
   */
  const removeInput = useCallback((index: number) => {
    updateField('inputs', formData.inputs.filter((_, i) => i !== index));
  }, [formData.inputs, updateField]);

  /**
   * Add compatible model
   */
  const addCompatibleModel = useCallback(() => {
    const model = newCompatibleModel.trim();
    if (model && !formData.models.compatible.includes(model)) {
      updateField('models', {
        ...formData.models,
        compatible: [...formData.models.compatible, model]
      });
      setNewCompatibleModel('');
    }
  }, [newCompatibleModel, formData.models, updateField]);

  /**
   * Remove compatible model
   */
  const removeCompatibleModel = useCallback((model: string) => {
    updateField('models', {
      ...formData.models,
      compatible: formData.models.compatible.filter(m => m !== model)
    });
  }, [formData.models, updateField]);

  /**
   * Add recommended model
   */
  const addRecommendedModel = useCallback(() => {
    const model = newRecommendedModel.trim();
    if (model && !formData.models.recommended.includes(model)) {
      updateField('models', {
        ...formData.models,
        recommended: [...formData.models.recommended, model]
      });
      setNewRecommendedModel('');
    }
  }, [newRecommendedModel, formData.models, updateField]);

  /**
   * Remove recommended model
   */
  const removeRecommendedModel = useCallback((model: string) => {
    updateField('models', {
      ...formData.models,
      recommended: formData.models.recommended.filter(m => m !== model)
    });
  }, [formData.models, updateField]);

  /**
   * Validate specific step
   */
  const validateStep = useCallback((stepIndex: number): boolean => {
    const step = WIZARD_STEPS[stepIndex];
    const stepErrors: ValidationErrors = {};

    step.fields.forEach(field => {
      switch (field) {
        case 'name':
          if (!formData.name.trim()) {
            stepErrors.name = 'Package name is required';
          } else {
            const nameRegex = /^[a-z0-9]([a-z0-9\-._])*[a-z0-9]$/;
            if (!nameRegex.test(formData.name.trim())) {
              stepErrors.name = 'Package name must contain only lowercase letters, numbers, hyphens, dots, and underscores';
            }
          }
          break;
        case 'author':
          if (!formData.author.trim()) stepErrors.author = 'Author is required';
          break;
        case 'description':
          if (!formData.description.trim()) stepErrors.description = 'Description is required';
          break;
        case 'prompt':
          if (!formData.prompt.trim()) stepErrors.prompt = 'Prompt content is required';
          break;
        case 'category':
          if (!formData.category.trim()) stepErrors.category = 'Category is required';
          break;
        case 'tags':
          if (formData.tags.length === 0) stepErrors.tags = 'At least one tag is required';
          break;
        case 'inputs':
          formData.inputs.forEach((input, index) => {
            if (!input.name.trim()) {
              stepErrors[`input_${index}_name`] = 'Input name is required';
            }
            if (!input.description.trim()) {
              stepErrors[`input_${index}_description`] = 'Input description is required';
            }
          });
          break;
        case 'models':
          if (formData.models.compatible.length === 0) {
            stepErrors.compatible_models = 'At least one compatible model is required';
          }
          break;
      }
    });

    // Update errors state with step-specific errors
    setErrors(prev => {
      const newErrors = { ...prev };
      
      // Clear existing errors for this step
      step.fields.forEach(field => {
        delete newErrors[field];
        if (field === 'inputs') {
          Object.keys(newErrors).forEach(key => {
            if (key.startsWith('input_')) {
              delete newErrors[key];
            }
          });
        }
        if (field === 'models') {
          delete newErrors.compatible_models;
        }
      });
      
      // Add new errors
      return { ...newErrors, ...stepErrors };
    });

    return Object.keys(stepErrors).length === 0;
  }, [formData]);

  /**
   * Navigate to next step
   */
  const nextStep = useCallback(() => {
    if (validateStep(currentStep)) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      if (currentStep < WIZARD_STEPS.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  }, [currentStep, validateStep]);

  /**
   * Navigate to previous step
   */
  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  /**
   * Navigate directly to a step
   */
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < WIZARD_STEPS.length) {
      setCurrentStep(stepIndex);
    }
  }, []);

  /**
   * Check if step is accessible
   */
  const isStepAccessible = useCallback((stepIndex: number): boolean => {
    if (stepIndex === 0) return true;
    return completedSteps.has(stepIndex - 1) || stepIndex === currentStep;
  }, [completedSteps, currentStep]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async () => {
    // Validate current step first
    if (!validateStep(currentStep)) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [formData, validateStep, currentStep, onSubmit]);

  /**
   * Handle tag input key press
   */
  const handleTagKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  }, [addTag]);

  /**
   * Handle model input key press
   */
  const handleModelKeyPress = useCallback((e: React.KeyboardEvent, type: 'compatible' | 'recommended') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === 'compatible') {
        addCompatibleModel();
      } else {
        addRecommendedModel();
      }
    }
  }, [addCompatibleModel, addRecommendedModel]);

  const currentStepData = WIZARD_STEPS[currentStep];
  const isLastStep = currentStep === WIZARD_STEPS.length - 1;

  return (
    <div className={`max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Prompt Package</h2>
        <p className="text-gray-600">
          Follow the steps below to create a new prompt package for the community.
        </p>
      </div>

      {/* Step Navigation */}
      <div className="px-8 py-4 border-b border-gray-100">
        <nav className="flex justify-between">
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index);
            const isAccessible = isStepAccessible(index);
            
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isAccessible ? goToStep(index) : undefined}
                disabled={!isAccessible || isSubmitting}
                className={`flex-1 flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg mx-1 transition-all ${
                  isActive
                    ? 'bg-[#007BFF] text-white shadow-sm'
                    : isCompleted
                    ? 'bg-green-50 text-green-700 hover:bg-green-100'
                    : isAccessible
                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isCompleted ? (
                    <Check size={16} />
                  ) : (
                    <Icon size={16} />
                  )}
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Step Content */}
      <div className="px-8 py-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <currentStepData.icon className="mr-2" size={20} />
            {currentStepData.title}
          </h3>
          <p className="text-gray-600 mt-1">{currentStepData.description}</p>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Package Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="my-awesome-prompt"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  value={formData.author}
                  onChange={(e) => updateField('author', e.target.value)}
                  placeholder="Your name or username"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] ${
                    errors.author ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.author && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.author}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-2">
                  License
                </label>
                <select
                  id="license"
                  value={formData.license}
                  onChange={(e) => updateField('license', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                  disabled={isSubmitting}
                >
                  <option value="MIT">MIT</option>
                  <option value="Apache-2.0">Apache 2.0</option>
                  <option value="GPL-3.0">GPL 3.0</option>
                  <option value="BSD-3-Clause">BSD 3-Clause</option>
                  <option value="ISC">ISC</option>
                  <option value="CC0-1.0">CC0 1.0</option>
                  <option value="Unlicense">Unlicense</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Describe what this prompt does and when to use it..."
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Prompt Content */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
                Prompt *
              </label>
              <textarea
                id="prompt"
                value={formData.prompt}
                onChange={(e) => updateField('prompt', e.target.value)}
                placeholder="Write your prompt here. You can use variables like {{input_name}} that will be replaced with user inputs..."
                rows={8}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] font-mono text-sm ${
                  errors.prompt ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isSubmitting}
              />
              {errors.prompt && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.prompt}
                </p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Use double curly braces like <code className="bg-gray-100 px-1 rounded">{'{{variable_name}}'}</code> to reference input variables.
              </p>
            </div>

            {/* Dynamic Inputs */}
            <div>
              <h4 className="text-base font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="mr-2" size={16} />
                Input Parameters
              </h4>
              
              <p className="text-sm text-gray-600 mb-4">
                Define input parameters that users can provide when using this prompt.
              </p>
              
              <div className="space-y-4">
                {formData.inputs.map((input, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-medium text-gray-900">Input {index + 1}</h4>
                      <button
                        type="button"
                        onClick={() => removeInput(index)}
                        disabled={isSubmitting}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={input.name}
                          onChange={(e) => updateInput(index, 'name', e.target.value)}
                          placeholder="variable_name"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] ${
                            errors[`input_${index}_name`] ? 'border-red-300' : 'border-gray-300'
                          }`}
                          disabled={isSubmitting}
                        />
                        {errors[`input_${index}_name`] && (
                          <p className="mt-1 text-xs text-red-600">{errors[`input_${index}_name`]}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <select
                          value={input.type}
                          onChange={(e) => updateInput(index, 'type', e.target.value as ApiPromptInput['type'])}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                          disabled={isSubmitting}
                        >
                          {INPUT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <input
                        type="text"
                        value={input.description}
                        onChange={(e) => updateInput(index, 'description', e.target.value)}
                        placeholder="Describe what this input is for..."
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] ${
                          errors[`input_${index}_description`] ? 'border-red-300' : 'border-gray-300'
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors[`input_${index}_description`] && (
                        <p className="mt-1 text-xs text-red-600">{errors[`input_${index}_description`]}</p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={input.required}
                          onChange={(e) => updateInput(index, 'required', e.target.checked)}
                          className="rounded border-gray-300 text-[#007BFF] focus:ring-[#007BFF]"
                          disabled={isSubmitting}
                        />
                        <span className="ml-2 text-sm text-gray-700">Required</span>
                      </label>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addInput}
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus size={16} className="mr-2" />
                  Add Input Parameter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Configuration */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF] ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle size={14} className="mr-1" />
                    {errors.category}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <select
                  id="difficulty"
                  value={formData.difficulty}
                  onChange={(e) => updateField('difficulty', e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                  disabled={isSubmitting}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={formData.language || ''}
                  onChange={(e) => updateField('language', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                  disabled={isSubmitting}
                >
                  <option value="">Any language</option>
                  {LANGUAGES.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-2">
                  Framework
                </label>
                <select
                  id="framework"
                  value={formData.framework || ''}
                  onChange={(e) => updateField('framework', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                  disabled={isSubmitting}
                >
                  <option value="">Any framework</option>
                  {FRAMEWORKS.map(framework => (
                    <option key={framework} value={framework}>{framework}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Tags & Models */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Tags */}
            <div>
              <label htmlFor="new-tag" className="block text-sm font-medium text-gray-700 mb-2">
                Add Tags *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  id="new-tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Enter a tag and press Enter"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={isSubmitting || !newTag.trim()}
                  className="px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        disabled={isSubmitting}
                        className="ml-2 hover:text-blue-600 disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {errors.tags && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.tags}
                </p>
              )}
            </div>

            {/* Compatible Models */}
            <div>
              <label htmlFor="compatible-model" className="block text-sm font-medium text-gray-700 mb-2">
                Compatible Models *
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  id="compatible-model"
                  value={newCompatibleModel}
                  onChange={(e) => setNewCompatibleModel(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                  disabled={isSubmitting}
                >
                  <option value="">Select a model</option>
                  {AI_MODELS.filter(model => !formData.models.compatible.includes(model)).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addCompatibleModel}
                  disabled={isSubmitting || !newCompatibleModel}
                  className="px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              
              {formData.models.compatible.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.models.compatible.map((model, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                    >
                      {model}
                      <button
                        type="button"
                        onClick={() => removeCompatibleModel(model)}
                        disabled={isSubmitting}
                        className="ml-2 hover:text-green-600 disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              {errors.compatible_models && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.compatible_models}
                </p>
              )}
            </div>

            {/* Recommended Models */}
            <div>
              <label htmlFor="recommended-model" className="block text-sm font-medium text-gray-700 mb-2">
                Recommended Models (Optional)
              </label>
              <div className="flex gap-2 mb-3">
                <select
                  id="recommended-model"
                  value={newRecommendedModel}
                  onChange={(e) => setNewRecommendedModel(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007BFF] focus:border-[#007BFF]"
                  disabled={isSubmitting}
                >
                  <option value="">Select a model</option>
                  {formData.models.compatible.filter(model => !formData.models.recommended.includes(model)).map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={addRecommendedModel}
                  disabled={isSubmitting || !newRecommendedModel}
                  className="px-4 py-2 bg-[#007BFF] text-white rounded-lg hover:bg-[#0056CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
              
              {formData.models.recommended.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.models.recommended.map((model, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm"
                    >
                      {model}
                      <button
                        type="button"
                        onClick={() => removeRecommendedModel(model)}
                        disabled={isSubmitting}
                        className="ml-2 hover:text-yellow-600 disabled:opacity-50"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              
              <p className="mt-2 text-sm text-gray-500">
                Recommended models should be a subset of compatible models and represent the best experience.
              </p>
            </div>
          </div>
        )}

        {/* Wizard Navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} className="mr-1" />
                Previous
              </button>
            )}
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">
              Step {currentStep + 1} of {WIZARD_STEPS.length}
            </span>
            
            {isLastStep ? (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2 bg-[#007BFF] text-white font-medium rounded-lg hover:bg-[#0056CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={16} />
                    Creating Package...
                  </>
                ) : (
                  'Create Package'
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-2 bg-[#007BFF] text-white font-medium rounded-lg hover:bg-[#0056CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptForm;
