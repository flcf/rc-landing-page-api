"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fetchGoogleCalendarEvents;
const googleapis_1 = require("googleapis");
const firestore_1 = require("@google-cloud/firestore");
const firestore = new firestore_1.Firestore();
async function fetchGoogleCalendarEvents(calendarId) {
    const serviceAccountKey = process.env.GCAL_SERVICE_ACCOUNT_KEY;
    if (!serviceAccountKey) {
        throw new Error('Service account key is missing');
    }
    const credentials = JSON.parse(serviceAccountKey);
    const auth = new googleapis_1.google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });
    const calendar = googleapis_1.google.calendar({ version: 'v3', auth });
    const params = {
        calendarId,
        maxResults: 50,
        singleEvents: true,
        orderBy: 'startTime',
    };
    const response = await calendar.events.list(params);
    return response.data.items;
}
