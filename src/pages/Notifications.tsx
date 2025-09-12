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
  IonBadge,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonRefresher,
  IonRefresherContent
} from '@ionic/react';
import { 
  timeOutline, 
  checkmarkCircleOutline,
  alertCircleOutline,
  informationCircleOutline,
  warningOutline,
  notificationsOutline
} from 'ionicons/icons';
import { useState } from 'react';
import { useQHop } from '../contexts/QHopContext';
import './Notifications.css';

const Notifications: React.FC = () => {
  const { state, actions } = useQHop();
  const [selectedSegment, setSelectedSegment] = useState<string>('all');

  const notifications = state.notifications.map(notification => ({
    ...notification,
    icon: getNotificationIcon(notification.type),
    color: getNotificationColor(notification.type)
  }));

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'queue_update':
      case 'completed':
        return checkmarkCircleOutline;
      case 'delay':
        return warningOutline;
      case 'position_update':
        return informationCircleOutline;
      case 'reminder':
        return timeOutline;
      default:
        return informationCircleOutline;
    }
  }

  function getNotificationColor(type: string) {
    switch (type) {
      case 'queue_update':
      case 'completed':
        return 'success';
      case 'delay':
        return 'warning';
      case 'position_update':
        return 'primary';
      case 'reminder':
        return 'medium';
      default:
        return 'medium';
    }
  }

  const handleRefresh = (event: CustomEvent) => {
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const getFilteredNotifications = () => {
    switch (selectedSegment) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'queue':
        return notifications.filter(n => ['queue_update', 'position_update', 'delay'].includes(n.type));
      default:
        return notifications;
    }
  };

  const markAsRead = (id: string) => {
    actions.markNotificationRead(id);
  };

  const markAllAsRead = () => {
    notifications.forEach(notification => {
      if (!notification.read) {
        actions.markNotificationRead(notification.id);
      }
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="qhop-text-h2">Notifications</IonTitle>
          {unreadCount > 0 && (
            <IonButton 
              slot="end" 
              fill="clear" 
              size="small"
              onClick={markAllAsRead}
            >
              Mark all read
            </IonButton>
          )}
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="qhop-notifications-content">
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large" className="qhop-text-display">Notifications</IonTitle>
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
            <IonSegmentButton value="all">
              <IonLabel>All</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="unread">
              <IonLabel>
                Unread
                {unreadCount > 0 && (
                  <IonBadge color="danger" className="qhop-unread-badge">
                    {unreadCount}
                  </IonBadge>
                )}
              </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="queue">
              <IonLabel>Queue Updates</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </div>

        {/* Notifications List */}
        <div className="qhop-notifications-list">
          {getFilteredNotifications().length > 0 ? (
            <IonList>
              {getFilteredNotifications().map(notification => (
                <IonItem 
                  key={notification.id} 
                  className={`qhop-notification-item ${!notification.read ? 'qhop-unread' : ''}`}
                  button
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="qhop-notification-icon" slot="start">
                    <IonIcon 
                      icon={notification.icon} 
                      color={notification.color}
                      className="qhop-notification-icon-inner"
                    />
                  </div>
                  
                  <IonLabel className="qhop-notification-content">
                    <div className="qhop-notification-header">
                      <IonText className="qhop-text-body qhop-notification-title">
                        <strong>{notification.title}</strong>
                      </IonText>
                      <IonText className="qhop-text-caption qhop-notification-time">
                        {notification.time}
                      </IonText>
                    </div>
                    
                    <IonText className="qhop-text-secondary qhop-notification-message">
                      <p>{notification.message}</p>
                    </IonText>
                    
                    {notification.businessName && (
                      <div className="qhop-notification-meta">
                        <IonText className="qhop-text-caption">
                          {notification.businessName}
                          {notification.ticketNumber && ` • ${notification.ticketNumber}`}
                        </IonText>
                      </div>
                    )}
                  </IonLabel>
                  
                  {!notification.read && (
                    <div className="qhop-unread-indicator" slot="end">
                      <div className="qhop-unread-dot"></div>
                    </div>
                  )}
                </IonItem>
              ))}
            </IonList>
          ) : (
            <div className="qhop-empty-state">
              <IonIcon icon={notificationsOutline} className="qhop-empty-icon" />
              <IonText className="qhop-text-h3">
                <h3>No notifications</h3>
              </IonText>
              <IonText className="qhop-text-secondary">
                <p>
                  {selectedSegment === 'unread' 
                    ? "You're all caught up! No unread notifications."
                    : selectedSegment === 'queue'
                    ? "No queue updates at the moment."
                    : "You'll see notifications here when you join queues or have updates."
                  }
                </p>
              </IonText>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Notifications;
