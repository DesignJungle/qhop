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

  // Enhanced QHop logo design with animations and improved visual effects
  const LogoIcon = () => (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="qhop-logo-icon"
    >
      <defs>
        <linearGradient id={`qhop-gradient-${iconSize}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1DD1A1" />
          <stop offset="30%" stopColor="#10AC84" />
          <stop offset="70%" stopColor="#0984e3" />
          <stop offset="100%" stopColor="#6c5ce7" />
        </linearGradient>
        <linearGradient id={`qhop-inner-gradient-${iconSize}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8f9fa" />
        </linearGradient>
        <filter id={`shadow-${iconSize}`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(0,0,0,0.15)"/>
        </filter>
        <filter id={`inner-shadow-${iconSize}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.05)"/>
        </filter>
        <radialGradient id={`people-gradient-${iconSize}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#0984e3" />
          <stop offset="100%" stopColor="#6c5ce7" />
        </radialGradient>
      </defs>

      {/* Main circular background with enhanced gradient */}
      <circle
        cx="50"
        cy="50"
        r="45"
        fill={`url(#qhop-gradient-${iconSize})`}
        filter={`url(#shadow-${iconSize})`}
        className="qhop-logo-bg"
      />

      {/* Inner highlight ring */}
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        className="qhop-logo-highlight"
      />

      {/* White inner circle with subtle gradient */}
      <circle
        cx="50"
        cy="50"
        r="35"
        fill={`url(#qhop-inner-gradient-${iconSize})`}
        filter={`url(#inner-shadow-${iconSize})`}
        className="qhop-logo-inner"
      />

      {/* Queue people icons with enhanced styling */}
      <g fill={`url(#people-gradient-${iconSize})`} className="qhop-logo-people">
        {/* Person 1 - Animated */}
        <g className="qhop-person qhop-person-1">
          <circle cx="35" cy="40" r="4.5" />
          <rect x="30.5" y="45" width="9" height="11" rx="2.5" />
        </g>

        {/* Person 2 - Center (highlighted) */}
        <g className="qhop-person qhop-person-2">
          <circle cx="50" cy="38" r="5" />
          <rect x="45" y="44" width="10" height="12" rx="3" />
        </g>

        {/* Person 3 - Animated */}
        <g className="qhop-person qhop-person-3">
          <circle cx="65" cy="40" r="4.5" />
          <rect x="60.5" y="45" width="9" height="11" rx="2.5" />
        </g>
      </g>

      {/* Enhanced action icon with pulse animation */}
      <g transform="translate(68, 68)" className="qhop-action-icon">
        <circle cx="0" cy="0" r="13" fill="#fd79a8" className="qhop-action-bg" />
        <circle cx="0" cy="0" r="11" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <g fill="white" transform="scale(0.9)">
          <circle cx="-2" cy="-2" r="3.5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="1.5" y1="1.5" x2="5" y2="5" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      </g>

      {/* Subtle connecting lines showing queue flow */}
      <g stroke="rgba(9, 132, 227, 0.2)" strokeWidth="1.5" strokeDasharray="2,2" className="qhop-flow-lines">
        <line x1="39" y1="50" x2="46" y2="50" />
        <line x1="54" y1="50" x2="61" y2="50" />
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
