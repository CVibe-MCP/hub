'use client';

import React from 'react';
import { FileText, Code, Hash, Tag } from 'lucide-react';
import { FormWizard, FormWizardStep, WizardStepMeta } from '../FormWizard';
import { BasicInfoStep, PromptContentStep, ConfigurationStep, TagsAndModelsStep } from './steps';
import { PromptFormData, defaultFormData } from './types';

/**
 * Props for the SubmitPromptForm component
 */
export interface SubmitPromptFormProps {
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
 * Wizard step configuration - Prompt Content first for better UX
 */
const WIZARD_STEPS: WizardStepMeta[] = [
  {
    id: 'prompt',
    title: 'Prompt Content',
    description: 'Write your prompt and define inputs',
    icon: Code
  },
  {
    id: 'basic',
    title: 'Basic Info',
    description: 'Prompt name, author, and description',
    icon: FileText
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
 * SubmitPromptForm Component - Clean wizard-based form for submitting prompts
 * 
 * This component uses the FormWizard architecture with proper separation of concerns:
 * - FormWizard handles navigation and validation flow
 * - Each step component manages its own validation and UI
 * - State is shared through context for clean data flow
 */
export const SubmitPromptForm: React.FC<SubmitPromptFormProps> = ({
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Submit New Prompt</h2>
        <p className="text-gray-600">
          Follow the steps below to submit a new prompt for the community.
        </p>
      </div>
      
      {/* Form Wizard */}
      <FormWizard<PromptFormData>
        initialData={formData}
        steps={WIZARD_STEPS}
        onSubmit={onSubmit}
        onCancel={onCancel}
        submitText="Submit Prompt"
        showStepNumbers={false}
        allowStepNavigation={true}
      >
        <FormWizardStep stepId="prompt" stepIndex={0}>
          <PromptContentStep />
        </FormWizardStep>
        
        <FormWizardStep stepId="basic" stepIndex={1}>
          <BasicInfoStep />
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

export default SubmitPromptForm;
