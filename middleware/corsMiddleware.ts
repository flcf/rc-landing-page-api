import { VercelRequest, VercelResponse } from '@vercel/node';
import cors from 'cors';

const allowedOrigins = ['https://your-frontend-domain.com'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

export const corsMiddleware = (req: VercelRequest, res: VercelResponse, next: Function) => {
  cors(corsOptions)(req, res, next);
};