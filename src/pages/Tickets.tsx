import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonText,
  IonBadge,
  IonIcon,
  IonButton,
  IonProgressBar,
  IonList,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { 
  timeOutline, 
  locationOutline, 
  peopleOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  refreshOutline,
  mapOutline,
  callOutline
} from 'ionicons/icons';
import { useState, useEffect } from 'react';
import { useQHop } from '../contexts/QHopContext';
import './Tickets.css';

const Tickets: React.FC = () => {
  const { state, actions } = useQHop();
  const [selectedSegment, setSelectedSegment] = useState<string>('active');

  // Load tickets on component mount
  useEffect(() => {
    actions.loadActiveTickets();
  }, []);

  const activeTickets = state.activeTickets;

  const completedTickets = [
    {
      id: 2,
      businessName: 'Premium Cuts Barber',
      businessAddress: '456 Oak Ave, Midtown',
      ticketNumber: 'B-023',
      completedAt: '1:45 PM',
      waitTime: '18 min',
      status: 'completed',
      rating: 5
    },
    {
      id: 3,
      businessName: 'Quick Service Bank',
      businessAddress: '789 Pine St, Downtown',
      ticketNumber: 'C-012',
      completedAt: 'Yesterday, 4:20 PM',
      waitTime: '8 min',
      status: 'completed',
      rating: 4
    }
  ];

  const cancelledTickets = [
    {
      id: 4,
      businessName: 'Downtown Dental Clinic',
      businessAddress: '321 Elm St, Downtown',
      ticketNumber: 'D-067',
      cancelledAt: '11:30 AM',
      reason: 'Cancelled by user',
      status: 'cancelled'
    }
  ];

  const handleRefresh = (event: CustomEvent) => {
    actions.loadActiveTickets().finally(() => {
      event.detail.complete();
    });
  };

  const handleCancelTicket = async (ticketId: string) => {
    if (window.confirm('Are you sure you want to cancel this ticket?')) {
      await actions.cancelTicket(ticketId);
    }
  };

  const getTicketsBySegment = () => {
    switch (selectedSegment) {
      case 'active':
        return activeTickets;
      case 'completed':
        return completedTickets;
      case 'cancelled':
        return cancelledTickets;
      default:
        return activeTickets;
    }
  };

  const renderActiveTicket = (ticket: any) => (
    <IonCard key={ticket.id} className="qhop-active-ticket-card">
      <IonCardContent>
        <div className="qhop-ticket-header">
          <div>
            <IonText className="qhop-text-h3">
              <h3>{ticket.businessName}</h3>
            </IonText>
            <IonText className="qhop-text-secondary">
              <p>{ticket.businessAddress}</p>
            </IonText>
          </div>
          <IonBadge color="primary" className="qhop-ticket-number">
            {ticket.ticketNumber}
          </IonBadge>
        </div>

        <div className="qhop-position-info">
          <div className="qhop-position-display">
            <IonText className="qhop-text-display qhop-position-number">
              {ticket.position}
            </IonText>
            <IonText className="qhop-text-secondary">
              <p>of {ticket.totalInQueue}</p>
            </IonText>
          </div>
          <div className="qhop-eta-display">
            <IonIcon icon={timeOutline} />
            <div>
              <IonText className="qhop-text-h2">
                <strong>{ticket.eta}</strong>
              </IonText>
              <IonText className="qhop-text-secondary">
                <p>estimated wait</p>
              </IonText>
            </div>
          </div>
        </div>

        <IonProgressBar value={ticket.progress / 100} className="qhop-progress-bar" />

        <div className="qhop-ticket-details">
          <div className="qhop-detail-item">
            <IonText className="qhop-text-secondary">Joined at:</IonText>
            <IonText className="qhop-text-body">{ticket.joinedAt}</IonText>
          </div>
          <div className="qhop-detail-item">
            <IonText className="qhop-text-secondary">Expected call:</IonText>
            <IonText className="qhop-text-body">{ticket.estimatedCallTime}</IonText>
          </div>
        </div>

        <div className="qhop-ticket-actions">
          <IonButton fill="outline" size="small">
            <IonIcon icon={mapOutline} slot="start" />
            Directions
          </IonButton>
          <IonButton fill="outline" size="small">
            <IonIcon icon={callOutline} slot="start" />
            Call Business
          </IonButton>
          <IonButton
            fill="outline"
            size="small"
            color="danger"
            onClick={() => handleCancelTicket(ticket.id)}
          >
            <IonIcon icon={closeCircleOutline} slot="start" />
            Cancel
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderCompletedTicket = (ticket: any) => (
    <IonCard key={ticket.id} className="qhop-completed-ticket-card">
      <IonCardContent>
        <div className="qhop-ticket-header">
          <div>
            <IonText className="qhop-text-body">
              <strong>{ticket.businessName}</strong>
            </IonText>
            <IonText className="qhop-text-secondary">
              <p>{ticket.businessAddress}</p>
            </IonText>
          </div>
          <IonBadge color="success" className="qhop-status-badge">
            <IonIcon icon={checkmarkCircleOutline} />
            Completed
          </IonBadge>
        </div>

        <div className="qhop-completed-details">
          <div className="qhop-detail-item">
            <IonText className="qhop-text-secondary">Ticket:</IonText>
            <IonText className="qhop-text-body">{ticket.ticketNumber}</IonText>
          </div>
          <div className="qhop-detail-item">
            <IonText className="qhop-text-secondary">Completed:</IonText>
            <IonText className="qhop-text-body">{ticket.completedAt}</IonText>
          </div>
          <div className="qhop-detail-item">
            <IonText className="qhop-text-secondary">Wait time:</IonText>
            <IonText className="qhop-text-body">{ticket.waitTime}</IonText>
          </div>
        </div>

        <div className="qhop-ticket-actions">
          <IonButton fill="outline" size="small">
            Rate Experience
          </IonButton>
          <IonButton fill="outline" size="small">
            Book Again
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );

  const renderCancelledTicket = (ticket: any) => (
    <IonCard key={ticket.id} className="qhop-cancelled-ticket-card">
      <IonCardContent>
        <div className="qhop-ticket-header">
          <div>
            <IonText className="qhop-text-body">
              <strong>{ticket.businessName}</strong>
            </IonText>
            <IonText className="qhop-text-secondary">
              <p>{ticket.businessAddress}</p>
            </IonText>
          </div>
          <IonBadge color="medium" className="qhop-status-badge">
            <IonIcon icon={closeCircleOutline} />
            Cancelled
          </IonBadge>
        </div>

        <div className="qhop-cancelled-details">
          <div className="qhop-detail-item">
            <IonText className="qhop-text-secondary">Ticket:</IonText>
            <IonText className="qhop-text-body">{ticket.ticketNumber}</IonText>
          </div>
          <div className="qhop-detail-item">
            <IonText className="qhop-text-secondary">Cancelled:</IonText>
            <IonText className="qhop-text-body">{ticket.cancelledAt}</IonText>
          </div>
          <div className="qhop-detail-item">
            <IonText className="qhop-text-secondary">Reason:</IonText>
            <IonText className="qhop-text-body">{ticket.reason}</IonText>
          </div>
        </div>

        <div className="qhop-ticket-actions">
          <IonButton fill="outline" size="small">
            Book Again
          </IonButton>
        </div>
      </IonCardContent>
    </IonCard>
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="qhop-text-h2">My Tickets</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="qhop-tickets-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className="qhop-text-display">My Tickets</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>
        
        {/* Segments */}
        <div className="qhop-segments-container">
          <IonSegment 
            value={selectedSegment} 
            onIonChange={(e) => setSelectedSegment(e.detail.value as string)}
            className="qhop-segments"
          >
            <IonSegmentButton value="active">
              <IonLabel>Active ({activeTickets.length})</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="completed">
              <IonLabel>Completed</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="cancelled">
              <IonLabel>Cancelled</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Tickets List */}
        <div className="qhop-tickets-list">
          {selectedSegment === 'active' && (
            <>
              {activeTickets.length > 0 ? (
                activeTickets.map(renderActiveTicket)
              ) : (
                <div className="qhop-empty-state">
                  <IonText className="qhop-text-h3">
                    <h3>No active tickets</h3>
                  </IonText>
                  <IonText className="qhop-text-secondary">
                    <p>Join a queue to see your tickets here</p>
                  </IonText>
                  <IonButton routerLink="/search" className="qhop-empty-action">
                    Find Businesses
                  </IonButton>
                </div>
              )}
            </>
          )}

          {selectedSegment === 'completed' && (
            <>
              {completedTickets.length > 0 ? (
                completedTickets.map(renderCompletedTicket)
              ) : (
                <div className="qhop-empty-state">
                  <IonText className="qhop-text-h3">
                    <h3>No completed tickets</h3>
                  </IonText>
                  <IonText className="qhop-text-secondary">
                    <p>Your completed visits will appear here</p>
                  </IonText>
                </div>
              )}
            </>
          )}

          {selectedSegment === 'cancelled' && (
            <>
              {cancelledTickets.length > 0 ? (
                cancelledTickets.map(renderCancelledTicket)
              ) : (
                <div className="qhop-empty-state">
                  <IonText className="qhop-text-h3">
                    <h3>No cancelled tickets</h3>
                  </IonText>
                  <IonText className="qhop-text-secondary">
                    <p>Cancelled tickets will appear here</p>
                  </IonText>
                </div>
              )}
            </>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tickets;
