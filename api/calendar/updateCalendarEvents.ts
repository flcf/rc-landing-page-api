import { VercelRequest, VercelResponse } from '@vercel/node';
import fetchGoogleCalendarEvents from '../../services/calendarService';

export default async function updateCalendarEvents(req: VercelRequest, res: VercelResponse) {
  const calendarIdVan = process.env.VANCOUVER_CALENDAR_ID;
  const calendarIdCal = process.env.CALGARY_CALENDAR_ID;


    if (!calendarIdVan) {
        return res.status(500).json({ error: 'Calendar ID for Vancouver is missing' });
    }

    if (!calendarIdCal) {
      return res.status(500).json({ error: 'Calendar ID for Calgary is missing' });
  }

    try {
        const [vanEvents, calEvents] = await Promise.all([
            fetchGoogleCalendarEvents(calendarIdVan),
            fetchGoogleCalendarEvents(calendarIdCal)
        ]);

        console.log('Vancouver events:', vanEvents);
        console.log('Calgary events:', calEvents);

        res.status(200).json({ message: 'Calendar events fetched successfully' });
    } catch (error) {
        console.error('Error fetching calendar events:', error.message);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }


} 

