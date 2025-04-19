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
    console.log('Calendar ID:', calendarId); // Log the calendar ID for debugging
    const params = {
        calendarId,
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
    };

    try {
        const response = await calendar.events.list(params);
        console.log('API Response:', response.data); // Log the API response
        return response.data.items;
    } catch (error: any) {
        console.error('Error fetching calendar events:', error.response?.data || error.message);
        throw error;
    }
}
