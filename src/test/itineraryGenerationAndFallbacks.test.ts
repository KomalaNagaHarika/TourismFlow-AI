import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  extractJsonFromText, 
  validateAndSanitizeItinerary, 
  generateItineraryPlan 
} from '../services/geminiService';
import { getCuratedDestinationItinerary } from '../data/destinationData';

describe('Destination-Specific Itinerary Generation & AI Fallback Engine', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('extractJsonFromText', () => {
    it('parses pristine JSON array directly', () => {
      const input = '[{"day": 1, "theme": "Historic Walk", "activities": []}]';
      const result = extractJsonFromText(input);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].theme).toBe('Historic Walk');
    });

    it('safely extracts JSON wrapped in markdown code fences', () => {
      const input = '```json\n[{"day": 1, "theme": "Artisan Tour", "activities": []}]\n```';
      const result = extractJsonFromText(input);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].theme).toBe('Artisan Tour');
    });

    it('safely extracts JSON enclosed in arbitrary conversational prelude and postscript', () => {
      const input = 'Here is your custom itinerary tailored for your trip:\n[{"day": 1, "theme": "Coastal Exploration", "activities": []}]\nHope you enjoy your journey!';
      const result = extractJsonFromText(input);
      expect(Array.isArray(result)).toBe(true);
      expect(result[0].theme).toBe('Coastal Exploration');
    });

    it('throws a helpful descriptive error if the text is not JSON or is an HTML error page', () => {
      const htmlError = '<!DOCTYPE html><html><head><title>504 Gateway Timeout</title></head><body>The page cannot be loaded</body></html>';
      expect(() => extractJsonFromText(htmlError)).toThrow();
    });

    it('throws error on empty or non-string input', () => {
      expect(() => extractJsonFromText('')).toThrow('Empty response received from AI model');
      expect(() => extractJsonFromText(null as any)).toThrow();
    });
  });

  describe('validateAndSanitizeItinerary', () => {
    it('validates and auto-calculates total day cost from activities', () => {
      const rawData = [
        {
          day: 1,
          theme: 'Old City Heritage',
          districtFocus: 'Charminar Enclave',
          travelTips: 'Wear walking shoes',
          dayCost: { transport: 250, food: 500, artisanBuffer: 300 },
          activities: [
            {
              activity: 'Charminar Monument',
              time: '09:30 AM – 11:00 AM',
              duration: '1.5 hrs',
              cost: 50,
              category: 'Heritage',
              isLocalGem: false
            },
            {
              activity: 'Laad Bazaar Lacquer Bangles',
              time: '11:15 AM – 12:30 PM',
              duration: '1.25 hrs',
              cost: 150,
              category: 'Crafts',
              isLocalGem: true
            }
          ]
        }
      ];

      const validated = validateAndSanitizeItinerary(rawData, 'Hyderabad');
      expect(validated).not.toBeNull();
      expect(validated).toHaveLength(1);

      const day1 = validated![0];
      expect(day1.day).toBe(1);
      expect(day1.activities).toHaveLength(2);
      expect(day1.activities[0].activity).toBe('Charminar Monument');
      expect(day1.activities[0].mapsLink).toContain('Charminar%20Monument%2C%20Hyderabad');
      // Total activity cost = 50 + 150 = 200
      // transport: 250 + food: 500 + artisanBuffer: 300 + entryFees: 200 = 1250
      expect(day1.dayCost.entryFees).toBe(200);
      expect(day1.dayCost.total).toBe(1250);
    });

    it('returns null if input is not an array or has no valid activities', () => {
      expect(validateAndSanitizeItinerary([], 'Hyderabad')).toBeNull();
      expect(validateAndSanitizeItinerary('invalid' as any, 'Hyderabad')).toBeNull();
      expect(validateAndSanitizeItinerary([{ day: 1, activities: [] }], 'Hyderabad')).toBeNull();
    });

    it('sanitizes missing fields with sensible defaults', () => {
      const rawData = [
        {
          activities: [
            {
              activity: 'Local Tea Tasting'
            }
          ]
        }
      ];

      const validated = validateAndSanitizeItinerary(rawData, 'Hyderabad');
      expect(validated).not.toBeNull();
      expect(validated![0].theme).toContain('Cultural & Scenic Exploration');
      expect(validated![0].activities[0].category).toBe('Culture');
      expect(validated![0].activities[0].cost).toBe(0);
    });
  });

  describe('Destination-specific catalog & fallback routing', () => {
    it('loads authentic Visakhapatnam attractions and never returns Hyderabad data', () => {
      const prefs = {
        destination: 'Visakhapatnam',
        days: 2,
        startDate: '2026-10-20',
        arrivalTime: '09:00 AM',
        departureTime: '08:00 PM',
        travelersCount: 2,
        groupType: 'Couple',
        budgetInr: 6000,
        interests: ['Nature', 'Heritage', 'Food'] as any[],
        transportPref: 'Cab',
        walkingPace: 'Moderate',
        crowdPref: 'Balanced',
      };

      const result = getCuratedDestinationItinerary(prefs);
      expect(result).not.toBeNull();
      expect(result!.source).toContain('Visakhapatnam');

      const allActivities = result!.days.flatMap(d => d.activities).map(a => a.activity.toLowerCase());
      const hasVizagAttraction = allActivities.some(name => 
        name.includes('kursura') || 
        name.includes('submarine') || 
        name.includes('kailasagiri') || 
        name.includes('rk beach') ||
        name.includes('etikoppaka') ||
        name.includes('thotlakonda')
      );
      expect(hasVizagAttraction).toBe(true);

      // Verify no Charminar or Golkonda sneaks into Visakhapatnam
      const hasHyderabadAttraction = allActivities.some(name => 
        name.includes('charminar') || name.includes('golkonda')
      );
      expect(hasHyderabadAttraction).toBe(false);
    });

    it('loads authentic Hyderabad attractions for Hyderabad query', () => {
      const prefs = {
        destination: 'Hyderabad',
        days: 2,
        startDate: '2026-10-20',
        arrivalTime: '09:00 AM',
        departureTime: '08:00 PM',
        travelersCount: 2,
        groupType: 'Couple',
        budgetInr: 8000,
        interests: ['Heritage', 'Food', 'Culture'] as any[],
        transportPref: 'Cab',
        walkingPace: 'Moderate',
        crowdPref: 'Balanced',
      };

      const result = getCuratedDestinationItinerary(prefs);
      expect(result).not.toBeNull();
      expect(result!.source).toContain('Hyderabad');

      const allActivities = result!.days.flatMap(d => d.activities).map(a => a.activity.toLowerCase());
      const hasHydAttraction = allActivities.some(name => 
        name.includes('charminar') || 
        name.includes('laad bazaar') || 
        name.includes('golkonda') ||
        name.includes('chowmahalla')
      );
      expect(hasHydAttraction).toBe(true);
    });

    it('rejects unsupported destinations gracefully without substituting unrelated attractions', async () => {
      const prefs = {
        destination: 'NonExistentCityXYZ',
        days: 2,
        startDate: '2026-10-20',
        arrivalTime: '09:00 AM',
        departureTime: '08:00 PM',
        travelersCount: 2,
        groupType: 'Couple',
        budgetInr: 8000,
        interests: ['Heritage'] as any[],
        transportPref: 'Cab',
        walkingPace: 'Moderate',
        crowdPref: 'Balanced',
      };

      // Since NonExistentCityXYZ is not in curated catalog and Gemini client might fail/not have keys in test runner,
      // it should throw a clear unsupported destination error rather than quietly returning Hyderabad
      await expect(generateItineraryPlan(prefs)).rejects.toThrow(/Could not generate recommendations for "NonExistentCityXYZ"/i);
    });

    it('validates that generateItineraryPlan throws error if destination is missing', async () => {
      await expect(generateItineraryPlan({ destination: '' } as any)).rejects.toThrow(
        'Destination and travel preferences are required.'
      );
    });
  });
});
