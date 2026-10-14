import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { HYDERABAD_ATTRACTIONS, ALTERNATIVE_COMPARISONS } from './src/data/hyderabadData.ts';
import { 
  isDestinationHyderabad, 
  getCuratedDestinationItinerary 
} from './src/data/destinationData.ts';
import { DayPlan, TripPreferences, PlanRepairType, RepairResult } from './src/types/tourism.ts';
import { 
  generateItineraryPlan, 
  repairItineraryPlan, 
  getBusinessAdvice
} from './src/services/geminiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini SDK with server-side API Key
const rawKey = process.env.GEMINI_API_KEY || '';
const apiKey = (rawKey && rawKey !== 'MY_GEMINI_API_KEY' && !rawKey.includes('MY_GEMINI')) ? rawKey : '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Timeout helper to guarantee responsive generation without premature aborts (25 seconds)
async function withTimeout<T>(promise: Promise<T>, ms = 25000): Promise<T> {
  let timer: NodeJS.Timeout;
  return Promise.race([
    promise.then((res) => {
      clearTimeout(timer);
      return res;
    }),
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error('AI generation timeout')), ms);
    })
  ]);
}


// Helper: Curated Deterministic Generator (ensures 100% reliability in demo mode)
function generateDeterministicItinerary(prefs: TripPreferences): DayPlan[] {
  const daysCount = Math.min(Math.max(prefs.days || 2, 1), 4);
  const userInterests = prefs.interests || ['Heritage', 'Food', 'Culture'];
  const isFamily = prefs.groupType.toLowerCase().includes('family');

  const days: DayPlan[] = [];

  for (let d = 1; d <= daysCount; d++) {
    if (d === 1) {
      // Day 1: Old City Historic & Artisanal Core
      days.push({
        day: 1,
        theme: 'Charminar Minarets, Laad Bazaar Artisans & Royal Nizami Flavors',
        districtFocus: 'Old City & Musi River Basin',
        travelTips: 'Wear comfortable walking shoes for historic paved alleys. Best to take metro to MGBS or cab directly to Charminar.',
        dayCost: {
          transport: 220,
          entryFees: 150,
          food: 650,
          artisanBuffer: 400,
          total: 1420
        },
        activities: [
          {
            id: 'act_1_1',
            time: '09:00 AM – 10:30 AM',
            activity: 'Charminar & Historic Bazaar Arcades',
            duration: '1.5 hrs',
            cost: 50,
            reason: 'Climb the historic minaret balconies early to beat midday queues and photograph Old City waking up.',
            transport: prefs.transportPref.includes('Cab') ? 'Cab / Auto to Charminar Gate' : 'Metro to MGBS station + 10-min shared electric rickshaw',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Nimrah Café right across the western archway',
            mapsLink: 'https://maps.google.com/?q=Charminar,+Hyderabad',
            attractionId: 'charminar',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 84,
            impactReason: 'Core heritage monument anchoring surrounding independent marketplace traders.'
          },
          {
            id: 'act_1_2',
            time: '10:30 AM – 11:30 AM',
            activity: 'Nimrah Café & Heritage Bakery (Morning Irani Chai & Osmania Tasting)',
            duration: '1 hr',
            cost: 120,
            reason: 'Quintessential Hyderabad culinary tradition; piping hot Zafrani Chai paired with oven-fresh Osmania & Tie biscuits.',
            transport: '2-minute leisurely walk across Charminar plaza',
            travelTimeMinutes: 2,
            nearbyFoodOrRest: 'Mecca Masjid peaceful fountain courtyard nearby for rest',
            mapsLink: 'https://maps.google.com/?q=Nimrah+Cafe+and+Bakery,+Charminar',
            attractionId: 'nimrah-cafe',
            category: 'Food',
            isLocalGem: true,
            impactScore: 96,
            impactReason: 'Puts travel spend directly into beloved 30-year local family-run bakery preserving Deccani baking heritage.'
          },
          {
            id: 'act_1_3',
            time: '11:45 AM – 01:15 PM',
            activity: 'Laad Bazaar Lacquer & Zari Artisan Studios (Live Craft Session)',
            duration: '1.5 hrs',
            cost: 250,
            reason: 'Witness 4th-generation master craftsmen mould heated natural tree-resin lacquer and set glittering stones by hand.',
            transport: 'Short 3-minute stroll down covered Laad Bazaar lane',
            travelTimeMinutes: 3,
            nearbyFoodOrRest: 'Fruit juice and sweet coconut water stalls along the alley',
            mapsLink: 'https://maps.google.com/?q=Laad+Bazaar,+Charminar,+Hyderabad',
            attractionId: 'laad-bazaar-bangles',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 98,
            impactReason: 'Direct artisan patronage supporting over 120 women crafts families and combating synthetic mass imports.'
          },
          {
            id: 'act_1_4',
            time: '01:30 PM – 02:45 PM',
            activity: 'Hotel Shadab Traditional Dum Biryani Lunch',
            duration: '1.25 hrs',
            cost: 380,
            reason: 'Legendary Bawarchi-cooked mutton/chicken Dum Biryani paired with fragrant Mirchi Ka Salan and creamy double ka meetha.',
            transport: '7-minute auto rickshaw ride along High Court road',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Air-conditioned family dining floor with fresh lime soda',
            mapsLink: 'https://maps.google.com/?q=Hotel+Shadab,+High+Court+Rd,+Hyderabad',
            attractionId: 'shadaab-biryani',
            category: 'Food',
            isLocalGem: true,
            impactScore: 92,
            impactReason: 'Locally owned dining landmark sourcing spices from traditional Old City wholesale mandi.'
          },
          {
            id: 'act_1_5',
            time: '03:15 PM – 05:15 PM',
            activity: 'Chowmahalla Palace & Royal Nizam Vintage Carriage Courtyard',
            duration: '2 hrs',
            cost: 150,
            reason: 'Relaxed afternoon exploring grand ceremonial halls, 1912 vintage Rolls Royce, and fountains without heavy stairs.',
            transport: '10-minute auto ride back through Khilwat',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Palace heritage cafe serving herbal infusions in garden',
            mapsLink: 'https://maps.google.com/?q=Chowmahalla+Palace,+Hyderabad',
            attractionId: 'chowmahalla-palace',
            category: 'Culture',
            isLocalGem: false,
            impactScore: 89,
            impactReason: 'Restored royal trust supporting local cultural music preservation and archive artisans.'
          }
        ]
      });
    } else if (d === 2) {
      // Day 2: Golkonda Fort, Acoustic Wonders & Royal Necropolis Gardens
      days.push({
        day: 2,
        theme: 'Golkonda Fortress Citadel, Qutb Shahi Tombs & Evening Lake Breeze',
        districtFocus: 'Golkonda & West Hyderabad Plateau',
        travelTips: 'Carry a refillable water bottle and sun hat. Golkonda involves moderate climbing; Qutb Shahi is flat, shaded garden.',
        dayCost: {
          transport: 280,
          entryFees: 320,
          food: 580,
          artisanBuffer: 250,
          total: 1430
        },
        activities: [
          {
            id: 'act_2_1',
            time: '08:45 AM – 11:45 AM',
            activity: 'Golkonda Fort & Acoustic Whispering Citadel',
            duration: '3 hrs',
            cost: 300,
            reason: 'Early exploration of the majestic fortress while cool; test clapping acoustics at Fateh Darwaza and climb to Bala Hissar.',
            transport: prefs.transportPref.includes('Cab') ? 'Cab / Taxi directly to Fort entrance' : 'Bus or Metro to Lakdikapul + connected cab',
            travelTimeMinutes: 30,
            nearbyFoodOrRest: 'Chai and tender coconut stands at the fort base plaza',
            mapsLink: 'https://maps.google.com/?q=Golkonda+Fort,+Hyderabad',
            attractionId: 'golkonda-fort',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 87,
            impactReason: 'Certified guide association employment and heritage protection for ancient rainwater channels.'
          },
          {
            id: 'act_2_2',
            time: '12:15 PM – 01:45 PM',
            activity: 'Qutb Shahi Royal Necropolis & Restored Gardens',
            duration: '1.5 hrs',
            cost: 80,
            reason: 'Tranquil garden mausoleums just 1.5km from the fort with minimal crowds, shaded banyan trees, and ornate stone jali carving.',
            transport: '5-minute auto ride from Golkonda gate',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Shaded pavilion lawns ideal for restful pause',
            mapsLink: 'https://maps.google.com/?q=Qutb+Shahi+Tombs,+Hyderabad',
            attractionId: 'qutb-shahi-tombs',
            category: 'Heritage',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Direct partnership with Aga Khan Trust for Culture employing master stone carvers.'
          },
          {
            id: 'act_2_3',
            time: '02:00 PM – 03:15 PM',
            activity: 'Traditional Deccani Lunch & Spiced Lassi at Toli Chowki',
            duration: '1.25 hrs',
            cost: 320,
            reason: 'Savor regional specialties like Talawa Gosht or vegetarian Khatti Dal and Bagara Baingan at local family kitchen.',
            transport: '8-minute cab down Toli Chowki heritage corridor',
            travelTimeMinutes: 8,
            nearbyFoodOrRest: 'Famous local bakery sweet counters adjacent to restaurant',
            mapsLink: 'https://maps.google.com/?q=Toli+Chowki,+Hyderabad',
            category: 'Food',
            isLocalGem: true,
            impactScore: 91,
            impactReason: 'Circulates travel revenue into non-mall community dining.'
          },
          {
            id: 'act_2_4',
            time: '04:00 PM – 06:30 PM',
            activity: 'Shilparamam Rural Arts & Handloom Village',
            duration: '2.5 hrs',
            cost: 150,
            reason: 'Interactive pottery wheel sessions, live Dhokra brass casters, and direct handloom saree weavers in village settings.',
            transport: '18-minute cab to Madhapur',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Open-air village snack kiosks serving mirchi bajji and hot filter coffee',
            mapsLink: 'https://maps.google.com/?q=Shilparamam,+Madhapur,+Hyderabad',
            attractionId: 'shilparamam-crafts',
            category: 'Crafts',
            isLocalGem: false,
            impactScore: 97,
            impactReason: 'Empowers over 200 visiting rural artisan households with zero commission on handmade wares.'
          },
          {
            id: 'act_2_5',
            time: '07:00 PM – 08:30 PM',
            activity: 'Durgam Cheruvu Secret Lake & Cable Bridge Sunset Promenade',
            duration: '1.5 hrs',
            cost: 60,
            reason: 'Relaxing illuminated lake breeze, pedal boating, and peaceful view of the modern cable bridge lights reflecting in the water.',
            transport: '8-minute auto or walk from Knowledge City',
            travelTimeMinutes: 8,
            nearbyFoodOrRest: 'Lakefront walking kiosks with roasted sweet corn and fresh juices',
            mapsLink: 'https://maps.google.com/?q=Durgam+Cheruvu+Lake,+Hyderabad',
            attractionId: 'durgam-cheruvu-lake',
            category: 'Nature',
            isLocalGem: true,
            impactScore: 90,
            impactReason: 'Eco-sensitive recreation area preserving geological rock formations from development.'
          }
        ]
      });
    } else if (d === 3) {
      // Day 3: Hidden Treasures, Paigah Tombs & Handloom Cooperatives
      days.push({
        day: 3,
        theme: 'Intricate Stucco Lace, GI-Tagged Ikat Weavers & Clock Tower Treats',
        districtFocus: 'Central Hyderabad & Abids Precinct',
        travelTips: 'Great day for souvenir collectors and textile enthusiasts seeking authentic GI-tagged handlooms.',
        dayCost: {
          transport: 240,
          entryFees: 120,
          food: 520,
          artisanBuffer: 600,
          total: 1480
        },
        activities: [
          {
            id: 'act_3_1',
            time: '09:30 AM – 11:30 AM',
            activity: 'Paigah Tombs — Intricate Stucco & Mosaic Sanctuary',
            duration: '2 hrs',
            cost: 40,
            reason: 'Marvel at 27 unique, unrepeated geometric lime-mortar stucco floral screens in serene, uncrowded nobility grounds.',
            transport: 'Cab to Santoshnagar',
            travelTimeMinutes: 25,
            nearbyFoodOrRest: 'Traditional local chai and bun stalls at Santoshnagar square',
            mapsLink: 'https://maps.google.com/?q=Paigah+Tombs,+Santoshnagar,+Hyderabad',
            attractionId: 'paigah-tombs',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 98,
            impactReason: 'Channels tourism interest away from congested central zones into historically overlooked community sites.'
          },
          {
            id: 'act_3_2',
            time: '12:00 PM – 01:15 PM',
            activity: 'Badshahi Ashurkhana Enamelled Mosaic Hall (Est. 1594)',
            duration: '1.25 hrs',
            cost: 0,
            reason: 'Gaze at 430-year-old brilliant Persian lapis lazuli and turquoise tile mosaics with zero commercial clutter.',
            transport: '15-minute cab along Musi river road',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Pathar Gatti historical sweet shops nearby',
            mapsLink: 'https://maps.google.com/?q=Badshahi+Ashurkhana,+Hyderabad',
            attractionId: 'badshahi-ashurkhana',
            category: 'Culture',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Preserves rare Deccani Kashani tile work and supports neighborhood heritage trust.'
          },
          {
            id: 'act_3_3',
            time: '01:30 PM – 02:45 PM',
            activity: 'Heritage Thali Lunch at Abids & Famous Fruit Ice Cream',
            duration: '1.25 hrs',
            cost: 260,
            reason: 'South Indian banana leaf lunch followed by 100% hand-churned seasonal Sitaphal (custard apple) ice cream at 1951 Moazzam Jahi market.',
            transport: '7-minute auto to Moazzam Jahi Market',
            travelTimeMinutes: 7,
            nearbyFoodOrRest: 'Moazzam Jahi granite clock tower courtyard benches',
            mapsLink: 'https://maps.google.com/?q=Famous+Ice+Cream,+Moazzam+Jahi+Market,+Hyderabad',
            attractionId: 'famous-ice-cream',
            category: 'Food',
            isLocalGem: true,
            impactScore: 94,
            impactReason: 'Celebrates artisanal hand-churned ice cream and supports restored municipal market merchants.'
          },
          {
            id: 'act_3_4',
            time: '03:15 PM – 05:30 PM',
            activity: 'Pochampally Ikat Handloom Cooperative Showroom & Loom Demo',
            duration: '2.25 hrs',
            cost: 250,
            reason: 'Direct artisan-run cooperative where you learn the mathematical tie-and-dye Ikat resist technique directly from master weavers.',
            transport: '10-minute walk through historic Abids shopping arcade',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Abids vintage Irani cafes with filter coffee',
            mapsLink: 'https://maps.google.com/?q=Pochampally+Handloom+House,+Abids,+Hyderabad',
            attractionId: 'pochampally-weavers-coop',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 99,
            impactReason: 'Certified 100% fair trade; directly finances weaver pensions and pit loom upgrades in Nalgonda rural clusters.'
          }
        ]
      });
    } else {
      // Day 4: Salar Jung Treasuries & Hussain Sagar Sunset
      days.push({
        day: 4,
        theme: 'National Art Treasures, Jade Antiques & Hussain Sagar Lake Vista',
        districtFocus: 'Darulshifa & Tank Bund Promenade',
        travelTips: 'Arrive at Salar Jung museum before 11:30 AM to secure a spot for the iconic mechanical clock chiming at noon.',
        dayCost: {
          transport: 220,
          entryFees: 180,
          food: 550,
          artisanBuffer: 300,
          total: 1250
        },
        activities: [
          {
            id: 'act_4_1',
            time: '10:00 AM – 01:00 PM',
            activity: 'Salar Jung Museum & 19th-Century Musical Clock',
            duration: '3 hrs',
            cost: 100,
            reason: 'Witness the Veiled Rebecca in Italian marble, royal Deccani jade daggers, and the famous British miniature mechanical clock.',
            transport: 'Cab / Metro to Salar Jung station',
            travelTimeMinutes: 20,
            nearbyFoodOrRest: 'Museum indoor cafeteria and landscaped river gardens',
            mapsLink: 'https://maps.google.com/?q=Salar+Jung+Museum,+Hyderabad',
            attractionId: 'salar-jung-museum',
            category: 'Culture',
            isLocalGem: false,
            impactScore: 86,
            impactReason: 'Premier national art institution supporting student educational excursions.'
          },
          {
            id: 'act_4_2',
            time: '01:30 PM – 02:45 PM',
            activity: 'Authentic Andhra Meals at Tank Bund / Secretariat Road',
            duration: '1.25 hrs',
            cost: 280,
            reason: 'Spicy Gongura chutney, Gunpowder ghee rice, and fresh curd served on fresh plantain leaf.',
            transport: '12-minute cab to Tank Bund road',
            travelTimeMinutes: 12,
            nearbyFoodOrRest: 'Lake promenade gardens right across the road',
            mapsLink: 'https://maps.google.com/?q=Tank+Bund,+Hyderabad',
            category: 'Food',
            isLocalGem: true,
            impactScore: 90,
            impactReason: 'Regional farm-to-table dining celebrating Telangana spice traditions.'
          },
          {
            id: 'act_4_3',
            time: '03:30 PM – 06:00 PM',
            activity: 'Hussain Sagar Lake & Monolithic Buddha Boat Ferry',
            duration: '2.5 hrs',
            cost: 120,
            reason: 'Scenic ferry ride across the 450-year-old lake to stand beneath the 18-meter single-granite rock Buddha statue.',
            transport: '5-minute stroll to Lumbini Park boat jetty',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Evening boat deck breeze and snack kiosks on Tank Bund promenade',
            mapsLink: 'https://maps.google.com/?q=Hussain+Sagar,+Hyderabad',
            category: 'Nature',
            isLocalGem: false,
            impactScore: 88,
            impactReason: 'Municipal public space supporting eco-ferry operators and public recreation.'
          }
        ]
      });
    }
  }

  return days;
}

