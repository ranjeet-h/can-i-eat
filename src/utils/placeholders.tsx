import React from 'react';

/**
 * A reusable placeholder for product images
 */
export const ProductPlaceholderSVG = ({
  width = 150,
  height = 150,
  className = '',
}: {
  width?: number;
  height?: number;
  className?: string;
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 200 200"
    xmlns="http://www.w3.org/2000/svg"
    className={`bg-dark-800 ${className}`}
    preserveAspectRatio="xMidYMid meet"
  >
    <rect width="200" height="200" fill="#44475a" />
    <g fill="#6272a4">
      <path
        d="M33 89c0-7.7 6.3-14 14-14h106c7.7 0 14 6.3 14 14v72c0 7.7-6.3 14-14 14H47c-7.7 0-14-6.3-14-14V89z"
        opacity="0.4"
      />
      <circle cx="71" cy="74" r="20" opacity="0.4" />
    </g>
    <g fill="#bd93f9">
      <path
        d="M38 48h124M38 68h124M38 88h124"
        strokeWidth="8"
        stroke="currentColor"
        strokeLinecap="round"
        opacity="0.3"
      />
      <text
        x="100"
        y="156"
        fontSize="16"
        fontFamily="system-ui, sans-serif"
        textAnchor="middle"
        fill="#f8f8f2"
      >
        Product Image
      </text>
    </g>
    <path
      d="M60 133l25-25 10 10 35-35"
      stroke="#ff79c6"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

/**
 * URL to a base64-encoded SVG placeholder image
 * Use this when you need a URL string instead of a React component
 */
export const placeholderImageUrl = `data:image/svg+xml;base64,${btoa(`
<svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#44475a" />
  <g fill="#6272a4">
    <path d="M33 89c0-7.7 6.3-14 14-14h106c7.7 0 14 6.3 14 14v72c0 7.7-6.3 14-14 14H47c-7.7 0-14-6.3-14-14V89z" opacity="0.4" />
    <circle cx="71" cy="74" r="20" opacity="0.4" />
  </g>
  <g fill="#bd93f9">
    <path d="M38 48h124M38 68h124M38 88h124" stroke="#bd93f9" stroke-width="8" stroke-linecap="round" opacity="0.3" />
    <text x="100" y="156" font-size="16" font-family="system-ui, sans-serif" text-anchor="middle" fill="#f8f8f2">
      Product Image
    </text>
  </g>
  <path d="M60 133l25-25 10 10 35-35" stroke="#ff79c6" stroke-width="4" stroke-linecap="round" fill="none" />
</svg>
`)}`;
