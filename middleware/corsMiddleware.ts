import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

const allowedOrigins = ['rootscollectivecanada.com'];

const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export const corsMiddleware = (req: VercelRequest, res: VercelResponse, next: (err?: any) => any) => {
  cors(corsOptions)(req, res, next);
};