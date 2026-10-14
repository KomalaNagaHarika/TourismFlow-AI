import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TripPlanner } from '../components/TripPlanner';
import { TourismFlowProvider, useTourismFlow } from '../context/TourismFlowContext';

// Helper component to inspect context preferences
const ContextInspector: React.FC = () => {
  const { preferences } = useTourismFlow();
  return (
    <div data-testid="context-inspector">
      <span data-testid="inspector-destination">{preferences.destination}</span>
      <span data-testid="inspector-days">{preferences.days}</span>
      <span data-testid="inspector-budget">{preferences.budgetInr}</span>
      <span data-testid="inspector-travelers">{preferences.travelersCount}</span>
      <span data-testid="inspector-group">{preferences.groupType}</span>
      <span data-testid="inspector-interests">{preferences.interests.join(',')}</span>
    </div>
  );
};

describe('Trip Planner Form Validation & User Inputs', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the planner form with default values and options', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ContextInspector />
      </TourismFlowProvider>
    );

    // Destination input
    const destInput = screen.getByPlaceholderText(/e\.g\. Hyderabad/i);
    expect(destInput).toBeInTheDocument();
    expect((destInput as HTMLInputElement).value).toContain('Hyderabad');

    // Generate button
    expect(screen.getByRole('button', { name: /Generate Intelligent Itinerary/i })).toBeInTheDocument();

    // Days selector should contain numeric options
    expect(screen.getByText(/Trip Duration/i)).toBeInTheDocument();

    // Budget input
    const budgetInput = screen.getByDisplayValue('8000');
    expect(budgetInput).toBeInTheDocument();
  });

  it('updates destination input and preferences on change', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ContextInspector />
      </TourismFlowProvider>
    );

    const destInput = screen.getByPlaceholderText(/e\.g\. Hyderabad/i);
    fireEvent.change(destInput, { target: { value: 'Visakhapatnam' } });

    expect((destInput as HTMLInputElement).value).toBe('Visakhapatnam');
    expect(screen.getByTestId('inspector-destination').textContent).toBe('Visakhapatnam');
  });

  it('allows changing trip duration and validates number of days', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ContextInspector />
      </TourismFlowProvider>
    );

    // Click 3 days button
    const threeDaysBtn = screen.getByRole('button', { name: '3 Days' });
    fireEvent.click(threeDaysBtn);

    expect(screen.getByTestId('inspector-days').textContent).toBe('3');
  });

  it('updates total budget and enforces numeric bounds', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ContextInspector />
      </TourismFlowProvider>
    );

    const budgetInput = screen.getByDisplayValue('8000');
    fireEvent.change(budgetInput, { target: { value: '15000' } });

    expect(screen.getByTestId('inspector-budget').textContent).toBe('15000');
  });

  it('updates travelers count and group type', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ContextInspector />
      </TourismFlowProvider>
    );

    // Find travelers input or select
    const travelersInput = screen.getByDisplayValue('3');
    fireEvent.change(travelersInput, { target: { value: '4' } });
    expect(screen.getByTestId('inspector-travelers').textContent).toBe('4');

    // Select group type
    const groupSelect = screen.getByDisplayValue('Family with Children');
    fireEvent.change(groupSelect, { target: { value: 'Friends Group' } });
    expect(screen.getByTestId('inspector-group').textContent).toBe('Friends Group');
  });

  it('toggles cultural interests and preserves at least one interest', () => {
    render(
      <TourismFlowProvider>
        <TripPlanner />
        <ContextInspector />
      </TourismFlowProvider>
    );

    const currentInterests = screen.getByTestId('inspector-interests').textContent?.split(',') || [];
    expect(currentInterests).toContain('Food');

    // Click on Culinary interest to toggle it off
    const foodOption = screen.getByText('Culinary & Irani Chai');
    fireEvent.click(foodOption);

    const updatedInterests = screen.getByTestId('inspector-interests').textContent?.split(',') || [];
    expect(updatedInterests).not.toContain('Food');

    // Click back to toggle it on
    fireEvent.click(foodOption);
    const restoredInterests = screen.getByTestId('inspector-interests').textContent?.split(',') || [];
    expect(restoredInterests).toContain('Food');
  });

  it('validates custom location form fields when adding location', () => {
    // We can simulate having an active itinerary
    const initialItinerary = [
      {
        day: 1,
        theme: 'Heritage Walk',
        districtFocus: 'Old City',
        travelTips: 'Stay hydrated',
        dayCost: { transport: 200, entryFees: 100, food: 400, artisanBuffer: 200, total: 900 },
        activities: [
          {
            id: 'act_1',
            time: '10:00 AM – 11:30 AM',
            activity: 'Charminar',
            duration: '1.5 hrs',
            cost: 50,
            reason: 'Iconic landmark',
            transport: 'Cab',
            travelTimeMinutes: 15,
            nearbyFoodOrRest: 'Nimrah Cafe',
            mapsLink: 'https://maps.google.com',
            category: 'Heritage' as const,
            isLocalGem: false,
            impactScore: 90,
            impactReason: 'Core heritage'
          }
        ]
      }
    ];

    localStorage.setItem('tf_current_itinerary', JSON.stringify(initialItinerary));

    render(
      <TourismFlowProvider>
        <TripPlanner />
      </TourismFlowProvider>
    );

    // Open Edit Itinerary mode
    const editPlanBtn = screen.getByRole('button', { name: /Edit Itinerary/i });
    fireEvent.click(editPlanBtn);

    // Click "+ Add Location"
    const addLocBtn = screen.getByRole('button', { name: /Add Location/i });
    fireEvent.click(addLocBtn);

    // Modal should be open
    expect(screen.getByText(/Add Custom Attraction or Artisan Stop/i)).toBeInTheDocument();

    // Attempt to submit empty form
    const submitBtn = screen.getByRole('button', { name: /Add to Day 1 Itinerary/i });
    fireEvent.click(submitBtn);

    // Should display validation error
    expect(screen.getByText(/Place name is required/i)).toBeInTheDocument();
  });
});
