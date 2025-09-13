/**
 * Authentication Service for QHop
 * Handles phone-based OTP authentication, user sessions, and profile management
 */

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
  private readonly OTP_EXPIRY_MINUTES = 5;
  private currentSession: AuthSession | null = null;
  
  // Mock OTP storage for development
  private mockOTPs: Map<string, { otp: string; expiresAt: Date; sessionId: string }> = new Map();
  private mockUsers: Map<string, User> = new Map();

  constructor() {
    this.initializeMockData();
    this.loadStoredSession();
  }

  private initializeMockData() {
    // Create some mock users for development
    const mockUser: User = {
      id: 'user-1',
      phone: '+2348012345678',
      name: 'John Doe',
      email: 'john.doe@example.com',
      isVerified: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      preferences: {
        notifications: true,
        darkMode: false,
        language: 'en'
      }
    };
    
    this.mockUsers.set(mockUser.phone, mockUser);
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
    await this.delay(1000); // Simulate network delay

    const fullPhone = `${request.countryCode}${request.phone}`;
    const otp = this.generateOTP();
    const sessionId = this.generateSessionId();
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);

    // Store OTP for verification
    this.mockOTPs.set(fullPhone, { otp, expiresAt, sessionId });

    // In production, this would send SMS via service like Twilio
    console.log(`🔐 OTP for ${fullPhone}: ${otp} (expires in ${this.OTP_EXPIRY_MINUTES} minutes)`);

    return {
      sessionId,
      expiresIn: this.OTP_EXPIRY_MINUTES * 60
    };
  }

  /**
   * Verify OTP and authenticate user
   */
  async verifyOTP(verification: OTPVerification): Promise<AuthSession> {
    await this.delay(800);

    const fullPhone = verification.phone;
    const storedOTP = this.mockOTPs.get(fullPhone);

    if (!storedOTP) {
      throw new Error('No OTP found for this phone number');
    }

    if (storedOTP.sessionId !== verification.sessionId) {
      throw new Error('Invalid session');
    }

    if (new Date() > storedOTP.expiresAt) {
      this.mockOTPs.delete(fullPhone);
      throw new Error('OTP has expired');
    }

    if (storedOTP.otp !== verification.otp) {
      throw new Error('Invalid OTP');
    }

    // OTP verified successfully
    this.mockOTPs.delete(fullPhone);

    // Get or create user
    let user = this.mockUsers.get(fullPhone);
    if (!user) {
      // Create new user
      user = {
        id: `user_${Date.now()}`,
        phone: fullPhone,
        isVerified: true,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        preferences: {
          notifications: true,
          darkMode: false,
          language: 'en'
        }
      };
      this.mockUsers.set(fullPhone, user);
    } else {
      // Update last login
      user.lastLoginAt = new Date().toISOString();
      this.mockUsers.set(fullPhone, user);
    }

    // Create session
    const session: AuthSession = {
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      refreshToken: `refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      user
    };

    this.storeSession(session);
    return session;
  }

  /**
   * Update user profile
   */
  async updateProfile(updates: ProfileUpdate): Promise<User> {
    await this.delay(500);

    const session = this.getCurrentSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const updatedUser: User = {
      ...session.user,
      ...updates,
      preferences: {
        ...session.user.preferences,
        ...updates.preferences
      }
    };

    // Update stored user
    this.mockUsers.set(updatedUser.phone, updatedUser);

    // Update session
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
    await this.delay(300);

    const session = this.getCurrentSession();
    if (!session) {
      throw new Error('No active session to refresh');
    }

    const refreshedSession: AuthSession = {
      ...session,
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
   * Delete user account
   */
  async deleteAccount(): Promise<void> {
    await this.delay(1000);

    const session = this.getCurrentSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    // Remove user data
    this.mockUsers.delete(session.user.phone);
    this.clearStoredSession();
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
