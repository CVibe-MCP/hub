# PromptForm Component

A comprehensive React form component for creating and editing prompt packages in the Cvibe ecosystem. Built with TypeScript, featuring dynamic input management, comprehensive validation, and a design that matches the app's existing aesthetic.

## Features

- **Complete Form Management**: All fields from the `ApiPromptContent` interface
- **Dynamic Input Parameters**: Add/remove input parameters with validation
- **Tag Management**: Visual tag input with add/remove functionality
- **Model Selection**: Compatible and recommended AI model selection
- **Comprehensive Validation**: Real-time validation with helpful error messages
- **Responsive Design**: Mobile-friendly layout that matches the app's design system
- **Loading States**: Proper loading indicators during form submission
- **Accessibility**: ARIA labels, keyboard navigation, and screen reader support

## Usage

### Basic Usage

```tsx
import { PromptForm, PromptFormData } from '@/components/PromptForm';

function CreatePromptPage() {
  const handleSubmit = async (data: PromptFormData) => {
    console.log('Form data:', data);
    // Send to your API
    await fetch('/api/prompts', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  };

  return (
    <PromptForm
      onSubmit={handleSubmit}
      onCancel={() => router.back()}
    />
  );
}
```

### With Initial Data (Editing)

```tsx
const initialData = {
  name: 'existing-prompt',
  author: 'John Doe',
  description: 'An existing prompt package',
  // ... other fields
};

<PromptForm
  initialData={initialData}
  onSubmit={handleSubmit}
  isSubmitting={isLoading}
/>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `onSubmit` | `(data: PromptFormData) => void \| Promise<void>` | Yes | Callback called when form is submitted with valid data |
| `initialData` | `Partial<PromptFormData>` | No | Initial form data for editing existing prompts |
| `isSubmitting` | `boolean` | No | Whether the form is in loading/submitting state |
| `onCancel` | `() => void` | No | Optional callback for when form is cancelled |
| `className` | `string` | No | Optional CSS class name for custom styling |

## Data Structure

### PromptFormData Interface

```tsx
interface PromptFormData {
  // Basic metadata
  name: string;           // Package name (npm-style validation)
  description: string;    // Package description
  author: string;         // Author name
  license: string;        // License type (MIT, Apache-2.0, etc.)
  
  // Prompt content
  prompt: string;         // The actual prompt text
  
  // Configuration
  tags: string[];         // Searchable tags
  category: string;       // Category from predefined list
  language?: string;      // Optional primary language
  framework?: string;     // Optional primary framework
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Dynamic inputs
  inputs: ApiPromptInput[];
  
  // Model compatibility
  models: {
    compatible: string[];    // Required: models that work
    recommended: string[];   // Optional: best experience models
  };
}
```

### ApiPromptInput Interface

```tsx
interface ApiPromptInput {
  name: string;           // Variable name used in prompt
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;      // Whether input is required
  description: string;    // Description of what this input does
}
```

## Form Sections

### 1. Basic Information
- **Package Name**: npm-style package name with validation
- **Author**: Creator's name or username
- **Description**: What the prompt does and when to use it
- **License**: Open source license selection

### 2. Prompt Content
- **Prompt**: The actual prompt text with variable substitution support
- Uses `{{variable_name}}` syntax for input variables
- Monospace font for better code readability

### 3. Configuration
- **Category**: Predefined categories (Code Generation, Documentation, etc.)
- **Difficulty**: Beginner, Intermediate, or Advanced
- **Language**: Optional primary programming language
- **Framework**: Optional primary framework/library

### 4. Tags
- Dynamic tag management with visual chips
- Add tags by typing and pressing Enter or clicking Add
- Remove tags by clicking the X button
- Required: at least one tag

### 5. Input Parameters
- Define dynamic inputs that users provide when using the prompt
- Each input has: name, type, description, and required flag
- Add/remove inputs dynamically
- Validates input names and descriptions

### 6. AI Model Compatibility
- **Compatible Models**: Models that work with this prompt (required)
- **Recommended Models**: Subset of compatible models for best experience
- Dropdown selection with visual chips for added models

## Validation Rules

- **Required Fields**: Name, description, author, prompt, category, at least one tag, at least one compatible model
- **Package Name**: Must follow npm naming conventions (lowercase, alphanumeric, hyphens, dots, underscores)
- **Input Parameters**: Each input must have a name and description
- **Model Logic**: Recommended models must be a subset of compatible models

## Styling

The component uses Tailwind CSS classes and follows the app's design system:

- **Primary Color**: `#007BFF` (blue)
- **Hover Color**: `#0056CC` (darker blue)
- **Error Color**: Red variants
- **Success Color**: Green variants
- **Warning Color**: Yellow variants
- **Border Radius**: `rounded-lg` (8px)
- **Spacing**: Consistent padding and margins
- **Typography**: Proper font weights and sizes

## Accessibility

- Proper ARIA labels and descriptions
- Keyboard navigation support
- Screen reader compatible
- Focus management
- Error announcements
- High contrast colors

## Error Handling

- Real-time validation with immediate feedback
- Field-specific error messages
- Visual error indicators (red borders, error icons)
- Prevents submission with invalid data
- Clears errors when user corrects input

## Responsive Design

- Mobile-first approach
- Stacked layout on small screens
- Grid layouts on larger screens
- Touch-friendly button sizes
- Proper spacing and typography scaling

## Integration Notes

1. **API Integration**: The `onSubmit` callback receives fully validated data ready for API submission
2. **Routing**: Use `onCancel` to handle navigation away from the form
3. **Loading States**: Pass `isSubmitting` to show loading indicators and disable form
4. **Error Handling**: Handle API errors in your `onSubmit` callback
5. **Persistence**: Consider saving form data to localStorage for draft functionality

## Example API Transformation

```tsx
const handleSubmit = async (formData: PromptFormData) => {
  // Transform to API format
  const apiData: ApiPromptContent = {
    cvibe: {
      tags: formData.tags,
      inputs: formData.inputs,
      models: formData.models,
      category: formData.category,
      language: formData.language,
      framework: formData.framework,
      difficulty: formData.difficulty
    },
    author: formData.author,
    prompt: formData.prompt,
    license: formData.license,
    description: formData.description
  };

  await fetch('/api/prompts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.name,
      content: apiData
    })
  });
};
```

## Browser Support

- Modern browsers with ES2015+ support
- React 18+
- TypeScript 4.5+
- Tailwind CSS 3.0+

## Performance

- Optimized with React.useCallback for event handlers
- Minimal re-renders with proper state management
- Efficient form validation
- Lazy loading of dropdown options
- Debounced input validation where appropriate
