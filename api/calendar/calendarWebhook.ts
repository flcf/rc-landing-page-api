import { VercelRequest, VercelResponse } from '@vercel/node';
import syncCalendarEvents from './syncCalendarEvents';

export default async function calendarWebhook(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const resourceId = req.headers['x-goog-resource-id'] as string;
    const channelId = req.headers['x-goog-channel-id'] as string;
    const messageNumber = req.headers['x-goog-message-number'] as string;

    if (!resourceId || !channelId) {
        console.error('Invalid webhook notification:', req.headers);
        return res.status(400).json({ error: 'Invalid webhook notification' });
    }
    const channelIds = [process.env.VANCOUVER_CHANNEL_ID, process.env.CALGARY_CHANNEL_ID];
    if (!channelIds.includes(channelId)) {
        console.error('Invalid channel ID:', channelId);
        return res.status(400).json({ error: 'Invalid channel ID' });
    }

    console.log('Webhook notification received:', {
        resourceId,
        channelId,
        messageNumber,
    });

    try {
        console.log('Syncing calendar events...');
        await syncCalendarEvents(req, res);
        console.log('Webhook notification processed.');
    } catch (error: any) {
        console.error('Error processing webhook notification:', error.message);
       throw error;
    }
}