import { VercelRequest, VercelResponse } from '@vercel/node';

const expectedHeaderValue = process.env.CUSTOM_HEADER_VALUE;

export const headerMiddleware = (req: VercelRequest, res: VercelResponse, next: Function) => {
  const customHeader = req.headers['x-custom-header'];

  if (customHeader === expectedHeaderValue) {
    next();
  } else {
    res.status(403).json({ error: 'Forbidden' });
  }
};