'use client';

import React, { useEffect, useCallback } from 'react';
import { AlertCircle } from 'lucide-react';
import { useFormWizard, useStepValidation } from '../../FormWizard';
import { PromptFormData } from '../types';

/**
 * Basic Information Step Component
 * Handles package name, author, license, and description
 */
export const BasicInfoStep: React.FC = () => {
  const { formData, updateFormData, isSubmitting } = useFormWizard<PromptFormData>();
  const { setIsValid, errors } = useStepValidation('step-0');
  
  /**
   * Validate this step's fields
   */
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string> = {};
    
    // Validate name
    if (!formData.name.trim()) {
      stepErrors.name = 'Package name is required';
    } else {
      const nameRegex = /^[a-z0-9]([a-z0-9\-._])*[a-z0-9]$/;
      if (!nameRegex.test(formData.name.trim())) {
        stepErrors.name = 'Package name must contain only lowercase letters, numbers, hyphens, dots, and underscores';
      }
    }
    
    // Validate author
    if (!formData.author.trim()) {
      stepErrors.author = 'Author is required';
    }
    
    // Validate description
    if (!formData.description.trim()) {
      stepErrors.description = 'Description is required';
    }
    
    const isValid = Object.keys(stepErrors).length === 0;
    setIsValid(isValid, stepErrors);
    return isValid;
  }, [formData, setIsValid]);
  
  /**
   * Update field and clear its error
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Package Name */}
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
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.name ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors?.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.name}
            </p>
          )}
        </div>
        
        {/* Author */}
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
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors?.author ? 'border-red-300' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors?.author && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.author}
            </p>
          )}
        </div>
        
        {/* License */}
        <div>
          <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-2">
            License
          </label>
          <select
            id="license"
            value={formData.license}
            onChange={(e) => updateField('license', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
      
      {/* Description */}
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
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors?.description ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors?.description && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {errors.description}
          </p>
        )}
      </div>
    </div>
  );
};

