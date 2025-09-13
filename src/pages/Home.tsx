import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonChip,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonText
} from '@ionic/react';
import { QHopCard, QHopButton, QHopBadge, QHopProgress } from '../components';
import { 
  locationOutline, 
  timeOutline, 
  peopleOutline, 
  restaurantOutline,
  medicalOutline,
  cutOutline,
  businessOutline,
  carOutline
} from 'ionicons/icons';
import { useQHop } from '../contexts/QHopContext';
import { useEffect } from 'react';
import './Home.css';

const Home: React.FC = () => {
  const { state, actions } = useQHop();
  const categories = [
    { name: 'Clinics', icon: medicalOutline, color: 'primary' },
    { name: 'Barbers', icon: cutOutline, color: 'success' },
    { name: 'Restaurants', icon: restaurantOutline, color: 'warning' },
    { name: 'Services', icon: businessOutline, color: 'medium' },
    { name: 'Auto', icon: carOutline, color: 'tertiary' }
  ];

  // Load businesses on component mount
  useEffect(() => {
    if (state.user.isAuthenticated) {
      actions.searchBusinesses();
    }
  }, [state.user.isAuthenticated]);



  const nearbyBusinesses = state.businesses.slice(0, 3); // Show first 3 businesses
  const activeQueues = state.activeTickets;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="qhop-text-h2">QHop</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="qhop-home-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className="qhop-text-display">QHop</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        {/* Search Bar */}
        <div className="qhop-search-container">
          <IonSearchbar 
            placeholder="Search businesses, services..."
            className="qhop-searchbar"
          />
        </div>

        {/* Active Queues Section */}
        {activeQueues.length > 0 && (
          <div className="qhop-section">
            <IonText className="qhop-text-h3 qhop-section-title">
              <h3>Your Active Queues</h3>
            </IonText>
            {activeQueues.map(queue => (
              <QHopCard key={queue.id} variant="priority" className="qhop-active-queue-card">
                <div className="qhop-queue-header">
                  <div>
                    <IonText className="qhop-text-body">
                      <strong>{queue.businessName}</strong>
                    </IonText>
                    <IonText className="qhop-text-secondary">
                      <p>Ticket #{queue.ticketNumber}</p>
                    </IonText>
                  </div>
                  <QHopBadge variant="info" size="medium">
                    {queue.position}/{queue.totalInQueue}
                  </QHopBadge>
                </div>
                <QHopProgress
                  value={(queue.totalInQueue - queue.position) / queue.totalInQueue * 100}
                  variant="default"
                  size="medium"
                />
                <div className="qhop-queue-info">
                  <div className="qhop-eta-info">
                    <IonIcon icon={timeOutline} />
                    <IonText className="qhop-text-secondary">ETA: {queue.eta}</IonText>
                  </div>
                  <QHopButton variant="ghost" size="small">
                    View Details
                  </QHopButton>
                </div>
              </QHopCard>
            ))}
          </div>
        )}

        {/* Categories */}
        <div className="qhop-section">
          <IonText className="qhop-text-h3 qhop-section-title">
            <h3>Categories</h3>
          </IonText>
          <IonGrid>
            <IonRow>
              {categories.map((category, index) => (
                <IonCol size="6" sizeMd="4" key={index}>
                  <QHopCard className="qhop-category-card" button>
                    <div className="qhop-category-content">
                      <IonIcon
                        icon={category.icon}
                        className="qhop-category-icon"
                        color={category.color}
                      />
                      <IonText className="qhop-text-secondary">
                        <p>{category.name}</p>
                      </IonText>
                    </div>
                  </QHopCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        </div>

        {/* Open Now Near You */}
        <div className="qhop-section">
          <div className="qhop-section-header">
            <IonText className="qhop-text-h3">
              <h3>Open Now Near You</h3>
            </IonText>
            <IonChip>
              <IonIcon icon={locationOutline} />
              <IonLabel>0.5 km</IonLabel>
            </IonChip>
          </div>
          
          <IonList>
            {nearbyBusinesses.map(business => (
              <IonItem key={business.id} button className="qhop-business-item">
                <IonAvatar slot="start">
                  <div className="qhop-business-avatar">
                    {business.name.charAt(0)}
                  </div>
                </IonAvatar>
                <div className="qhop-business-info">
                  <div className="qhop-business-header">
                    <IonText className="qhop-text-body">
                      <strong>{business.name}</strong>
                    </IonText>
                    <QHopBadge
                      variant={business.status === 'Open' ? 'success' : 'warning'}
                      size="small"
                    >
                      {business.status}
                    </QHopBadge>
                  </div>
                  <IonText className="qhop-text-secondary">
                    <p>{business.category} • {business.distance}</p>
                  </IonText>
                  <div className="qhop-business-stats">
                    <div className="qhop-stat">
                      <IonIcon icon={timeOutline} />
                      <span>{business.currentWaitTime}</span>
                    </div>
                    <div className="qhop-stat">
                      <IonIcon icon={peopleOutline} />
                      <span>{business.queueLength} in queue</span>
                    </div>
                  </div>
                </div>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
