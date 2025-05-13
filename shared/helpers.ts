import moment from 'moment-timezone';
import crypto from 'crypto';

export function extractEventLink(description: string): string | null {
    if (!description) {
      return null;
    }
  
    const urlRegex = /(https?:\/\/[^\s">]+)/g;
  
    const matches = description.match(urlRegex);
  
    return matches ? matches[0] : null;
  }

export function getTimezone(timezone: string): string {
    const now = new Date();
    return moment.tz(now, timezone).format('z');

  }

export function generateDocumentKey(eventId: string, calUID: string): string {
  const combinedString = `${eventId}-${calUID}`
  return crypto.createHash('sha256').update(combinedString).digest('hex')
} 