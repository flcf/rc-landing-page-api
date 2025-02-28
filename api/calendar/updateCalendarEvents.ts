import { VercelRequest, VercelResponse } from '@vercel/node';
import CalendarService from '../../../services/calendarService';
import { corsMiddleware } from '../../../middleware/corsMiddleware';
import { headerMiddleware } from '../../../middleware/headerMiddleware';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  await corsMiddleware(req, res, async () => {
    await headerMiddleware(req, res, async () => {
      try {
        const events = await CalendarService.getGoogleCalendarEvents('your-calendar-id');
        await CalendarService.writeEventsToFirestore(events);
        res.status(200).json({ message: 'Calendar events updated successfully' });
      } catch (error) {
        res.status(500).json({ error: 'Failed to update calendar events' });
      }
    });
  });
}