import React from 'react';
import { IonBadge, IonIcon } from '@ionic/react';
import './QHopBadge.css';

interface QHopBadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  className?: string;
}

const QHopBadge: React.FC<QHopBadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'medium',
  icon,
  className = ''
}) => {
  const getIonicColor = () => {
    switch (variant) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      case 'info':
        return 'primary';
      case 'neutral':
      default:
        return 'medium';
    }
  };

  const badgeClasses = `qhop-badge qhop-badge--${variant} qhop-badge--${size} ${className}`;

  return (
    <IonBadge 
      color={getIonicColor()}
      className={badgeClasses}
    >
      {icon && <IonIcon icon={icon} className="qhop-badge__icon" />}
      <span className="qhop-badge__text">{children}</span>
    </IonBadge>
  );
};

export default QHopBadge;
