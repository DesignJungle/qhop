import React, { useState } from 'react';
import PhoneLogin from './PhoneLogin';
import OTPVerification from './OTPVerification';
import { useQHop } from '../../contexts/QHopContext';

type AuthStep = 'phone' | 'otp';

const AuthContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AuthStep>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [sessionId, setSessionId] = useState('');
  const { actions } = useQHop();

  const handleOTPRequested = (phone: string, session: string) => {
    setPhoneNumber(phone);
    setSessionId(session);
    setCurrentStep('otp');
  };

  const handleVerificationSuccess = async () => {
    // The AuthService has already stored the session
    // Now we need to update the QHop context
    const { authService } = await import('../../services/AuthService');
    const currentUser = authService.getCurrentUser();

    if (currentUser) {
      // Update QHop context with authenticated user
      actions.setUser({
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        phone: currentUser.phone,
        isAuthenticated: true
      });
    }
  };

  const handleBackToPhone = () => {
    setCurrentStep('phone');
    setPhoneNumber('');
    setSessionId('');
  };

  return (
    <div className="qhop-auth-container">
      {currentStep === 'phone' && (
        <PhoneLogin onOTPRequested={handleOTPRequested} />
      )}
      
      {currentStep === 'otp' && (
        <OTPVerification
          phone={phoneNumber}
          sessionId={sessionId}
          onVerificationSuccess={handleVerificationSuccess}
          onBack={handleBackToPhone}
        />
      )}
    </div>
  );
};

export default AuthContainer;
