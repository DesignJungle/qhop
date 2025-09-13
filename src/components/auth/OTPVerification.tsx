import React, { useState, useEffect, useRef } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonInput,
  IonText,
  IonIcon,
  IonSpinner
} from '@ionic/react';
import { shieldCheckmarkOutline, arrowBackOutline, refreshOutline } from 'ionicons/icons';
import { authService, type OTPVerification } from '../../services/AuthService';
import QHopLogo from '../brand/QHopLogo';

interface OTPVerificationProps {
  phone: string;
  sessionId: string;
  onVerificationSuccess: () => void;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  phone,
  sessionId,
  onVerificationSuccess,
  onBack
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const inputRefs = useRef<(HTMLIonInputElement | null)[]>([]);

  // Timer for OTP expiry
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatPhoneNumber = (phone: string): string => {
    // Format phone number for display
    if (phone.startsWith('+234')) {
      const number = phone.slice(4);
      return `+234 ${number.slice(0, 3)} ${number.slice(3, 7)} ${number.slice(7)}`;
    }
    return phone;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pastedOtp = value.slice(0, 6).split('');
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + pastedOtp.length, 5);
      inputRefs.current[nextIndex]?.setFocus();
    } else {
      // Single digit input
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.setFocus();
      }
    }
    
    setError(null);
  };

  const handleKeyDown = (index: number, event: any) => {
    if (event.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.setFocus();
    }
  };

  const handleVerifyOTP = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const verification: OTPVerification = {
        phone,
        otp: otpString,
        sessionId
      };

      await authService.verifyOTP(verification);
      onVerificationSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid verification code');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.setFocus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError(null);

    try {
      // Extract country code and phone number
      const countryCode = phone.substring(0, 4); // e.g., "+234"
      const phoneNumber = phone.substring(4); // rest of the number

      await authService.requestOTP({
        phone: phoneNumber,
        countryCode
      });

      setTimeLeft(300); // Reset timer
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.setFocus();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  // Auto-submit when all digits are entered
  useEffect(() => {
    const otpString = otp.join('');
    if (otpString.length === 6 && !isLoading) {
      handleVerifyOTP();
    }
  }, [otp]);

  return (
    <div className="qhop-otp-verification">
      <IonCard className="qhop-auth-card">
        <IonCardHeader>
          <div className="qhop-auth-header">
            <IonButton
              fill="clear"
              className="qhop-back-button"
              onClick={onBack}
            >
              <IonIcon icon={arrowBackOutline} />
            </IonButton>
            
            <QHopLogo size="md" variant="icon" className="qhop-logo-fade-in" />
            <IonCardTitle className="qhop-text-h2">Verify Your Phone</IonCardTitle>
            <IonText className="qhop-text-secondary">
              <p>Enter the 6-digit code sent to</p>
              <p className="qhop-phone-display">{formatPhoneNumber(phone)}</p>
            </IonText>
          </div>
        </IonCardHeader>

        <IonCardContent>
          {/* OTP Input Grid */}
          <div className="qhop-otp-input-grid">
            {otp.map((digit, index) => (
              <IonInput
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="tel"
                value={digit}
                onIonInput={(e) => handleOtpChange(index, e.detail.value!)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="qhop-otp-input"
                maxlength={6}
                disabled={isLoading}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <IonText color="danger" className="qhop-error-text">
              <p>{error}</p>
            </IonText>
          )}

          {/* Timer and Resend */}
          <div className="qhop-timer-section">
            {timeLeft > 0 ? (
              <IonText className="qhop-text-secondary">
                <p>Code expires in {formatTime(timeLeft)}</p>
              </IonText>
            ) : (
              <IonText color="danger">
                <p>Code has expired</p>
              </IonText>
            )}

            <IonButton
              fill="clear"
              size="small"
              onClick={handleResendOTP}
              disabled={!canResend || isResending}
              className="qhop-resend-button"
            >
              {isResending ? (
                <>
                  <IonSpinner name="crescent" />
                  <span style={{ marginLeft: '4px' }}>Sending...</span>
                </>
              ) : (
                <>
                  <IonIcon icon={refreshOutline} slot="start" />
                  Resend Code
                </>
              )}
            </IonButton>
          </div>

          {/* Verify Button */}
          <IonButton
            expand="block"
            className="qhop-primary-button qhop-auth-button"
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.join('').length !== 6}
          >
            {isLoading ? (
              <>
                <IonSpinner name="crescent" />
                <span style={{ marginLeft: '8px' }}>Verifying...</span>
              </>
            ) : (
              'Verify Code'
            )}
          </IonButton>

          {/* Help Text */}
          <IonText className="qhop-text-caption qhop-help-text">
            <p>
              Didn't receive the code? Check your SMS messages or try resending.
              If you continue to have issues, please contact support.
            </p>
          </IonText>
        </IonCardContent>
      </IonCard>

      <style>{`
        .qhop-otp-verification {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: var(--qhop-spacing-md);
          background: var(--qhop-gradient-primary-soft);
        }

        .qhop-back-button {
          position: absolute;
          top: var(--qhop-spacing-sm);
          left: var(--qhop-spacing-sm);
          z-index: 10;
        }

        .qhop-phone-display {
          font-weight: 600;
          color: var(--qhop-primary-600);
          font-size: 1.1em;
        }

        .qhop-otp-input-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: var(--qhop-spacing-sm);
          margin: var(--qhop-spacing-lg) 0;
        }

        .qhop-otp-input {
          --background: var(--qhop-neutral-50);
          --border-color: var(--qhop-neutral-200);
          --border-radius: var(--qhop-radius-md);
          --padding: var(--qhop-spacing-md);
          text-align: center;
          font-size: 1.5em;
          font-weight: 600;
          height: 56px;
        }

        .qhop-otp-input.ion-focused {
          --border-color: var(--qhop-primary-600);
          --background: var(--qhop-primary-50);
        }

        .qhop-timer-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--qhop-spacing-sm);
          margin: var(--qhop-spacing-lg) 0;
        }

        .qhop-resend-button {
          --color: var(--qhop-primary-600);
          font-size: 0.9em;
        }

        .qhop-help-text {
          text-align: center;
          margin-top: var(--qhop-spacing-md);
          line-height: 1.4;
        }

        @media (max-width: 480px) {
          .qhop-otp-input-grid {
            gap: var(--qhop-spacing-xs);
          }
          
          .qhop-otp-input {
            height: 48px;
            font-size: 1.3em;
          }
        }
      `}</style>
    </div>
  );
};

export default OTPVerification;
