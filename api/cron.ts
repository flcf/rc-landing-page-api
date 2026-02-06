import { VercelRequest, VercelResponse } from '@vercel/node';
import syncCalendarEvents from './calendar/syncCalendarEvents';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }

  await syncCalendarEvents(req, res);

  res.status(200).json({ message: 'Cron job finished successfully' });
}
