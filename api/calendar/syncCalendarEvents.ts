import { VercelRequest, VercelResponse } from '@vercel/node';
import fetchGoogleCalendarEvents, { sendInternalEventsToStore } from '../../services/calendarService';

export default async function syncCalendarEvents(req: VercelRequest, res: VercelResponse) {
  const calendarIdVan = process.env.VANCOUVER_CALENDAR_ID;
  const calendarIdCal = process.env.CALGARY_CALENDAR_ID;

  if (!calendarIdVan || !calendarIdCal) {
    return res.status(500).json({ error: 'Calendar IDs are missing' });
  }

  if (req.headers['x-goog-resource-id']) {
    console.log('Webhook notification received:', req.headers);
  } else {
    console.log('Manual or cron-triggered sync initiated');
  }
  try {
    const allEvents = await Promise.all([fetchGoogleCalendarEvents(calendarIdVan), fetchGoogleCalendarEvents(calendarIdCal)]);

    console.log('Calendar events fetched successfully.');

    const formattedEvents = [
      { events: allEvents[0], branch: 'Vancouver' },
      { events: allEvents[1], branch: 'Calgary' },
    ];

    await sendInternalEventsToStore(formattedEvents);
    console.log('Events successfully synced to Firestore.');

    res.status(200).json({ message: 'calendar event sync complete.' });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to sync calendar events.' });
  }
}
