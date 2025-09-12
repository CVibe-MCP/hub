'use client';

import React, { useEffect, useCallback, ReactNode } from 'react';
import { useFormWizard } from './FormWizardContext';

/**
 * Props for FormWizardStep component
 */
export interface FormWizardStepProps {
  /** Unique identifier for the step */
  stepId: string;
  
  /** Step index in the wizard */
  stepIndex: number;
  
  /** Validation function that returns true if step is valid */
  validate?: () => { isValid: boolean; errors?: Record<string, string> };
  
  /** Children to render in the step */
  children: ReactNode;
  
  /** Optional CSS class name */
  className?: string;
  
  /** Called when step becomes active */
  onStepEnter?: () => void;
  
  /** Called when step becomes inactive */
  onStepExit?: () => void;
}

/**
 * FormWizardStep Component
 * 
 * Individual step component that manages its own validation
 * and communicates with the wizard context
 */
export const FormWizardStep: React.FC<FormWizardStepProps> = ({
  stepId,
  stepIndex,
  validate,
  children,
  className = '',
  onStepEnter,
  onStepExit
}) => {
  const { currentStep, setStepValidation } = useFormWizard();
  const isActive = currentStep === stepIndex;
  
  /**
   * Set validation state for this step
   */
  const setIsValid = useCallback((isValid: boolean, errors?: Record<string, string>) => {
    setStepValidation(stepId, isValid, errors);
  }, [stepId, setStepValidation]);
  
  /**
   * Run validation and update context
   */
  const runValidation = useCallback(() => {
    if (validate) {
      const result = validate();
      setIsValid(result.isValid, result.errors);
      return result.isValid;
    }
    // If no validation function, assume valid
    setIsValid(true);
    return true;
  }, [validate, setIsValid]);
  
  /**
   * Handle step lifecycle
   */
  useEffect(() => {
    if (isActive) {
      onStepEnter?.();
      // Run validation when step becomes active
      runValidation();
      
      return () => {
        onStepExit?.();
      };
    }
  }, [isActive, onStepEnter, onStepExit, runValidation]);
  
  // Only render if this step is active
  if (!isActive) {
    return null;
  }
  
  return (
    <div className={`form-wizard-step ${className}`} data-step-id={stepId}>
      {/* Inject validation props into children if they're function components */}
      {typeof children === 'function' 
        ? (children as any)({ setIsValid, runValidation })
        : children
      }
    </div>
  );
};

/**
 * Hook for step components to interact with validation
 */
export const useStepValidation = (stepId: string) => {
  const { setStepValidation, isStepValid, getStepErrors } = useFormWizard();
  
  const setIsValid = useCallback((isValid: boolean, errors?: Record<string, string>) => {
    setStepValidation(stepId, isValid, errors);
  }, [stepId, setStepValidation]);
  
  const isValid = isStepValid(stepId);
  const errors = getStepErrors(stepId);
  
  return {
    setIsValid,
    isValid,
    errors
  };
};

