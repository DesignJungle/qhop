import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingState {
  hasSeenSplash: boolean;
  hasCompletedOnboarding: boolean;
  isFirstLaunch: boolean;
  userPreferences: {
    enableHaptics: boolean;
    enableAnimations: boolean;
    preferredTheme: 'auto' | 'light' | 'dark';
  };
  onboardingCompletedAt?: string;
  appVersion: string;
}

interface OnboardingContextType {
  state: OnboardingState;
  actions: {
    completeSplash: () => void;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
    updatePreferences: (preferences: Partial<OnboardingState['userPreferences']>) => void;
    triggerHaptic: (type?: 'light' | 'medium' | 'heavy') => void;
  };
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

interface OnboardingProviderProps {
  children: ReactNode;
}

const ONBOARDING_STORAGE_KEY = 'qhop_onboarding_state';

export const OnboardingProvider: React.FC<OnboardingProviderProps> = ({ children }) => {
  const [state, setState] = useState<OnboardingState>({
    hasSeenSplash: false,
    hasCompletedOnboarding: false,
    isFirstLaunch: true,
    userPreferences: {
      enableHaptics: true,
      enableAnimations: true,
      preferredTheme: 'auto'
    },
    appVersion: '1.0.0'
  });

  // Load onboarding state from localStorage on mount
  useEffect(() => {
    const loadOnboardingState = () => {
      try {
        const savedState = localStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          setState({
            hasSeenSplash: parsedState.hasSeenSplash || false,
            hasCompletedOnboarding: parsedState.hasCompletedOnboarding || false,
            isFirstLaunch: parsedState.isFirstLaunch !== false, // Default to true if not set
            userPreferences: {
              enableHaptics: parsedState.userPreferences?.enableHaptics ?? true,
              enableAnimations: parsedState.userPreferences?.enableAnimations ?? true,
              preferredTheme: parsedState.userPreferences?.preferredTheme ?? 'auto'
            },
            onboardingCompletedAt: parsedState.onboardingCompletedAt,
            appVersion: parsedState.appVersion || '1.0.0'
          });
        }
      } catch (error) {
        console.warn('Failed to load onboarding state from localStorage:', error);
        // Keep default state if loading fails
      }
    };

    loadOnboardingState();
  }, []);

  // Save onboarding state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save onboarding state to localStorage:', error);
    }
  }, [state]);

  const completeSplash = () => {
    setState(prev => ({
      ...prev,
      hasSeenSplash: true
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      hasCompletedOnboarding: true,
      isFirstLaunch: false,
      onboardingCompletedAt: new Date().toISOString()
    }));
  };

  const updatePreferences = (preferences: Partial<OnboardingState['userPreferences']>) => {
    setState(prev => ({
      ...prev,
      userPreferences: {
        ...prev.userPreferences,
        ...preferences
      }
    }));
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (!state.userPreferences.enableHaptics) return;

    try {
      // Check if we're in a Capacitor environment
      if ((window as any).Capacitor) {
        import('@capacitor/haptics').then(({ Haptics, ImpactStyle }) => {
          const impactStyle = type === 'light' ? ImpactStyle.Light :
                             type === 'medium' ? ImpactStyle.Medium : ImpactStyle.Heavy;
          Haptics.impact({ style: impactStyle });
        }).catch(() => {
          // Fallback for web
          if (navigator.vibrate) {
            const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
            navigator.vibrate(duration);
          }
        });
      } else if (navigator.vibrate) {
        // Web vibration API
        const duration = type === 'light' ? 10 : type === 'medium' ? 20 : 50;
        navigator.vibrate(duration);
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  };

  const resetOnboarding = () => {
    setState({
      hasSeenSplash: false,
      hasCompletedOnboarding: false,
      isFirstLaunch: true,
      userPreferences: {
        enableHaptics: true,
        enableAnimations: true,
        preferredTheme: 'auto'
      },
      appVersion: '1.0.0'
    });
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to remove onboarding state from localStorage:', error);
    }
  };

  const contextValue: OnboardingContextType = {
    state,
    actions: {
      completeSplash,
      completeOnboarding,
      resetOnboarding,
      updatePreferences,
      triggerHaptic
    }
  };

  return (
    <OnboardingContext.Provider value={contextValue}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = (): OnboardingContextType => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export default OnboardingContext;
