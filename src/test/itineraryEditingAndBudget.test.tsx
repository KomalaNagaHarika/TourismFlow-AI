import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { TripPlanner } from '../components/TripPlanner';
import { TourismFlowProvider, useTourismFlow } from '../context/TourismFlowContext';
import { DayPlan } from '../types/tourism';

const sampleItinerary: DayPlan[] = [
  {
    day: 1,
    theme: 'Historic Enclaves',
    districtFocus: 'Charminar Heritage Quarter',
    travelTips: 'Wear comfortable shoes',
    dayCost: {
      transport: 200,
      entryFees: 150, // 50 + 100
      food: 450,
      artisanBuffer: 250,
      total: 1050 // 200 + 150 + 450 + 250
    },
    activities: [
      {
        id: 'act_1_1',
        time: '09:30 AM – 11:00 AM',
        activity: 'Charminar Monument',
        duration: '1.5 hrs',
        cost: 50,
        reason: 'Iconic 16th-century monument',
        transport: 'Cab',
        travelTimeMinutes: 15,
        nearbyFoodOrRest: 'Nimrah Cafe',
        mapsLink: 'https://maps.google.com',
        category: 'Heritage',
        isLocalGem: false,
        impactScore: 90,
        impactReason: 'Major heritage icon'
      },
      {
        id: 'act_1_2',
        time: '11:15 AM – 12:45 PM',
        activity: 'Laad Bazaar Artisan Workshop',
        duration: '1.5 hrs',
        cost: 100,
        reason: 'Traditional lacquer bangle crafting',
        transport: 'Walk',
        travelTimeMinutes: 5,
        nearbyFoodOrRest: 'Local tea stall',
        mapsLink: 'https://maps.google.com',
        category: 'Crafts',
        isLocalGem: true,
        impactScore: 98,
        impactReason: 'Direct artisan empowerment'
      }
    ]
  },
  {
    day: 2,
    theme: 'Palaces & Royal Heritage',
    districtFocus: 'Chowmahalla',
    travelTips: 'Photography permitted',
    dayCost: {
      transport: 250,
      entryFees: 120,
      food: 500,
      artisanBuffer: 300,
      total: 1170
    },
    activities: [
      {
        id: 'act_2_1',
        time: '10:00 AM – 12:30 PM',
        activity: 'Chowmahalla Palace',
        duration: '2.5 hrs',
        cost: 120,
        reason: 'Seat of the Asaf Jahi dynasty',
        transport: 'Auto',
        travelTimeMinutes: 20,
        nearbyFoodOrRest: 'Shadab Restaurant',
        mapsLink: 'https://maps.google.com',
        category: 'Culture',
        isLocalGem: false,
        impactScore: 92,
        impactReason: 'Architectural conservation'
      }
    ]
  }
];

// Helper to inspect active context itinerary
const ItineraryInspector: React.FC = () => {
  const { itinerary } = useTourismFlow();
  if (!itinerary) return <div data-testid="no-itinerary">No Itinerary</div>;
  return (
    <div data-testid="itinerary-inspector">
      <span data-testid="total-days">{itinerary.length}</span>
      <span data-testid="day1-acts-count">{itinerary[0]?.activities.length}</span>
      <span data-testid="day1-total-cost">{itinerary[0]?.dayCost.total}</span>
      <span data-testid="day1-entry-cost">{itinerary[0]?.dayCost.entryFees}</span>
      <span data-testid="day1-first-act-name">{itinerary[0]?.activities[0]?.activity}</span>
      <span data-testid="day1-first-act-cost">{itinerary[0]?.activities[0]?.cost}</span>
    </div>
  );
};

