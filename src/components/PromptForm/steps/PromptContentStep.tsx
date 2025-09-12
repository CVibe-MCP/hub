'use client';

import React, { useEffect, useCallback, useState } from 'react';
import { AlertCircle, Plus, X, Globe } from 'lucide-react';
import { useFormWizard, useStepValidation } from '../../FormWizard';
import { PromptFormData, INPUT_TYPES } from '../types';
import { ApiPromptInput } from '@/lib/types';

/**
 * Prompt Content Step Component
 * Handles prompt text and input parameters
 */
export const PromptContentStep: React.FC = () => {
  const { formData, updateFormData, isSubmitting } = useFormWizard<PromptFormData>();
  const { setIsValid, errors } = useStepValidation('step-1');
  
  /**
   * Validate this step's fields
   */
  const validateStep = useCallback(() => {
    const stepErrors: Record<string, string> = {};
    
    // Validate prompt
    if (!formData.prompt.trim()) {
      stepErrors.prompt = 'Prompt content is required';
    }
    
    // Validate inputs
    formData.inputs.forEach((input, index) => {
      if (!input.name.trim()) {
        stepErrors[`input_${index}_name`] = 'Input name is required';
      }
      if (!input.description.trim()) {
        stepErrors[`input_${index}_description`] = 'Input description is required';
      }
    });
    
    const isValid = Object.keys(stepErrors).length === 0;
    setIsValid(isValid, stepErrors);
    return isValid;
  }, [formData, setIsValid]);
  
  /**
   * Update the prompt field
   */
  const updatePrompt = useCallback((value: string) => {
    updateFormData({ prompt: value });
  }, [updateFormData]);
  
  /**
   * Add a new input parameter
   */
  const addInput = useCallback(() => {
    const newInput: ApiPromptInput = {
      name: '',
      type: 'string',
      required: false,
      description: ''
    };
    updateFormData({ 
      inputs: [...formData.inputs, newInput] 
    });
  }, [formData.inputs, updateFormData]);
  
  /**
   * Update an input parameter
   */
  const updateInput = useCallback((index: number, field: keyof ApiPromptInput, value: any) => {
    const updatedInputs = formData.inputs.map((input, i) => 
      i === index ? { ...input, [field]: value } : input
    );
    updateFormData({ inputs: updatedInputs });
  }, [formData.inputs, updateFormData]);
  
  /**
   * Remove an input parameter
   */
  const removeInput = useCallback((index: number) => {
    const updatedInputs = formData.inputs.filter((_, i) => i !== index);
    updateFormData({ inputs: updatedInputs });
  }, [formData.inputs, updateFormData]);
  
  /**
   * Validate on mount and when form data changes
   */
  useEffect(() => {
    validateStep();
  }, [validateStep]);
  
  return (
    <div className="space-y-6">
      {/* Prompt Content */}
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
          Prompt *
        </label>
        <textarea
          id="prompt"
          value={formData.prompt}
          onChange={(e) => updatePrompt(e.target.value)}
          placeholder="Write your prompt here. You can use variables like {{input_name}} that will be replaced with user inputs..."
          rows={8}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm ${
            errors?.prompt ? 'border-red-300' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors?.prompt && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle size={14} className="mr-1" />
            {errors.prompt}
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Use double curly braces like <code className="bg-gray-100 px-1 rounded">{'{{variable_name}}'}</code> to reference input variables.
        </p>
      </div>
      
      {/* Input Parameters */}
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
                <h5 className="text-sm font-medium text-gray-900">Input {index + 1}</h5>
                <button
                  type="button"
                  onClick={() => removeInput(index)}
                  disabled={isSubmitting}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  aria-label={`Remove input ${index + 1}`}
                >
                  <X size={16} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Input Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={input.name}
                    onChange={(e) => updateInput(index, 'name', e.target.value)}
                    placeholder="variable_name"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors?.[`input_${index}_name`] ? 'border-red-300' : 'border-gray-300'
                    }`}
                    disabled={isSubmitting}
                  />
                  {errors?.[`input_${index}_name`] && (
                    <p className="mt-1 text-xs text-red-600">{errors[`input_${index}_name`]}</p>
                  )}
                </div>
                
                {/* Input Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={input.type}
                    onChange={(e) => updateInput(index, 'type', e.target.value as ApiPromptInput['type'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isSubmitting}
                  >
                    {INPUT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Input Description */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={input.description}
                  onChange={(e) => updateInput(index, 'description', e.target.value)}
                  placeholder="Describe what this input is for..."
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors?.[`input_${index}_description`] ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                />
                {errors?.[`input_${index}_description`] && (
                  <p className="mt-1 text-xs text-red-600">{errors[`input_${index}_description`]}</p>
                )}
              </div>
              
              {/* Required Checkbox */}
              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={input.required}
                    onChange={(e) => updateInput(index, 'required', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <span className="ml-2 text-sm text-gray-700">Required</span>
                </label>
              </div>
            </div>
          ))}
          
          {/* Add Input Button */}
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
  );
};

