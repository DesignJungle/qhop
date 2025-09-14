import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OnboardingState {
  hasSeenSplash: boolean;
  hasCompletedOnboarding: boolean;
  isFirstLaunch: boolean;
}

interface OnboardingContextType {
  state: OnboardingState;
  actions: {
    completeSplash: () => void;
    completeOnboarding: () => void;
    resetOnboarding: () => void;
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
    isFirstLaunch: true
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
            isFirstLaunch: parsedState.isFirstLaunch !== false // Default to true if not set
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
      isFirstLaunch: false
    }));
  };

  const resetOnboarding = () => {
    setState({
      hasSeenSplash: false,
      hasCompletedOnboarding: false,
      isFirstLaunch: true
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
      resetOnboarding
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
