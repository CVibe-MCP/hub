import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Package, Download, Calendar, User, Star, Code2, Copy } from 'lucide-react';

interface PageProps {
  params: {
    username: string;
    packagename: string;
  };
}

export default function PackagePage({ params }: PageProps) {
  const { username, packagename } = params;
  
  // For now, return 404 for demo purposes
  // Later this will fetch real data
  const packageData = {
    name: `@${username}/${packagename}`,
    version: '1.2.0',
    description: 'A comprehensive code review prompt for multiple programming languages',
    downloads: '1.2k',
    lastUpdated: '2 days ago',
    author: username,
    license: 'MIT',
    keywords: ['code-review', 'javascript', 'typescript', 'python'],
    readme: `# @${username}/${packagename}

A comprehensive code review prompt that helps you review code across multiple programming languages.

## Usage

\`\`\`bash
cvibe install @${username}/${packagename}
\`\`\`

Then use in your MCP-compatible tool:

\`\`\`javascript
import { ${packagename} } from '@${username}/${packagename}';
\`\`\`

## Features

- Multi-language support
- Best practices enforcement  
- Security vulnerability detection
- Performance optimization suggestions

## License

MIT`,
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
            <Link href="/" className="hover:text-[#007BFF]">cvibe</Link>
            <span>/</span>
            <Link href={`/package/@${username}`} className="hover:text-[#007BFF]">@{username}</Link>
            <span>/</span>
            <span className="font-medium">{packagename}</span>
          </div>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {packageData.name}
              </h1>
              <p className="text-gray-600 text-lg mb-4">{packageData.description}</p>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Download size={16} />
                  <span>{packageData.downloads} weekly downloads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Updated {packageData.lastUpdated}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User size={16} />
                  <Link href={`/package/@${username}`} className="hover:text-[#007BFF]">
                    {packageData.author}
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                v{packageData.version}
              </div>
              <div className="space-y-2">
                <button className="w-full bg-[#007BFF] text-white px-4 py-2 rounded-lg hover:bg-[#0056CC] transition-colors flex items-center justify-center space-x-2">
                  <Download size={16} />
                  <span>Install</span>
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Copy size={16} />
                  <span>Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Installation */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Installation</h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <code className="text-sm">cvibe install {packageData.name}</code>
                  <button className="text-gray-500 hover:text-gray-700">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* README */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">README</h2>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                  {packageData.readme}
                </pre>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Package Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Package Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Version</span>
                    <span className="font-medium">{packageData.version}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">License</span>
                    <span className="font-medium">{packageData.license}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weekly downloads</span>
                    <span className="font-medium">{packageData.downloads}</span>
                  </div>
                </div>
              </div>

              {/* Keywords */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {packageData.keywords.map((keyword) => (
                    <Link
                      key={keyword}
                      href={`/browse?q=${keyword}`}
                      className="bg-blue-50 text-[#007BFF] px-2 py-1 rounded text-xs hover:bg-blue-100 transition-colors"
                    >
                      {keyword}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}