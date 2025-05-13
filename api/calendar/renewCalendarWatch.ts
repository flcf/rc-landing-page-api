import { VercelRequest, VercelResponse } from '@vercel/node';
import { setupCalendarWatch } from '../../services/calendarService';

export default async function renewCalendarWatch(req: VercelRequest, res: VercelResponse) {
  const calendarIdVan = process.env.VANCOUVER_CALENDAR_ID;
  const calendarIdCal = process.env.CALGARY_CALENDAR_ID;

  if (!calendarIdVan || !calendarIdCal) {
    return res.status(500).json({ error: 'Calendar IDs are missing' });
  }

  try {
    const vanWatch = await setupCalendarWatch(calendarIdVan);
    const calWatch = await setupCalendarWatch(calendarIdCal);

    console.log('Vancouver watch renewed:', vanWatch);
    console.log('Calgary watch renewed:', calWatch);

    res.status(200).json({ message: 'Watch channels renewed successfully' });
  } catch (error: any) {
    console.error('Error renewing watch channels:', error.message);
    res.status(500).json({ error: 'Failed to renew watch channels' });
  }
}