'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

/**
 * Step validation state
 */
export interface StepValidation {
  stepId: string;
  isValid: boolean;
  errors?: Record<string, string>;
}

/**
 * FormWizard context interface
 */
export interface FormWizardContextType<T = any> {
  // Form data management
  formData: T;
  updateFormData: (updates: Partial<T>) => void;
  setFormData: (data: T) => void;
  
  // Navigation state
  currentStep: number;
  totalSteps: number;
  
  // Validation management
  stepValidations: Map<string, StepValidation>;
  setStepValidation: (stepId: string, isValid: boolean, errors?: Record<string, string>) => void;
  isStepValid: (stepId: string) => boolean;
  getStepErrors: (stepId: string) => Record<string, string> | undefined;
  
  // Navigation actions
  goToStep: (stepIndex: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  canNavigateForward: () => boolean;
  canNavigateBackward: () => boolean;
  
  // Step completion tracking
  completedSteps: Set<number>;
  markStepComplete: (stepIndex: number) => void;
  isStepAccessible: (stepIndex: number) => boolean;
  
  // Form submission
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  onSubmit?: (data: T) => void | Promise<void>;
}

const FormWizardContext = createContext<FormWizardContextType | undefined>(undefined);

/**
 * Hook to use the FormWizard context
 */
export const useFormWizard = <T = any>(): FormWizardContextType<T> => {
  const context = useContext(FormWizardContext);
  if (!context) {
    throw new Error('useFormWizard must be used within a FormWizardProvider');
  }
  return context as FormWizardContextType<T>;
};

/**
 * Props for FormWizardProvider
 */
export interface FormWizardProviderProps<T = any> {
  children: ReactNode;
  initialData: T;
  totalSteps: number;
  onSubmit?: (data: T) => void | Promise<void>;
}

/**
 * FormWizard Provider Component
 */
export function FormWizardProvider<T = any>({
  children,
  initialData,
  totalSteps,
  onSubmit
}: FormWizardProviderProps<T>) {
  // Form data state
  const [formData, setFormDataState] = useState<T>(initialData);
  
  // Navigation state
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // Validation state
  const [stepValidations, setStepValidations] = useState<Map<string, StepValidation>>(new Map());
  
  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Update form data partially
   */
  const updateFormData = useCallback((updates: Partial<T>) => {
    setFormDataState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);
  
  /**
   * Set entire form data
   */
  const setFormData = useCallback((data: T) => {
    setFormDataState(data);
  }, []);
  
  /**
   * Set validation state for a step
   */
  const setStepValidation = useCallback((stepId: string, isValid: boolean, errors?: Record<string, string>) => {
    setStepValidations(prev => {
      const newMap = new Map(prev);
      newMap.set(stepId, { stepId, isValid, errors });
      return newMap;
    });
  }, []);
  
  /**
   * Check if a step is valid
   */
  const isStepValid = useCallback((stepId: string): boolean => {
    const validation = stepValidations.get(stepId);
    return validation?.isValid ?? true; // Default to true if not validated yet
  }, [stepValidations]);
  
  /**
   * Get errors for a step
   */
  const getStepErrors = useCallback((stepId: string): Record<string, string> | undefined => {
    return stepValidations.get(stepId)?.errors;
  }, [stepValidations]);
  
  /**
   * Check if we can navigate forward
   */
  const canNavigateForward = useCallback((): boolean => {
    // Get current step's validation
    const currentStepId = `step-${currentStep}`;
    const currentStepValidation = stepValidations.get(currentStepId);
    
    // Can't navigate if current step is invalid
    if (currentStepValidation && !currentStepValidation.isValid) {
      return false;
    }
    
    // Can navigate if not at the last step
    return currentStep < totalSteps - 1;
  }, [currentStep, totalSteps, stepValidations]);
  
  /**
   * Check if we can navigate backward
   */
  const canNavigateBackward = useCallback((): boolean => {
    return currentStep > 0;
  }, [currentStep]);
  
  /**
   * Navigate to next step
   */
  const nextStep = useCallback(() => {
    if (canNavigateForward()) {
      // Mark current step as complete
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, canNavigateForward]);
  
  /**
   * Navigate to previous step
   */
  const prevStep = useCallback(() => {
    if (canNavigateBackward()) {
      setCurrentStep(prev => prev - 1);
    }
  }, [canNavigateBackward]);
  
  /**
   * Navigate to specific step
   */
  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      // Check if the step is accessible
      const isAccessible = stepIndex === 0 || completedSteps.has(stepIndex - 1) || stepIndex === currentStep;
      if (isAccessible) {
        setCurrentStep(stepIndex);
      }
    }
  }, [totalSteps, completedSteps, currentStep]);
  
  /**
   * Mark a step as complete
   */
  const markStepComplete = useCallback((stepIndex: number) => {
    setCompletedSteps(prev => new Set([...prev, stepIndex]));
  }, []);
  
  /**
   * Check if a step is accessible
   */
  const isStepAccessible = useCallback((stepIndex: number): boolean => {
    if (stepIndex === 0) return true;
    return completedSteps.has(stepIndex - 1) || stepIndex === currentStep;
  }, [completedSteps, currentStep]);
  
  const contextValue: FormWizardContextType<T> = {
    formData,
    updateFormData,
    setFormData,
    currentStep,
    totalSteps,
    stepValidations,
    setStepValidation,
    isStepValid,
    getStepErrors,
    goToStep,
    nextStep,
    prevStep,
    canNavigateForward,
    canNavigateBackward,
    completedSteps,
    markStepComplete,
    isStepAccessible,
    isSubmitting,
    setIsSubmitting,
    onSubmit
  };
  
  return (
    <FormWizardContext.Provider value={contextValue}>
      {children}
    </FormWizardContext.Provider>
  );
}

