import moment from 'moment-timezone';

export function extractEventLink(description: string): string | null {
    if (!description) {
      return null;
    }
  
    const urlRegex = /(https?:\/\/[^\s]+)/g;
  
    const matches = description.match(urlRegex);
  
    return matches ? matches[0] : null;
  }

export function getTimezone(timezone: string): string {
    const now = new Date();
    return moment.tz(now, timezone).format('z');

  }