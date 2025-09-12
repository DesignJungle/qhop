import React from 'react';
import { IonProgressBar, IonText } from '@ionic/react';
import './QHopProgress.css';

interface QHopProgressProps {
  value: number; // 0-100
  showLabel?: boolean;
  label?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const QHopProgress: React.FC<QHopProgressProps> = ({
  value,
  showLabel = false,
  label,
  variant = 'default',
  size = 'medium',
  className = ''
}) => {
  const progressClasses = `qhop-progress qhop-progress--${variant} qhop-progress--${size} ${className}`;
  const normalizedValue = Math.max(0, Math.min(100, value)) / 100;

  const getProgressColor = () => {
    switch (variant) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'danger':
        return 'danger';
      default:
        return 'primary';
    }
  };

  return (
    <div className={progressClasses}>
      {(showLabel || label) && (
        <div className="qhop-progress__header">
          {label && (
            <IonText className="qhop-progress__label">
              {label}
            </IonText>
          )}
          {showLabel && (
            <IonText className="qhop-progress__value">
              {Math.round(value)}%
            </IonText>
          )}
        </div>
      )}
      <IonProgressBar 
        value={normalizedValue}
        color={getProgressColor()}
        className="qhop-progress__bar"
      />
    </div>
  );
};

export default QHopProgress;
