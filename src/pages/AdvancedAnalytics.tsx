import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonSpinner,
  IonText,
  IonItem,
  IonList,
  IonProgressBar,
  IonChip,
  IonBadge
} from '@ionic/react';
import {
  analyticsOutline,
  trendingUpOutline,
  peopleOutline,
  timeOutline,
  cashOutline,
  downloadOutline,
  refreshOutline,
  settingsOutline,
  alertCircleOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './AdvancedAnalytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  overview: {
    totalCustomers: number;
    avgWaitTime: number;
    customerSatisfaction: number;
    noShowRate: number;
    period: string;
  };
  peakHours: Array<{
    hour: number;
    count: number;
    label: string;
  }>;
  dailyStats: Array<{
    date: string;
    customers: number;
    avgWaitTime: number;
    revenue: number;
    satisfaction: number;
    noShowRate: number;
  }>;
  queuePerformance: Array<{
    queueId: string;
    name: string;
    totalTickets: number;
    maxSize: number;
    utilizationRate: number;
  }>;
  serviceMetrics: Array<{
    serviceId: string;
    name: string;
    totalBookings: number;
    duration: number;
    price: number;
    revenue: number;
  }>;
  generatedAt: string;
}

const AdvancedAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [selectedView, setSelectedView] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, [selectedPeriod]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockData: AnalyticsData = {
        overview: {
          totalCustomers: 1247,
          avgWaitTime: 12.5,
          customerSatisfaction: 4.6,
          noShowRate: 8.2,
          period: selectedPeriod
        },
        peakHours: [
          { hour: 14, count: 89, label: '14:00' },
          { hour: 15, count: 76, label: '15:00' },
          { hour: 11, count: 65, label: '11:00' },
          { hour: 16, count: 58, label: '16:00' },
          { hour: 10, count: 52, label: '10:00' }
        ],
        dailyStats: generateDailyStats(selectedPeriod),
        queuePerformance: [
          { queueId: '1', name: 'General Queue', totalTickets: 456, maxSize: 50, utilizationRate: 85.2 },
          { queueId: '2', name: 'Priority Queue', totalTickets: 234, maxSize: 20, utilizationRate: 92.1 },
          { queueId: '3', name: 'Walk-in Queue', totalTickets: 189, maxSize: 30, utilizationRate: 67.8 }
        ],
        serviceMetrics: [
          { serviceId: '1', name: 'Consultation', totalBookings: 345, duration: 30, price: 50, revenue: 17250 },
          { serviceId: '2', name: 'Quick Check', totalBookings: 567, duration: 15, price: 25, revenue: 14175 },
          { serviceId: '3', name: 'Treatment', totalBookings: 123, duration: 60, price: 100, revenue: 12300 }
        ],
        generatedAt: new Date().toISOString()
      };

      setAnalyticsData(mockData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const generateDailyStats = (period: string) => {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const stats = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      stats.push({
        date: date.toISOString().split('T')[0],
        customers: Math.floor(Math.random() * 100) + 50,
        avgWaitTime: Math.floor(Math.random() * 20) + 5,
        revenue: Math.floor(Math.random() * 2000) + 500,
        satisfaction: Math.round((Math.random() * 1.5 + 3.5) * 10) / 10,
        noShowRate: Math.round((Math.random() * 15) * 10) / 10
      });
    }
    
    return stats;
  };

  const getChartOptions = (title: string) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'var(--ion-color-medium)'
        }
      },
      title: {
        display: true,
        text: title,
        color: 'var(--ion-color-dark)'
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'var(--ion-color-medium)'
        },
        grid: {
          color: 'var(--ion-color-light)'
        }
      },
      y: {
        ticks: {
          color: 'var(--ion-color-medium)'
        },
        grid: {
          color: 'var(--ion-color-light)'
        }
      }
    }
  });

  const renderOverviewCards = () => {
    if (!analyticsData) return null;

    const { overview } = analyticsData;
    
    return (
      <IonGrid>
        <IonRow>
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="analytics-card">
              <IonCardContent>
                <div className="analytics-metric">
                  <IonIcon icon={peopleOutline} className="metric-icon customers" />
                  <div className="metric-content">
                    <h2>{overview.totalCustomers.toLocaleString()}</h2>
                    <p>Total Customers</p>
                    <IonChip color="success">
                      <IonIcon icon={trendingUpOutline} />
                      <IonLabel>+12.5%</IonLabel>
                    </IonChip>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="analytics-card">
              <IonCardContent>
                <div className="analytics-metric">
                  <IonIcon icon={timeOutline} className="metric-icon wait-time" />
                  <div className="metric-content">
                    <h2>{overview.avgWaitTime} min</h2>
                    <p>Avg Wait Time</p>
                    <IonChip color="warning">
                      <IonIcon icon={trendingUpOutline} />
                      <IonLabel>+2.1%</IonLabel>
                    </IonChip>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="analytics-card">
              <IonCardContent>
                <div className="analytics-metric">
                  <IonIcon icon={checkmarkCircleOutline} className="metric-icon satisfaction" />
                  <div className="metric-content">
                    <h2>{overview.customerSatisfaction}/5</h2>
                    <p>Satisfaction</p>
                    <IonChip color="success">
                      <IonIcon icon={trendingUpOutline} />
                      <IonLabel>+0.3</IonLabel>
                    </IonChip>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          
          <IonCol size="12" sizeMd="6" sizeLg="3">
            <IonCard className="analytics-card">
              <IonCardContent>
                <div className="analytics-metric">
                  <IonIcon icon={alertCircleOutline} className="metric-icon no-show" />
                  <div className="metric-content">
                    <h2>{overview.noShowRate}%</h2>
                    <p>No-Show Rate</p>
                    <IonChip color="danger">
                      <IonIcon icon={trendingUpOutline} />
                      <IonLabel>+1.2%</IonLabel>
                    </IonChip>
                  </div>
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const renderCharts = () => {
    if (!analyticsData) return null;

    const customerTrendData = {
      labels: analyticsData.dailyStats.map(stat => 
        new Date(stat.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [
        {
          label: 'Daily Customers',
          data: analyticsData.dailyStats.map(stat => stat.customers),
          borderColor: 'var(--qhop-primary)',
          backgroundColor: 'var(--qhop-primary-light)',
          fill: true,
          tension: 0.4
        }
      ]
    };

    const peakHoursData = {
      labels: analyticsData.peakHours.map(hour => hour.label),
      datasets: [
        {
          label: 'Customer Count',
          data: analyticsData.peakHours.map(hour => hour.count),
          backgroundColor: [
            'var(--qhop-primary)',
            'var(--qhop-secondary)',
            'var(--qhop-accent)',
            'var(--qhop-warning)',
            'var(--qhop-success)'
          ]
        }
      ]
    };

    const queueUtilizationData = {
      labels: analyticsData.queuePerformance.map(queue => queue.name),
      datasets: [
        {
          label: 'Utilization Rate (%)',
          data: analyticsData.queuePerformance.map(queue => queue.utilizationRate),
          backgroundColor: 'var(--qhop-primary)',
          borderColor: 'var(--qhop-primary-dark)',
          borderWidth: 1
        }
      ]
    };

    return (
      <IonGrid>
        <IonRow>
          <IonCol size="12" sizeLg="8">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Customer Trends</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="chart-container">
                  <Line data={customerTrendData} options={getChartOptions('Daily Customer Flow')} />
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
          
          <IonCol size="12" sizeLg="4">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Peak Hours</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="chart-container">
                  <Doughnut data={peakHoursData} options={getChartOptions('Busiest Hours')} />
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        
        <IonRow>
          <IonCol size="12">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Queue Utilization</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <div className="chart-container">
                  <Bar data={queueUtilizationData} options={getChartOptions('Queue Performance')} />
                </div>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  const renderPerformanceMetrics = () => {
    if (!analyticsData) return null;

    return (
      <IonGrid>
        <IonRow>
          <IonCol size="12" sizeLg="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Queue Performance</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {analyticsData.queuePerformance.map((queue, index) => (
                    <IonItem key={index}>
                      <div className="queue-performance-item">
                        <div className="queue-info">
                          <h3>{queue.name}</h3>
                          <p>{queue.totalTickets} tickets processed</p>
                        </div>
                        <div className="queue-metrics">
                          <IonProgressBar 
                            value={queue.utilizationRate / 100} 
                            color={queue.utilizationRate > 90 ? 'danger' : queue.utilizationRate > 70 ? 'warning' : 'success'}
                          />
                          <IonBadge color={queue.utilizationRate > 90 ? 'danger' : queue.utilizationRate > 70 ? 'warning' : 'success'}>
                            {queue.utilizationRate.toFixed(1)}%
                          </IonBadge>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
          
          <IonCol size="12" sizeLg="6">
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Service Revenue</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList>
                  {analyticsData.serviceMetrics.map((service, index) => (
                    <IonItem key={index}>
                      <div className="service-revenue-item">
                        <div className="service-info">
                          <h3>{service.name}</h3>
                          <p>{service.totalBookings} bookings</p>
                        </div>
                        <div className="service-revenue">
                          <IonText color="success">
                            <h3>${service.revenue.toLocaleString()}</h3>
                          </IonText>
                          <p>${service.price} × {service.totalBookings}</p>
                        </div>
                      </div>
                    </IonItem>
                  ))}
                </IonList>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  };

  if (loading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Advanced Analytics</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <div className="loading-container">
            <IonSpinner name="crescent" />
            <p>Loading analytics...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Advanced Analytics</IonTitle>
          <IonButton 
            slot="end" 
            fill="clear" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <IonIcon icon={refreshing ? undefined : refreshOutline} />
            {refreshing && <IonSpinner name="crescent" />}
          </IonButton>
        </IonToolbar>
      </IonHeader>
      
      <IonContent>
        <div className="analytics-header">
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="12" sizeMd="6">
                <IonSegment 
                  value={selectedView} 
                  onIonChange={e => setSelectedView(e.detail.value as string)}
                >
                  <IonSegmentButton value="overview">
                    <IonLabel>Overview</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="trends">
                    <IonLabel>Trends</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton value="performance">
                    <IonLabel>Performance</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonCol>
              
              <IonCol size="12" sizeMd="6">
                <div className="analytics-controls">
                  <IonSelect
                    value={selectedPeriod}
                    onIonChange={e => setSelectedPeriod(e.detail.value)}
                    interface="popover"
                    placeholder="Select Period"
                  >
                    <IonSelectOption value="1d">Last 24 Hours</IonSelectOption>
                    <IonSelectOption value="7d">Last 7 Days</IonSelectOption>
                    <IonSelectOption value="30d">Last 30 Days</IonSelectOption>
                    <IonSelectOption value="90d">Last 90 Days</IonSelectOption>
                  </IonSelect>
                  
                  <IonButton fill="outline" size="small">
                    <IonIcon icon={downloadOutline} slot="start" />
                    Export
                  </IonButton>
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>

        <div className="analytics-content">
          {selectedView === 'overview' && renderOverviewCards()}
          {selectedView === 'trends' && renderCharts()}
          {selectedView === 'performance' && renderPerformanceMetrics()}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdvancedAnalytics;
