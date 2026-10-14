import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';
import { DayPlan, TripPreferences, PlanRepairType, RepairResult, Category } from '../types/tourism';
import { getCuratedDestinationItinerary } from '../data/destinationData';

// Safe environment key reader
export function getGeminiApiKey(): string {
  const rawKey = (typeof process !== 'undefined' && process.env) 
    ? (process.env.GEMINI_API_KEY || process.env.API_KEY || '')
    : '';
  
  if (rawKey && rawKey !== 'MY_GEMINI_API_KEY' && !rawKey.includes('MY_GEMINI')) {
    return rawKey.trim();
  }
  return '';
}

// Instantiate Gemini client
export function createGeminiClient(): GoogleGenAI | null {
  const key = getGeminiApiKey();
  if (!key) return null;

  try {
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-tourismflow-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

// Promise timeout helper
export async function withTimeout<T>(promise: Promise<T>, ms = 22000): Promise<T> {
  let timer: any;
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Operation timed out after ${Math.round(ms / 1000)}s`)), ms);
    }),
  ]);
}

// Robust JSON extraction from LLM response text
export function extractJsonFromText(rawText: string): any {
  if (!rawText || typeof rawText !== 'string') {
    throw new Error('Empty response received from AI model');
  }

  let text = rawText.trim();

  // Strip Markdown code fences like ```json ... ``` or ``` ... ```
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // If text has prefix or suffix, locate the outer JSON bounds
  const firstBracket = text.indexOf('[');
  const firstBrace = text.indexOf('{');
  
  let startIdx = -1;
  let endIdx = -1;

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    // Array expected
    startIdx = firstBracket;
    endIdx = text.lastIndexOf(']');
  } else if (firstBrace !== -1) {
    // Object expected
    startIdx = firstBrace;
    endIdx = text.lastIndexOf('}');
  }

  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    text = text.slice(startIdx, endIdx + 1);
  }

  return JSON.parse(text);
}

// Validate and sanitize itinerary array
export function validateAndSanitizeItinerary(data: any, destination: string): DayPlan[] | null {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  const validDays: DayPlan[] = [];

  for (let i = 0; i < data.length; i++) {
    const rawDay = data[i];
    if (!rawDay || typeof rawDay !== 'object') continue;

    const dayNum = Number(rawDay.day) || (i + 1);
    const theme = String(rawDay.theme || `Day ${dayNum} Cultural & Scenic Exploration`);
    const districtFocus = String(rawDay.districtFocus || `${destination} Central Heritage`);
    const travelTips = String(rawDay.travelTips || 'Wear comfortable shoes and carry water.');

    const rawActivities = Array.isArray(rawDay.activities) ? rawDay.activities : [];
    const validActivities = rawActivities.map((act: any, actIdx: number) => {
      const actName = String(act.activity || act.name || `Local Highlight ${actIdx + 1}`).trim();
      const time = String(act.time || '10:00 AM – 11:30 AM');
      const duration = String(act.duration || '1.5 hrs');
      const cost = Math.max(0, Number(act.cost) || 0);
      const category: Category = (['Heritage', 'Food', 'Culture', 'Crafts', 'Nature', 'Shopping'].includes(act.category)
        ? act.category
        : 'Culture') as Category;
      const isLocalGem = Boolean(act.isLocalGem);
      const reason = String(act.reason || 'Authentic regional experience supporting the local community.');
      const transport = String(act.transport || 'Local auto or taxi');
      const travelTimeMinutes = Number(act.travelTimeMinutes) || 15;
      const nearbyFoodOrRest = String(act.nearbyFoodOrRest || 'Local tea stall and resting pavilion nearby');
      const mapsQuery = encodeURIComponent(`${actName}, ${destination}`);
      const mapsLink = act.mapsLink && act.mapsLink.startsWith('http')
        ? act.mapsLink
        : `https://maps.google.com/?q=${mapsQuery}`;

      return {
        id: act.id || `act_${dayNum}_${actIdx + 1}`,
        time,
        activity: actName,
        duration,
        cost,
        reason,
        transport,
        travelTimeMinutes,
        nearbyFoodOrRest,
        mapsLink,
        category,
        isLocalGem,
        impactScore: Number(act.impactScore) || (isLocalGem ? 95 : 85),
        impactReason: String(act.impactReason || 'Channels tourism revenue to authentic local makers.')
      };
    });

    if (validActivities.length === 0) continue;

    // Calculate day costs
    const totalActivityCosts = validActivities.reduce((sum: number, a: any) => sum + (Number(a.cost) || 0), 0);
    const transportCost = Number(rawDay.dayCost?.transport) || 220;
    const foodCost = Number(rawDay.dayCost?.food) || 500;
    const artisanBuffer = Number(rawDay.dayCost?.artisanBuffer) || 300;
    const totalDayCost = transportCost + totalActivityCosts + foodCost + artisanBuffer;

    validDays.push({
      day: dayNum,
      theme,
      districtFocus,
      travelTips,
      dayCost: {
        transport: transportCost,
        entryFees: totalActivityCosts,
        food: foodCost,
        artisanBuffer,
        total: totalDayCost,
      },
      activities: validActivities,
    });
  }

  return validDays.length > 0 ? validDays : null;
}

