import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText,
  IonIcon,
  IonSpinner,
  IonToast
} from '@ionic/react';
import { phonePortraitOutline, shieldCheckmarkOutline } from 'ionicons/icons';
import { authService, OTPRequest } from '../../services/AuthService';
import QHopLogo from '../brand/QHopLogo';
import '../brand/QHopLogo.css';

interface PhoneLoginProps {
  onOTPRequested: (phone: string, sessionId: string) => void;
  onSwitchToBusiness?: () => void;
}

const PhoneLogin: React.FC<PhoneLoginProps> = ({ onOTPRequested, onSwitchToBusiness }) => {
  const [countryCode, setCountryCode] = useState('+234');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const countryCodes = [
    { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
    { code: '+1', country: 'United States', flag: '🇺🇸' },
    { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
    { code: '+91', country: 'India', flag: '🇮🇳' },
    { code: '+86', country: 'China', flag: '🇨🇳' },
    { code: '+33', country: 'France', flag: '🇫🇷' },
    { code: '+49', country: 'Germany', flag: '🇩🇪' },
    { code: '+81', country: 'Japan', flag: '🇯🇵' }
  ];

  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if it's a valid length (typically 7-15 digits)
    return cleanPhone.length >= 7 && cleanPhone.length <= 15;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove any non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Format based on country code
    if (countryCode === '+234') {
      // Nigerian format: 080 1234 5678
      if (cleanPhone.length >= 10) {
        return cleanPhone.replace(/(\d{3})(\d{4})(\d{4})/, '$1 $2 $3');
      }
    }
    
    return cleanPhone;
  };

  const handlePhoneChange = (value: string | null | undefined) => {
    if (value !== null && value !== undefined) {
      const formatted = formatPhoneNumber(value);
      setPhoneNumber(formatted);
      setError(null);
    }
  };

  const handleRequestOTP = async () => {
    if (!phoneNumber.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cleanPhone = phoneNumber.replace(/\D/g, '');
      const request: OTPRequest = {
        phone: cleanPhone,
        countryCode: countryCode
      };

      const response = await authService.requestOTP(request);
      const fullPhone = `${countryCode}${cleanPhone}`;
      
      onOTPRequested(fullPhone, response.sessionId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="qhop-phone-login">
      <IonCard className="qhop-auth-card">
        <IonCardHeader>
          <div className="qhop-auth-header">
            <QHopLogo size="lg" variant="full" className="qhop-logo-fade-in" />
            <IonCardTitle className="qhop-text-h2">Welcome to QHop</IonCardTitle>
            <IonText className="qhop-text-secondary">
              <p>Enter your phone number to get started</p>
            </IonText>
          </div>
        </IonCardHeader>

        <IonCardContent>
          <div className="qhop-phone-input-group">
            {/* Country Code Selector */}
            <IonItem className="qhop-country-select">
              <IonLabel position="stacked">Country</IonLabel>
              <IonSelect
                value={countryCode}
                onIonChange={(e) => setCountryCode(e.detail.value)}
                interface="popover"
                placeholder="Select country"
              >
                {countryCodes.map((country) => (
                  <IonSelectOption key={country.code} value={country.code}>
                    {country.flag} {country.country} ({country.code})
                  </IonSelectOption>
                ))}
              </IonSelect>
            </IonItem>

            {/* Phone Number Input */}
            <IonItem className="qhop-phone-input">
              <IonLabel position="stacked">Phone Number</IonLabel>
              <IonInput
                type="tel"
                value={phoneNumber}
                onIonInput={(e) => handlePhoneChange(e.detail.value)}
                placeholder="Enter your phone number"
                maxlength={20}
                disabled={isLoading}
              />
            </IonItem>
          </div>

          {/* Error Message */}
          {error && (
            <IonText color="danger" className="qhop-error-text">
              <p>{error}</p>
            </IonText>
          )}

          {/* Security Notice */}
          <div className="qhop-security-notice">
            <IonIcon icon={shieldCheckmarkOutline} className="qhop-security-icon" />
            <IonText className="qhop-text-caption">
              <p>We'll send you a verification code via SMS. Standard rates may apply.</p>
            </IonText>
          </div>

          {/* Send OTP Button */}
          <IonButton
            expand="block"
            className="qhop-primary-button qhop-auth-button"
            onClick={handleRequestOTP}
            disabled={isLoading || !phoneNumber.trim()}
          >
            {isLoading ? (
              <>
                <IonSpinner name="crescent" />
                <span style={{ marginLeft: '8px' }}>Sending...</span>
              </>
            ) : (
              'Send Verification Code'
            )}
          </IonButton>

          {/* Terms Notice */}
          <IonText className="qhop-text-caption qhop-terms-notice">
            <p>
              By continuing, you agree to QHop's{' '}
              <a href="#" className="qhop-link">Terms of Service</a> and{' '}
              <a href="#" className="qhop-link">Privacy Policy</a>
            </p>
          </IonText>
        </IonCardContent>
      </IonCard>

      {/* Business Portal Switch */}
      {onSwitchToBusiness && (
        <div className="qhop-auth-switch">
          <IonText className="qhop-text-secondary">
            <p>
              Are you a business owner?{' '}
              <IonButton
                fill="clear"
                size="small"
                onClick={onSwitchToBusiness}
                className="qhop-switch-button"
              >
                Business Portal
              </IonButton>
            </p>
          </IonText>
        </div>
      )}

      <style>{`
        .qhop-phone-login {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--qhop-spacing-md);
          background: var(--qhop-gradient-primary-soft);
        }

        .qhop-auth-card {
          width: 100%;
          max-width: 400px;
          margin: 0;
          border-radius: var(--qhop-radius-lg);
          box-shadow: var(--qhop-shadow-lg);
        }

        .qhop-auth-header {
          text-align: center;
          padding: var(--qhop-spacing-md) 0;
        }

        .qhop-auth-icon {
          font-size: 48px;
          color: var(--qhop-primary-600);
          margin-bottom: var(--qhop-spacing-sm);
        }

        .qhop-phone-input-group {
          margin: var(--qhop-spacing-md) 0;
        }

        .qhop-country-select,
        .qhop-phone-input {
          margin-bottom: var(--qhop-spacing-sm);
          border-radius: var(--qhop-radius-md);
          border: 1px solid var(--qhop-neutral-200);
        }

        .qhop-security-notice {
          display: flex;
          align-items: center;
          gap: var(--qhop-spacing-xs);
          margin: var(--qhop-spacing-md) 0;
          padding: var(--qhop-spacing-sm);
          background: var(--qhop-primary-50);
          border-radius: var(--qhop-radius-md);
        }

        .qhop-security-icon {
          color: var(--qhop-primary-600);
          font-size: 16px;
          flex-shrink: 0;
        }

        .qhop-auth-button {
          margin: var(--qhop-spacing-lg) 0 var(--qhop-spacing-md) 0;
          height: 48px;
          font-weight: 600;
        }

        .qhop-terms-notice {
          text-align: center;
          margin-top: var(--qhop-spacing-md);
        }

        .qhop-link {
          color: var(--qhop-primary-600);
          text-decoration: none;
        }

        .qhop-link:hover {
          text-decoration: underline;
        }

        .qhop-error-text {
          margin: var(--qhop-spacing-sm) 0;
          text-align: center;
        }

        .qhop-auth-switch {
          text-align: center;
          margin-top: var(--qhop-space-4);
          padding: var(--qhop-space-3);
        }

        .qhop-auth-switch p {
          margin: 0;
          font-size: 14px;
        }

        .qhop-switch-button {
          --color: var(--qhop-accent-600);
          font-weight: 600;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default PhoneLogin;
