import { setupCalendarWatch } from './services/calendarService';
import 'dotenv/config';

async function initializeWatchChannels() {
    const calendarIdVan = process.env.VANCOUVER_CALENDAR_ID;
    const calendarIdCal = process.env.CALGARY_CALENDAR_ID;

    if (!calendarIdVan || !calendarIdCal) {
        throw new Error('Calendar IDs are missing');
    }

    try {
        await setupCalendarWatch(calendarIdVan);
        await setupCalendarWatch(calendarIdCal);
        console.log('Watch channels initialized.');
    } catch (error: any) {
        console.error('Error initializing watch channels:', error.message);
    }
}

initializeWatchChannels();