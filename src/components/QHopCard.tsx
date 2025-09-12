import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import './QHopCard.css';

interface QHopCardProps {
  children: React.ReactNode;
  title?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'priority';
  className?: string;
  onClick?: () => void;
  button?: boolean;
}

const QHopCard: React.FC<QHopCardProps> = ({
  children,
  title,
  variant = 'default',
  className = '',
  onClick,
  button = false
}) => {
  const cardClasses = `qhop-card qhop-card--${variant} ${className}`;

  return (
    <IonCard 
      className={cardClasses}
      button={button || !!onClick}
      onClick={onClick}
    >
      {title && (
        <IonCardHeader>
          <IonCardTitle className="qhop-card__title">{title}</IonCardTitle>
        </IonCardHeader>
      )}
      <IonCardContent className="qhop-card__content">
        {children}
      </IonCardContent>
    </IonCard>
  );
};

export default QHopCard;
