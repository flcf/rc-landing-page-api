import { VercelRequest, VercelResponse } from '@vercel/node';
import fetchGoogleCalendarEvents from '../../services/calendarService';

export default async function updateCalendarEvents(req: VercelRequest, res: VercelResponse) {
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

    if (!calendarId) {
        return res.status(400).json({ error: 'Calendar ID is required' });
    }

    try {
        const events = await fetchGoogleCalendarEvents(calendarId);

        res.status(200).json({ events });
    } catch (error) {
        console.error('Error fetching calendar events:', error.message);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
} 