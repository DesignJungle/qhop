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

  useEffect(() => {
    // Show logo after a brief delay
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 300);

    // Complete splash screen after animation
    const completeTimer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(onComplete, 500); // Allow fade out animation
    }, 2500);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <IonPage className="splash-screen">
      <IonContent fullscreen className="splash-content">
        <div className="splash-container">
          <div className={`splash-logo-container ${showLogo ? 'show' : ''}`}>
            <QHopLogo size="xl" variant="icon" />
          </div>
          
          <div className={`splash-text-container ${showLogo ? 'show' : ''}`}>
            <IonText className="splash-title">
              <h1>QHop</h1>
            </IonText>
            
            <IonText className="splash-tagline">
              <p>End waiting lines, everywhere</p>
            </IonText>
          </div>
          
          <div className={`splash-loading-container ${showLogo ? 'show' : ''}`}>
            {isLoading && (
              <IonSpinner 
                name="crescent" 
                className="splash-spinner"
                color="primary"
              />
            )}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default SplashScreen;
