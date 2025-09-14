import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonToggle,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { createGesture, GestureDetail } from '@ionic/react';
import {
  peopleOutline,
  notificationsOutline,
  timeOutline,
  checkmarkCircleOutline,
  arrowForwardOutline,
  settingsOutline,
  phonePortraitOutline,
  colorPaletteOutline
} from 'ionicons/icons';
import QHopLogo from '../components/brand/QHopLogo';
import { QHopButton } from '../components';
import { useOnboarding } from '../contexts/OnboardingContext';
import './Onboarding.css';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const { state: onboardingState, actions: onboardingActions } = useOnboarding();

  const slides = [
    {
      id: 1,
      title: "Welcome to QHop",
      subtitle: "End waiting lines, everywhere",
      description: "Transform how you wait with smart virtual queues. Join lines remotely and get your time back.",
      icon: <QHopLogo size="xl" variant="icon" />,
      color: "primary",
      features: ["🎯 Smart queue management", "📱 Mobile-first experience", "⚡ Instant notifications"]
    },
    {
      id: 2,
      title: "Discover & Join Queues",
      subtitle: "Find businesses near you",
      description: "Browse nearby clinics, barbers, restaurants, and services. See real-time wait times and join instantly.",
      icon: <IonIcon icon={peopleOutline} style={{ fontSize: '80px', color: 'var(--qhop-primary-600)' }} />,
      color: "success",
      features: ["🔍 Search by location", "⏱️ Live wait times", "📍 GPS integration"]
    },
    {
      id: 3,
      title: "Smart Notifications",
      subtitle: "Never miss your turn",
      description: "Get intelligent alerts when you're next in line. Our AI predicts your exact turn time.",
      icon: <IonIcon icon={notificationsOutline} style={{ fontSize: '80px', color: 'var(--qhop-accent-500)' }} />,
      color: "warning",
      features: ["🔔 Smart alerts", "🤖 AI predictions", "📊 Real-time updates"]
    },
    {
      id: 4,
      title: "Maximize Your Time",
      subtitle: "Be productive while you wait",
      description: "Use your waiting time for what matters. Work, shop, or relax - we'll notify you when it's time.",
      icon: <IonIcon icon={timeOutline} style={{ fontSize: '80px', color: 'var(--qhop-primary-600)' }} />,
      color: "tertiary",
      features: ["⏰ Time tracking", "📈 Productivity insights", "🎯 Smart scheduling"]
    },
    {
      id: 5,
      title: "Customize Your Experience",
      subtitle: "Personalize QHop for you",
      description: "Configure your preferences to get the most out of QHop. You can change these anytime in settings.",
      icon: <IonIcon icon={settingsOutline} style={{ fontSize: '80px', color: 'var(--qhop-primary-600)' }} />,
      color: "tertiary",
      features: ["🎨 Theme preferences", "📳 Haptic feedback", "🔔 Notification settings"],
      isSettings: true
    },
    {
      id: 6,
      title: "You're All Set!",
      subtitle: "Ready to eliminate waiting?",
      description: "Join 50,000+ users who have saved over 100,000 hours of waiting time with QHop.",
      icon: <IonIcon icon={checkmarkCircleOutline} style={{ fontSize: '80px', color: 'var(--qhop-accent-500)' }} />,
      color: "success",
      features: ["👥 50,000+ active users", "⏱️ 100,000+ hours saved", "⭐ 4.9/5 rating"]
    }
  ];

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    onboardingActions.triggerHaptic('light');

    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      onboardingActions.triggerHaptic('medium');
      onComplete();
    }

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    onboardingActions.triggerHaptic('light');

    if (activeSlide > 0) {
      setActiveSlide(activeSlide - 1);
    }

    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToSlide = (index: number) => {
    if (isTransitioning || index === activeSlide) return;
    setIsTransitioning(true);
    onboardingActions.triggerHaptic('light');
    setActiveSlide(index);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight' || event.key === ' ') {
        nextSlide();
      } else if (event.key === 'Escape') {
        onComplete();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [activeSlide, isTransitioning]);

  // Swipe gesture setup
  useEffect(() => {
    if (!slideRef.current) return;

    const gesture = createGesture({
      el: slideRef.current,
      threshold: 15,
      gestureName: 'swipe',
      onMove: (detail: GestureDetail) => {
        // Optional: Add visual feedback during swipe
      },
      onEnd: (detail: GestureDetail) => {
        const threshold = 50;
        if (detail.deltaX > threshold) {
          prevSlide();
        } else if (detail.deltaX < -threshold) {
          nextSlide();
        }
      }
    });

    gesture.enable();
    return () => gesture.destroy();
  }, [activeSlide, isTransitioning]);

  const currentSlide = slides[activeSlide];

  return (
    <IonPage className="onboarding-page">
      <IonContent fullscreen className="onboarding-content">
        <div
          ref={slideRef}
          className={`onboarding-slide ${isTransitioning ? 'transitioning' : ''}`}
        >
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

                  {/* Feature highlights */}
                  {currentSlide.features && !currentSlide.isSettings && (
                    <div className="onboarding-features">
                      {currentSlide.features.map((feature, index) => (
                        <div
                          key={index}
                          className="onboarding-feature"
                          style={{ animationDelay: `${index * 0.2}s` }}
                        >
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Settings panel */}
                  {currentSlide.isSettings && (
                    <div className="onboarding-settings">
                      <IonList className="onboarding-settings-list">
                        <IonItem className="onboarding-setting-item">
                          <IonIcon icon={phonePortraitOutline} slot="start" />
                          <IonLabel>
                            <h3>Haptic Feedback</h3>
                            <p>Feel vibrations for interactions</p>
                          </IonLabel>
                          <IonToggle
                            checked={onboardingState.userPreferences.enableHaptics}
                            onIonChange={(e) => {
                              onboardingActions.updatePreferences({ enableHaptics: e.detail.checked });
                              if (e.detail.checked) onboardingActions.triggerHaptic('medium');
                            }}
                          />
                        </IonItem>

                        <IonItem className="onboarding-setting-item">
                          <IonIcon icon={colorPaletteOutline} slot="start" />
                          <IonLabel>
                            <h3>Theme Preference</h3>
                            <p>Choose your preferred theme</p>
                          </IonLabel>
                          <IonSelect
                            value={onboardingState.userPreferences.preferredTheme}
                            onIonChange={(e) => onboardingActions.updatePreferences({ preferredTheme: e.detail.value })}
                            interface="popover"
                          >
                            <IonSelectOption value="auto">Auto</IonSelectOption>
                            <IonSelectOption value="light">Light</IonSelectOption>
                            <IonSelectOption value="dark">Dark</IonSelectOption>
                          </IonSelect>
                        </IonItem>

                        <IonItem className="onboarding-setting-item">
                          <IonIcon icon={settingsOutline} slot="start" />
                          <IonLabel>
                            <h3>Animations</h3>
                            <p>Enable smooth animations</p>
                          </IonLabel>
                          <IonToggle
                            checked={onboardingState.userPreferences.enableAnimations}
                            onIonChange={(e) => onboardingActions.updatePreferences({ enableAnimations: e.detail.checked })}
                          />
                        </IonItem>
                      </IonList>
                    </div>
                  )}
                </div>
              </IonCol>
            </IonRow>

            <IonRow className="onboarding-controls-row">
              <IonCol size="12" className="onboarding-progress-col">
                <div className="onboarding-progress-container">
                  <div className="onboarding-progress-bar">
                    <div
                      className="onboarding-progress-fill"
                      style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }}
                    />
                  </div>
                  <span className="onboarding-progress-text">
                    {activeSlide + 1} of {slides.length}
                  </span>
                </div>
              </IonCol>

              <IonCol size="12" className="onboarding-indicators-col">
                <div className="onboarding-indicators">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      className={`onboarding-indicator ${i === activeSlide ? 'active' : ''} ${i < activeSlide ? 'completed' : ''}`}
                      onClick={() => goToSlide(i)}
                      aria-label={`Go to slide ${i + 1}`}
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
