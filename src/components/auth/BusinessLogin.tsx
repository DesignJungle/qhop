import React, { useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonText,
  IonIcon,
  IonCheckbox,
  IonSpinner,
  IonToast
} from '@ionic/react';
import { 
  businessOutline, 
  mailOutline, 
  lockClosedOutline,
  eyeOutline,
  eyeOffOutline 
} from 'ionicons/icons';
import QHopLogo from '../brand/QHopLogo';
import { authService } from '../../services/AuthService';
import { type BusinessOwner } from '../../services/ApiService';
import './BusinessLogin.css';

interface BusinessLoginProps {
  onLoginSuccess: (owner: BusinessOwner) => void;
  onSwitchToCustomer: () => void;
}

const BusinessLogin: React.FC<BusinessLoginProps> = ({ 
  onLoginSuccess, 
  onSwitchToCustomer 
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      setShowToast(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const session = await authService.businessLogin(email, password);
      const owner = authService.getCurrentBusinessOwner();

      if (owner) {
        if (rememberMe) {
          localStorage.setItem('qhop_business_owner', JSON.stringify(owner));
        }
        onLoginSuccess(owner);
      } else {
        setError('Failed to get business owner information');
        setShowToast(true);
      }
    } catch (error: any) {
      console.error('Business login error:', error);
      setError(error.message || 'Login failed. Please try again.');
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setEmail('sarah@example.com');
    setPassword('demo123');
    
    // Auto-submit after setting demo credentials
    setTimeout(() => {
      const demoEvent = new Event('submit') as any;
      handleLogin(demoEvent);
    }, 100);
  };

  return (
    <div className="business-login-container">
      <IonCard className="business-login-card">
        <IonCardHeader>
          <div className="business-auth-header">
            <QHopLogo size="lg" variant="full" className="qhop-logo-fade-in" />
            <IonCardTitle className="qhop-text-h2">Business Portal</IonCardTitle>
            <IonText className="qhop-text-secondary">
              <p>Manage your queues and grow your business</p>
            </IonText>
          </div>
        </IonCardHeader>

        <IonCardContent>
          <form onSubmit={handleLogin} className="business-login-form">
            {/* Email Input */}
            <IonItem className="auth-input-item">
              <IonIcon icon={mailOutline} slot="start" color="medium" />
              <IonLabel position="stacked">Email Address</IonLabel>
              <IonInput
                type="email"
                value={email}
                onIonInput={(e) => setEmail(e.detail.value!)}
                placeholder="Enter your business email"
                required
                clearInput
              />
            </IonItem>

            {/* Password Input */}
            <IonItem className="auth-input-item">
              <IonIcon icon={lockClosedOutline} slot="start" color="medium" />
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                type={showPassword ? 'text' : 'password'}
                value={password}
                onIonInput={(e) => setPassword(e.detail.value!)}
                placeholder="Enter your password"
                required
              />
              <IonButton
                fill="clear"
                slot="end"
                onClick={() => setShowPassword(!showPassword)}
              >
                <IonIcon icon={showPassword ? eyeOffOutline : eyeOutline} />
              </IonButton>
            </IonItem>

            {/* Remember Me */}
            <div className="auth-options">
              <IonCheckbox
                checked={rememberMe}
                onIonChange={(e) => setRememberMe(e.detail.checked)}
              />
              <IonLabel className="remember-label">Remember me</IonLabel>
            </div>

            {/* Login Button */}
            <IonButton
              expand="block"
              type="submit"
              className="auth-submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <IonSpinner name="crescent" />
                  <span style={{ marginLeft: '8px' }}>Signing In...</span>
                </>
              ) : (
                <>
                  <IonIcon icon={businessOutline} slot="start" />
                  Sign In to Dashboard
                </>
              )}
            </IonButton>

            {/* Demo Login */}
            <IonButton
              expand="block"
              fill="outline"
              onClick={handleDemoLogin}
              disabled={isLoading}
              className="demo-button"
            >
              Try Demo Account
            </IonButton>

            {/* Forgot Password */}
            <div className="auth-links">
              <IonButton fill="clear" size="small">
                Forgot Password?
              </IonButton>
            </div>
          </form>

          {/* Switch to Customer */}
          <div className="auth-switch">
            <IonText className="qhop-text-secondary">
              <p>
                Are you a customer?{' '}
                <IonButton 
                  fill="clear" 
                  size="small" 
                  onClick={onSwitchToCustomer}
                  className="switch-button"
                >
                  Customer Login
                </IonButton>
              </p>
            </IonText>
          </div>

          {/* Business Features */}
          <div className="business-features">
            <IonText className="qhop-text-secondary">
              <h4>Business Dashboard Features:</h4>
              <ul>
                <li>Real-time queue management</li>
                <li>Customer analytics and insights</li>
                <li>Staff management tools</li>
                <li>Revenue tracking</li>
                <li>Automated notifications</li>
              </ul>
            </IonText>
          </div>
        </IonCardContent>
      </IonCard>

      {/* Error Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={error}
        duration={3000}
        color="danger"
        position="top"
      />


    </div>
  );
};

export default BusinessLogin;
