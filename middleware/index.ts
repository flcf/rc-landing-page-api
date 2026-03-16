// All API edge functions must manually invoke middleware.
// This is the entry point for all middleware.
// Individual middleware functions should not invoked outside this directory

import { VercelRequest, VercelResponse } from '@vercel/node';
import corsMiddleware from './corsMiddleware';

const withMiddleware = (fn: (req: VercelRequest, res: VercelResponse) => any) => async (req: VercelRequest, res: VercelResponse) => {
  console.log('!!! middleware starting');

  return corsMiddleware(fn)(req, res);
  // TODO: Refactor and add rateLimitMiddleware
};

export default withMiddleware;
