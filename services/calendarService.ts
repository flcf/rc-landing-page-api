import { google, calendar_v3  } from 'googleapis';
import { Firestore } from '@google-cloud/firestore';
import { extractEventLink, getTimezone } from '../shared/helpers';
type Schema$Event = calendar_v3.Schema$Event;

const calendarServiceAccountKey = process.env.GCAL_SERVICE_ACCOUNT_KEY;
const firebaseAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!calendarServiceAccountKey || !firebaseAccountKey) {
    throw new Error('account key is missing');
}

const credentials = JSON.parse(calendarServiceAccountKey);
const firebaseCredentials =  JSON.parse(firebaseAccountKey);

const firestore = new Firestore({
    projectId: firebaseCredentials.project_id,
    credentials: {
        client_email: firebaseCredentials.client_email,
        private_key: firebaseCredentials.private_key,
    },
});

export default async function fetchGoogleCalendarEvents(calendarId: string) {
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

    try {
        const response = await calendar.events.list(params);

        if (!response.data.items) {
            throw new Error(`Unexpected response structure for calendar ID: ${calendarId}. No 'items' field found.`);
        }
        console.log('API Response:', JSON.stringify(response.data));
        return response.data.items;
    } catch (error: any) {
        console.error('Error fetching calendar events:', error.response?.data || error.message);
        throw error;
    }
}

export async function sendInternalEventsToStore(calendars: { events: Schema$Event[]; branch: string }[]) {
    const batch = firestore.batch();
    const eventsCollection = firestore.collection('calendarEvents');

    const allEvents = calendars.flatMap(calendar =>
        calendar.events.map((event: Schema$Event) => ({
            ...event,
            branch: calendar.branch, 
        }))
    );

    allEvents.forEach((event: Schema$Event & { branch: string }) => {
        try {
            if (!event.iCalUID) {
                throw new Error(`Missing iCalUID for event with ID: ${event.id}`);
            }

            const eventRef = eventsCollection.doc(event.iCalUID);
            batch.set(eventRef, {
                id: event.id,
                title: event.summary || 'No Title',
                startTime: event.start?.dateTime || event.start?.date,
                endTime: event.end?.dateTime || event.end?.date,
                timezone: getTimezone(event.start?.timeZone || 'UTC'),
                location: event.location || 'No Location',
                branch: event.branch,
                source: "internal",
                eventLink: extractEventLink(event.description || ''),
            });
        } catch (error: any) {
            console.error(`Error processing event: ${error.message}`);
        }
    });

    await batch.commit();
    console.log('Events successfully synced to Firestore');
}

export async function readEventsFromFirestore() {
    try {
        const eventsCollection = firestore.collection('calendarEvents');
        const threeMonthsAgoISO = new Date(new Date().setMonth(new Date().getMonth()-3)).toISOString();
        const snapshot = await eventsCollection.where('startTime', '>=', threeMonthsAgoISO).orderBy('startTime', 'asc').get();
        const events: any[] = [];

        if (snapshot.empty) {
            console.warn('No events found in Firestore.');
            return events; 
        }

        snapshot.forEach(doc => {
            try {
                events.push({ id: doc.id, ...doc.data() });
            } catch (docError) {
                console.error(`Error processing document with ID ${doc.id}:`, docError);
            }
        });

        return events;
    } catch (error: any) {
        console.error('Error reading events from Firestore:', error.message || error);
        throw new Error('Failed to fetch events from Firestore.');
    }
}


export async function setupCalendarWatch(calendarId: string) {

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/calendar'],
    });
  
    const calendar = google.calendar({ version: 'v3', auth });
  
    try {
      const response = await calendar.events.watch({
        calendarId,
        requestBody: {
          id: `channel-${calendarId}-${Date.now()}`,
          type: 'webhook',
          address: 'https://rc-landing-page-api.vercel.app/api/calendarWebhook', 
        },
      });
  
      console.log('Watch channel created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error setting up calendar watch:', error.message);
      throw error;
    }
  }