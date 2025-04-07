import { google } from 'googleapis';
import { Firestore } from '@google-cloud/firestore';
const firestore = new Firestore();

export default async function fetchGoogleCalendarEvents(calendarId: string) {
    const serviceAccountKey = process.env.GCAL_SERVICE_ACCOUNT_KEY

    if (!serviceAccountKey) {
        throw new Error('Service account key is missing');
      }
      
    const credentials = JSON.parse(serviceAccountKey);

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const calendar = google.calendar({ version: 'v3', auth });

    const params = {
        calendarId,
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
    };

    const response = await calendar.events.list(params);
    return response.data.items;
}
