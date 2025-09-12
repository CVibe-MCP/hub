'use client';

import React, { useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { useFormWizard, useStepValidation } from '../../FormWizard';
import { PromptFormData, CATEGORIES, LANGUAGES, FRAMEWORKS } from '../types';

/**
 * Configuration Step Component
 * Handles category, difficulty, language, and framework settings
 */
export const ConfigurationStep: React.FC = () => {
  const { formData, updateFormData, isSubmitting } = useFormWizard<PromptFormData>();
  const { setIsValid, errors } = useStepValidation('step-2');
  
  /**
   * Validate this step's fields
   */
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string> = {};
    
    // Validate category
    if (!formData.category.trim()) {
      stepErrors.category = 'Category is required';
    }
    
    const isValid = Object.keys(stepErrors).length === 0;
    setIsValid(isValid, stepErrors);
    return isValid;
  }, [formData, setIsValid]);
  
  /**
   * Update a configuration field
   */
  const updateField = useCallback((field: keyof PromptFormData, value: any) => {
    updateFormData({ [field]: value } as Partial<PromptFormData>);
  }, [updateFormData]);
  
  /**
   * Validate on mount and when form data changes
   */
  useEffect(() => {
    validateStep();
  }, [validateStep]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.category ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          {errors?.category && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.category}
            </p>
          )}
        </div>
        
        {/* Difficulty */}
        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => updateField('difficulty', e.target.value as 'beginner' | 'intermediate' | 'advanced')}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        
        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <select
            id="language"
            value={formData.language || ''}
            onChange={(e) => updateField('language', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Any language</option>
            {LANGUAGES.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>
        
        {/* Framework */}
        <div>
          <label htmlFor="framework" className="block text-sm font-medium text-gray-700 mb-2">
            Framework
          </label>
          <select
            id="framework"
            value={formData.framework || ''}
            onChange={(e) => updateField('framework', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          >
            <option value="">Any framework</option>
            {FRAMEWORKS.map(framework => (
              <option key={framework} value={framework}>{framework}</option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Help Text */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Configuration Tips</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Category:</strong> Choose the primary use case for your prompt</li>
          <li>• <strong>Difficulty:</strong> Set based on the technical expertise required to use the prompt effectively</li>
          <li>• <strong>Language:</strong> Specify if your prompt is tailored for a specific programming language</li>
          <li>• <strong>Framework:</strong> Specify if your prompt works best with a particular framework</li>
        </ul>
      </div>
    </div>
  );
};

