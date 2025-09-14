import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonText,
  IonSpinner
} from '@ionic/react';
import QHopLogo from '../components/brand/QHopLogo';
import './SplashScreen.css';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [showText, setShowText] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing QHop...');

  useEffect(() => {
    const messages = [
      'Initializing QHop...',
      'Loading queue data...',
      'Connecting to services...',
      'Preparing your experience...',
      'Almost ready!'
    ];

    // Show logo after a brief delay
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);

    // Show text after logo
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 800);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;
        const messageIndex = Math.floor((newProgress / 100) * messages.length);
        if (messageIndex < messages.length) {
          setLoadingMessage(messages[messageIndex]);
        }
        return Math.min(newProgress, 100);
      });
    }, 200);

    // Complete splash screen after animation
    const completeTimer = setTimeout(() => {
      setLoadingProgress(100);
      setLoadingMessage('Welcome to QHop!');
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(onComplete, 500); // Allow fade out animation
      }, 500);
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <IonPage className="splash-screen">
      <IonContent fullscreen className="splash-content">
        <div className="splash-container">
          <div className={`splash-logo-container ${showLogo ? 'show' : ''}`}>
            <QHopLogo size="xl" variant="icon" />
          </div>

          <div className={`splash-text-container ${showText ? 'show' : ''}`}>
            <IonText className="splash-title">
              <h1>QHop</h1>
            </IonText>

            <IonText className="splash-tagline">
              <p>End waiting lines, everywhere</p>
            </IonText>
          </div>

          <div className={`splash-loading-container ${showText ? 'show' : ''}`}>
            {isLoading && (
              <>
                <div className="splash-progress-container">
                  <div className="splash-progress-bar">
                    <div
                      className="splash-progress-fill"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                  <div className="splash-progress-text">
                    {Math.round(loadingProgress)}%
                  </div>
                </div>

                <IonText className="splash-loading-message">
                  <p>{loadingMessage}</p>
                </IonText>

                <div className="splash-dots">
                  <span className="splash-dot"></span>
                  <span className="splash-dot"></span>
                  <span className="splash-dot"></span>
                </div>
              </>
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreen;
