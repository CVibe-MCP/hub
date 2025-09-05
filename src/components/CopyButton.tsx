'use client';

import { useState } from 'react';
import { Copy, CheckCircle } from 'lucide-react';

interface CopyButtonProps {
  content: string;
  className?: string;
  showIcon?: boolean;
}

export default function CopyButton({ 
  content, 
  className = "inline-flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
  showIcon = false 
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <button onClick={handleCopy} className={className}>
      {showIcon && (copied ? <CheckCircle size={16} className="text-green-500" /> : <Copy size={16} />)}
      <span>{copied ? 'Copied!' : 'Copy Prompt'}</span>
    </button>
  );
}
