import React from 'react';

interface ProductPlaceholderProps {
  productName: string;
  primaryColor?: string;
  className?: string;
}

export const ProductPlaceholder = ({ 
  productName, 
  primaryColor = "#3b82f6", 
  className = "w-full h-full" 
}: ProductPlaceholderProps) => {
  // Generate initials from product name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // Generate a light version of the primary color for gradient
  const lightenColor = (color: string, percent: number) => {
    // Remove # if present
    const hex = color.replace('#', '');
    
    // Parse RGB values
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Lighten each component
    const newR = Math.min(255, Math.floor(r + (255 - r) * percent));
    const newG = Math.min(255, Math.floor(g + (255 - g) * percent));
    const newB = Math.min(255, Math.floor(b + (255 - b) * percent));
    
    // Convert back to hex
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  const initials = getInitials(productName);
  const lightColor = lightenColor(primaryColor, 0.3);

  return (
    <svg 
      className={className}
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`gradient-${initials}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={lightColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
      </defs>
      
      {/* Background circle */}
      <circle 
        cx="100" 
        cy="100" 
        r="90" 
        fill={`url(#gradient-${initials})`}
        opacity="0.9"
      />
      
      {/* Product icon background */}
      <circle 
        cx="100" 
        cy="80" 
        r="35" 
        fill="white" 
        fillOpacity="0.2"
      />
      
      {/* Simple product icon */}
      <path
        d="M70 70 L130 70 L125 90 L75 90 Z M80 90 L120 90 L115 110 L85 110 Z"
        fill="white"
        fillOpacity="0.8"
      />
      
      {/* Product name initials */}
      <text
        x="100"
        y="145"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="24"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        {initials}
      </text>
    </svg>
  );
};