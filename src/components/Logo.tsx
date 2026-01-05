import React from 'react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', className = '' }) => {
  // Generate unique IDs for this component instance to avoid conflicts
  const uniqueId = React.useId();
  const iconGradientId = `iconGradient-${uniqueId}`;
  const textGradientId = `textGradient-${uniqueId}`;
  const arrowPathId = `arrowPath-${uniqueId}`;

  const sizes = {
    small: { width: 180, height: 50, fontSize: '28px', iconSize: 40 },
    medium: { width: 240, height: 60, fontSize: '36px', iconSize: 50 },
    large: { width: 320, height: 80, fontSize: '52px', iconSize: 70 },
  };

  const { width, height, fontSize, iconSize } = sizes[size];

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))' }}
      role="img"
      aria-label="Ex→It Logo"
    >
      <defs>
        {/* Gradient for icon background */}
        <linearGradient id={iconGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
        </linearGradient>
        
        {/* Gradient for text */}
        <linearGradient id={textGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#f0f0f0', stopOpacity: 0.95 }} />
        </linearGradient>

        {/* Arrow path for reuse */}
        <path
          id={arrowPathId}
          d="M 5 5 L 15 5 L 15 2 L 22 7.5 L 15 13 L 15 10 L 5 10 Z"
        />
      </defs>

      {/* Icon background circle */}
      <circle
        cx={iconSize / 2}
        cy={height / 2}
        r={iconSize / 2 - 2}
        fill={`url(#${iconGradientId})`}
        opacity="0.9"
      />

      {/* Exit door icon */}
      <g transform={`translate(${iconSize / 2 - 12}, ${height / 2 - 12})`}>
        {/* Door frame */}
        <rect x="2" y="4" width="16" height="18" rx="1" fill="white" opacity="0.95" />
        <rect x="4" y="6" width="12" height="14" rx="0.5" fill={`url(#${iconGradientId})`} />
        
        {/* Door handle */}
        <circle cx="8" cy="14" r="1.5" fill="white" />
        
        {/* Arrow pointing out */}
        <g transform="translate(-3, 8) scale(0.7)">
          <use href={`#${arrowPathId}`} fill="white" />
        </g>
      </g>

      {/* Text: Ex→It */}
      <text
        x={iconSize + 15}
        y={height / 2 + parseInt(fontSize) / 3}
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif"
        fontSize={fontSize}
        fontWeight="900"
        fill={`url(#${textGradientId})`}
        letterSpacing="1"
      >
        Ex→It
      </text>
    </svg>
  );
};

export default Logo;
