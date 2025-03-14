import { google } from 'googleapis';
import { Firestore } from '@google-cloud/firestore';
import path from 'path';
import { readFileSync } from 'fs';
const firestore = new Firestore();

export default async function getCalendarEvents(calendarId: string) {
    const credentials = JSON.parse(
        readFileSync(path.resolve('./secure/service-account-key.json'), 'utf8')
    );

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
