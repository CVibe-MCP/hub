'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import SubmitPromptForm, { PromptFormData } from '@/components/SubmitPromptForm';
import { apiClient } from '@/lib/api';
import { ApiPromptCreateRequest } from '@/lib/types';

export default function SubmitPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const transformFormDataToApiRequest = (data: PromptFormData): ApiPromptCreateRequest => {
    // Build cvibe object with proper optional field handling
    const cvibeData: any = {
      tags: data.tags,
      inputs: data.inputs,
      models: data.models,
      category: data.category,
      difficulty: data.difficulty,
    };

    // Only include optional fields if they have values
    if (data.language && data.language.trim()) {
      cvibeData.language = data.language.trim();
    }
    if (data.framework && data.framework.trim()) {
      cvibeData.framework = data.framework.trim();
    }

    // Build content object with proper optional field handling
    const contentData: any = {
      cvibe: cvibeData,
      author: data.author,
      prompt: data.prompt,
      description: data.description,
    };

    // Only include optional fields if they have values
    if (data.license && data.license.trim()) {
      contentData.license = data.license.trim();
    }

    return {
      name: data.name,
      readme: data.description, // Using description as readme for now
      content: contentData,
    };
  };

  const validateFormData = (data: PromptFormData): string[] => {
    const errors: string[] = [];

    // Required string fields with min length 1
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.description?.trim()) errors.push('Description is required');
    if (!data.author?.trim()) errors.push('Author is required');
    if (!data.prompt?.trim()) errors.push('Prompt content is required');
    if (!data.category?.trim()) errors.push('Category is required');

    // Required arrays with min items 1
    if (!data.tags || data.tags.length === 0) {
      errors.push('At least one tag is required');
    }
    if (!data.models?.compatible || data.models.compatible.length === 0) {
      errors.push('At least one compatible model is required');
    }
    if (!data.models?.recommended || data.models.recommended.length === 0) {
      errors.push('At least one recommended model is required');
    }

    // Validate inputs array structure
    if (data.inputs) {
      data.inputs.forEach((input, index) => {
        if (!input.name?.trim()) errors.push(`Input ${index + 1}: Name is required`);
        if (!input.description?.trim()) errors.push(`Input ${index + 1}: Description is required`);
        if (!['string', 'number', 'boolean', 'array', 'object'].includes(input.type)) {
          errors.push(`Input ${index + 1}: Invalid type`);
        }
      });
    }

    return errors;
  };

  const handleSubmit = async (data: PromptFormData) => {
    console.log('Submitting prompt:', data);
    
    // Validate form data before submission
    const validationErrors = validateFormData(data);
    if (validationErrors.length > 0) {
      alert(`Please fix the following errors:\n\n• ${validationErrors.join('\n• ')}`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform form data to API request format
      const apiRequest = transformFormDataToApiRequest(data);
      
      // Call the API to create the prompt
      const result = await apiClient.createPrompt(apiRequest);
      
      // Show success message
      const successMessage = `✅ Prompt "${result.name}" submitted successfully!`;
      console.log(successMessage);

      // Redirect to the newly created prompt's detail page
      router.push(`/package/${result.name}`);
    } catch (error) {
      console.error('Prompt submission error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to submit prompt: ${errorMessage}`);
      throw error; // Re-throw to let form handle the error state
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Submitting Your Prompt
            </h3>
            <p className="text-gray-600 mb-4">
              Please wait while we process and publish your prompt to the registry...
            </p>
            <div className="text-sm text-gray-500">
              This may take a few moments
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className={`inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors ${
                    isSubmitting ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Home
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center">
                  <Package className="text-blue-600 mr-2" size={24} />
                  <h1 className="text-2xl font-bold text-gray-900">Submit Prompt</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Sparkles size={16} className="text-yellow-500" />
                <span>Share your AI prompts with the community</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Minimal Introduction */}
        <div className="text-center mb-8">
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Got a great prompt? Share it with the developer community and help others build better AI workflows.
          </p>
        </div>

        {/* Form */}
        <div className={isSubmitting ? 'pointer-events-none opacity-50' : ''}>
          <SubmitPromptForm
            onSubmit={handleSubmit}
            className="max-w-none"
          />
        </div>

        {/* Minimal Help Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              💡 Quick tips for great prompts
            </h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-gray-700 mb-2"><strong>Be specific:</strong> Clear instructions get better results</p>
                <p className="text-gray-700 mb-2"><strong>Use examples:</strong> Show what good output looks like</p>
                <p className="text-gray-700"><strong>Test first:</strong> Try it with different AI models</p>
              </div>
              <div>
                <p className="text-gray-700 mb-2"><strong>Variables:</strong> Use {"{{variable}}"} for dynamic content</p>
                <p className="text-gray-700 mb-2"><strong>Context:</strong> Explain the use case clearly</p>
                <p className="text-gray-700"><strong>Keep it simple:</strong> Complex prompts are harder to reuse</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

