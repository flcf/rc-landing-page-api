import { google } from 'googleapis';
import { Firestore } from '@google-cloud/firestore';

const firestore = new Firestore();

class CalendarService {
    private calendar;

    constructor() {
        this.calendar = google.calendar({ version: 'v3', auth: 'YOUR_GOOGLE_API_KEY' });
    }

    async getGoogleCalendarEvents(calendarId: string) {
        try {
            const response = await this.calendar.events.list({
                calendarId: calendarId,
                timeMin: (new Date()).toISOString(),
                maxResults: 10,
                singleEvents: true,
                orderBy: 'startTime',
            });
            return response.data.items;
        } catch (error) {
            console.error('Error fetching Google Calendar events:', error);
            throw error;
        }
    }

    async writeEventsToFirestore(events: any[]) {
        try {
            const batch = firestore.batch();
            events.forEach(event => {
                const docRef = firestore.collection('events').doc(event.id);
                batch.set(docRef, event);
            });
            await batch.commit();
            console.log('Events written to Firestore');
        } catch (error) {
            console.error('Error writing events to Firestore:', error);
            throw error;
        }
    }

    async readEventsFromFirestore() {
        try {
            const snapshot = await firestore.collection('events').get();
            const events: any[] = [];
            snapshot.forEach(doc => {
                events.push(doc.data());
            });
            return events;
        } catch (error) {
            console.error('Error reading events from Firestore:', error);
            throw error;
        }
    }
}

export default new CalendarService();
