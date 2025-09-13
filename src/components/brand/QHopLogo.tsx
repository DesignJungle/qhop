import React from 'react';

interface QHopLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  variant?: 'full' | 'icon' | 'wordmark';
  className?: string;
  style?: React.CSSProperties;
}

const QHopLogo: React.FC<QHopLogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '',
  style = {}
}) => {
  const getSize = () => {
    if (typeof size === 'number') return size;
    
    const sizeMap = {
      xs: 24,
      sm: 32,
      md: 48,
      lg: 64,
      xl: 128
    };
    
    return sizeMap[size];
  };

  const logoSize = getSize();
  const iconSize = logoSize;
  const fullWidth = variant === 'full' ? logoSize * 2.5 : logoSize;

  // SVG recreation of your logo design
  const LogoIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer ring with gradient */}
      <defs>
        <linearGradient id="qhop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--qhop-primary-600)" />
          <stop offset="50%" stopColor="var(--qhop-accent-500)" />
          <stop offset="100%" stopColor="var(--qhop-primary-600)" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>
      
      {/* Main circular ring */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="url(#qhop-gradient)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray="220 40"
        transform="rotate(-45 50 50)"
        filter="url(#shadow)"
      />
      
      {/* Inner circle (navy background) */}
      <circle
        cx="50"
        cy="50"
        r="25"
        fill="var(--qhop-navy-800)"
      />
      
      {/* Small accent dot */}
      <circle
        cx="75"
        cy="65"
        r="4"
        fill="var(--qhop-primary-600)"
      />
    </svg>
  );

  const Wordmark = () => (
    <svg
      width={logoSize * 1.8}
      height={logoSize * 0.4}
      viewBox="0 0 120 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="18"
        fontFamily="var(--qhop-font-display)"
        fontSize="20"
        fontWeight="600"
        fill="var(--qhop-navy-800)"
      >
        Qhop
      </text>
    </svg>
  );

  const renderLogo = () => {
    switch (variant) {
      case 'icon':
        return <LogoIcon />;
      case 'wordmark':
        return <Wordmark />;
      case 'full':
      default:
        return (
          <div className="qhop-logo-full" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LogoIcon />
            <Wordmark />
          </div>
        );
    }
  };

  return (
    <div 
      className={`qhop-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        width: fullWidth,
        height: logoSize,
        ...style
      }}
    >
      {renderLogo()}
    </div>
  );
};

export default QHopLogo;
