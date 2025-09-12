'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { AlertCircle, X } from 'lucide-react';
import { useFormWizard, useStepValidation } from '../../FormWizard';
import { PromptFormData, AI_MODELS } from '../types';

/**
 * Tags and Models Step Component
 * Handles tags and AI model compatibility settings
 */
export const TagsAndModelsStep: React.FC = () => {
  const { formData, updateFormData, isSubmitting } = useFormWizard<PromptFormData>();
  const { setIsValid, errors } = useStepValidation('step-3');
  
  // Local state for input fields
  const [newTag, setNewTag] = useState('');
  const [newCompatibleModel, setNewCompatibleModel] = useState('');
  const [newRecommendedModel, setNewRecommendedModel] = useState('');
  
  /**
   * Validate this step's fields
   */
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string> = {};
    
    // Validate tags
    if (formData.tags.length === 0) {
      stepErrors.tags = 'At least one tag is required';
    }
    
    // Validate compatible models
    if (formData.models.compatible.length === 0) {
      stepErrors.compatible_models = 'At least one compatible model is required';
    }
    
    const isValid = Object.keys(stepErrors).length === 0;
    setIsValid(isValid, stepErrors);
    return isValid;
  }, [formData, setIsValid]);
  
  /**
   * Add a new tag
   */
  const addTag = useCallback(() => {
    const tag = newTag.trim();
    if (tag && !formData.tags.includes(tag)) {
      updateFormData({ 
        tags: [...formData.tags, tag] 
      });
      setNewTag('');
    }
  }, [newTag, formData.tags, updateFormData]);
  
  /**
   * Remove a tag
   */
  const removeTag = useCallback((tagToRemove: string) => {
    updateFormData({ 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    });
  }, [formData.tags, updateFormData]);
  
  /**
   * Add compatible model
   */
  const addCompatibleModel = useCallback(() => {
    const model = newCompatibleModel.trim();
    if (model && !formData.models.compatible.includes(model)) {
      updateFormData({
        models: {
          ...formData.models,
          compatible: [...formData.models.compatible, model]
        }
      });
      setNewCompatibleModel('');
    }
  }, [newCompatibleModel, formData.models, updateFormData]);
  
  /**
   * Remove compatible model
   */
  const removeCompatibleModel = useCallback((model: string) => {
    // Also remove from recommended if it exists there
    const newRecommended = formData.models.recommended.filter(m => m !== model);
    updateFormData({
      models: {
        compatible: formData.models.compatible.filter(m => m !== model),
        recommended: newRecommended
      }
    });
  }, [formData.models, updateFormData]);
  
  /**
   * Add recommended model
   */
  const addRecommendedModel = useCallback(() => {
    const model = newRecommendedModel.trim();
    if (model && !formData.models.recommended.includes(model)) {
      updateFormData({
        models: {
          ...formData.models,
          recommended: [...formData.models.recommended, model]
        }
      });
      setNewRecommendedModel('');
    }
  }, [newRecommendedModel, formData.models, updateFormData]);
  
  /**
   * Remove recommended model
   */
  const removeRecommendedModel = useCallback((model: string) => {
    updateFormData({
      models: {
        ...formData.models,
        recommended: formData.models.recommended.filter(m => m !== model)
      }
    });
  }, [formData.models, updateFormData]);
  
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
   * Validate on mount and when form data changes
   */
  useEffect(() => {
    validateStep();
  }, [validateStep]);
  
  return (
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={addTag}
            disabled={isSubmitting || !newTag.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  aria-label={`Remove tag ${tag}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {errors?.tags && (
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  aria-label={`Remove compatible model ${model}`}
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        )}
        
        {errors?.compatible_models && (
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
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  aria-label={`Remove recommended model ${model}`}
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
  );
};

