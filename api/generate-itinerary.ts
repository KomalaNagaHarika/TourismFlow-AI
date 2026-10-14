import type { IncomingMessage, ServerResponse } from 'http';
import { generateItineraryPlan } from '../src/services/geminiService';
import { TripPreferences } from '../src/types/tourism';

interface VercelRequest extends IncomingMessage {
  body: any;
  query: Record<string, string | string[]>;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => VercelResponse;
  send: (data: any) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    let prefs: TripPreferences;
    if (typeof req.body === 'string') {
      prefs = JSON.parse(req.body);
    } else {
      prefs = req.body;
    }

    if (!prefs || !prefs.destination) {
      res.status(400).json({ error: 'Trip preferences with a valid destination are required.' });
      return;
    }

    const result = await generateItineraryPlan(prefs);
    res.status(200).json(result);
  } catch (err: any) {
    console.error('API generate-itinerary error:', err);
    const statusCode = err?.status || 500;
    res.status(statusCode).json({
      error: err?.message || 'Failed to generate itinerary recommendations.',
      isUnsupportedDestination: Boolean(err?.isUnsupportedDestination),
    });
  }
}
