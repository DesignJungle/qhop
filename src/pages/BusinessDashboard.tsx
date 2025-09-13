import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonText,
  IonButton,
  IonBadge,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonChip,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  RefresherEventDetail
} from '@ionic/react';
import {
  peopleOutline,
  timeOutline,
  trendingUpOutline,
  callOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  analyticsOutline,
  settingsOutline,
  personAddOutline,
  notificationsOutline
} from 'ionicons/icons';
import { QHopCard, QHopButton, QHopBadge } from '../components';
import QHopLogo from '../components/brand/QHopLogo';
import { businessService, type QueueAnalytics, type QueueSettings } from '../services/BusinessService';
import './BusinessDashboard.css';

interface DashboardStats {
  totalCustomers: number;
  currentQueue: number;
  avgWaitTime: number;
  todayRevenue: number;
  customerSatisfaction: number;
}

const BusinessDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    currentQueue: 0,
    avgWaitTime: 0,
    todayRevenue: 0,
    customerSatisfaction: 0
  });
  
  const [currentQueue, setCurrentQueue] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<QueueAnalytics | null>(null);
  const [settings, setSettings] = useState<QueueSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const businessId = 'business-1'; // In real app, this would come from auth context

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load all dashboard data
      const [queueData, analyticsData, settingsData] = await Promise.all([
        businessService.getCurrentQueue(businessId),
        businessService.getAnalytics(businessId),
        businessService.getQueueSettings(businessId)
      ]);

      setCurrentQueue(queueData);
      setSettings(settingsData);
      
      if (analyticsData.length > 0) {
        const todayAnalytics = analyticsData[0];
        setAnalytics(todayAnalytics);
        
        // Update stats
        setStats({
          totalCustomers: todayAnalytics.totalCustomers,
          currentQueue: queueData.length,
          avgWaitTime: todayAnalytics.avgWaitTime,
          todayRevenue: todayAnalytics.revenue,
          customerSatisfaction: todayAnalytics.customerSatisfaction
        });
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    await loadDashboardData();
    event.detail.complete();
  };

  const handleCallNext = async () => {
    try {
      await businessService.callNextCustomer(businessId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error calling next customer:', error);
    }
  };

  const handleMarkServed = async (ticketId: string) => {
    try {
      await businessService.markCustomerServed(businessId, ticketId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error marking customer served:', error);
    }
  };

  const handleMarkNoShow = async (ticketId: string) => {
    try {
      await businessService.markCustomerNoShow(businessId, ticketId);
      await loadDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error marking no-show:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'warning';
      case 'called': return 'primary';
      case 'served': return 'success';
      case 'no-show': return 'danger';
      default: return 'medium';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <QHopLogo size="sm" variant="icon" />
              Business Dashboard
            </div>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen className="business-dashboard-content">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/* Dashboard Stats */}
        <div className="dashboard-stats">
          <IonGrid>
            <IonRow>
              <IonCol size="6" sizeMd="3">
                <QHopCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-content">
                      <IonIcon icon={peopleOutline} className="stat-icon primary" />
                      <div className="stat-info">
                        <IonText className="stat-value">{stats.totalCustomers}</IonText>
                        <IonText className="stat-label">Today's Customers</IonText>
                      </div>
                    </div>
                  </IonCardContent>
                </QHopCard>
              </IonCol>
              
              <IonCol size="6" sizeMd="3">
                <QHopCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-content">
                      <IonIcon icon={timeOutline} className="stat-icon accent" />
                      <div className="stat-info">
                        <IonText className="stat-value">{stats.currentQueue}</IonText>
                        <IonText className="stat-label">In Queue</IonText>
                      </div>
                    </div>
                  </IonCardContent>
                </QHopCard>
              </IonCol>
              
              <IonCol size="6" sizeMd="3">
                <QHopCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-content">
                      <IonIcon icon={trendingUpOutline} className="stat-icon success" />
                      <div className="stat-info">
                        <IonText className="stat-value">{stats.avgWaitTime}min</IonText>
                        <IonText className="stat-label">Avg Wait Time</IonText>
                      </div>
                    </div>
                  </IonCardContent>
                </QHopCard>
              </IonCol>
              
              <IonCol size="6" sizeMd="3">
                <QHopCard className="stat-card">
                  <IonCardContent>
                    <div className="stat-content">
                      <IonIcon icon={analyticsOutline} className="stat-icon warning" />
                      <div className="stat-info">
                        <IonText className="stat-value">₦{stats.todayRevenue.toLocaleString()}</IonText>
                        <IonText className="stat-label">Today's Revenue</IonText>
                      </div>
                    </div>
                  </IonCardContent>
                </QHopCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <IonGrid>
            <IonRow>
              <IonCol size="12">
                <QHopCard>
                  <IonCardHeader>
                    <IonCardTitle>Quick Actions</IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <div className="action-buttons">
                      <IonButton
                        expand="block"
                        color="primary"
                        onClick={handleCallNext}
                        disabled={currentQueue.length === 0}
                        className="qhop-button"
                      >
                        <IonIcon icon={callOutline} slot="start" />
                        Call Next Customer
                      </IonButton>

                      <IonButton
                        expand="block"
                        fill="outline"
                        color="secondary"
                        className="qhop-button"
                        onClick={() => window.location.href = '/advanced-analytics'}
                      >
                        <IonIcon icon={analyticsOutline} slot="start" />
                        Advanced Analytics
                      </IonButton>

                      <IonButton
                        expand="block"
                        fill="outline"
                        color="tertiary"
                        className="qhop-button"
                        onClick={() => window.location.href = '/staff-management'}
                      >
                        <IonIcon icon={personAddOutline} slot="start" />
                        Staff Management
                      </IonButton>

                      <IonButton expand="block" fill="outline" color="medium" className="qhop-button">
                        <IonIcon icon={settingsOutline} slot="start" />
                        Queue Settings
                      </IonButton>
                    </div>
                  </IonCardContent>
                </QHopCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        {/* Current Queue */}
        <div className="current-queue">
          <QHopCard>
            <IonCardHeader>
              <IonCardTitle>Current Queue ({currentQueue.length})</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              {currentQueue.length === 0 ? (
                <div className="empty-queue">
                  <IonText color="medium">
                    <p>No customers in queue</p>
                  </IonText>
                </div>
              ) : (
                <IonList>
                  {currentQueue.map((customer, index) => (
                    <IonItem key={customer.id}>
                      <IonAvatar slot="start">
                        <div className="customer-avatar">
                          {customer.number}
                        </div>
                      </IonAvatar>
                      
                      <IonLabel>
                        <h3>{customer.customerName}</h3>
                        <p>Wait time: {customer.waitTime}</p>
                      </IonLabel>
                      
                      <div slot="end" className="customer-actions">
                        <IonChip color={getStatusColor(customer.status)}>
                          {customer.status}
                        </IonChip>
                        
                        {customer.status === 'waiting' && (
                          <div className="action-buttons-inline">
                            <IonButton 
                              size="small" 
                              fill="clear" 
                              color="success"
                              onClick={() => handleMarkServed(customer.id)}
                            >
                              <IonIcon icon={checkmarkCircleOutline} />
                            </IonButton>
                            
                            <IonButton 
                              size="small" 
                              fill="clear" 
                              color="danger"
                              onClick={() => handleMarkNoShow(customer.id)}
                            >
                              <IonIcon icon={closeCircleOutline} />
                            </IonButton>
                          </div>
                        )}
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              )}
            </IonCardContent>
          </QHopCard>
        </div>

        {/* Performance Overview */}
        {analytics && (
          <div className="performance-overview">
            <QHopCard>
              <IonCardHeader>
                <IonCardTitle>Today's Performance</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="performance-metrics">
                  <div className="metric">
                    <IonText className="metric-label">Customer Satisfaction</IonText>
                    <div className="metric-value-with-bar">
                      <IonText className="metric-value">{analytics.customerSatisfaction}/5.0</IonText>
                      <IonProgressBar 
                        value={analytics.customerSatisfaction / 5} 
                        color="success"
                      />
                    </div>
                  </div>
                  
                  <div className="metric">
                    <IonText className="metric-label">No-Show Rate</IonText>
                    <div className="metric-value-with-bar">
                      <IonText className="metric-value">{(analytics.noShowRate * 100).toFixed(1)}%</IonText>
                      <IonProgressBar 
                        value={analytics.noShowRate} 
                        color={analytics.noShowRate > 0.1 ? "danger" : "success"}
                      />
                    </div>
                  </div>
                  
                  <div className="metric">
                    <IonText className="metric-label">Peak Hours</IonText>
                    <div className="peak-hours">
                      {analytics.peakHours.map((hour, index) => (
                        <IonChip key={index} color="primary">
                          {hour}
                        </IonChip>
                      ))}
                    </div>
                  </div>
                </div>
              </IonCardContent>
            </QHopCard>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default BusinessDashboard;
