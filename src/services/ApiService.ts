// QHop API Service - Real Backend Integration
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  avatar?: string;
  isVerified: boolean;
}

interface BusinessPermission {
  businessId: string;
  permissions: ('manage_queue' | 'view_analytics' | 'manage_staff' | 'manage_settings')[];
}

interface BusinessOwner {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'owner' | 'manager' | 'staff';
  businessIds: string[];
  permissions: BusinessPermission[];
  createdAt: string;
  lastLogin: string;
}

interface Ticket {
  id: string;
  ticketNumber: string;
  position: number;
  estimatedTime: string;
  status: string;
  business: {
    id: string;
    name: string;
    address: string;
    phone: string;
  };
  queue: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
    duration: number;
    price: number;
  };
  createdAt: string;
}

interface QueueStatus {
  queueId: string;
  waiting: number;
  called: number;
  inService: number;
  total: number;
  averageWaitTime: number;
  estimatedWaitTime: number;
  currentlyServing?: {
    ticketNumber: string;
    customerName: string;
  };
  lastUpdated: string;
}

class ApiService {
  private token: string | null = null;
  private socket: Socket | null = null;

  constructor() {
    this.token = localStorage.getItem('qhop_token');
  }

  // Authentication Methods
  async requestOTP(phone: string): Promise<ApiResponse<{ sessionId: string; expiresIn: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer/request-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error requesting OTP:', error);
      return {
        success: false,
        error: 'Failed to request OTP'
      };
    }
  }

  async verifyOTP(sessionId: string, otp: string, name?: string): Promise<ApiResponse<{ user: User; token: string; expiresIn: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/customer/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId, otp, name }),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        this.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        error: 'Failed to verify OTP'
      };
    }
  }

  async businessLogin(email: string, password: string): Promise<ApiResponse<{ owner: BusinessOwner; token: string; expiresIn: number }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/business/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (data.success && data.token) {
        this.setToken(data.token);
      }
      
      return data;
    } catch (error) {
      console.error('Error in business login:', error);
      return {
        success: false,
        error: 'Failed to login'
      };
    }
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (data.success) {
        this.clearToken();
        this.disconnectWebSocket();
      }
      
      return data;
    } catch (error) {
      console.error('Error logging out:', error);
      this.clearToken();
      this.disconnectWebSocket();
      return {
        success: true,
        message: 'Logged out locally'
      };
    }
  }

  async verifyToken(): Promise<ApiResponse<{ user?: User; owner?: BusinessOwner; type: 'customer' | 'business' }>> {
    if (!this.token) {
      return {
        success: false,
        error: 'No token available'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
        },
      });

      const data = await response.json();
      
      if (!data.success) {
        this.clearToken();
      }
      
      return data;
    } catch (error) {
      console.error('Error verifying token:', error);
      this.clearToken();
      return {
        success: false,
        error: 'Failed to verify token'
      };
    }
  }

  // Queue Management Methods
  async joinQueue(businessId: string, queueId: string, serviceId?: string): Promise<ApiResponse<{ ticket: Ticket }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/queue/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ businessId, queueId, serviceId }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error joining queue:', error);
      return {
        success: false,
        error: 'Failed to join queue'
      };
    }
  }

  async leaveQueue(ticketId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/queue/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error leaving queue:', error);
      return {
        success: false,
        error: 'Failed to leave queue'
      };
    }
  }

  async getQueueStatus(queueId: string): Promise<ApiResponse<{ queueStatus: QueueStatus }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/queue/${queueId}/status`, {
        method: 'GET',
      });

      return await response.json();
    } catch (error) {
      console.error('Error getting queue status:', error);
      return {
        success: false,
        error: 'Failed to get queue status'
      };
    }
  }

  async callNextCustomer(queueId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/queue/call-next`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ queueId }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error calling next customer:', error);
      return {
        success: false,
        error: 'Failed to call next customer'
      };
    }
  }

  // WebSocket Methods
  connectWebSocket(): Socket | null {
    if (!this.token) {
      console.warn('Cannot connect WebSocket without token');
      return null;
    }

    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(WS_URL, {
      auth: {
        token: this.token
      },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('🔌 WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('🔌 WebSocket error:', error);
    });

    return this.socket;
  }

  disconnectWebSocket(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Token Management
  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('qhop_token', token);
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('qhop_token');
  }

  // Utility Methods
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(this.token && { 'Authorization': `Bearer ${this.token}` }),
          ...options.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error);
      return {
        success: false,
        error: 'Network error'
      };
    }
  }
}

export const apiService = new ApiService();
export type { User, BusinessOwner, Ticket, QueueStatus, ApiResponse };