// Endpoint: AI-Powered Trip Planner with Fallback
app.post('/api/generate-itinerary', async (req, res) => {
  const prefs: TripPreferences = req.body;

  if (!prefs || !prefs.destination) {
    res.status(400).json({ error: 'Trip preferences with a valid destination are required.' });
    return;
  }

  try {
    const result = await generateItineraryPlan(prefs);
    res.json(result);
  } catch (err: any) {
    const statusCode = err?.status || 500;
    res.status(statusCode).json({
      error: err?.message || `Unable to generate recommendations for "${prefs.destination}".`,
      isUnsupportedDestination: Boolean(err?.isUnsupportedDestination),
    });
  }
});

// Endpoint: Adaptive Itinerary / Plan Repair AI
app.post('/api/repair-itinerary', async (req, res) => {
  const { currentPlan, repairType, preferences, problemDetails } = req.body;

  if (!currentPlan || !Array.isArray(currentPlan) || currentPlan.length === 0) {
    res.status(400).json({ error: 'Current plan is required for repair' });
    return;
  }

  try {
    const result = await repairItineraryPlan(
      currentPlan,
      repairType || 'late_start',
      preferences,
      problemDetails
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Plan repair failed' });
  }
});

// Endpoint: AI Business Advisor for Local Artisans
app.post('/api/business-advice', async (req, res) => {
  const { business, demoMetrics, popularInterests } = req.body;

  if (!business) {
    res.status(400).json({ error: 'Business details are required' });
    return;
  }

  try {
    const result = await getBusinessAdvice(
      business,
      demoMetrics,
      popularInterests || ['Heritage', 'Authentic Local Crafts', 'Culinary Traditions']
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err?.message || 'Business advice failed' });
  }
});

