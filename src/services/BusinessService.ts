// QHop Business Management Service
// This service handles all business owner operations

export interface BusinessOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessIds: string[];
  role: 'owner' | 'manager' | 'staff';
  permissions: BusinessPermission[];
  createdAt: string;
  lastLogin: string;
}

export interface BusinessPermission {
  businessId: string;
  permissions: ('manage_queue' | 'view_analytics' | 'manage_staff' | 'manage_settings')[];
}

export interface QueueSettings {
  businessId: string;
  maxQueueSize: number;
  avgServiceTime: number; // in minutes
  allowWalkIns: boolean;
  requireDeposit: boolean;
  depositAmount?: number;
  autoCallNext: boolean;
  sendNotifications: boolean;
  operatingHours: {
    [key: string]: { // day of week
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  breaks: {
    start: string;
    end: string;
    description: string;
  }[];
}

export interface QueueAnalytics {
  businessId: string;
  date: string;
  totalCustomers: number;
  avgWaitTime: number;
  avgServiceTime: number;
  peakHours: string[];
  customerSatisfaction: number;
  noShowRate: number;
  revenue: number;
  hourlyData: {
    hour: string;
    customers: number;
    avgWait: number;
    revenue: number;
  }[];
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'manager' | 'staff';
  businessId: string;
  isActive: boolean;
  permissions: string[];
  schedule: {
    [key: string]: {
      start: string;
      end: string;
      isWorking: boolean;
    };
  };
}

class BusinessService {
  private businessOwners: BusinessOwner[] = [];
  private queueSettings: Map<string, QueueSettings> = new Map();
  private analytics: Map<string, QueueAnalytics[]> = new Map();
  private staff: Map<string, StaffMember[]> = new Map();

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock business owner
    const mockOwner: BusinessOwner = {
      id: 'owner-1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+2348012345678',
      businessIds: ['business-1', 'business-2'],
      role: 'owner',
      permissions: [
        {
          businessId: 'business-1',
          permissions: ['manage_queue', 'view_analytics', 'manage_staff', 'manage_settings']
        }
      ],
      createdAt: '2024-01-15T10:00:00Z',
      lastLogin: new Date().toISOString()
    };

    this.businessOwners.push(mockOwner);

    // Mock queue settings
    const mockSettings: QueueSettings = {
      businessId: 'business-1',
      maxQueueSize: 50,
      avgServiceTime: 15,
      allowWalkIns: true,
      requireDeposit: false,
      autoCallNext: true,
      sendNotifications: true,
      operatingHours: {
        monday: { open: '09:00', close: '17:00', isOpen: true },
        tuesday: { open: '09:00', close: '17:00', isOpen: true },
        wednesday: { open: '09:00', close: '17:00', isOpen: true },
        thursday: { open: '09:00', close: '17:00', isOpen: true },
        friday: { open: '09:00', close: '17:00', isOpen: true },
        saturday: { open: '10:00', close: '15:00', isOpen: true },
        sunday: { open: '00:00', close: '00:00', isOpen: false }
      },
      breaks: [
        { start: '12:00', end: '13:00', description: 'Lunch Break' }
      ]
    };

    this.queueSettings.set('business-1', mockSettings);

    // Mock analytics
    const mockAnalytics: QueueAnalytics = {
      businessId: 'business-1',
      date: new Date().toISOString().split('T')[0],
      totalCustomers: 45,
      avgWaitTime: 12,
      avgServiceTime: 15,
      peakHours: ['10:00-11:00', '14:00-15:00'],
      customerSatisfaction: 4.5,
      noShowRate: 0.08,
      revenue: 2250,
      hourlyData: [
        { hour: '09:00', customers: 3, avgWait: 5, revenue: 150 },
        { hour: '10:00', customers: 8, avgWait: 15, revenue: 400 },
        { hour: '11:00', customers: 6, avgWait: 10, revenue: 300 },
        { hour: '12:00', customers: 2, avgWait: 8, revenue: 100 },
        { hour: '13:00', customers: 4, avgWait: 12, revenue: 200 },
        { hour: '14:00', customers: 9, avgWait: 18, revenue: 450 },
        { hour: '15:00', customers: 7, avgWait: 14, revenue: 350 },
        { hour: '16:00', customers: 6, avgWait: 11, revenue: 300 }
      ]
    };

    this.analytics.set('business-1', [mockAnalytics]);

    // Mock staff
    const mockStaff: StaffMember[] = [
      {
        id: 'staff-1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+2348087654321',
        role: 'manager',
        businessId: 'business-1',
        isActive: true,
        permissions: ['manage_queue', 'view_analytics'],
        schedule: {
          monday: { start: '09:00', end: '17:00', isWorking: true },
          tuesday: { start: '09:00', end: '17:00', isWorking: true },
          wednesday: { start: '09:00', end: '17:00', isWorking: true },
          thursday: { start: '09:00', end: '17:00', isWorking: true },
          friday: { start: '09:00', end: '17:00', isWorking: true },
          saturday: { start: '00:00', end: '00:00', isWorking: false },
          sunday: { start: '00:00', end: '00:00', isWorking: false }
        }
      }
    ];

    this.staff.set('business-1', mockStaff);
  }

  // Business Owner Authentication
  async authenticateBusinessOwner(email: string, password: string): Promise<BusinessOwner | null> {
    console.log('🏢 Business Owner Login:', { email });
    
    // Mock authentication - in production, this would validate against backend
    const owner = this.businessOwners.find(o => o.email === email);
    if (owner) {
      owner.lastLogin = new Date().toISOString();
      console.log('✅ Business Owner Authenticated:', owner.name);
      return owner;
    }
    
    console.log('❌ Business Owner Authentication Failed');
    return null;
  }

  // Queue Management
  async getQueueSettings(businessId: string): Promise<QueueSettings | null> {
    return this.queueSettings.get(businessId) || null;
  }

  async updateQueueSettings(businessId: string, settings: Partial<QueueSettings>): Promise<boolean> {
    const current = this.queueSettings.get(businessId);
    if (current) {
      this.queueSettings.set(businessId, { ...current, ...settings });
      console.log('✅ Queue Settings Updated:', businessId);
      return true;
    }
    return false;
  }

  // Analytics
  async getAnalytics(businessId: string, dateRange?: { start: string; end: string }): Promise<QueueAnalytics[]> {
    const analytics = this.analytics.get(businessId) || [];
    
    if (dateRange) {
      return analytics.filter(a => 
        a.date >= dateRange.start && a.date <= dateRange.end
      );
    }
    
    return analytics;
  }

  // Staff Management
  async getStaff(businessId: string): Promise<StaffMember[]> {
    return this.staff.get(businessId) || [];
  }

  async addStaffMember(businessId: string, staff: Omit<StaffMember, 'id'>): Promise<StaffMember> {
    const newStaff: StaffMember = {
      ...staff,
      id: `staff-${Date.now()}`
    };
    
    const currentStaff = this.staff.get(businessId) || [];
    this.staff.set(businessId, [...currentStaff, newStaff]);
    
    console.log('✅ Staff Member Added:', newStaff.name);
    return newStaff;
  }

  async updateStaffMember(businessId: string, staffId: string, updates: Partial<StaffMember>): Promise<boolean> {
    const currentStaff = this.staff.get(businessId) || [];
    const staffIndex = currentStaff.findIndex(s => s.id === staffId);
    
    if (staffIndex !== -1) {
      currentStaff[staffIndex] = { ...currentStaff[staffIndex], ...updates };
      this.staff.set(businessId, currentStaff);
      console.log('✅ Staff Member Updated:', staffId);
      return true;
    }
    
    return false;
  }

  // Real-time Queue Operations
  async getCurrentQueue(businessId: string): Promise<any[]> {
    // This would connect to real-time queue data
    // For now, return mock data
    return [
      { id: 'ticket-1', number: 'A001', customerName: 'John Doe', waitTime: '5 min', status: 'waiting' },
      { id: 'ticket-2', number: 'A002', customerName: 'Jane Smith', waitTime: '12 min', status: 'waiting' },
      { id: 'ticket-3', number: 'A003', customerName: 'Bob Johnson', waitTime: '18 min', status: 'called' }
    ];
  }

  async callNextCustomer(businessId: string): Promise<boolean> {
    console.log('📢 Calling next customer for business:', businessId);
    // This would trigger real-time notifications
    return true;
  }

  async markCustomerServed(businessId: string, ticketId: string): Promise<boolean> {
    console.log('✅ Customer served:', { businessId, ticketId });
    return true;
  }

  async markCustomerNoShow(businessId: string, ticketId: string): Promise<boolean> {
    console.log('❌ Customer no-show:', { businessId, ticketId });
    return true;
  }
}

export const businessService = new BusinessService();
