'use client';

import React, { ReactNode, Children, isValidElement, cloneElement } from 'react';
import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { FormWizardProvider, useFormWizard } from './FormWizardContext';
import { FormWizardStepProps } from './FormWizardStep';

/**
 * Step metadata for navigation
 */
export interface WizardStepMeta {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

/**
 * Props for FormWizard component
 */
export interface FormWizardProps<T = any> {
  /** Initial form data */
  initialData: T;
  
  /** Step metadata for navigation UI */
  steps: WizardStepMeta[];
  
  /** Callback when form is submitted */
  onSubmit: (data: T) => void | Promise<void>;
  
  /** Callback when wizard is cancelled */
  onCancel?: () => void;
  
  /** Children must be FormWizardStep components */
  children: ReactNode;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Custom submit button text */
  submitText?: string;
  
  /** Show step numbers in navigation */
  showStepNumbers?: boolean;
  
  /** Allow clicking on completed steps to navigate */
  allowStepNavigation?: boolean;
}

/**
 * Internal component that uses the context
 */
const FormWizardContent: React.FC<Omit<FormWizardProps, 'initialData' | 'onSubmit'> & { 
  steps: WizardStepMeta[];
  submitText?: string;
  onCancel?: () => void;
  showStepNumbers?: boolean;
  allowStepNavigation?: boolean;
}> = ({
  children,
  steps,
  className = '',
  submitText = 'Submit',
  onCancel,
  showStepNumbers = true,
  allowStepNavigation = true
}) => {
  const {
    formData,
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    goToStep,
    canNavigateForward,
    canNavigateBackward,
    completedSteps,
    isStepAccessible,
    isSubmitting,
    setIsSubmitting,
    onSubmit,
    stepValidations
  } = useFormWizard();
  
  const isLastStep = currentStep === totalSteps - 1;
  const currentStepMeta = steps[currentStep];
  
  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    // Check if current step is valid
    const currentStepId = `step-${currentStep}`;
    const currentValidation = stepValidations.get(currentStepId);
    
    if (currentValidation && !currentValidation.isValid) {
      // Don't submit if current step is invalid
      return;
    }
    
    if (onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  /**
   * Process children to inject step props
   */
  const processedChildren = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<FormWizardStepProps>, {
        stepIndex: index,
        stepId: `step-${index}`
      });
    }
    return child;
  });
  
  return (
    <div className={`form-wizard ${className}`}>
      {/* Step Navigation Tabs */}
      <nav className="wizard-navigation border-b border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index);
            const isAccessible = isStepAccessible(index);
            const stepValidation = stepValidations.get(`step-${index}`);
            const hasErrors = stepValidation && !stepValidation.isValid;
            
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => allowStepNavigation && isAccessible ? goToStep(index) : undefined}
                disabled={!allowStepNavigation || !isAccessible || isSubmitting}
                className={`
                  flex-1 flex items-center justify-center px-3 py-2 mx-1 rounded-lg transition-all
                  text-sm font-medium
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : isCompleted 
                    ? 'bg-green-50 text-green-700 hover:bg-green-100' 
                    : isAccessible 
                    ? hasErrors
                      ? 'bg-red-50 text-red-700 hover:bg-red-100'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }
                `}
                aria-current={isActive ? 'step' : undefined}
              >
                <div className="flex items-center space-x-2">
                  {/* Step indicator */}
                  <div className="flex items-center">
                    {isCompleted ? (
                      <Check size={16} className="text-green-600" />
                    ) : Icon ? (
                      <Icon size={16} />
                    ) : showStepNumbers ? (
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${isActive 
                          ? 'bg-white/20' 
                          : hasErrors
                          ? 'bg-red-200 text-red-800'
                          : 'bg-gray-200 text-gray-600'
                        }
                      `}>
                        {index + 1}
                      </span>
                    ) : null}
                  </div>
                  
                  {/* Step title */}
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Current Step Info */}
      {currentStepMeta && (
        <div className="wizard-step-info px-6 py-4 bg-white border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {currentStepMeta.icon && (
              <currentStepMeta.icon className="mr-2" size={20} />
            )}
            {currentStepMeta.title}
          </h3>
          {currentStepMeta.description && (
            <p className="text-sm text-gray-600 mt-1">{currentStepMeta.description}</p>
          )}
        </div>
      )}
      
      {/* Step Content */}
      <div className="wizard-content p-6 bg-white">
        {processedChildren}
      </div>
      
      {/* Navigation Controls */}
      <div className="wizard-controls flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          {canNavigateBackward() && (
            <button
              type="button"
              onClick={prevStep}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {totalSteps}
          </span>
          
          {isLastStep ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Submitting...
                </>
              ) : (
                submitText
              )}
            </button>
          ) : (
            <button
              type="button"
              onClick={nextStep}
              disabled={!canNavigateForward() || isSubmitting}
              className="inline-flex items-center px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * FormWizard Component
 * 
 * A flexible wizard component that manages multi-step forms
 * with validation and shared state
 */
export function FormWizard<T = any>({
  initialData,
  steps,
  children,
  onSubmit,
  ...props
}: FormWizardProps<T>) {
  const stepCount = Children.count(children);
  
  if (stepCount !== steps.length) {
    console.warn(`FormWizard: Number of steps (${steps.length}) doesn't match number of children (${stepCount})`);
  }
  
  return (
    <FormWizardProvider 
      initialData={initialData} 
      totalSteps={stepCount}
      onSubmit={onSubmit}
    >
      <FormWizardContent steps={steps} {...props}>
        {children}
      </FormWizardContent>
    </FormWizardProvider>
  );
}

