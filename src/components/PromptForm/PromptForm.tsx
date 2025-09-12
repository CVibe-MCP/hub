'use client';

import React from 'react';
import { FileText, Code, Hash, Tag } from 'lucide-react';
import { FormWizard, FormWizardStep, WizardStepMeta } from '../FormWizard';
import { BasicInfoStep, PromptContentStep, ConfigurationStep, TagsAndModelsStep } from './steps';
import { PromptFormData, defaultFormData } from './types';

/**
 * Props for the PromptForm component
 */
export interface PromptFormProps {
  /** Initial form data (for editing existing prompts) */
  initialData?: Partial<PromptFormData>;
  /** Callback function called when form is submitted with valid data */
  onSubmit: (data: PromptFormData) => void | Promise<void>;
  /** Optional callback for when form is cancelled */
  onCancel?: () => void;
  /** Optional CSS class name for custom styling */
  className?: string;
}

/**
 * Wizard step configuration
 */
const WIZARD_STEPS: WizardStepMeta[] = [
  {
    id: 'basic',
    title: 'Basic Info',
    description: 'Package name, author, and description',
    icon: FileText
  },
  {
    id: 'prompt',
    title: 'Prompt Content',
    description: 'Write your prompt and define inputs',
    icon: Code
  },
  {
    id: 'configuration',
    title: 'Configuration',
    description: 'Category, difficulty, and technical details',
    icon: Hash
  },
  {
    id: 'tags',
    title: 'Tags & Models',
    description: 'Add tags and specify AI model compatibility',
    icon: Tag
  }
];

/**
 * PromptForm Component - Clean wizard-based form for creating prompt packages
 * 
 * This component uses the FormWizard architecture with proper separation of concerns:
 * - FormWizard handles navigation and validation flow
 * - Each step component manages its own validation and UI
 * - State is shared through context for clean data flow
 */
export const PromptForm: React.FC<PromptFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  className = ''
}) => {
  // Merge initial data with defaults
  const formData: PromptFormData = {
    ...defaultFormData,
    ...initialData
  };
  
  return (
    <div className={`max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create New Prompt Package</h2>
        <p className="text-gray-600">
          Follow the steps below to create a new prompt package for the community.
        </p>
      </div>
      
      {/* Form Wizard */}
      <FormWizard<PromptFormData>
        initialData={formData}
        steps={WIZARD_STEPS}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitText="Create Package"
        showStepNumbers={false}
        allowStepNavigation={true}
      >
        <FormWizardStep stepId="basic" stepIndex={0}>
          <BasicInfoStep />
        </FormWizardStep>
        
        <FormWizardStep stepId="prompt" stepIndex={1}>
          <PromptContentStep />
        </FormWizardStep>
        
        <FormWizardStep stepId="configuration" stepIndex={2}>
          <ConfigurationStep />
        </FormWizardStep>
        
        <FormWizardStep stepId="tags" stepIndex={3}>
          <TagsAndModelsStep />
        </FormWizardStep>
      </FormWizard>
    </div>
  );
};

export default PromptForm;
