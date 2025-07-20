import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();
const calendarServiceAccountKeyRaw = process.env.GCAL_SERVICE_ACCOUNT_KEY;

const calendarServiceAccountKey = Buffer.from(calendarServiceAccountKeyRaw || '', 'base64').toString('utf-8');

const credentials = JSON.parse(calendarServiceAccountKey);


async function getAccessToken() {
    const auth = new google.auth.GoogleAuth({
        credentials, // Your service account credentials
        scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const accessToken = await auth.getAccessToken();
    console.log('Access Token:', accessToken);
    return accessToken;
}

// Call the function to log the access token
//getAccessToken();


async function stopWatchChannel(channelId: string, resourceId: string) {
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/calendar'],
    });

    const calendar = google.calendar({ version: 'v3', auth });
    const response = await calendar.calendarList.list();
    console.log('Available calendars:', response.data.items);
    

    // try {
    //     await calendar.channels.stop({
    //         requestBody: {
    //             id: channelId,
    //             resourceId,
    //         },
    //     });
    //     console.log(`Watch channel stopped: ${channelId}`);
    // } catch (error: any) {
    //     console.error('Error stopping watch channel:', error.response?.data || error.message);
    //     throw error;
    // }
}

stopWatchChannel('vanChannelId', 'gcenlkDr34nWWcwu0qUDMsMVfDc');
// stopWatchChannel('calChannelId', 'gcenlkDr34nWWcwu0qUDMsMVfDc')