import { Package, Upload, Code, Book } from 'lucide-react';

export default function PublishPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Publish a package
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Share your prompt packages with the developer community
          </p>
        </div>

        {/* Publishing process */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How to publish</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#007BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Package size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Create your package</h3>
              <p className="text-gray-600 text-sm">
                Structure your prompt with a package.json and README.md following our guidelines
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#007BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Code size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Use CVibe CLI</h3>
              <p className="text-gray-600 text-sm">
                Install our CLI and run <code className="bg-gray-100 px-1 rounded">cvibe publish</code> in your package directory
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-50 text-[#007BFF] rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Share with community</h3>
              <p className="text-gray-600 text-sm">
                Your package will be available for others to discover and install
              </p>
            </div>
          </div>
        </div>

        {/* CLI Installation */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Install CVibe CLI</h3>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2"># Install CVibe CLI globally</div>
            <div className="text-green-400">npm install -g cvibe-cli</div>
          </div>
        </div>

        {/* Package structure example */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Package structure example</h3>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="font-mono text-sm text-gray-700">
              <div>my-prompt-package/</div>
              <div className="ml-4">├── package.json</div>
              <div className="ml-4">├── README.md</div>
              <div className="ml-4">└── prompt.json</div>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Book className="w-6 h-6 text-[#007BFF]" />
              <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Learn how to create, structure, and publish your prompt packages
            </p>
            <button className="text-[#007BFF] hover:text-[#0056CC] font-medium">
              Read the docs →
            </button>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-3">
              <Package className="w-6 h-6 text-[#007BFF]" />
              <h3 className="text-lg font-semibold text-gray-900">Example packages</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Browse existing packages to see best practices and get inspiration
            </p>
            <button className="text-[#007BFF] hover:text-[#0056CC] font-medium">
              View examples →
            </button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 p-8 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Ready to publish?
          </h3>
          <p className="text-gray-600 mb-6">
            Join the community of developers sharing their best prompts
          </p>
          <button className="bg-[#007BFF] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#0056CC] transition-colors">
            Get started with CLI
          </button>
        </div>
      </div>
    </div>
  );
}