import { VercelRequest, VercelResponse } from '@vercel/node';

const corsMiddleware = (fn: (req: VercelRequest, res: VercelResponse) => any) => async (req: VercelRequest, res: VercelResponse) => {
  const { origin } = req.headers;

  if (!process.env.ALLOWED_ORIGINS) {
    console.error('ALLOWED_ORIGINS is missing');
    res.status(500).json({ error: 'Failed to execute middleware' });
    return;
  }

  const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  return await fn(req, res);
};

export default corsMiddleware;
