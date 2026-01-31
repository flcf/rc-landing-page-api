import { VercelRequest, VercelResponse } from '@vercel/node';
import { readEventsFromFirestore } from '../../services/calendarService';
import { corsMiddleware } from '../../middleware/corsMiddleware';
import { rateLimitMiddleware } from '../../middleware/rateLimitMiddleware';

export default async function getCalendarEvents(req: VercelRequest, res: VercelResponse) {
  try {
    const events = await readEventsFromFirestore();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve calendar events' });
  }
}

//TODO: Add back CORS and rate limiting middleware
