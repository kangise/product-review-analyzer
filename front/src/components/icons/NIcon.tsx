import React from 'react';

interface RIconProps {
  className?: string;
}

export const RIcon: React.FC<RIconProps> = ({ className = "h-4 w-4" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4V20H9V14H12L15 20H18.5L15 13.5C16.5 12.5 17.5 11 17.5 9C17.5 6 15.5 4 12.5 4H6ZM9 7H12.5C13.5 7 14.5 7.5 14.5 9C14.5 10.5 13.5 11 12.5 11H9V7Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
};

export default RIcon;
