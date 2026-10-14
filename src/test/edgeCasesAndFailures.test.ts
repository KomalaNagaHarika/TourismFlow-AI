import { describe, it, expect, vi } from 'vitest';
import { 
  withTimeout, 
  extractJsonFromText, 
  validateAndSanitizeItinerary, 
  repairItineraryPlan 
} from '../services/geminiService';
import { DayPlan } from '../types/tourism';

describe('Edge Cases, Invalid Inputs, Missing Data & API Failures', () => {
  describe('Timeout Handling with withTimeout', () => {
    it('resolves if promise resolves before timeout duration', async () => {
      const fastPromise = new Promise(resolve => setTimeout(() => resolve('success'), 20));
      const result = await withTimeout(fastPromise, 500);
      expect(result).toBe('success');
    });

    it('rejects with timeout error if promise exceeds timeout duration', async () => {
      const slowPromise = new Promise(resolve => setTimeout(() => resolve('slow'), 300));
      await expect(withTimeout(slowPromise, 50)).rejects.toThrow(/timed out/i);
    });
  });

  describe('Invalid JSON & Corrupted Model Outputs', () => {
    it('throws error when JSON is missing closing bracket or brace', () => {
      const truncatedJson = '[{"day": 1, "theme": "Incomplete Day"';
      expect(() => extractJsonFromText(truncatedJson)).toThrow();
    });

    it('handles unexpected HTML error response from reverse proxy or cloud gateway', () => {
      const errorPages = [
        "The page cannot be found (HTTP 404)",
        "<html><body>502 Bad Gateway</body></html>",
        "Error: Service Unavailable at /api/generate-itinerary"
      ];

      for (const page of errorPages) {
        expect(() => extractJsonFromText(page)).toThrow();
      }
    });

    it('handles JSON with negative costs or non-numeric strings safely in sanitization', () => {
      const malformedData = [
        {
          day: 'invalid_number',
          theme: null,
          activities: [
            {
              activity: 'Local Gem',
              cost: -500, // Negative cost should be sanitized to 0
              travelTimeMinutes: 'not_a_number'
            }
          ]
        }
      ];

      const validated = validateAndSanitizeItinerary(malformedData, 'Jaipur');
      expect(validated).not.toBeNull();
      expect(validated![0].day).toBe(1);
      expect(validated![0].activities[0].cost).toBe(0);
      expect(validated![0].activities[0].travelTimeMinutes).toBe(15);
    });
  });

  describe('Adaptive Plan Repair Deterministic Fallbacks', () => {
    const basePlan: DayPlan[] = [
      {
        day: 1,
        theme: 'Heritage Walk',
        districtFocus: 'Central Core',
        travelTips: 'Stay hydrated',
        dayCost: { transport: 200, entryFees: 300, food: 400, artisanBuffer: 200, total: 1100 },
        activities: [
          {
            id: 'act_1',
            time: '09:00 AM – 10:30 AM',
            activity: 'Historic Gateway',
            duration: '1.5 hrs',
            cost: 100,
            reason: 'Monument',
            transport: 'Cab',
            travelTimeMinutes: 10,
            nearbyFoodOrRest: 'Tea stall',
            mapsLink: 'https://maps.google.com',
            category: 'Heritage',
            isLocalGem: false,
            impactScore: 90,
            impactReason: 'Heritage conservation'
          },
          {
            id: 'act_2',
            time: '11:00 AM – 12:30 PM',
            activity: 'Handloom Cooperative',
            duration: '1.5 hrs',
            cost: 200,
            reason: 'Artisan weaving',
            transport: 'Walk',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Artisan cafeteria',
            mapsLink: 'https://maps.google.com',
            category: 'Crafts',
            isLocalGem: true,
            impactScore: 98,
            impactReason: 'Direct artisan livelihood'
          },
          {
            id: 'act_3',
            time: '01:00 PM – 02:30 PM',
            activity: 'Regional Thali House',
            duration: '1.5 hrs',
            cost: 0,
            reason: 'Traditional lunch',
            transport: 'Walk',
            travelTimeMinutes: 5,
            nearbyFoodOrRest: 'Resting garden',
            mapsLink: 'https://maps.google.com',
            category: 'Food',
            isLocalGem: true,
            impactScore: 95,
            impactReason: 'Local culinary heritage'
          }
        ]
      }
    ];

    it('handles "late_start" disruption by shifting schedule forward', async () => {
      const repair = await repairItineraryPlan(basePlan, 'late_start', { destination: 'Hyderabad' } as any);
      expect(repair).toBeDefined();
      expect(repair.revisedPlan).toHaveLength(1);
      expect(repair.changeSummary).toContain('Shifted Day 1 start');
      expect(repair.revisedPlan[0].activities[0].time).toContain('10:30 AM');
    });

    it('handles "budget_decreased" disruption by swapping paid tickets with free artisan enclaves', async () => {
      const repair = await repairItineraryPlan(basePlan, 'budget_decreased', { destination: 'Hyderabad' } as any);
      expect(repair).toBeDefined();
      expect(repair.costDifference).toBeLessThan(0);
      expect(repair.changeSummary).toContain('Optimized spending');
      expect(repair.revisedPlan[0].dayCost.total).toBeLessThan(basePlan[0].dayCost.total);
    });

    it('handles "fewer_crowds" disruption with tranquil open-air alternatives', async () => {
      const repair = await repairItineraryPlan(basePlan, 'fewer_crowds', { destination: 'Hyderabad' } as any);
      expect(repair).toBeDefined();
      expect(repair.changeSummary).toContain('tranquil open-air heritage');
    });

    it('handles "attraction_closed" disruption gracefully with nearby alternative gem', async () => {
      const repair = await repairItineraryPlan(basePlan, 'attraction_closed', { destination: 'Hyderabad' } as any);
      expect(repair).toBeDefined();
      expect(repair.changeSummary).toContain('alternative');
    });
  });
});
