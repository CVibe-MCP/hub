import React from 'react';

/**
 * Props for the Card component
 */
export interface CardProps {
  /** The text content to display in the card */
  text: string;
  /** Optional CSS class name for custom styling */
  className?: string;
  /** Optional click handler for the card */
  onClick?: () => void;
  /** Whether the card is in a loading state */
  isLoading?: boolean;
  /** Whether the card is disabled */
  disabled?: boolean;
  /** Optional test ID for testing purposes */
  'data-testid'?: string;
}

/**
 * Card Component
 * 
 * A reusable card component that displays text content in a styled container.
 * Supports interaction, loading states, and accessibility features.
 * 
 * @param props - The props for the Card component
 * @returns A React functional component
 * 
 * @example
 * ```tsx
 * <Card text="Hello World" />
 * <Card text="Clickable Card" onClick={() => console.log('clicked')} />
 * <Card text="Loading..." isLoading={true} />
 * ```
 */
export const Card: React.FC<CardProps> = ({
  text,
  className = '',
  onClick,
  isLoading = false,
  disabled = false,
  'data-testid': testId = 'card',
}) => {
  const handleClick = () => {
    if (!disabled && !isLoading && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if ((event.key === 'Enter' || event.key === ' ') && !disabled && !isLoading && onClick) {
      event.preventDefault();
      onClick();
    }
  };

  const baseClasses = [
    'bg-white',
    'border',
    'border-gray-200',
    'rounded-lg',
    'shadow-sm',
    'p-6',
    'transition-all',
    'duration-200',
    'ease-in-out',
  ];

  const interactiveClasses = onClick && !disabled && !isLoading ? [
    'hover:shadow-md',
    'hover:border-gray-300',
    'cursor-pointer',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-blue-500',
    'focus:ring-offset-2',
  ] : [];

  const stateClasses = [
    disabled ? 'opacity-50 cursor-not-allowed' : '',
    isLoading ? 'animate-pulse' : '',
  ];

  const allClasses = [
    ...baseClasses,
    ...interactiveClasses,
    ...stateClasses,
    className,
  ].filter(Boolean).join(' ');

  const cardContent = isLoading ? (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
      <span className="text-gray-500">Loading...</span>
    </div>
  ) : (
    <p className="text-gray-900 text-base leading-relaxed">{text}</p>
  );

  return (
    <div
      className={allClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled && !isLoading ? 0 : undefined}
      aria-disabled={disabled}
      aria-busy={isLoading}
      data-testid={testId}
    >
      {cardContent}
    </div>
  );
};

export default Card;
