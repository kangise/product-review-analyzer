import React from 'react';

interface NIconProps {
  className?: string;
}

export const NIcon: React.FC<NIconProps> = ({ className = "h-4 w-4" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 4V20H9V10.5L15 20H18V4H15V13.5L9 4H6Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="0.5"
      />
    </svg>
  );
};

export default NIcon;
