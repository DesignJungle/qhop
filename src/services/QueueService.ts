// QHop Queue Management Service
// This service handles all queue-related operations

export interface Business {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  website?: string;
  distance: string;
  rating: number;
  totalReviews: number;
  currentWaitTime: string;
  queueLength: number;
  status: 'Open' | 'Busy' | 'Closed';
  acceptsDeposit: boolean;
  depositAmount?: number;
  hasPriority: boolean;
  description: string;
  hours: {
    today: string;
    tomorrow: string;
  };
  services: Service[];
  policies: string[];
  location: {
    lat: number;
    lng: number;
  };
}

export interface Service {
  id: string;
  name: string;
  avgTime: string;
  price: number;
  description?: string;
}

export interface Ticket {
  id: string;
  businessId: string;
  businessName: string;
  businessAddress: string;
  ticketNumber: string;
  position: number;
  totalInQueue: number;
  eta: string;
  status: 'waiting' | 'called' | 'completed' | 'cancelled' | 'no-show';
  joinedAt: string;
  estimatedCallTime: string;
  progress: number;
  serviceId: string;
  serviceName: string;
  partySize: number;
  depositPaid?: boolean;
  depositAmount?: number;
}

export interface QueueJoinRequest {
  businessId: string;
  serviceId: string;
  partySize: number;
  acceptsTerms: boolean;
  payDeposit?: boolean;
}

export interface NotificationData {
  id: string;
  type: 'queue_update' | 'position_update' | 'delay' | 'reminder' | 'completed' | 'cancelled';
  title: string;
  message: string;
  time: string;
  read: boolean;
  businessName?: string;
  ticketNumber?: string;
  ticketId?: string;
}

class QueueService {
  private baseUrl = 'http://localhost:3001/api'; // Backend API URL
  private wsUrl = 'ws://localhost:3001'; // WebSocket URL for real-time updates
  private ws: WebSocket | null = null;

  // Mock data for development
  private mockBusinesses: Business[] = [
    {
      id: '1',
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
      status: 'Open',
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
    },
    {
      id: '2',
      name: 'Premium Cuts Barber',
      category: 'Barber',
      address: '456 Oak Avenue, Midtown',
      phone: '+234 802 345 6789',
      distance: '0.5 km',
      rating: 4.8,
      totalReviews: 89,
      currentWaitTime: '25 min',
      queueLength: 5,
      status: 'Busy',
      acceptsDeposit: true,
      depositAmount: 500,
      hasPriority: true,
      description: 'Premium barbering services with skilled professionals and modern equipment.',
      hours: {
        today: '9:00 AM - 8:00 PM',
        tomorrow: '9:00 AM - 8:00 PM'
      },
      services: [
        { id: 'haircut', name: 'Haircut & Styling', avgTime: '30 min', price: 2500 },
        { id: 'shave', name: 'Beard Trim & Shave', avgTime: '20 min', price: 1500 },
        { id: 'combo', name: 'Full Service Combo', avgTime: '45 min', price: 3500 }
      ],
      policies: [
        'Appointments preferred but walk-ins welcome',
        'Deposit required for weekend bookings',
        'Cancellation policy: 2 hours notice required'
      ],
      location: { lat: 6.5344, lng: 3.3892 }
    }
  ];

  private mockTickets: Ticket[] = [
    {
      id: 'ticket-1',
      businessId: '1',
      businessName: 'City Medical Center',
      businessAddress: '123 Main Street, Downtown',
      ticketNumber: 'A-045',
      position: 3,
      totalInQueue: 8,
      eta: '12 min',
      status: 'waiting',
      joinedAt: '2:30 PM',
      estimatedCallTime: '2:42 PM',
      progress: 62.5,
      serviceId: 'general',
      serviceName: 'General Consultation',
      partySize: 1,
      depositPaid: true,
      depositAmount: 1000
    }
  ];

