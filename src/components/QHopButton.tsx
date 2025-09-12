import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import './QHopButton.css';

interface QHopButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  startIcon?: string;
  endIcon?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const QHopButton: React.FC<QHopButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  startIcon,
  endIcon,
  onClick,
  type = 'button',
  className = ''
}) => {
  const getIonicProps = () => {
    const props: any = {
      disabled: disabled || loading,
      onClick,
      type,
      className: `qhop-button qhop-button--${variant} qhop-button--${size} ${fullWidth ? 'qhop-button--full-width' : ''} ${className}`,
      size: size === 'small' ? 'small' : size === 'large' ? 'large' : 'default'
    };

    switch (variant) {
      case 'primary':
        props.fill = 'solid';
        props.color = 'primary';
        break;
      case 'secondary':
        props.fill = 'outline';
        props.color = 'primary';
        break;
      case 'ghost':
        props.fill = 'clear';
        props.color = 'primary';
        break;
      case 'destructive':
        props.fill = 'solid';
        props.color = 'danger';
        break;
    }

    return props;
  };

  return (
    <IonButton {...getIonicProps()}>
      {startIcon && <IonIcon icon={startIcon} slot="start" />}
      {loading ? (
        <div className="qhop-button__loading">
          <div className="qhop-button__spinner"></div>
          Loading...
        </div>
      ) : (
        children
      )}
      {endIcon && <IonIcon icon={endIcon} slot="end" />}
    </IonButton>
  );
};

export default QHopButton;