// Master Itinerary Generation Function
export async function generateItineraryPlan(prefs: TripPreferences): Promise<{
  days: DayPlan[];
  isDemoFallback: boolean;
  source: string;
  notice?: string;
}> {
  if (!prefs || !prefs.destination) {
    throw new Error('Destination and travel preferences are required.');
  }

  const destination = prefs.destination.trim();
  const ai = createGeminiClient();

  if (ai) {
    const prompt = `
You are the master itinerary architect of TourismFlow AI.
Build a structured, realistic, day-by-day travel itinerary strictly for:
Destination: ${destination}
Duration: ${prefs.days || 2} days
Group Type: ${prefs.groupType || 'Solo'} (${prefs.travelersCount || 1} travelers)
Budget: ₹${prefs.budgetInr || 5000} INR total
Interests: ${(prefs.interests || ['Culture', 'Food', 'Heritage']).join(', ')}
Transport: ${prefs.transportPref || 'Cab'}
Pace: ${prefs.walkingPace || 'Moderate'}
Crowd Preference: ${prefs.crowdPref || 'Balanced'}

CRITICAL RULES:
1. Every activity, attraction, experience, and restaurant MUST be located in and authentic to ${destination}. Do NOT mention any other city.
2. Group attractions geographically in the same neighborhood/district per day to prevent zigzag transit.
3. Incorporate at least one genuine local artisan workshop, traditional craft market, or authentic regional dining spot native to ${destination} each day.
4. Provide realistic timings, durations, cost per person (INR), transport suggestion, travel time in minutes, nearby food options, and working Google Maps search queries: 'https://maps.google.com/?q=' + encodeURIComponent(activity + ', ' + '${destination}').
5. Provide a day cost breakdown: transport, entryFees, food, artisanBuffer, total.

Return a JSON array adhering strictly to this schema:
[
  {
    "day": 1,
    "theme": "string",
    "districtFocus": "string",
    "travelTips": "string",
    "dayCost": {
      "transport": number,
      "entryFees": number,
      "food": number,
      "artisanBuffer": number,
      "total": number
    },
    "activities": [
      {
        "id": "string",
        "time": "09:00 AM – 10:30 AM",
        "activity": "string",
        "duration": "1.5 hrs",
        "cost": number,
        "reason": "string",
        "transport": "string",
        "travelTimeMinutes": number,
        "nearbyFoodOrRest": "string",
        "mapsLink": "https://maps.google.com/?q=...",
        "category": "Heritage | Food | Culture | Crafts | Nature | Shopping",
        "isLocalGem": boolean,
        "impactScore": number,
        "impactReason": "string"
      }
    ]
  }
]
`;

    // Try primary model, with automatic fallback to fast lite model on 503/high-demand
    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];

    for (const model of candidateModels) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model,
            contents: prompt,
            config: {
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    theme: { type: Type.STRING },
                    districtFocus: { type: Type.STRING },
                    travelTips: { type: Type.STRING },
                    dayCost: {
                      type: Type.OBJECT,
                      properties: {
                        transport: { type: Type.NUMBER },
                        entryFees: { type: Type.NUMBER },
                        food: { type: Type.NUMBER },
                        artisanBuffer: { type: Type.NUMBER },
                        total: { type: Type.NUMBER }
                      },
                      required: ['transport', 'entryFees', 'food', 'total']
                    },
                    activities: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          time: { type: Type.STRING },
                          activity: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          cost: { type: Type.NUMBER },
                          reason: { type: Type.STRING },
                          transport: { type: Type.STRING },
                          travelTimeMinutes: { type: Type.NUMBER },
                          nearbyFoodOrRest: { type: Type.STRING },
                          mapsLink: { type: Type.STRING },
                          category: { type: Type.STRING },
                          isLocalGem: { type: Type.BOOLEAN },
                          impactScore: { type: Type.NUMBER },
                          impactReason: { type: Type.STRING }
                        },
                        required: ['activity', 'time', 'cost', 'category']
                      }
                    }
                  },
                  required: ['day', 'theme', 'activities']
                }
              },
              temperature: 0.3,
            },
          }),
          22000
        );

        const rawText = response.text || '';
        const parsed = extractJsonFromText(rawText);
        const validatedDays = validateAndSanitizeItinerary(parsed, destination);

        if (validatedDays && validatedDays.length > 0) {
          return {
            days: validatedDays,
            isDemoFallback: false,
            source: `Gemini AI (${destination})`,
          };
        }
      } catch (err: any) {
        console.warn(`Gemini generation with ${model} failed:`, err?.message || err);
        // Continue to try next candidate model
      }
    }
  }

  // If Gemini is unavailable, check curated destination catalog
  const curated = getCuratedDestinationItinerary(prefs);
  if (curated) {
    return {
      days: curated.days,
      isDemoFallback: true,
      source: curated.source,
      notice: `Loaded verified curated local itinerary for ${destination}.`,
    };
  }

  // If destination is not in curated dataset and AI is unavailable
  const error: any = new Error(
    `Could not generate recommendations for "${destination}". Live AI generation is currently unavailable and this destination is not in our offline sample catalog. Please explore supported destinations: Hyderabad, Visakhapatnam, Jaipur, Bengaluru, Goa, Delhi, Mumbai, or Kochi.`
  );
  error.isUnsupportedDestination = true;
  error.status = 422;
  throw error;
}

