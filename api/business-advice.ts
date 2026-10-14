import type { IncomingMessage, ServerResponse } from 'http';
import { getBusinessAdvice } from '../src/services/geminiService';

interface VercelRequest extends IncomingMessage {
  body: any;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => VercelResponse;
  send: (data: any) => VercelResponse;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { business, demoMetrics, popularInterests } = body;

    if (!business) {
      res.status(400).json({ error: 'Business details are required' });
      return;
    }

    const result = await getBusinessAdvice(
      business,
      demoMetrics,
      popularInterests || ['Heritage', 'Authentic Local Crafts', 'Culinary Traditions']
    );

    res.status(200).json(result);
  } catch (err: any) {
    console.error('API business-advice error:', err);
    res.status(500).json({ error: err?.message || 'Business advice failed' });
  }
}
