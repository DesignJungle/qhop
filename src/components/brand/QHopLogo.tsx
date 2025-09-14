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

  // New QHop logo design with queue management theme
  const LogoIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="qhop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1DD1A1" />
          <stop offset="50%" stopColor="#10AC84" />
          <stop offset="100%" stopColor="#0984e3" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.1)"/>
        </filter>
      </defs>

      {/* Main circular background */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill="url(#qhop-gradient)"
        filter="url(#shadow)"
      />

      {/* White inner circle */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill="white"
      />

      {/* Queue people icons */}
      <g fill="#0984e3">
        {/* Person 1 */}
        <circle cx="35" cy="40" r="4" />
        <rect x="31" y="45" width="8" height="10" rx="2" />

        {/* Person 2 */}
        <circle cx="50" cy="40" r="4" />
        <rect x="46" y="45" width="8" height="10" rx="2" />

        {/* Person 3 */}
        <circle cx="65" cy="40" r="4" />
        <rect x="61" y="45" width="8" height="10" rx="2" />
      </g>

      {/* Orange search/action icon */}
      <g transform="translate(65, 65)">
        <circle cx="0" cy="0" r="12" fill="#fd79a8" />
        <g fill="white" transform="scale(0.8)">
          <circle cx="-3" cy="-3" r="4" fill="none" stroke="white" strokeWidth="2" />
          <line x1="2" y1="2" x2="6" y2="6" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </g>
      </g>
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