// Adaptive Plan Repair Function
export async function repairItineraryPlan(
  currentPlan: DayPlan[],
  repairType: PlanRepairType,
  preferences: TripPreferences,
  problemDetails?: string
): Promise<RepairResult> {
  const repair = repairType || 'late_start';
  const ai = createGeminiClient();

  if (ai) {
    try {
      const prompt = `
You are the adaptive Plan Repair AI of TourismFlow AI.
The tourist encountered this real-world disruption: "${repair}".
Details provided: "${problemDetails || ''}".
Preferences: Budget ₹${preferences?.budgetInr || 5000}, Pace: ${preferences?.walkingPace || 'Moderate'}.

Current Itinerary:
${JSON.stringify(currentPlan, null, 2)}

TASK:
Propose a revised itinerary that solves the disruption while preserving the traveler's core priorities and local artisan support.
- If 'late_start': Shift morning schedule later, merge/shorten transit, preserve the signature local gem and lunch spot.
- If 'budget_decreased': Replace high-entry-cost commercial attractions with authentic low-cost or free local gems, recalculating savings.
- If 'attraction_closed': Replace the closed stop with a nearby alternative gem in the same district.
- If 'fewer_crowds': Swap peak congested sites for tranquil alternatives.
- If 'more_rest': Lengthen rest periods, insert a relaxing tea tasting or garden stroll, remove rushed walking.
- If 'skip_stop': Remove the least critical stop and allocate extra time buffer.

Return ONLY a JSON object:
{
  "revisedPlan": [...updated DayPlan array...],
  "changeSummary": "string explaining what was changed and why in 2-3 sentences",
  "costDifference": number,
  "scheduleDifference": "string",
  "changes": [
    {
      "activityName": "string",
      "actionTaken": "rescheduled | swapped | shortened | removed | added_rest",
      "details": "string"
    }
  ]
}
`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
        15000
      );

      const parsed: RepairResult = extractJsonFromText(response.text || '');
      if (parsed && Array.isArray(parsed.revisedPlan) && parsed.revisedPlan.length > 0) {
        parsed.isDemoFallback = false;
        return parsed;
      }
    } catch (err: any) {
      console.warn('AI plan repair fallback:', err?.message || err);
    }
  }

  // Deterministic Plan Repair Fallback
  const revised: DayPlan[] = JSON.parse(JSON.stringify(currentPlan));
  let summary = '';
  let costDiff = 0;
  let scheduleDiff = '';
  const changes: any[] = [];

  if (repair === 'late_start') {
    summary = 'Shifted Day 1 start by +1.5 hours to 10:30 AM. Combined morning tea into the artisan arrival so you do not miss either experience.';
    scheduleDiff = 'Schedule shifted +90 mins; lunch preserved at 02:00 PM with unhurried pace.';
    if (revised[0]?.activities?.length >= 2) {
      revised[0].activities[0].time = '10:30 AM – 11:30 AM';
      changes.push({
        activityName: revised[0].activities[0].activity,
        actionTaken: 'shortened',
        details: 'Shortened morning visit to 60 mins to absorb the late start delay.'
      });
      revised[0].activities[1].time = '11:45 AM – 12:45 PM';
      changes.push({
        activityName: revised[0].activities[1].activity,
        actionTaken: 'rescheduled',
        details: 'Moved to late morning tea pairing without skipping signature tasting.'
      });
    }
  } else if (repair === 'budget_decreased') {
    costDiff = -350;
    summary = 'Optimized spending: Replaced paid gallery tickets with authentic zero-cost historic mosaic and garden gems, reducing entry fees by ₹350.';
    scheduleDiff = 'Saved ₹350 per person while maintaining high cultural value.';
    if (revised[0]?.activities?.length > 2) {
      revised[0].activities[1].cost = 0;
      revised[0].activities[1].isLocalGem = true;
      changes.push({
        activityName: revised[0].activities[1].activity,
        actionTaken: 'swapped',
        details: 'Swapped ticketed attraction for authentic free local heritage enclave.'
      });
      revised[0].dayCost.entryFees = Math.max(0, revised[0].dayCost.entryFees - 200);
      revised[0].dayCost.total = Math.max(0, revised[0].dayCost.total - 350);
    }
  } else if (repair === 'fewer_crowds') {
    summary = 'Transferred peak midday slot to tranquil open-air heritage sanctuary grounds, reducing crowd exposure by over 60%.';
    scheduleDiff = 'Crowd score reduced to Low; relaxed photography atmosphere.';
    changes.push({
      activityName: 'Midday Peak Attraction',
      actionTaken: 'swapped',
      details: 'Substituted crowded indoor corridors with tranquil open-air arches.'
    });
  } else if (repair === 'more_rest') {
    summary = 'Extended leisure breaks: Inserted a 45-minute veranda tea tasting break and replaced steep climbing with relaxed promenade seating.';
    scheduleDiff = '+60 minutes buffer added; eliminated steep stair traverses.';
    changes.push({
      activityName: 'Veranda Tea Tasting Break',
      actionTaken: 'added_rest',
      details: 'Inserted shaded seating with traditional herbal tea for elder/family comfort.'
    });
  } else {
    summary = 'Streamlined itinerary: Removed an intermediate transit stop to allow deeper 2-hour engagement at the master artisan workshop.';
    scheduleDiff = 'Eliminated 40 mins of traffic transfers.';
    changes.push({
      activityName: 'Secondary Marketplace Stop',
      actionTaken: 'removed',
      details: 'Removed to eliminate traffic stress and deepen artisan immersion.'
    });
  }

  return {
    revisedPlan: revised,
    changeSummary: summary,
    costDifference: costDiff,
    scheduleDifference: scheduleDiff,
    changes,
    isDemoFallback: true,
  };
}

