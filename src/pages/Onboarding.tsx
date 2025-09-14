import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import {
  peopleOutline,
  notificationsOutline,
  timeOutline,
  checkmarkCircleOutline,
  arrowForwardOutline
} from 'ionicons/icons';
import QHopLogo from '../components/brand/QHopLogo';
import { QHopButton } from '../components';
import './Onboarding.css';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "Welcome to QHop",
      subtitle: "End waiting lines, everywhere",
      description: "Join virtual queues at your favorite businesses and get notified when it's your turn.",
      icon: <QHopLogo size="xl" variant="icon" />,
      color: "primary"
    },
    {
      id: 2,
      title: "Smart Queue Management",
      subtitle: "Join queues remotely",
      description: "Find nearby businesses, join their queues instantly, and track your position in real-time.",
      icon: <IonIcon icon={peopleOutline} style={{ fontSize: '80px', color: 'var(--qhop-primary-600)' }} />,
      color: "success"
    },
    {
      id: 3,
      title: "Real-Time Notifications",
      subtitle: "Never miss your turn",
      description: "Get instant notifications when you're next in line, with smart ETA calculations.",
      icon: <IonIcon icon={notificationsOutline} style={{ fontSize: '80px', color: 'var(--qhop-accent-500)' }} />,
      color: "warning"
    },
    {
      id: 4,
      title: "Save Your Time",
      subtitle: "Do more with your day",
      description: "Use your waiting time productively. Shop, work, or relax while we hold your place in line.",
      icon: <IonIcon icon={timeOutline} style={{ fontSize: '80px', color: 'var(--qhop-primary-600)' }} />,
      color: "tertiary"
    },
    {
      id: 5,
      title: "Ready to Start?",
      subtitle: "Let's get you set up",
      description: "Join thousands of users who have already eliminated waiting from their daily routine.",
      icon: <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '80px', color: 'var(--qhop-accent-500)' }} />,
      color: "success"
    }
  ];

  const nextSlide = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }
  };

  const goToSlide = (index: number) => {
    setActiveSlide(index);
  };

  const currentSlide = slides[activeSlide];

  return (
    <IonPage className="onboarding-page">
      <IonContent fullscreen className="onboarding-content">
        <div className="onboarding-slide">
          <IonGrid className="onboarding-grid">
            <IonRow className="onboarding-content-row">
              <IonCol size="12" className="onboarding-icon-col">
                <div className="onboarding-icon-container">
                  {currentSlide.icon}
                </div>
              </IonCol>

              <IonCol size="12" className="onboarding-text-col">
                <div className="onboarding-text-container">
                  <IonText className="onboarding-title">
                    <h1>{currentSlide.title}</h1>
                  </IonText>

                  <IonText className="onboarding-subtitle">
                    <h2>{currentSlide.subtitle}</h2>
                  </IonText>

                  <IonText className="onboarding-description">
                    <p>{currentSlide.description}</p>
                  </IonText>
                </div>
              </IonCol>
            </IonRow>

            <IonRow className="onboarding-controls-row">
              <IonCol size="12" className="onboarding-indicators-col">
                <div className="onboarding-indicators">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      className={`onboarding-indicator ${i === activeSlide ? 'active' : ''}`}
                      onClick={() => goToSlide(i)}
                    />
                  ))}
                </div>
              </IonCol>

              <IonCol size="12" className="onboarding-buttons-col">
                <div className="onboarding-buttons">
                  {activeSlide > 0 && (
                    <QHopButton
                      variant="secondary"
                      size="medium"
                      onClick={prevSlide}
                      className="onboarding-prev-btn"
                    >
                      Back
                    </QHopButton>
                  )}

                  <QHopButton
                    variant="primary"
                    size="medium"
                    onClick={nextSlide}
                    className="onboarding-next-btn"
                  >
                    {activeSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                    <IonIcon icon={arrowForwardOutline} slot="end" />
                  </QHopButton>
                </div>
              </IonCol>

              <IonCol size="12" className="onboarding-skip-col">
                {activeSlide < slides.length - 1 && (
                  <IonButton
                    fill="clear"
                    size="small"
                    onClick={onComplete}
                    className="onboarding-skip-btn"
                  >
                    Skip Tutorial
                  </IonButton>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Onboarding;
