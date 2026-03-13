import React from 'react';

export const Logo = ({ className = "", size = "md" }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24"
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Gradient Definitions */}
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        
        {/* TM Letters */}
        <path d="M 30 60 L 70 60 L 70 70 L 55 70 L 55 140 L 45 140 L 45 70 L 30 70 Z" fill="url(#blueGradient)" />
        <path d="M 90 60 L 100 60 L 115 120 L 130 60 L 140 60 L 140 140 L 132 140 L 132 80 L 118 140 L 112 140 L 98 80 L 98 140 L 90 140 Z" fill="url(#blueGradient)" />
        
        {/* Upward Arrow with circles */}
        <circle cx="155" cy="75" r="4" fill="url(#arrowGradient)" />
        <circle cx="165" cy="65" r="4" fill="url(#arrowGradient)" />
        <path d="M 145 105 L 175 65 L 185 75" stroke="url(#arrowGradient)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M 175 65 L 175 85 M 175 65 L 160 65" stroke="url(#arrowGradient)" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export default Logo;