// Business Advice Function
export async function getBusinessAdvice(
  business: any,
  demoMetrics: any,
  popularInterests: string[]
): Promise<{ suggestions: any[]; isDemoFallback: boolean }> {
  const ai = createGeminiClient();

  if (ai) {
    try {
      const prompt = `
You are the AI Business Advisor on TourismFlow AI.
Analyze this local artisan/business:
Name: ${business.name} (${business.category})
Story: ${business.story}
Products: ${JSON.stringify(business.products || [])}
Observed Demo Metrics: Views: ${demoMetrics?.views || 300}, Saves: ${demoMetrics?.saves || 80}, Trip Additions: ${demoMetrics?.tripAdditions || 35}.
Top Traveler Demand Trends: ${(popularInterests || ['Heritage', 'Authentic Craft Workshops', 'Cultural Dining']).join(', ')}.

Provide 3 practical, high-impact business advisory suggestions:
1. Experience Highlight: Which specific workshop or product to promote to tourists and why.
2. Listing Optimization: How to improve the description to resonate with cultural travelers.
3. Interest Alignment: How to package offerings to match top search trends.

Return ONLY a JSON array of 3 suggestion cards:
[
  {
    "category": "Experience Highlight | Listing Optimization | Interest Alignment",
    "title": "Short punchy title",
    "advice": "Clear, actionable recommendation (2-3 sentences explaining why it helps)",
    "expectedImpact": "e.g. +25% morning foot traffic from family travelers"
  }
]
`;

      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.3,
          },
        }),
        15000
      );

      const suggestions = extractJsonFromText(response.text || '');
      if (Array.isArray(suggestions) && suggestions.length >= 3) {
        return { suggestions, isDemoFallback: false };
      }
    } catch (err: any) {
      console.warn('AI business advice fallback:', err?.message || err);
    }
  }

  // Deterministic advisory fallback
  return {
    suggestions: [
      {
        category: 'Experience Highlight',
        title: 'Launch a 30-Minute "Express Artisan Touch" Session',
        advice: 'Travelers on tight schedules often hesitate at 90-minute commitments. Introducing a quick ₹250 introductory demonstration allows visitors to craft a small keepsake with master guidance.',
        expectedImpact: '+35% conversion from tourists with tight day itineraries.'
      },
      {
        category: 'Listing Optimization',
        title: 'Emphasize Multi-Generational Heritage Roots',
        advice: 'Highlight your master lineage and natural raw materials directly in the first sentence. Cultural travelers value authentic provenance over commercial retail shops.',
        expectedImpact: 'Higher trust and +40% save rate on TourismFlow itineraries.'
      },
      {
        category: 'Interest Alignment',
        title: 'Bundle with Nearby Cultural Walking Routes',
        advice: 'Partner with neighborhood walking guides to position your workshop as the official rest and demonstration stop following morning monument visits.',
        expectedImpact: 'Predictable morning footfall between 10:30 AM and 01:00 PM.'
      }
    ],
    isDemoFallback: true,
  };
}