// Endpoint: Tourism Impact Engine Explanation
app.post('/api/explain-recommendation', async (req, res) => {
  const { attraction, preferences } = req.body;

  if (!attraction) {
    res.status(400).json({ error: 'Attraction data required' });
    return;
  }

  // Calculate explainable metrics
  const interestMatch = preferences?.interests?.includes(attraction.category) ? 96 : 82;
  const affordability = (attraction.avgCost <= (preferences?.budgetInr ? preferences.budgetInr / 5 : 500)) ? 94 : 76;
  const localEconomy = attraction.isLocalGem ? 98 : 70;
  const crowdScore = attraction.crowdLevel === 'Low' ? 95 : attraction.crowdLevel === 'Moderate' ? 82 : 65;
  const overall = Math.round((interestMatch * 0.3) + (affordability * 0.2) + (localEconomy * 0.3) + (crowdScore * 0.2));

  let naturalLanguageExplanation = '';

  if (ai) {
    try {
      const prompt = `
You are the transparent Tourism Impact Engine.
Explain in 2 conversational sentences why "${attraction.name}" was recommended for a ${preferences?.groupType || 'traveler'} with interests in ${preferences?.interests?.join(', ') || 'Heritage & Food'}.
Emphasize why this creates authentic value for the tourist and economic benefit for the local community.
`;
      const response = await withTimeout(
        ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        }),
        4000
      );
      naturalLanguageExplanation = response.text?.trim() || '';
    } catch {
      // ignore
    }
  }

  if (!naturalLanguageExplanation) {
    naturalLanguageExplanation = attraction.isLocalGem
      ? `Recommended because it directly supports authentic local artisans (${attraction.culturalImpact || 'traditional crafts'}) while offering an intimate, uncrowded experience that fits your group budget.`
      : `Recommended as a foundational cultural cornerstone that anchors your geographic route through Hyderabad with minimal transit overhead.`;
  }

  res.json({
    breakdown: {
      interestMatchScore: interestMatch,
      affordabilityScore: affordability,
      geographicClusteringScore: 92,
      crowdBalancingBonus: crowdScore,
      localEconomyImpactScore: localEconomy,
      overallScore: overall,
      explanation: naturalLanguageExplanation,
    }
  });
});

// Serve frontend: Vite middleware in development, static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TourismFlow AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
