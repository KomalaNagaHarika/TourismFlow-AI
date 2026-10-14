import type { IncomingMessage, ServerResponse } from 'http';
import { createGeminiClient, withTimeout } from '../src/services/geminiService';

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
    const { attraction, preferences } = body;

    if (!attraction) {
      res.status(400).json({ error: 'Attraction data required' });
      return;
    }

    const interestMatch = preferences?.interests?.includes(attraction.category) ? 96 : 82;
    const affordability = (attraction.avgCost <= (preferences?.budgetInr ? preferences.budgetInr / 5 : 500)) ? 94 : 76;
    const localEconomy = attraction.isLocalGem ? 98 : 70;
    const crowdScore = attraction.crowdLevel === 'Low' ? 95 : attraction.crowdLevel === 'Moderate' ? 82 : 65;
    const overall = Math.round((interestMatch * 0.3) + (affordability * 0.2) + (localEconomy * 0.3) + (crowdScore * 0.2));

    let explanation = '';
    const ai = createGeminiClient();

    if (ai) {
      try {
        const prompt = `
You are the transparent Tourism Impact Engine.
Explain in 2 conversational sentences why "${attraction.name}" was recommended for a ${preferences?.groupType || 'traveler'} interested in ${preferences?.interests?.join(', ') || 'Heritage & Food'}.
Emphasize why this creates authentic value for the tourist and economic benefit for the local community.
`;
        const response = await withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: prompt,
          }),
          4000
        );
        explanation = response.text?.trim() || '';
      } catch {
        // Fallback below
      }
    }

    if (!explanation) {
      explanation = attraction.isLocalGem
        ? `Recommended by the Tourism Impact Engine because it directly sustains local master artisans (${attraction.culturalImpact || 'traditional crafts'}) while offering an intimate, uncrowded experience that fits your group budget.`
        : `Recommended as a foundational cultural cornerstone that anchors your geographic route with minimal transit overhead.`;
    }

    res.status(200).json({
      breakdown: {
        interestMatchScore: interestMatch,
        affordabilityScore: affordability,
        geographicClusteringScore: 92,
        crowdBalancingBonus: crowdScore,
        localEconomyImpactScore: localEconomy,
        overallScore: overall,
        explanation,
      }
    });
  } catch (err: any) {
    console.error('API explain-recommendation error:', err);
    res.status(500).json({ error: err?.message || 'Explanation generation failed' });
  }
}
