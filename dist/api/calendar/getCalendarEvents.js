"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const corsMiddleware_1 = require("../../middleware/corsMiddleware");
const headerMiddleware_1 = require("../../middleware/headerMiddleware");
async function handler(req, res) {
    await (0, corsMiddleware_1.corsMiddleware)(req, res, async () => {
        await (0, headerMiddleware_1.headerMiddleware)(req, res, async () => {
            // try {
            //   const events = await CalendarService.readEventsFromFirestore();
            //   res.status(200).json(events);
            // } catch (error) {
            //   res.status(500).json({ error: 'Failed to retrieve calendar events' });
            // }
        });
    });
}
