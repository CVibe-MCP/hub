'use client';

import Link from 'next/link';
import { Download, Package, Code, Upload, ChevronRight, ExternalLink, Copy, Clock, Terminal } from 'lucide-react';
import { useState } from 'react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('claude');
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get started in 4 steps
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Install CVibe, use packages, create your own, and share with the community. Zero friction, maximum impact.
          </p>
          
          {/* Quick Navigation */}
          <div className="flex flex-wrap justify-center gap-4">
            <a href="#install" className="inline-flex items-center space-x-2 bg-[#007BFF] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0056CC] transition-colors">
              <Download size={16} />
              <span>1. Install</span>
            </a>
            <a href="#use" className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Package size={16} />
              <span>2. Use</span>
            </a>
            <a href="#create" className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Code size={16} />
              <span>3. Create</span>
            </a>
            <a href="#deploy" className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload size={16} />
              <span>4. Deploy</span>
            </a>
          </div>
        </div>

        {/* Step 1: Install CVibe */}
        <section id="install" className="mb-20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#007BFF] text-white rounded-full flex items-center justify-center font-bold">1</div>
            <h2 className="text-3xl font-bold text-gray-900">Install CVibe</h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">30 seconds</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-6">Connect CVibe to your AI development tools via MCP</p>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-6">
              <button 
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'claude' 
                    ? 'text-gray-700 border-b-2 border-[#007BFF] bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('claude')}
              >
                <div className="flex items-center space-x-2">
                  <img src="https://claude.ai/favicon.ico" alt="Claude Code" className="w-4 h-4" />
                  <span>Claude Code</span>
                </div>
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'cursor' 
                    ? 'text-gray-700 border-b-2 border-[#007BFF] bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('cursor')}
              >
                <div className="flex items-center space-x-2">
                  <img src="https://cursor.sh/favicon.ico" alt="Cursor" className="w-4 h-4" />
                  <span>Cursor</span>
                </div>
              </button>
            </div>

            {/* Claude Code Content */}
            {activeTab === 'claude' && (
              <div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-gray-400"># Add CVibe MCP server</div>
                    <button className="text-gray-400 hover:text-white transition-colors" title="Copy to clipboard">
                      <Copy size={14} />
                    </button>
                  </div>
                  <pre className="text-white leading-relaxed">
                    <div className="text-green-400">claude mcp add --transport http cvibe https://mcp.cvibe.dev/</div>
                  </pre>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                  <div className="flex items-center space-x-2 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">CVibe connected to Claude Code</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cursor Content */}
            {activeTab === 'cursor' && (
              <div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-gray-400"># Add to your MCP config file</div>
                    <button className="text-gray-400 hover:text-white transition-colors" title="Copy to clipboard">
                      <Copy size={14} />
                    </button>
                  </div>
                  <pre className="text-white leading-relaxed">
{`{
  "mcpServers": {
    "cvibe": {
      "url": "https://mcp.cvibe.dev"
    }
  }
}`}
                  </pre>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                  <div className="flex items-center space-x-2 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Restart Cursor to activate CVibe</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Use Packages */}
        <section id="use" className="mb-20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#007BFF] text-white rounded-full flex items-center justify-center font-bold">2</div>
            <h2 className="text-3xl font-bold text-gray-900">Use Packages</h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">10 seconds</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-4">Ask your AI tool to run any CVibe prompt</p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500 mb-2">Chat with your AI:</div>
              <div className="text-xl text-gray-900 font-medium">
                "use cvibe prompt ts-react-component"
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              → AI creates Button.tsx + tests + stories
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Terminal className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Natural Language</h4>
              <p className="text-sm text-gray-600">No syntax to memorize. Just describe what you need.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Automatic Resolution</h4>
              <p className="text-sm text-gray-600">MCP finds and executes the appropriate prompt.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Complete Generation</h4>
              <p className="text-sm text-gray-600">Full file sets with types, tests, and documentation.</p>
            </div>
          </div>
        </section>

        {/* Step 3: Create Packages */}
        <section id="create" className="mb-20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#007BFF] text-white rounded-full flex items-center justify-center font-bold">3</div>
            <h2 className="text-3xl font-bold text-gray-900">Create Packages</h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">5 minutes</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">Build your own prompt package from scratch</p>
          
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-400"># Create new package</div>
              <button className="text-gray-400 hover:text-white transition-colors" title="Copy to clipboard">
                <Copy size={16} />
              </button>
            </div>
            <div className="text-green-400 text-lg">mkdir my-prompt && cd my-prompt</div>
            <div className="text-green-400 text-lg mt-2">cvibe init</div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Package structure created:</h3>
            <div className="font-mono text-sm text-gray-700">
              <div>my-prompt/</div>
              <div className="ml-4">├── cvibe-package.json</div>
              <div className="ml-4">├── prompt.json</div>
              <div className="ml-4">└── README.md</div>
            </div>
          </div>

          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono text-sm mb-6">
            <div className="text-gray-400 mb-3"># Edit your prompt.json</div>
            <div className="text-white">
{`{
  "system": "You are an expert code reviewer.",
  "user": "Review this code: {{code}}",
  "variables": ["code"]
}`}
            </div>
          </div>

          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-400"># Test your prompt locally</div>
              <button className="text-gray-400 hover:text-white transition-colors" title="Copy to clipboard">
                <Copy size={16} />
              </button>
            </div>
            <div className="text-green-400 text-lg">cvibe test</div>
            <div className="text-gray-400 mt-2">✓ Prompt structure is valid</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 bg-blue-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-medium text-blue-800">Package ready!</p>
                <p className="text-blue-700 text-sm">Your prompt package is created and tested. Time to share it with the world.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Deploy Packages */}
        <section id="deploy" className="mb-20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#007BFF] text-white rounded-full flex items-center justify-center font-bold">4</div>
            <h2 className="text-3xl font-bold text-gray-900">Deploy Packages</h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">1 minute</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">Publish your package to the CVibe registry</p>
          
          <div className="bg-gray-900 text-gray-100 p-6 rounded-lg font-mono mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-400"># Publish to CVibe registry</div>
              <button className="text-gray-400 hover:text-white transition-colors" title="Copy to clipboard">
                <Copy size={16} />
              </button>
            </div>
            <div className="text-green-400 text-lg">cvibe publish</div>
            <div className="text-gray-400 mt-3">
              <div>📦 Publishing @username/my-prompt@1.0.0...</div>
              <div>✓ Package uploaded successfully</div>
              <div>✓ Available at: cvibe.dev/package/@username/my-prompt</div>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-500 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div>
                <p className="font-semibold text-green-800 text-lg">Package published! 🎉</p>
                <p className="text-green-700 mt-1">Your prompt is now available to developers worldwide. Anyone can install it with:</p>
                <div className="bg-white border border-green-300 rounded p-3 font-mono text-sm mt-3">
                  <span className="text-green-600">cvibe install @username/my-prompt</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">What happens next?</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>✓ Package appears in search results</div>
                <div>✓ Available on cvibe.dev/browse</div>
                <div>✓ Auto-indexed by AI tools</div>
                <div>✓ Community can discover & use it</div>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Update your package</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>1. Edit your prompt files</div>
                <div>2. Bump version in package.json</div>
                <div>3. Run <code className="bg-gray-100 px-2 py-1 rounded">cvibe publish</code> again</div>
              </div>
            </div>
          </div>
        </section>

        {/* Community & Support */}
        <div className="border-t border-gray-200 pt-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to build something amazing?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join thousands of developers already using CVibe to streamline their AI workflows
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="https://discord.gg/xtzRyfky"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group"
            >
              <div className="w-12 h-12 bg-[#5865F2] text-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.445.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-[#5865F2]">Join Discord</h3>
                <p className="text-sm text-gray-600">Get help and connect with other developers</p>
              </div>
              <ExternalLink size={16} className="text-gray-400" />
            </a>

            <Link
              href="/browse"
              className="flex items-center space-x-3 p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group"
            >
              <div className="w-12 h-12 bg-[#007BFF] text-white rounded-lg flex items-center justify-center">
                <Package size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-[#007BFF]">Browse Packages</h3>
                <p className="text-sm text-gray-600">Discover prompts from the community</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/publish"
              className="flex items-center space-x-3 p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group"
            >
              <div className="w-12 h-12 bg-[#007BFF] text-white rounded-lg flex items-center justify-center">
                <Upload size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-[#007BFF]">Publish Package</h3>
                <p className="text-sm text-gray-600">Share your prompts with the world</p>
              </div>
              <ChevronRight size={16} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}