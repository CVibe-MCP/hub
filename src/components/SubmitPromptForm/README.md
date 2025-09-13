# PromptForm - Clean FormWizard Architecture

## Overview

The PromptForm has been refactored from a monolithic component with clumsy callbacks into a clean, modular architecture using the FormWizard pattern.

## Architecture

### Core Components

1. **FormWizard** - Main container that provides:
   - Step navigation with tabs UI
   - Validation state management
   - Forward navigation blocking when steps are invalid
   - Shared form state through context

2. **FormWizardStep** - Individual step wrapper that:
   - Receives `setIsValid()` callback for validation
   - Only renders when active
   - Manages step lifecycle (onStepEnter/onStepExit)

3. **FormWizardContext** - Shared state provider:
   - Form data management
   - Validation tracking per step
   - Navigation control
   - Submission handling

### Step Components

Each step is now a clean, focused component:

- **BasicInfoStep** - Package name, author, license, description
- **PromptContentStep** - Prompt text and input parameters
- **ConfigurationStep** - Category, difficulty, language, framework
- **TagsAndModelsStep** - Tags and AI model compatibility

## Key Benefits

### Before (Monolithic)
```tsx
// Old: Everything in one massive component
const PromptForm = () => {
  // 300+ lines of callbacks
  const addTag = useCallback(...);
  const removeTag = useCallback(...);
  const addCompatibleModel = useCallback(...);
  const removeCompatibleModel = useCallback(...);
  // ... dozens more callbacks

  // Complex conditional rendering
  {currentStep === 0 && (/* Step 1 JSX */)}
  {currentStep === 1 && (/* Step 2 JSX */)}
  // ... etc
};
```

### After (Clean Architecture)
```tsx
// New: Clean separation
<FormWizard initialData={data} steps={steps} onSubmit={handleSubmit}>
  <FormWizardStep stepId="basic">
    <BasicInfoStep />
  </FormWizardStep>
  <FormWizardStep stepId="prompt">
    <PromptContentStep />
  </FormWizardStep>
  // ... etc
</FormWizard>
```

## Step Validation

Each step manages its own validation:

```tsx
const MyStep = () => {
  const { formData, updateFormData } = useFormWizard();
  const { setIsValid, errors } = useStepValidation('step-id');

  useEffect(() => {
    // Validate fields
    const errors = validateFields(formData);
    setIsValid(Object.keys(errors).length === 0, errors);
  }, [formData]);

  return (/* Step UI */);
};
```

## Navigation Control

- Forward navigation is automatically blocked when current step is invalid
- Steps can be marked as completed
- Direct navigation to previous/completed steps is allowed
- Step accessibility is managed by the wizard

## State Management

All steps share state through context:

```tsx
const {
  formData,           // Shared form data
  updateFormData,     // Update function
  isSubmitting,       // Submission state
  nextStep,          // Navigation
  prevStep
} = useFormWizard();
```

## Usage Example

```tsx
import { PromptForm } from '@/components/PromptForm';

function MyPage() {
  const handleSubmit = async (data: PromptFormData) => {
    // Handle form submission
    await savePrompt(data);
  };
  
  return (
    <PromptForm
      initialData={existingData}
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
```

## File Structure

```
components/
├── FormWizard/                 # Generic wizard components
│   ├── FormWizard.tsx         # Main wizard container
│   ├── FormWizardStep.tsx     # Step wrapper component
│   ├── FormWizardContext.tsx  # Shared state context
│   └── index.ts
│
├── PromptForm/                # Prompt-specific implementation
│   ├── PromptForm.tsx     # Main form component
│   ├── types.ts              # Types and constants
│   ├── steps/                # Individual step components
│   │   ├── BasicInfoStep.tsx
│   │   ├── PromptContentStep.tsx
│   │   ├── ConfigurationStep.tsx
│   │   ├── TagsAndModelsStep.tsx
│   │   └── index.ts
│   └── index.ts
│
└── PromptForm.tsx            # Re-export for backward compatibility
```

## Extending

To add a new step:

1. Create a new step component in `steps/`
2. Use `useFormWizard()` for data access
3. Use `useStepValidation()` for validation
4. Add step metadata to `WIZARD_STEPS`
5. Add `<FormWizardStep>` to the wizard

The architecture is designed to be reusable - the FormWizard components can be used for any multi-step form in the application.

