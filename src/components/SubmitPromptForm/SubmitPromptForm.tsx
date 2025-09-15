'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Send, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { PromptFormData, defaultFormData, AI_MODELS, INPUT_TYPES, LICENSES, DIFFICULTY_OPTIONS, LANGUAGE_OPTIONS, FRAMEWORK_OPTIONS, CATEGORY_OPTIONS } from './types';
import { ApiPromptInput } from '@/lib/types';
import { DropdownWithSubtitle } from './DropdownWithSubtitle';
import { TagInput } from './TagInput';

/**
 * Props for the SubmitPromptForm component
 */
export interface SubmitPromptFormProps {
  /** Initial form data (for editing existing prompts) */
  initialData?: Partial<PromptFormData>;
  /** Callback function called when form is submitted with valid data */
  onSubmit: (data: PromptFormData) => void | Promise<void>;
  /** Optional CSS class name for custom styling */
  className?: string;
}

/**
 * SubmitPromptForm Component - Minimal, single-page form for submitting prompts
 * 
 * Redesigned for better UX:
 * - Single page instead of wizard steps
 * - Minimal UI with focus on prompt content
 * - Emotionally appealing design
 * - Reduced cognitive load
 */
export const SubmitPromptForm: React.FC<SubmitPromptFormProps> = ({
  initialData = {},
  onSubmit,
  className = ''
}) => {
  // Form state
  const [formData, setFormData] = useState<PromptFormData>({
    ...defaultFormData,
    ...initialData
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validate form on mount and when formData changes
  useEffect(() => {
    validateForm();
  }, [formData]);

  // Update form data
  const updateField = (field: keyof PromptFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when field is updated
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required string fields
    if (!formData.name?.trim()) errors.name = 'Title is required';
    if (!formData.author?.trim()) errors.author = 'Author is required';
    if (!formData.prompt?.trim()) errors.prompt = 'Prompt content is required';
    if (!formData.category?.trim()) errors.category = 'Category is required';

    // Required arrays
    if (!formData.tags || formData.tags.length === 0) {
      errors.tags = 'At least one tag is required';
    }
    if (!formData.models?.compatible || formData.models.compatible.length === 0) {
      errors.models = 'At least one compatible model is required';
    }
    if (!formData.models?.recommended || formData.models.recommended.length === 0) {
      errors.recommendedModels = 'At least one recommended model is required';
    }

    // Validate inputs
    formData.inputs.forEach((input, index) => {
      if (!input.name?.trim()) errors[`input_${index}_name`] = 'Input name is required';
      if (!input.description?.trim()) errors[`input_${index}_description`] = 'Input description is required';
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return; // Don't submit if validation fails
    }

    setIsSubmitting(true);
    try {
      // Prepare form data with "N/A" description if empty
      const submissionData = {
        ...formData,
        description: formData.description.trim() || 'N/A'
      };
      await onSubmit(submissionData);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add/remove tags
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      updateField('tags', [...formData.tags, trimmedTag]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateField('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };


  // Model management functions
  const addModel = (model: string) => {
    if (model.trim() && !formData.models.compatible.includes(model.trim())) {
      updateField('models', {
        compatible: [...formData.models.compatible, model.trim()],
        recommended: formData.models.recommended
      });
    }
  };

  const removeModel = (model: string) => {
    updateField('models', {
      compatible: formData.models.compatible.filter(m => m !== model),
      recommended: formData.models.recommended.filter(m => m !== model)
    });
  };

  const toggleRecommended = (model: string) => {
    const isRecommended = formData.models.recommended.includes(model);
    if (isRecommended) {
      updateField('models', {
        ...formData.models,
        recommended: formData.models.recommended.filter(m => m !== model)
      });
    } else {
      updateField('models', {
        ...formData.models,
        recommended: [...formData.models.recommended, model]
      });
    }
  };


  // Input parameter management
  const addInput = () => {
    const newInput: ApiPromptInput = {
      name: '',
      type: 'string',
      required: true,
      description: ''
    };
    updateField('inputs', [...formData.inputs, newInput]);
  };

  const removeInput = (index: number) => {
    updateField('inputs', formData.inputs.filter((_, i) => i !== index));
  };

  const updateInput = (index: number, field: keyof ApiPromptInput, value: any) => {
    const updatedInputs = formData.inputs.map((input, i) => 
      i === index ? { ...input, [field]: value } : input
    );
    updateField('inputs', updatedInputs);
  };
  
  return (
    <div className={`max-w-3xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section - Prompt Writing */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 border border-blue-100/50 shadow-sm">
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles size={24} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-2 gap-4">
                <div className="flex-1 pr-4">
                  {/* Editable Prompt Title */}
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Untitled Prompt"
                    className={`text-3xl font-bold bg-transparent border-none outline-none resize-none w-full ${
                      !formData.name.trim() || validationErrors.name
                        ? 'text-gray-400 placeholder-gray-400' 
                        : 'text-gray-900'
                    } focus:ring-0 focus:border-none p-0`}
                    style={{ 
                      textDecoration: (!formData.name.trim() || validationErrors.name) ? 'underline' : 'none',
                      textDecorationColor: (!formData.name.trim() || validationErrors.name) ? '#ef4444' : 'transparent',
                      textDecorationThickness: '2px'
                    }}
                  />
                </div>
                
                {/* Top Right Controls Container */}
                <div className="lg:flex-shrink-0 flex flex-wrap gap-2 items-start">
                  {/* License Dropdown */}
                  <DropdownWithSubtitle
                    value={formData.license}
                    onChange={(value) => updateField('license', value)}
                    options={LICENSES.map(license => ({
                      value: license.value,
                      label: `${license.value} License`,
                      description: license.description
                    }))}
                    colorScheme="purple"
                  />
                  
                  {/* Future dropdown controls will go here */}
                </div>
              </div>
              
              {/* Author Subtitle */}
              <div className="flex items-center space-x-2 max-w-full">
                <span className="text-gray-600 text-lg flex-shrink-0">Written by:</span>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => updateField('author', e.target.value)}
                    placeholder="Unknown"
                    className={`text-lg bg-transparent border-none outline-none resize-none w-full ${
                      !formData.author.trim() || validationErrors.author
                        ? 'text-gray-400 placeholder-gray-400' 
                        : 'text-gray-600'
                    } focus:ring-0 focus:border-none p-0 min-w-0 truncate`}
                    style={{ 
                      textDecoration: (!formData.author.trim() || validationErrors.author) ? 'underline' : 'none',
                      textDecorationColor: (!formData.author.trim() || validationErrors.author) ? '#ef4444' : 'transparent',
                      textDecorationThickness: '2px',
                      maxWidth: '300px'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <textarea
            value={formData.prompt}
            onChange={(e) => updateField('prompt', e.target.value)}
            placeholder="You are a helpful assistant that helps developers write clean, efficient code. When given a task, you should analyze the requirements, suggest best practices, and provide clear explanations..."
            className={`w-full h-48 p-6 border-0 bg-white/70 backdrop-blur rounded-xl focus:ring-2 focus:bg-white resize-none text-gray-900 placeholder-gray-500 text-lg leading-relaxed shadow-sm transition-colors ${
              validationErrors.prompt
                ? 'ring-2 ring-red-300 focus:ring-red-500'
                : 'focus:ring-blue-500'
            }`}
            style={{ marginRight: '0' }}
            required
          />

          {/* Input Parameters */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Input Parameters</label>
              <button
                type="button"
                onClick={addInput}
                className="inline-flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Plus size={14} />
                <span>Add Input</span>
              </button>
            </div>
            
            {formData.inputs.length === 0 ? (
              <p className="text-gray-500 text-sm italic">No input parameters defined. Click "Add Input" to add dynamic variables to your prompt.</p>
            ) : (
              <div className="space-y-3">
                {formData.inputs.map((input, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 p-3 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      value={input.name}
                      onChange={(e) => updateInput(index, 'name', e.target.value)}
                      placeholder="Variable name"
                      className="col-span-3 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <select
                      value={input.type}
                      onChange={(e) => updateInput(index, 'type', e.target.value)}
                      className="col-span-2 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {INPUT_TYPES.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={input.description}
                      onChange={(e) => updateInput(index, 'description', e.target.value)}
                      placeholder="Description"
                      className="col-span-5 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <label className="col-span-1 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={input.required}
                        onChange={(e) => updateInput(index, 'required', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => removeInput(index)}
                      className="col-span-1 flex items-center justify-center text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Advanced Options - Collapsible */}
        <div className="bg-gray-50 rounded-xl border border-gray-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-100 rounded-xl transition-colors"
          >
            <span className="font-medium text-gray-700">Advanced options</span>
            {showAdvanced ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          
          {showAdvanced && (
            <div className="px-6 pb-6 space-y-4 mt-2">
              {/* Category, Difficulty, Language, and Framework */}
              <div className="flex flex-wrap gap-3">
                <DropdownWithSubtitle
                  value={formData.category}
                  onChange={(value) => updateField('category', value)}
                  options={[
                    { value: '', label: 'Choose category...' }, 
                    ...CATEGORY_OPTIONS.map(cat => ({
                      ...cat,
                      label: `Prompt category: ${cat.label}`
                    }))
                  ]}
                  colorScheme="blue"
                />
                
                <DropdownWithSubtitle
                  value={formData.difficulty}
                  onChange={(value) => updateField('difficulty', value as any)}
                  options={DIFFICULTY_OPTIONS}
                  colorScheme={
                    formData.difficulty === 'beginner' ? 'green' : 
                    formData.difficulty === 'intermediate' ? 'orange' : 'red'
                  }
                />
                
                <DropdownWithSubtitle
                  value={formData.language || ''}
                  onChange={(value) => updateField('language', value || undefined)}
                  options={LANGUAGE_OPTIONS}
                  colorScheme="gray"
                />
                
                <DropdownWithSubtitle
                  value={formData.framework || ''}
                  onChange={(value) => updateField('framework', value || undefined)}
                  options={FRAMEWORK_OPTIONS}
                  colorScheme="gray"
                />
              </div>

              {/* Description (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Description <span className="text-gray-400 font-normal ">(Optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="What does this prompt do? Keep it brief and clear..."
                  className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  rows={3}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
                <TagInput
                  tags={formData.tags}
                  onAddTag={addTag}
                  onRemoveTag={removeTag}
                  placeholder="Click to add tags or type to search (e.g., javascript, react, testing)..."
                  emptyMessage="No tags added yet. Tags help others discover your prompt."
                  error={validationErrors.tags}
                  required
                />
              </div>

              {/* AI Models */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">AI Models</label>
                <TagInput
                  tags={formData.models.compatible}
                  onAddTag={addModel}
                  onRemoveTag={removeModel}
                  placeholder="Click to see available models or type to search..."
                  suggestions={AI_MODELS}
                  recommendedTags={formData.models.recommended}
                  onToggleRecommended={toggleRecommended}
                  emptyMessage="No AI models selected. Add compatible models for your prompt."
                  error={validationErrors.models}
                  required
                />
              </div>


            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex justify-center pt-6">
          <button
            type="submit"
            disabled={isSubmitting || Object.keys(validationErrors).length > 0}
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all text-lg"
          >
            <Send size={20} />
            <span>{isSubmitting ? 'Submitting...' : 'Submit Prompt'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitPromptForm;