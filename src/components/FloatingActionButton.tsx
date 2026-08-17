import type { ReactNode } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'white';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const FloatingActionButton = ({
  onClick,
  icon,
  label,
  variant = 'primary',
  position = 'bottom-right',
  className = ''
}: FloatingActionButtonProps) => {
  const variantClasses = {
    primary: 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg',
    secondary: 'bg-white text-gray-700 hover:bg-gray-50 shadow-md border border-gray-200',
    white: 'bg-white text-gray-900 hover:bg-gray-50 shadow-lg'
  };

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} w-14 h-14 rounded-full ${variantClasses[variant]} flex items-center justify-center smooth-transition z-30 ${className}`}
      aria-label={label}
    >
      {icon}
    </button>
  );
};

export default FloatingActionButton;