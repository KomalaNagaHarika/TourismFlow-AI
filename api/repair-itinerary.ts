import type { IncomingMessage, ServerResponse } from 'http';
import { repairItineraryPlan } from '../src/services/geminiService';
import { DayPlan, PlanRepairType, TripPreferences } from '../src/types/tourism';

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
    const { currentPlan, repairType, preferences, problemDetails } = body;

    if (!currentPlan || !Array.isArray(currentPlan) || currentPlan.length === 0) {
      res.status(400).json({ error: 'Current plan is required for plan repair' });
      return;
    }

    const result = await repairItineraryPlan(
      currentPlan as DayPlan[],
      (repairType || 'late_start') as PlanRepairType,
      preferences as TripPreferences,
      problemDetails
    );

    res.status(200).json(result);
  } catch (err: any) {
    console.error('API repair-itinerary error:', err);
    res.status(500).json({ error: err?.message || 'Plan repair failed' });
  }
}
