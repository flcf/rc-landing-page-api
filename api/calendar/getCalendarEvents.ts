import { VercelRequest, VercelResponse } from '@vercel/node';
import { readEventsFromFirestore } from '../../services/calendarService';
import withMiddleware from '../../middleware';

async function getCalendarEvents(req: VercelRequest, res: VercelResponse) {
  try {
    const events = await readEventsFromFirestore();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve calendar events' });
  }
}

export default withMiddleware(getCalendarEvents);
