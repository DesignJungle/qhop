/**
 * Authentication Service for QHop - Real API Integration
 * Handles phone-based OTP authentication, user sessions, and profile management
 */

import { apiService, type User as ApiUser, type BusinessOwner, type ApiResponse } from './ApiService';

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
  };
}

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface OTPRequest {
  phone: string;
  countryCode: string;
}

export interface OTPVerification {
  phone: string;
  otp: string;
  sessionId: string;
}

export interface ProfileUpdate {
  name?: string;
  email?: string;
  avatar?: string;
  preferences?: Partial<User['preferences']>;
}

class AuthService {
  private readonly STORAGE_KEY = 'qhop_auth_session';
  private currentSession: AuthSession | null = null;
  private currentUser: User | null = null;
  private currentBusinessOwner: BusinessOwner | null = null;
  private userType: 'customer' | 'business' | null = null;

  constructor() {
    this.loadStoredSession();
  }

  // Initialize and verify existing session
  private async initializeSession(): Promise<void> {
    const token = apiService.getToken();
    if (token) {
      const result = await apiService.verifyToken();
      if (result.success) {
        if (result.data?.type === 'customer' && result.data.user) {
          this.currentUser = this.mapApiUserToUser(result.data.user);
          this.userType = 'customer';
        } else if (result.data?.type === 'business' && result.data.owner) {
          this.currentBusinessOwner = result.data.owner;
          this.userType = 'business';
        }
      } else {
        this.clearSession();
      }
    }
  }

  private loadStoredSession() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const session: AuthSession = JSON.parse(stored);
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = session;
        } else {
          this.clearStoredSession();
        }
      }
    } catch (error) {
      console.error('Failed to load stored session:', error);
      this.clearStoredSession();
    }
  }

  private storeSession(session: AuthSession) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(session));
      this.currentSession = session;
    } catch (error) {
      console.error('Failed to store session:', error);
    }
  }

  private clearStoredSession() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentSession = null;
  }

  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public API Methods

  /**
   * Check if user is currently authenticated
   */
  isAuthenticated(): boolean {
    return this.currentSession !== null && new Date(this.currentSession.expiresAt) > new Date();
  }

  /**
   * Get current user session
   */
  getCurrentSession(): AuthSession | null {
    return this.isAuthenticated() ? this.currentSession : null;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    const session = this.getCurrentSession();
    return session ? session.user : null;
  }

  /**
   * Request OTP for phone number
   */
  async requestOTP(request: OTPRequest): Promise<{ sessionId: string; expiresIn: number }> {
    const fullPhone = `${request.countryCode}${request.phone}`;

    const result = await apiService.requestOTP(fullPhone);

    if (result.success && result.data) {
      return {
        sessionId: result.data.sessionId,
        expiresIn: result.data.expiresIn
      };
    } else {
      throw new Error(result.error || result.message || 'Failed to send OTP');
    }
  }

  /**
   * Verify OTP and authenticate user
   */
  async verifyOTP(verification: OTPVerification): Promise<AuthSession> {
    const result = await apiService.verifyOTP(verification.sessionId, verification.otp, verification.name);

    if (result.success && result.data) {
      const user = this.mapApiUserToUser(result.data.user);
      this.currentUser = user;
      this.userType = 'customer';

      // Create session
      const session: AuthSession = {
        token: result.data.token,
        refreshToken: result.data.token, // Using same token for now
        expiresAt: new Date(Date.now() + result.data.expiresIn * 1000).toISOString(),
        user
      };

      this.storeSession(session);
      return session;
    } else {
      throw new Error(result.error || result.message || 'Failed to verify OTP');
    }
  }

  /**
   * Business owner login
   */
  async businessLogin(email: string, password: string): Promise<AuthSession> {
    const result = await apiService.businessLogin(email, password);

    if (result.success && result.data) {
      this.currentBusinessOwner = result.data.owner;
      this.userType = 'business';

      // Create session for business owner
      const session: AuthSession = {
        token: result.data.token,
        refreshToken: result.data.token,
        expiresAt: new Date(Date.now() + result.data.expiresIn * 1000).toISOString(),
        user: this.mapBusinessOwnerToUser(result.data.owner)
      };

      this.storeSession(session);
      return session;
    } else {
      throw new Error(result.error || result.message || 'Failed to login');
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: ProfileUpdate): Promise<User> {
    const session = this.getCurrentSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    // For now, just update locally - in production this would call API
    const updatedUser: User = {
      ...session.user,
      ...updates,
      preferences: {
        ...session.user.preferences,
        ...updates.preferences
      }
    };

    const updatedSession: AuthSession = {
      ...session,
      user: updatedUser
    };

    this.storeSession(updatedSession);
    return updatedUser;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(): Promise<AuthSession> {
    const session = this.getCurrentSession();
    if (!session) {
      throw new Error('No active session to refresh');
    }

    // For now, just extend the current session
    // In production, this would call the API to refresh the token
    const refreshedSession: AuthSession = {
      ...session,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    this.storeSession(refreshedSession);
    return refreshedSession;
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await this.delay(200);
    this.clearStoredSession();
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    await apiService.logout();
    this.clearSession();
  }

  /**
   * Get current user type
   */
  getUserType(): 'customer' | 'business' | null {
    return this.userType;
  }

  /**
   * Get current business owner
   */
  getCurrentBusinessOwner(): BusinessOwner | null {
    return this.currentBusinessOwner;
  }

  /**
   * Clear all session data
   */
  private clearSession(): void {
    this.currentSession = null;
    this.currentUser = null;
    this.currentBusinessOwner = null;
    this.userType = null;
    this.clearStoredSession();
    apiService.clearToken();
  }

  /**
   * Map API user to local user interface
   */
  private mapApiUserToUser(apiUser: ApiUser): User {
    return {
      id: apiUser.id,
      phone: apiUser.phone,
      name: apiUser.name,
      email: apiUser.email,
      avatar: apiUser.avatar,
      isVerified: apiUser.isVerified,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
      }
    };
  }

  /**
   * Map business owner to user interface for session compatibility
   */
  private mapBusinessOwnerToUser(owner: BusinessOwner): User {
    return {
      id: owner.id,
      phone: owner.phone,
      name: owner.name,
      email: owner.email,
      avatar: undefined,
      isVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
      }
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