describe('Itinerary Editing, Reordering, Adding Locations & Budget Recalculation', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('tf_current_itinerary', JSON.stringify(sampleItinerary));
    localStorage.setItem('tf_original_itinerary', JSON.stringify(sampleItinerary));
    localStorage.setItem('tf_current_itinerary_destination', 'Hyderabad');
  });

  it('renders initial itinerary with correct day tabs and cost breakdown', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ItineraryInspector />
      </TourismFlowProvider>
    );

    expect(screen.getByTestId('total-days').textContent).toBe('2');
    expect(screen.getByTestId('day1-acts-count').textContent).toBe('2');
    expect(screen.getByTestId('day1-total-cost').textContent).toBe('1050');
    expect(screen.getByText('Charminar Monument')).toBeInTheDocument();
    expect(screen.getByText('Laad Bazaar Artisan Workshop')).toBeInTheDocument();
  });

  it('enters editing mode and allows editing activity cost with real-time budget recalculation', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ItineraryInspector />
      </TourismFlowProvider>
    );

    // Click "Edit Itinerary"
    const editBtn = screen.getByRole('button', { name: /Edit Itinerary/i });
    fireEvent.click(editBtn);

    // Now in editing mode, activity cost inputs should be editable
    const costInputs = screen.getAllByRole('spinbutton');
    // First activity cost is 50
    const charminarCostInput = costInputs.find(i => (i as HTMLInputElement).value === '50');
    expect(charminarCostInput).toBeDefined();

    // Change cost from 50 to 250 (+200 INR)
    fireEvent.change(charminarCostInput!, { target: { value: '250' } });

    // Click "Save Itinerary Changes"
    const saveChangesBtn = screen.getByRole('button', { name: /Save Itinerary Changes/i });
    fireEvent.click(saveChangesBtn);

    // Verify context updated: entryFees was 150 (50+100), now should be 350 (250+100)
    // Total was 1050, now should be 1250 (200 + 350 + 450 + 250)
    expect(screen.getByTestId('day1-first-act-cost').textContent).toBe('250');
    expect(screen.getByTestId('day1-entry-cost').textContent).toBe('350');
    expect(screen.getByTestId('day1-total-cost').textContent).toBe('1250');
  });

  it('allows reordering activities within the same day', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ItineraryInspector />
      </TourismFlowProvider>
    );

    // Initial first activity is Charminar
    expect(screen.getByTestId('day1-first-act-name').textContent).toBe('Charminar Monument');

    // Click Edit Itinerary
    fireEvent.click(screen.getByRole('button', { name: /Edit Itinerary/i }));

    // Move first activity down
    const moveDownBtns = screen.getAllByTitle('Move down');
    fireEvent.click(moveDownBtns[0]);

    // Save changes
    fireEvent.click(screen.getByRole('button', { name: /Save Itinerary Changes/i }));

    // Now first activity should be Laad Bazaar Artisan Workshop
    expect(screen.getByTestId('day1-first-act-name').textContent).toBe('Laad Bazaar Artisan Workshop');
  });

  it('removes an activity and recalculates the day budget accordingly', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ItineraryInspector />
      </TourismFlowProvider>
    );

    expect(screen.getByTestId('day1-acts-count').textContent).toBe('2');

    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /Edit Itinerary/i }));

    // Find remove buttons
    const removeBtns = screen.getAllByTitle('Remove stop');
    // Remove the first activity (cost was 50)
    fireEvent.click(removeBtns[0]);

    // Save changes
    fireEvent.click(screen.getByRole('button', { name: /Save Itinerary Changes/i }));

    // Verify act count is now 1
    expect(screen.getByTestId('day1-acts-count').textContent).toBe('1');
    // Remaining activity is Laad Bazaar (cost 100)
    expect(screen.getByTestId('day1-entry-cost').textContent).toBe('100');
    // Total should be 200 (transport) + 100 (entry) + 450 (food) + 250 (buffer) = 1000
    expect(screen.getByTestId('day1-total-cost').textContent).toBe('1000');
  });

  it('adds a new custom location to Day 1 with custom cost and updates budget', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ItineraryInspector />
      </TourismFlowProvider>
    );

    // Enter edit mode
    fireEvent.click(screen.getByRole('button', { name: /Edit Itinerary/i }));

    // Open "+ Add Location"
    fireEvent.click(screen.getByRole('button', { name: /Add Location/i }));

    // Fill form
    const placeInput = screen.getByPlaceholderText(/e\.g\. Badshahi Ashurkhana/i);
    fireEvent.change(placeInput, { target: { value: 'Badshahi Ashurkhana' } });

    const costInput = screen.getByPlaceholderText(/e\.g\. 50/i);
    fireEvent.change(costInput, { target: { value: '80' } });

    // Submit location modal
    fireEvent.click(screen.getByRole('button', { name: /Add to Day 1 Itinerary/i }));

    // Save itinerary changes
    fireEvent.click(screen.getByRole('button', { name: /Save Itinerary Changes/i }));

    // Day 1 should now have 3 activities
    expect(screen.getByTestId('day1-acts-count').textContent).toBe('3');
    // Entry fees: 50 + 100 + 80 = 230
    expect(screen.getByTestId('day1-entry-cost').textContent).toBe('230');
    // Total cost: 200 + 230 + 450 + 250 = 1130
    expect(screen.getByTestId('day1-total-cost').textContent).toBe('1130');
  });

  it('allows reverting modified itinerary to original plan', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ItineraryInspector />
      </TourismFlowProvider>
    );

    // Edit and remove an activity
    fireEvent.click(screen.getByRole('button', { name: /Edit Itinerary/i }));
    const removeBtns = screen.getAllByTitle('Remove stop');
    fireEvent.click(removeBtns[0]);
    fireEvent.click(screen.getByRole('button', { name: /Save Itinerary Changes/i }));
    expect(screen.getByTestId('day1-acts-count').textContent).toBe('1');

    // Click Revert to Original Plan
    const revertBtn = screen.getByRole('button', { name: /Revert to Original Plan/i });
    fireEvent.click(revertBtn);

    // Should be restored to 2 activities and original 1050 cost
    expect(screen.getByTestId('day1-acts-count').textContent).toBe('2');
    expect(screen.getByTestId('day1-total-cost').textContent).toBe('1050');
  });
});
