import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonAvatar,
  IonText,
  IonBadge,
  IonIcon,
  IonChip,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/react';
import { 
  locationOutline, 
  timeOutline, 
  peopleOutline,
  filterOutline,
  starOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { useState } from 'react';
import './Search.css';

const Search: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  const filters = [
    { label: 'Open Now', active: true },
    { label: 'Accepts Deposit', active: false },
    { label: 'Priority Available', active: false },
    { label: 'Near Me', active: true }
  ];

  const searchResults = [
    {
      id: 1,
      name: 'City Medical Center',
      category: 'Clinic',
      distance: '0.3 km',
      waitTime: '15 min',
      queueLength: 8,
      status: 'Open',
      statusColor: 'success',
      rating: 4.5,
      acceptsDeposit: true,
      hasPriority: false
    },
    {
      id: 2,
      name: 'Premium Cuts Barber',
      category: 'Barber',
      distance: '0.5 km',
      waitTime: '25 min',
      queueLength: 5,
      status: 'Busy',
      statusColor: 'warning',
      rating: 4.8,
      acceptsDeposit: true,
      hasPriority: true
    },
    {
      id: 3,
      name: 'Quick Service Bank',
      category: 'Bank',
      distance: '0.8 km',
      waitTime: '10 min',
      queueLength: 3,
      status: 'Open',
      statusColor: 'success',
      rating: 4.2,
      acceptsDeposit: false,
      hasPriority: false
    },
    {
      id: 4,
      name: 'Downtown Dental Clinic',
      category: 'Clinic',
      distance: '1.2 km',
      waitTime: '30 min',
      queueLength: 12,
      status: 'Open',
      statusColor: 'success',
      rating: 4.6,
      acceptsDeposit: true,
      hasPriority: true
    }
  ];

  const filteredResults = searchResults.filter(business => {
    if (selectedSegment === 'clinics' && business.category !== 'Clinic') return false;
    if (selectedSegment === 'barbers' && business.category !== 'Barber') return false;
    if (selectedSegment === 'services' && !['Bank', 'Service'].includes(business.category)) return false;
    if (searchText && !business.name.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="qhop-text-h2">Search</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="qhop-search-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className="qhop-text-display">Search</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        {/* Search Bar */}
        <div className="qhop-search-container">
          <IonSearchbar 
            value={searchText}
            onIonInput={(e) => setSearchText(e.detail.value!)}
            placeholder="Search businesses, services..."
            className="qhop-searchbar"
          />
        </div>

        {/* Category Segments */}
        <div className="qhop-segments-container">
          <IonSegment 
            value={selectedSegment} 
            onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
            className="qhop-segments"
          >
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="clinics">
              <IonLabel>Clinics</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="barbers">
              <IonLabel>Barbers</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="services">
              <IonLabel>Services</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Filters */}
        <div className="qhop-filters-container">
          <div className="qhop-filters-scroll">
            <IonButton fill="outline" size="small" className="qhop-filter-button">
              <IonIcon icon={filterOutline} slot="start" />
              Filters
            </IonButton>
            {filters.map((filter, index) => (
              <IonChip 
                key={index} 
                color={filter.active ? 'primary' : 'medium'}
                className="qhop-filter-chip"
              >
                <IonLabel>{filter.label}</IonLabel>
                {filter.active && <IonIcon icon={checkmarkCircleOutline} />}
              </IonChip>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="qhop-results-container">
          <div className="qhop-results-header">
            <IonText className="qhop-text-secondary">
              <p>{filteredResults.length} results found</p>
            </IonText>
          </div>

          <IonList>
            {filteredResults.map(business => (
              <IonCard key={business.id} className="qhop-search-result-card">
                <IonCardContent>
                  <IonItem lines="none" className="qhop-business-item">
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
                        <IonBadge color={business.statusColor} className="qhop-status-badge">
                          {business.status}
                        </IonBadge>
                      </div>
                      <div className="qhop-business-meta">
                        <IonText className="qhop-text-secondary">
                          <p>{business.category} • {business.distance}</p>
                        </IonText>
                        <div className="qhop-rating">
                          <IonIcon icon={starOutline} />
                          <span>{business.rating}</span>
                        </div>
                      </div>
                      <div className="qhop-business-stats">
                        <div className="qhop-stat">
                          <IonIcon icon={timeOutline} />
                          <span>{business.waitTime}</span>
                        </div>
                        <div className="qhop-stat">
                          <IonIcon icon={peopleOutline} />
                          <span>{business.queueLength} in queue</span>
                        </div>
                      </div>
                      <div className="qhop-business-features">
                        {business.acceptsDeposit && (
                          <IonChip color="success" className="qhop-feature-chip">
                            <IonLabel>Deposit</IonLabel>
                          </IonChip>
                        )}
                        {business.hasPriority && (
                          <IonChip color="warning" className="qhop-feature-chip">
                            <IonLabel>Priority</IonLabel>
                          </IonChip>
                        )}
                      </div>
                    </div>
                  </IonItem>
                  <div className="qhop-business-actions">
                    <IonButton fill="outline" size="small">
                      View Details
                    </IonButton>
                    <IonButton size="small" color="primary">
                      Join Queue
                    </IonButton>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Search;
