import { z } from 'zod';

export const EventSchema = z.object({
    iCalUID: z.string().nonempty("iCalUID is required"),
    id: z.string().nonempty("Event ID is required"),
    summary: z.string().nonempty("Summary is required"),
    start: z.object({
        dateTime: z.string().optional(), 
        date: z.string().optional(),
        timeZone: z.string().optional()
    }).refine(
        (data) => data.dateTime || data.date,
        { message: "Either dateTime or date must be provided for start" }
    ),
    end: z.object({
        dateTime: z.string().optional(), 
        date: z.string().optional(),
        timeZone: z.string().optional(),
    }).refine(
        (data) => data.dateTime || data.date, 
        { message: "Either dateTime or date must be provided for end" }
    ),
    location: z.string().nonempty("Location is required"),
    branch: z.string().nonempty("Branch is required"),
    description: z.string().nonempty(),
});