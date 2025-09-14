import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonText,
  IonIcon,
  IonButton,
  IonAvatar,
  IonCard,
  IonCardContent,
  IonToggle,
  IonBadge
} from '@ionic/react';
import { 
  personOutline,
  callOutline,
  mailOutline,
  notificationsOutline,
  cardOutline,
  helpCircleOutline,
  informationCircleOutline,
  logOutOutline,
  settingsOutline,
  starOutline,
  timeOutline,
  chevronForwardOutline,
  businessOutline,
  playCircleOutline
} from 'ionicons/icons';
import { useQHop } from '../contexts/QHopContext';
import { useOnboarding } from '../contexts/OnboardingContext';
import './Profile.css';

const Profile: React.FC = () => {
  const { state, actions } = useQHop();
  const { actions: onboardingActions } = useOnboarding();
  const userStats = {
    totalVisits: 24,
    timeSaved: '4.2 hours',
    averageRating: 4.8,
    memberSince: 'March 2024'
  };

  const menuItems = [
    {
      section: 'Account',
      items: [
        { icon: personOutline, label: 'Edit Profile', action: 'edit-profile' },
        { icon: callOutline, label: 'Phone Number', subtitle: '+234 801 234 5678', action: 'phone' },
        { icon: notificationsOutline, label: 'Notification Settings', action: 'notifications' },
        { icon: cardOutline, label: 'Payment Methods', action: 'payments' }
      ]
    },
    {
      section: 'Business',
      items: [
        { icon: businessOutline, label: 'Business Dashboard', subtitle: 'Manage your business queues', action: 'business' }
      ]
    },
    {
      section: 'Support',
      items: [
        { icon: playCircleOutline, label: 'View Tutorial', subtitle: 'See the app introduction again', action: 'tutorial' },
        { icon: helpCircleOutline, label: 'Help & Support', action: 'help' },
        { icon: informationCircleOutline, label: 'About QHop', subtitle: 'Version 1.0.0', action: 'about' }
      ]
    }
  ];

  const handleMenuAction = (action: string) => {
    console.log('Menu action:', action);

    if (action === 'tutorial') {
      // Reset onboarding to show tutorial again
      onboardingActions.resetOnboarding();
      return;
    }

    // In a real app, this would navigate to the appropriate page
  };

  const handleLogout = async () => {
    try {
      await actions.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="qhop-text-h2">Profile</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear" 
            onClick={() => handleMenuAction('settings')}
          >
            <IonIcon icon={settingsOutline} />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="qhop-profile-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className="qhop-text-display">Profile</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        {/* User Info Card */}
        <IonCard className="qhop-user-card">
          <IonCardContent>
            <div className="qhop-user-header">
              <IonAvatar className="qhop-user-avatar">
                <div className="qhop-avatar-placeholder">
                  <IonIcon icon={personOutline} />
                </div>
              </IonAvatar>
              <div className="qhop-user-info">
                <IonText className="qhop-text-h2">
                  <h2>John Doe</h2>
                </IonText>
                <IonText className="qhop-text-secondary">
                  <p>john.doe@email.com</p>
                </IonText>
                <IonText className="qhop-text-secondary">
                  <p>Member since {userStats.memberSince}</p>
                </IonText>
              </div>
            </div>
            
            <div className="qhop-user-stats">
              <div className="qhop-stat-item">
                <IonText className="qhop-text-h3 qhop-stat-value">
                  {userStats.totalVisits}
                </IonText>
                <IonText className="qhop-text-caption qhop-stat-label">
                  Total Visits
                </IonText>
              </div>
              <div className="qhop-stat-item">
                <IonText className="qhop-text-h3 qhop-stat-value">
                  {userStats.timeSaved}
                </IonText>
                <IonText className="qhop-text-caption qhop-stat-label">
                  Time Saved
                </IonText>
              </div>
              <div className="qhop-stat-item">
                <IonText className="qhop-text-h3 qhop-stat-value">
                  {userStats.averageRating}
                </IonText>
                <IonText className="qhop-text-caption qhop-stat-label">
                  Avg Rating
                </IonText>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Menu Sections */}
        <div className="qhop-menu-sections">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="qhop-menu-section">
              <IonText className="qhop-text-h3 qhop-section-title">
                <h3>{section.section}</h3>
              </IonText>
              
              <IonList className="qhop-menu-list">
                {section.items.map((item, itemIndex) => (
                  <IonItem 
                    key={itemIndex} 
                    button 
                    className="qhop-menu-item"
                    onClick={() => handleMenuAction(item.action)}
                  >
                    <IonIcon 
                      icon={item.icon} 
                      slot="start" 
                      className="qhop-menu-icon"
                    />
                    <IonLabel>
                      <IonText className="qhop-text-body">
                        <strong>{item.label}</strong>
                      </IonText>
                      {item.subtitle && (
                        <IonText className="qhop-text-secondary">
                          <p>{item.subtitle}</p>
                        </IonText>
                      )}
                    </IonLabel>
                    <IonIcon 
                      icon={chevronForwardOutline} 
                      slot="end" 
                      className="qhop-chevron"
                    />
                  </IonItem>
                ))}
              </IonList>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="qhop-quick-actions">
          <IonCard className="qhop-action-card">
            <IonCardContent>
              <div className="qhop-action-header">
                <IonIcon icon={starOutline} className="qhop-action-icon" />
                <div>
                  <IonText className="qhop-text-body">
                    <strong>Rate Recent Visits</strong>
                  </IonText>
                  <IonText className="qhop-text-secondary">
                    <p>Help others by rating your experiences</p>
                  </IonText>
                </div>
              </div>
              <IonButton fill="outline" size="small" className="qhop-action-button">
                Rate Now
              </IonButton>
            </IonCardContent>
          </IonCard>

          <IonCard className="qhop-action-card">
            <IonCardContent>
              <div className="qhop-action-header">
                <IonIcon icon={timeOutline} className="qhop-action-icon" />
                <div>
                  <IonText className="qhop-text-body">
                    <strong>Queue History</strong>
                  </IonText>
                  <IonText className="qhop-text-secondary">
                    <p>View your complete queue history</p>
                  </IonText>
                </div>
              </div>
              <IonButton fill="outline" size="small" className="qhop-action-button">
                View History
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>

        {/* Logout Button */}
        <div className="qhop-logout-section">
          <IonButton 
            fill="clear" 
            color="danger" 
            className="qhop-logout-button"
            onClick={handleLogout}
          >
            <IonIcon icon={logOutOutline} slot="start" />
            Sign Out
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
