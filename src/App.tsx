import React, { useState } from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { home, search, ticket, notifications, person, business } from 'ionicons/icons';
import Home from './pages/Home';
import Search from './pages/Search';
import Tickets from './pages/Tickets';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import BusinessDetail from './pages/BusinessDetail';
import SplashScreen from './pages/SplashScreen';
import Onboarding from './pages/Onboarding';
import { OnboardingProvider, useOnboarding } from './contexts/OnboardingContext';
import BusinessDashboard from './pages/BusinessDashboard';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import StaffManagement from './pages/StaffManagement';
import AuthContainer from './components/auth/AuthContainer';
import BusinessLogin from './components/auth/BusinessLogin';
import { QHopProvider, useQHop } from './contexts/QHopContext';
import { BusinessOwner } from './services/BusinessService';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

// App Mode Types
type AppMode = 'customer' | 'business';

// Main App Component with Onboarding, Mode Selection and Authentication
const AppContent: React.FC = () => {
  const { state } = useQHop();
  const { state: onboardingState, actions: onboardingActions } = useOnboarding();
  const [appMode, setAppMode] = useState<AppMode>('customer');
  const [businessOwner, setBusinessOwner] = useState<BusinessOwner | null>(null);

  // Show splash screen first
  if (!onboardingState.hasSeenSplash) {
    return <SplashScreen onComplete={onboardingActions.completeSplash} />;
  }

  // Show onboarding if not completed
  if (!onboardingState.hasCompletedOnboarding) {
    return <Onboarding onComplete={onboardingActions.completeOnboarding} />;
  }

  // Check for stored business owner session
  React.useEffect(() => {
    const storedOwner = localStorage.getItem('qhop_business_owner');
    if (storedOwner) {
      try {
        const owner = JSON.parse(storedOwner);
        setBusinessOwner(owner);
        setAppMode('business');
      } catch (error) {
        console.error('Error parsing stored business owner:', error);
        localStorage.removeItem('qhop_business_owner');
      }
    }
  }, []);

  const handleBusinessLogin = (owner: BusinessOwner) => {
    setBusinessOwner(owner);
    setAppMode('business');
  };

  const handleBusinessLogout = () => {
    setBusinessOwner(null);
    setAppMode('customer');
    localStorage.removeItem('qhop_business_owner');
  };

  const handleSwitchToCustomer = () => {
    setAppMode('customer');
  };

  const handleSwitchToBusiness = () => {
    setAppMode('business');
  };

  // Business Mode - Show Business Dashboard
  if (appMode === 'business') {
    if (!businessOwner) {
      return (
        <BusinessLogin
          onLoginSuccess={handleBusinessLogin}
          onSwitchToCustomer={handleSwitchToCustomer}
        />
      );
    }

    return (
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/business/dashboard">
            <BusinessDashboard />
          </Route>
          <Route exact path="/advanced-analytics">
            <AdvancedAnalytics />
          </Route>
          <Route exact path="/staff-management">
            <StaffManagement />
          </Route>
          <Route exact path="/">
            <Redirect to="/business/dashboard" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    );
  }

  // Customer Mode - Show Customer App
  if (!state.user.isAuthenticated) {
    return (
      <AuthContainer
        onSwitchToBusiness={handleSwitchToBusiness}
      />
    );
  }

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/search">
            <Search />
          </Route>
          <Route exact path="/tickets">
            <Tickets />
          </Route>
          <Route exact path="/notifications">
            <Notifications />
          </Route>
          <Route exact path="/profile">
            <Profile />
          </Route>
          <Route exact path="/business/:id">
            <BusinessDetail />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon aria-hidden="true" icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="search" href="/search">
            <IonIcon aria-hidden="true" icon={search} />
            <IonLabel>Search</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tickets" href="/tickets">
            <IonIcon aria-hidden="true" icon={ticket} />
            <IonLabel>Tickets</IonLabel>
          </IonTabButton>
          <IonTabButton tab="notifications" href="/notifications">
            <IonIcon aria-hidden="true" icon={notifications} />
            <IonLabel>Notifications</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon aria-hidden="true" icon={person} />
            <IonLabel>Profile</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
};

const App: React.FC = () => (
  <IonApp>
    <OnboardingProvider>
      <QHopProvider>
        <AppContent />
      </QHopProvider>
    </OnboardingProvider>
  </IonApp>
);

export default App;
