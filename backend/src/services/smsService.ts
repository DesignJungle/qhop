import twilio from 'twilio';
import { logger } from '../utils/logger';

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

let twilioClient: twilio.Twilio | null = null;

if (accountSid && authToken) {
  twilioClient = twilio(accountSid, authToken);
  logger.info('📱 Twilio SMS service initialized');
} else {
  logger.warn('📱 Twilio credentials not found, SMS service will use mock mode');
}

interface SMSOptions {
  to: string;
  message: string;
  from?: string;
}

interface SMSResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send SMS message
 */
export async function sendSMS(to: string, message: string): Promise<SMSResult> {
  try {
    // Validate phone number format
    if (!isValidPhoneNumber(to)) {
      throw new Error('Invalid phone number format');
    }

    // In development or if Twilio is not configured, log to console
    if (!twilioClient || process.env.NODE_ENV === 'development') {
      logger.info(`📱 SMS (Mock): ${to} - ${message}`);
      return {
        success: true,
        messageId: `mock_${Date.now()}`
      };
    }

    // Send actual SMS via Twilio
    const result = await twilioClient.messages.create({
      body: message,
      from: fromNumber,
      to: to
    });

    logger.info(`📱 SMS sent successfully to ${to}`, {
      messageId: result.sid,
      status: result.status
    });

    return {
      success: true,
      messageId: result.sid
    };

  } catch (error: any) {
    logger.error(`📱 SMS sending failed to ${to}:`, error);
    
    return {
      success: false,
      error: error.message || 'Failed to send SMS'
    };
  }
}

/**
 * Send OTP SMS
 */
export async function sendOTPSMS(to: string, otp: string): Promise<SMSResult> {
  const message = `Your QHop verification code is: ${otp}. This code will expire in 5 minutes. Do not share this code with anyone.`;
  return await sendSMS(to, message);
}

/**
 * Send queue notification SMS
 */
export async function sendQueueNotificationSMS(to: string, businessName: string, ticketNumber: string, message: string): Promise<SMSResult> {
  const fullMessage = `QHop - ${businessName}\nTicket: ${ticketNumber}\n${message}`;
  return await sendSMS(to, fullMessage);
}

/**
 * Send appointment reminder SMS
 */
export async function sendAppointmentReminderSMS(to: string, businessName: string, appointmentTime: string): Promise<SMSResult> {
  const message = `Reminder: You have an appointment at ${businessName} at ${appointmentTime}. Please arrive on time.`;
  return await sendSMS(to, message);
}

/**
 * Send business notification SMS
 */
export async function sendBusinessNotificationSMS(to: string, message: string): Promise<SMSResult> {
  const fullMessage = `QHop Business Alert: ${message}`;
  return await sendSMS(to, fullMessage);
}

/**
 * Validate phone number format
 */
function isValidPhoneNumber(phone: string): boolean {
  // Basic international phone number validation
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Format phone number for SMS
 */
export function formatPhoneNumber(phone: string, countryCode?: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add country code if not present
  if (countryCode && !cleaned.startsWith(countryCode.replace('+', ''))) {
    cleaned = countryCode.replace('+', '') + cleaned;
  }
  
  // Add + prefix if not present
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Check SMS delivery status
 */
export async function checkSMSStatus(messageId: string): Promise<{ status: string; error?: string }> {
  try {
    if (!twilioClient) {
      return { status: 'mock_delivered' };
    }

    const message = await twilioClient.messages(messageId).fetch();
    
    return {
      status: message.status
    };

  } catch (error: any) {
    logger.error(`Failed to check SMS status for ${messageId}:`, error);
    return {
      status: 'unknown',
      error: error.message
    };
  }
}

/**
 * Get SMS sending statistics
 */
export async function getSMSStats(startDate?: Date, endDate?: Date): Promise<{
  sent: number;
  delivered: number;
  failed: number;
  pending: number;
}> {
  try {
    if (!twilioClient) {
      return { sent: 0, delivered: 0, failed: 0, pending: 0 };
    }

    const options: any = {};
    if (startDate) options.dateSentAfter = startDate;
    if (endDate) options.dateSentBefore = endDate;

    const messages = await twilioClient.messages.list(options);
    
    const stats = {
      sent: 0,
      delivered: 0,
      failed: 0,
      pending: 0
    };

    messages.forEach(message => {
      stats.sent++;
      switch (message.status) {
        case 'delivered':
          stats.delivered++;
          break;
        case 'failed':
        case 'undelivered':
          stats.failed++;
          break;
        case 'queued':
        case 'sending':
        case 'sent':
          stats.pending++;
          break;
      }
    });

    return stats;

  } catch (error: any) {
    logger.error('Failed to get SMS stats:', error);
    return { sent: 0, delivered: 0, failed: 0, pending: 0 };
  }
}

/**
 * Validate Twilio webhook signature
 */
export function validateTwilioSignature(signature: string, url: string, params: any): boolean {
  if (!twilioClient || !authToken) {
    return true; // Skip validation in development
  }

  try {
    return twilio.validateRequest(authToken, signature, url, params);
  } catch (error) {
    logger.error('Twilio signature validation failed:', error);
    return false;
  }
}

export default {
  sendSMS,
  sendOTPSMS,
  sendQueueNotificationSMS,
  sendAppointmentReminderSMS,
  sendBusinessNotificationSMS,
  formatPhoneNumber,
  checkSMSStatus,
  getSMSStats,
  validateTwilioSignature
};
