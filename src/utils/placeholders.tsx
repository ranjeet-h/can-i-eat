import React from 'react';

interface SVGProps {
  width?: number;
  height?: number;
  className?: string;
}

/**
 * SVG placeholder for product images when no actual image is available
 */
export const ProductPlaceholderSVG: React.FC<SVGProps> = ({ 
  width = 100, 
  height = 100,
  className = '' 
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="100" height="100" rx="8" fill="#2A2A36" />
      <path
        d="M35 30H65C67.7614 30 70 32.2386 70 35V65C70 67.7614 67.7614 70 65 70H35C32.2386 70 30 67.7614 30 65V35C30 32.2386 32.2386 30 35 30Z"
        stroke="#6D6D8A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M43 47C45.2091 47 47 45.2091 47 43C47 40.7909 45.2091 39 43 39C40.7909 39 39 40.7909 39 43C39 45.2091 40.7909 47 43 47Z"
        stroke="#6D6D8A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M70 57L59 46C58.4696 45.4696 57.7652 45.1716 57.0307 45.1716C56.2961 45.1716 55.5917 45.4696 55.0613 46L37 64"
        stroke="#6D6D8A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * SVG placeholder for user avatars when no actual image is available
 */
export const UserPlaceholderSVG: React.FC<SVGProps> = ({ 
  width = 40, 
  height = 40,
  className = '' 
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="40" rx="20" fill="#2A2A36" />
      <path
        d="M20 19C22.2091 19 24 17.2091 24 15C24 12.7909 22.2091 11 20 11C17.7909 11 16 12.7909 16 15C16 17.2091 17.7909 19 20 19Z"
        stroke="#6D6D8A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 29V27C14 25.9391 14.4214 24.9217 15.1716 24.1716C15.9217 23.4214 16.9391 23 18 23H22C23.0609 23 24.0783 23.4214 24.8284 24.1716C25.5786 24.9217 26 25.9391 26 27V29"
        stroke="#6D6D8A"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

/**
 * SVG placeholder for general illustrations when needed
 */
export const IllustrationPlaceholderSVG: React.FC<SVGProps> = ({ 
  width = 200, 
  height = 200,
  className = '' 
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="200" height="200" rx="8" fill="#2A2A36" />
      <rect x="40" y="40" width="120" height="120" rx="4" stroke="#6D6D8A" strokeWidth="2" strokeDasharray="4 4" />
      <path
        d="M100 80V120"
        stroke="#6D6D8A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M80 100H120"
        stroke="#6D6D8A"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default {
  ProductPlaceholderSVG,
  UserPlaceholderSVG,
  IllustrationPlaceholderSVG
};
