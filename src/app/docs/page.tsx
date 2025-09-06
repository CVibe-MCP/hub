'use client';

import Link from 'next/link';
import { Download, Package, Code, Upload, ChevronRight, ExternalLink, Copy, Clock, Terminal, Check } from 'lucide-react';
import { useState } from 'react';

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState('claude');
  const [copyStates, setCopyStates] = useState<{
    claude: boolean;
    cursor: boolean;
  }>({ claude: false, cursor: false });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Helper function to show toast and update copy state
  const showCopyFeedback = (type: 'claude' | 'cursor', message: string) => {
    setCopyStates(prev => ({ ...prev, [type]: true }));
    setToastMessage(message);
    
    // Reset copy state after 2 seconds
    setTimeout(() => {
      setCopyStates(prev => ({ ...prev, [type]: false }));
    }, 2000);
    
    // Hide toast after 3 seconds
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopyClaude = async () => {
    try {
      await navigator.clipboard.writeText('claude mcp add --transport http cvibe https://mcp.cvibe.dev/');
      showCopyFeedback('claude', 'Claude command copied to clipboard!');
    } catch (err) {
      setToastMessage('Failed to copy to clipboard');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleCopyCursor = async () => {
    try {
      const cursorConfig = `{
  "mcpServers": {
    "cvibe": {
        "command": "npx",
        "args": [
          "mcp-remote",
          "https://mcp.cvibe.dev/mcp"
        ]
      }
  }
}
`;
      await navigator.clipboard.writeText(cursorConfig);
      showCopyFeedback('cursor', 'Cursor config copied to clipboard!');
    } catch (err) {
      setToastMessage('Failed to copy to clipboard');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get started in 4 steps
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Install cvibe, use packages, create your own, and share with the community. Zero friction, maximum impact.
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
            <a href="#publish" className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload size={16} />
              <span>4. Publish</span>
            </a>
          </div>
        </div>

        {/* Step 1: Install cvibe */}
        <section id="install" className="mb-20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#007BFF] text-white rounded-full flex items-center justify-center font-bold">1</div>
            <h2 className="text-3xl font-bold text-gray-900">Install cvibe</h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">30 seconds</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-6">Connect cvibe to your AI development tools via MCP</p>
          
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
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-gray-400"># Add cvibe MCP server</div>
                    <button 
                      onClick={handleCopyClaude}
                      className={`transition-colors ${
                        copyStates.claude 
                          ? 'text-green-400' 
                          : 'text-gray-400 hover:text-white'
                      }`} 
                      title="Copy to clipboard"
                    >
                      {copyStates.claude ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre className="text-white leading-relaxed whitespace-pre overflow-x-auto">
                    <div className="text-green-400 break-all sm:break-normal">claude mcp add --transport http cvibe https://mcp.cvibe.dev/</div>
                  </pre>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                  <div className="flex items-center space-x-2 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">cvibe connected to Claude Code</span>
                  </div>
                </div>
              </div>
            )}

            {/* Cursor Content */}
            {activeTab === 'cursor' && (
              <div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm mb-4 overflow-x-auto">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-gray-400"># Add to your MCP config file</div>
                    <button 
                      onClick={handleCopyCursor}
                      className={`transition-colors ${
                        copyStates.cursor 
                          ? 'text-green-400' 
                          : 'text-gray-400 hover:text-white'
                      }`} 
                      title="Copy to clipboard"
                    >
                      {copyStates.cursor ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                  <pre className="text-white leading-relaxed whitespace-pre overflow-x-auto">
{`{
  "mcpServers": {
    "cvibe": {
        "command": "npx",
        "args": [
          "mcp-remote",
          "https://mcp.cvibe.dev/mcp"
        ]
      }
  }
}
`}
                  </pre>
                </div>
                <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                  <div className="flex items-center space-x-2 text-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Restart Cursor to activate cvibe</span>
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
          
          <p className="text-lg text-gray-600 mb-4">Ask your AI tool to run any cvibe prompt</p>

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
              <span className="text-sm">2 minutes</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-4">Start a new cvibe prompt package</p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500 mb-2">Chat with your AI:</div>
              <div className="text-xl text-gray-900 font-medium">
                "init a cvibe prompt package"
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              → AI creates cvibe-package.json + files
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Auto Structure</h4>
              <p className="text-sm text-gray-600">Creates package.json, README, and prompt files.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Code className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Smart Defaults</h4>
              <p className="text-sm text-gray-600">Fills in metadata, tags, and configuration.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Terminal className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Ready to Edit</h4>
              <p className="text-sm text-gray-600">Just customize your prompt and publish.</p>
            </div>
          </div>
        </section>

        {/* Step 4: Publish Packages */}
        <section id="publish" className="mb-20">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-[#007BFF] text-white rounded-full flex items-center justify-center font-bold">4</div>
            <h2 className="text-3xl font-bold text-gray-900">Publish Packages</h2>
            <div className="flex items-center space-x-2 text-gray-500">
              <Clock size={16} />
              <span className="text-sm">1 minute</span>
            </div>
          </div>
          
          <p className="text-lg text-gray-600 mb-4">Publish your package to the cvibe registry</p>

          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="text-center mb-4">
              <div className="text-sm text-gray-500 mb-2">Chat with your AI:</div>
              <div className="text-xl text-gray-900 font-medium">
                "publish to cvibe @cvibe-package.json"
              </div>
            </div>
            <div className="text-center text-sm text-gray-600">
              → AI publishes your package to the registry
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Package className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Auto Detection</h4>
              <p className="text-sm text-gray-600">Finds your cvibe-package.json and validates it.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Upload className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Registry Upload</h4>
              <p className="text-sm text-gray-600">Publishes to cvibe registry with unique ID.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Terminal className="w-5 h-5 text-gray-600" />
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Instant Access</h4>
              <p className="text-sm text-gray-600">Available immediately for search and use.</p>
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
              Join thousands of developers already using cvibe to streamline their AI workflows
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

            <a
              href="https://github.com/CVibe-MCP/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-6 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow group"
            >
              <div className="w-12 h-12 bg-[#007BFF] text-white rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-[#007BFF]">View on GitHub</h3>
                <p className="text-sm text-gray-600">Explore the code and contribute to cvibe</p>
              </div>
              <ExternalLink size={16} className="text-gray-400" />
            </a>

          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 z-50 animate-in slide-in-from-bottom-2 duration-300">
            <Check size={16} className="text-green-400" />
            <span className="text-sm">{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
}