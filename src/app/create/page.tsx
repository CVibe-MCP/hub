'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PromptForm, { PromptFormData } from '@/components/PromptForm';

export default function CreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: PromptFormData) => {
    console.log('Prompt form submitted with data:', data);
    
    try {
      // TODO: Replace with actual API call when backend is ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show success message
      alert(`Prompt package "${data.name}" created successfully! (Demo - no actual submission yet)`);
      
      // Redirect to browse page or the package page
      router.push('/browse');
    } catch (error) {
      console.error('Prompt submission error:', error);
      alert('Failed to create prompt package. Please try again.');
      throw error; // Re-throw to let FormWizard handle the error state
    }
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel? All changes will be lost.')) {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to Home
                </Link>
                <div className="h-6 w-px bg-gray-300" />
                <div className="flex items-center">
                  <Package className="text-blue-600 mr-2" size={24} />
                  <h1 className="text-2xl font-bold text-gray-900">Create Prompt Package</h1>
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
            Welcome to Cvibe Package Creator
          </h2>
          <p className="text-blue-800 mb-4">
            Create and share reusable AI prompts with the developer community. 
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
                <h3 className="font-semibold text-blue-900">Publish & Share</h3>
                <p className="text-sm text-blue-700">Make it available for the community to use</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <PromptForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          className="max-w-none"
        />

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
              🚀 After Publishing
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Your package will be available via <code className="bg-gray-200 px-1 rounded">cvibe install your-package</code></li>
              <li>• Users can run it with <code className="bg-gray-200 px-1 rounded">cvibe run your-package</code></li>
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

