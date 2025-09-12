import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonText,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonCheckbox,
  IonInput,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import { 
  locationOutline, 
  timeOutline, 
  peopleOutline,
  starOutline,
  callOutline,
  globeOutline,
  cashOutline,
  sparklesOutline,
  informationCircleOutline
} from 'ionicons/icons';
import { useState, useRef, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { QHopCard, QHopButton, QHopBadge, QHopProgress } from '../components';
import { useQHop } from '../contexts/QHopContext';
import './BusinessDetail.css';

const BusinessDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const { state, actions } = useQHop();

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [partySize, setPartySize] = useState(1);
  const [acceptsTerms, setAcceptsTerms] = useState(false);
  const [selectedService, setSelectedService] = useState('general');
  const [business, setBusiness] = useState<any>(null);
  const modal = useRef<HTMLIonModalElement>(null);

  // Load business data
  useEffect(() => {
    const loadBusiness = async () => {
      if (id) {
        // First try to find in already loaded businesses
        const existingBusiness = state.businesses.find(b => b.id === id);
        if (existingBusiness) {
          setBusiness(existingBusiness);
          setSelectedService(existingBusiness.services[0]?.id || 'general');
        } else {
          // If not found, this would normally fetch from API
          // For now, we'll use mock data
          const mockBusiness = {
            id: id,
            name: 'City Medical Center',
            category: 'Clinic',
            address: '123 Main Street, Downtown',
            phone: '+234 801 234 5678',
            website: 'www.citymedical.com',
            distance: '0.3 km',
            rating: 4.5,
            totalReviews: 128,
            currentWaitTime: '15 min',
            queueLength: 8,
            status: 'Open' as const,
            acceptsDeposit: true,
            depositAmount: 1000,
            hasPriority: false,
            description: 'Full-service medical center offering general consultations, specialist care, and diagnostic services.',
            hours: {
              today: '8:00 AM - 6:00 PM',
              tomorrow: '8:00 AM - 6:00 PM'
            },
            services: [
              { id: 'general', name: 'General Consultation', avgTime: '15 min', price: 5000 },
              { id: 'specialist', name: 'Specialist Consultation', avgTime: '30 min', price: 10000 },
              { id: 'diagnostic', name: 'Diagnostic Tests', avgTime: '20 min', price: 7500 }
            ],
            policies: [
              'Please arrive 5 minutes before your estimated time',
              'Deposit is refundable if cancelled 30+ minutes in advance',
              'Maximum wait time: 45 minutes beyond estimated time',
              'Valid ID required for all consultations'
            ],
            location: { lat: 6.5244, lng: 3.3792 }
          };
          setBusiness(mockBusiness);
          setSelectedService('general');
        }
      }
    };

    loadBusiness();
  }, [id, state.businesses]);

  const handleJoinQueue = async () => {
    if (!acceptsTerms) {
      alert('Please accept the terms and conditions');
      return;
    }

    if (!business) {
      alert('Business information not available');
      return;
    }

    try {
      await actions.joinQueue(business.id, selectedService, partySize, acceptsTerms);
      setIsJoinModalOpen(false);

      // Navigate to tickets page
      history.push('/tickets');
    } catch (error) {
      alert('Failed to join queue. Please try again.');
    }
  };

  const selectedServiceData = business?.services.find((s: any) => s.id === selectedService);

  if (!business) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/search" />
            </IonButtons>
            <IonTitle>Loading...</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Loading business details...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/search" />
          </IonButtons>
          <IonTitle className="qhop-text-h2">Business Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="qhop-business-detail-content">
        
        {/* Business Header */}
        <QHopCard className="qhop-business-header-card">
          <div className="qhop-business-header">
            <div className="qhop-business-avatar-large">
              {business.name.charAt(0)}
            </div>
            <div className="qhop-business-info">
              <IonText className="qhop-text-h1">
                <h1>{business.name}</h1>
              </IonText>
              <IonText className="qhop-text-secondary">
                <p>{business.category} • {business.distance}</p>
              </IonText>
              <div className="qhop-business-rating">
                <IonIcon icon={starOutline} />
                <span>{business.rating}</span>
                <IonText className="qhop-text-secondary">
                  ({business.totalReviews} reviews)
                </IonText>
              </div>
            </div>
            <QHopBadge variant="success" size="medium">
              {business.status}
            </QHopBadge>
          </div>
        </QHopCard>

        {/* Queue Status */}
        <QHopCard title="Current Queue Status" className="qhop-queue-status-card">
          <div className="qhop-queue-stats">
            <div className="qhop-stat-item">
              <IonIcon icon={timeOutline} />
              <div>
                <IonText className="qhop-text-h3">{business.currentWaitTime}</IonText>
                <IonText className="qhop-text-caption">Wait Time</IonText>
              </div>
            </div>
            <div className="qhop-stat-item">
              <IonIcon icon={peopleOutline} />
              <div>
                <IonText className="qhop-text-h3">{business.queueLength}</IonText>
                <IonText className="qhop-text-caption">In Queue</IonText>
              </div>
            </div>
          </div>
          
          <QHopProgress 
            value={75} 
            label="Queue Activity"
            showLabel
            variant="success"
            size="medium"
          />
        </QHopCard>

        {/* Services */}
        <QHopCard title="Available Services">
          <IonList>
            {business.services.map((service: any) => (
              <IonItem key={service.id} lines="none" className="qhop-service-item">
                <IonLabel>
                  <IonText className="qhop-text-body">
                    <strong>{service.name}</strong>
                  </IonText>
                  <IonText className="qhop-text-secondary">
                    <p>~{service.avgTime} • ₦{service.price.toLocaleString()}</p>
                  </IonText>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </QHopCard>

        {/* Business Info */}
        <QHopCard title="Business Information">
          <div className="qhop-business-details">
            <div className="qhop-detail-row">
              <IonIcon icon={locationOutline} />
              <IonText className="qhop-text-body">{business.address}</IonText>
            </div>
            <div className="qhop-detail-row">
              <IonIcon icon={callOutline} />
              <IonText className="qhop-text-body">{business.phone}</IonText>
            </div>
            <div className="qhop-detail-row">
              <IonIcon icon={globeOutline} />
              <IonText className="qhop-text-body">{business.website}</IonText>
            </div>
            <div className="qhop-detail-row">
              <IonIcon icon={timeOutline} />
              <div>
                <IonText className="qhop-text-body">Today: {business.hours.today}</IonText>
                <IonText className="qhop-text-secondary">
                  <p>Tomorrow: {business.hours.tomorrow}</p>
                </IonText>
              </div>
            </div>
          </div>
          
          <IonText className="qhop-text-secondary qhop-business-description">
            <p>{business.description}</p>
          </IonText>
        </QHopCard>

        {/* Features */}
        <QHopCard title="Features">
          <div className="qhop-features-grid">
            {business.acceptsDeposit && (
              <div className="qhop-feature-item">
                <IonIcon icon={cashOutline} />
                <div>
                  <IonText className="qhop-text-body">Accepts Deposit</IonText>
                  <IonText className="qhop-text-secondary">
                    <p>₦{business.depositAmount.toLocaleString()} to secure slot</p>
                  </IonText>
                </div>
              </div>
            )}
            {business.hasPriority && (
              <div className="qhop-feature-item">
                <IonIcon icon={sparklesOutline} />
                <div>
                  <IonText className="qhop-text-body">Priority Available</IonText>
                  <IonText className="qhop-text-secondary">
                    <p>Skip ahead for extra fee</p>
                  </IonText>
                </div>
              </div>
            )}
          </div>
        </QHopCard>

        {/* Join Queue Button */}
        <div className="qhop-join-section">
          <QHopButton 
            variant="primary"
            size="large"
            fullWidth
            loading={state.loading.joining}
            onClick={() => setIsJoinModalOpen(true)}
          >
            Join Queue
          </QHopButton>
        </div>

        {/* Join Queue Modal */}
        <IonModal ref={modal} isOpen={isJoinModalOpen} onDidDismiss={() => setIsJoinModalOpen(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Join Queue</IonTitle>
              <IonButtons slot="end">
                <QHopButton variant="ghost" onClick={() => setIsJoinModalOpen(false)}>
                  Cancel
                </QHopButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="qhop-join-modal-content">
            <QHopCard title="Queue Details">
              <div className="qhop-join-form">
                <div className="qhop-form-field">
                  <IonLabel>Service Type</IonLabel>
                  <IonSelect
                    value={selectedService}
                    onIonChange={(e: any) => setSelectedService(e.detail.value)}
                  >
                    {business.services.map((service: any) => (
                      <IonSelectOption key={service.id} value={service.id}>
                        {service.name} - ₦{service.price.toLocaleString()}
                      </IonSelectOption>
                    ))}
                  </IonSelect>
                </div>

                <div className="qhop-form-field">
                  <IonLabel>Party Size</IonLabel>
                  <IonInput 
                    type="number" 
                    value={partySize} 
                    min={1} 
                    max={10}
                    onIonInput={(e) => setPartySize(parseInt(e.detail.value!, 10) || 1)}
                  />
                </div>

                {selectedServiceData && (
                  <div className="qhop-service-summary">
                    <IonText className="qhop-text-body">
                      <strong>Estimated Time: {selectedServiceData.avgTime}</strong>
                    </IonText>
                    <IonText className="qhop-text-body">
                      <strong>Cost: ₦{selectedServiceData.price.toLocaleString()}</strong>
                    </IonText>
                  </div>
                )}

                <div className="qhop-policies">
                  <IonText className="qhop-text-h3">
                    <h3>Policies</h3>
                  </IonText>
                  {business.policies.map((policy: string, index: number) => (
                    <IonText key={index} className="qhop-text-secondary qhop-policy-item">
                      <p>• {policy}</p>
                    </IonText>
                  ))}
                </div>

                <div className="qhop-terms">
                  <IonCheckbox 
                    checked={acceptsTerms} 
                    onIonChange={(e) => setAcceptsTerms(e.detail.checked)}
                  />
                  <IonLabel className="qhop-terms-label">
                    I accept the terms and conditions and business policies
                  </IonLabel>
                </div>

                <QHopButton 
                  variant="primary"
                  size="large"
                  fullWidth
                  disabled={!acceptsTerms}
                  loading={state.loading.joining}
                  onClick={handleJoinQueue}
                >
                  Confirm & Join Queue
                </QHopButton>
              </div>
            </QHopCard>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default BusinessDetail;