  // Business Discovery
  async searchBusinesses(query?: string, category?: string, location?: { lat: number; lng: number }): Promise<Business[]> {
    // In a real app, this would make an API call
    await this.delay(500); // Simulate network delay
    
    let results = [...this.mockBusinesses];
    
    if (query) {
      results = results.filter(business => 
        business.name.toLowerCase().includes(query.toLowerCase()) ||
        business.category.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category && category !== 'all') {
      results = results.filter(business => 
        business.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    return results;
  }

  async getBusinessById(id: string): Promise<Business | null> {
    await this.delay(300);
    return this.mockBusinesses.find(business => business.id === id) || null;
  }

  async getNearbyBusinesses(location: { lat: number; lng: number }, radius: number = 5): Promise<Business[]> {
    await this.delay(400);
    // In a real app, this would filter by actual distance
    return this.mockBusinesses.filter(business => business.status === 'Open');
  }

  // Queue Management
  async joinQueue(request: QueueJoinRequest): Promise<Ticket> {
    await this.delay(800);
    
    const business = this.mockBusinesses.find(b => b.id === request.businessId);
    const service = business?.services.find(s => s.id === request.serviceId);
    
    if (!business || !service) {
      throw new Error('Business or service not found');
    }

    const newTicket: Ticket = {
      id: `ticket-${Date.now()}`,
      businessId: request.businessId,
      businessName: business.name,
      businessAddress: business.address,
      ticketNumber: `${business.name.charAt(0)}-${String(Math.floor(Math.random() * 100)).padStart(3, '0')}`,
      position: business.queueLength + 1,
      totalInQueue: business.queueLength + 1,
      eta: this.calculateETA(business.queueLength + 1, service.avgTime),
      status: 'waiting',
      joinedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedCallTime: this.calculateCallTime(business.queueLength + 1, service.avgTime),
      progress: 0,
      serviceId: request.serviceId,
      serviceName: service.name,
      partySize: request.partySize,
      depositPaid: request.payDeposit && business.acceptsDeposit,
      depositAmount: request.payDeposit ? business.depositAmount : undefined
    };

    this.mockTickets.push(newTicket);
    return newTicket;
  }

  async getActiveTickets(): Promise<Ticket[]> {
    await this.delay(300);
    return this.mockTickets.filter(ticket => 
      ['waiting', 'called'].includes(ticket.status)
    );
  }

  async getTicketById(id: string): Promise<Ticket | null> {
    await this.delay(200);
    return this.mockTickets.find(ticket => ticket.id === id) || null;
  }

  async cancelTicket(ticketId: string): Promise<boolean> {
    await this.delay(500);
    const ticketIndex = this.mockTickets.findIndex(ticket => ticket.id === ticketId);
    
    if (ticketIndex !== -1) {
      this.mockTickets[ticketIndex].status = 'cancelled';
      return true;
    }
    
    return false;
  }

  // Real-time Updates
  connectToUpdates(onUpdate: (data: any) => void): void {
    // In a real app, this would establish WebSocket connection
    console.log('Connecting to real-time updates...');
    
    // Simulate periodic updates
    setInterval(() => {
      // Simulate queue position updates
      this.mockTickets.forEach(ticket => {
        if (ticket.status === 'waiting' && ticket.position > 1) {
          const shouldUpdate = Math.random() > 0.7; // 30% chance of update
          if (shouldUpdate) {
            ticket.position = Math.max(1, ticket.position - 1);
            ticket.progress = ((ticket.totalInQueue - ticket.position) / ticket.totalInQueue) * 100;
            ticket.eta = this.calculateETA(ticket.position, '15 min');
            
            onUpdate({
              type: 'position_update',
              ticketId: ticket.id,
              newPosition: ticket.position,
              newETA: ticket.eta
            });
          }
        }
      });
    }, 10000); // Update every 10 seconds
  }

  disconnectFromUpdates(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  // Utility methods
  private calculateETA(position: number, avgServiceTime: string): string {
    const minutes = parseInt(avgServiceTime) * position;
    return `${minutes} min`;
  }

  private calculateCallTime(position: number, avgServiceTime: string): string {
    const now = new Date();
    const minutes = parseInt(avgServiceTime) * position;
    const callTime = new Date(now.getTime() + minutes * 60000);
    return callTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const queueService = new QueueService();
export default queueService;
