"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateCalendarEvents;
const calendarService_1 = __importDefault(require("../../services/calendarService"));
async function updateCalendarEvents(req, res) {
    const calendarIdVan = process.env.VANCOUVER_CALENDAR_ID;
    const calendarIdCal = process.env.CALGARY_CALENDAR_ID;
    if (!calendarIdVan) {
        return res.status(500).json({ error: 'Calendar ID for Vancouver is missing' });
    }
    if (!calendarIdCal) {
        return res.status(500).json({ error: 'Calendar ID for Calgary is missing' });
    }
    try {
        const [vanEvents, calEvents] = await Promise.all([
            (0, calendarService_1.default)(calendarIdVan),
            (0, calendarService_1.default)(calendarIdCal)
        ]);
        console.log('Vancouver events:', vanEvents);
        console.log('Calgary events:', calEvents);
        res.status(200).json({ message: 'Calendar events fetched successfully' });
    }
    catch (error) {
        console.error('Error fetching calendar events:', error.message);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
    //TODO: update Firestore with Calendar Events 
    //CREATE a script for this to run automatically every 4 days 
    //should there be a cleanup function to remove events from firestore?
}
