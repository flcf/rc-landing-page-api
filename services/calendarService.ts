import { google, calendar_v3  } from 'googleapis';
import { Firestore } from '@google-cloud/firestore';
import { extractEventLink, generateDocumentKey, getTimezone } from '../shared/helpers';
import { EventSchema } from './schemas/eventSchema';
import 'dotenv/config';

type Schema$Event = calendar_v3.Schema$Event;

const calendarServiceAccountKeyRaw = process.env.GCAL_SERVICE_ACCOUNT_KEY;
const firebaseAccountKeyRaw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!calendarServiceAccountKeyRaw || !firebaseAccountKeyRaw) {
    throw new Error('account key is missing');
}

const calendarServiceAccountKey = Buffer.from(calendarServiceAccountKeyRaw || '', 'base64').toString('utf-8');
const firebaseAccountKey = Buffer.from(firebaseAccountKeyRaw || '', 'base64').toString('utf-8');

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
            const validationResult = EventSchema.safeParse(event);

            if (!validationResult.success) {
                console.warn(`Skipping invalid event: ${event.iCalUID}`);
                console.warn('Validation errors:', validationResult.error.errors);
                return;
            }

            const validEvent = validationResult.data;

            const documentKey = generateDocumentKey(validEvent.id, validEvent.iCalUID);

            const eventRef = eventsCollection.doc(documentKey);
            batch.set(eventRef, {
                title: validEvent.summary,
                startTime: validEvent.start.dateTime
                ? new Date(validEvent.start.dateTime).toISOString() 
                : validEvent.start.date,
            endTime: validEvent.end.dateTime
                ? new Date(validEvent.end.dateTime).toISOString() 
                :validEvent.end.date, 
                timezone: validEvent.start.timeZone ? getTimezone(validEvent.start.timeZone) : null,
                location: validEvent.location,
                branch: validEvent.branch,
                source: "internal",
                eventLink: extractEventLink(validEvent.description),
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

    const channelId = calendarId == process.env.VANCOUVER_CALENDAR_ID ? process.env.VANCOUVER_CHANNEL_ID : process.env.CALGARY_CHANNEL_ID;
  
    try {
      const response = await calendar.events.watch({
        calendarId,
        requestBody: {
          id: channelId,
          type: 'webhook',
          address: `https://rc-landing-page-api.vercel.app/api/calendar/calendarWebhook`, 
        },
      });
  
      console.log('Watch channel created:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error setting up calendar watch:', error.response);
      throw error;
    }
  }