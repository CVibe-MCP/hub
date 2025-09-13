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
      throw error; // Re-throw to let FormWizard handle the error state
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isSubmitting) {
      return; // Prevent cancellation during submission
    }
    
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      router.push('/');
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
        {/* Introduction */}
        <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">
            Welcome to Cvibe Prompt Submission
          </h2>
          <p className="text-blue-800 mb-4">
            Submit and share reusable AI prompts with the developer community. 
            Your prompts will be available through the Cvibe CLI and can be installed 
            by developers worldwide.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Define Your Prompt</h3>
                <p className="text-sm text-blue-700">Write your prompt template with dynamic variables</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Configure Settings</h3>
                <p className="text-sm text-blue-700">Set category, difficulty, and model compatibility</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">Submit & Share</h3>
                <p className="text-sm text-blue-700">Make it available for the community to use</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className={isSubmitting ? 'pointer-events-none opacity-50' : ''}>
          <SubmitPromptForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            className="max-w-none"
          />
        </div>

        {/* Help Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📝 Writing Good Prompts
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Be clear and specific about the expected output</li>
              <li>• Use variables ({"{{variable}}"}) for dynamic content</li>
              <li>• Include examples when helpful</li>
              <li>• Test with different AI models before publishing</li>
              <li>• Document any assumptions or prerequisites</li>
            </ul>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🚀 After Submission
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Your prompt will be available via <code className="bg-gray-200 px-1 rounded">cvibe install your-prompt</code></li>
              <li>• Users can run it with <code className="bg-gray-200 px-1 rounded">cvibe run your-prompt</code></li>
              <li>• Track usage statistics and feedback</li>
              <li>• Update and improve based on community input</li>
              <li>• Earn recognition as a contributor</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

