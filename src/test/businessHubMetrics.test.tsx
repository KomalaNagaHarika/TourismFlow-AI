import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { BusinessHub } from '../components/BusinessHub';
import { TourismFlowProvider, useTourismFlow } from '../context/TourismFlowContext';
import { DEMO_LOCAL_BUSINESSES, HYDERABAD_ATTRACTIONS } from '../data/hyderabadData';

// Helper component to trigger prototype interactions and inspect events
const InteractionTrigger: React.FC = () => {
  const { logEvent, activeBusinessId } = useTourismFlow();
  return (
    <div data-testid="interaction-controls">
      <button 
        data-testid="trigger-view-btn"
        onClick={() => logEvent('view', 'Crafts', activeBusinessId, 'Test Business View')}
      >
        Trigger View
      </button>
      <button 
        data-testid="trigger-save-btn"
        onClick={() => logEvent('save', 'Crafts', activeBusinessId, 'Test Business Save')}
      >
        Trigger Save
      </button>
      <button 
        data-testid="trigger-trip-add-btn"
        onClick={() => logEvent('trip_add', 'Crafts', activeBusinessId, 'Test Business Trip Add')}
      >
        Trigger Trip Add
      </button>
    </div>
  );
};

describe('Business Hub Metrics & Real-time Prototype Interactions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders active business profile and displays initial baseline metrics', () => {
    render(
      <TourismFlowProvider>
        <BusinessHub />
      </TourismFlowProvider>
    );

    // Business profile title
    expect(screen.getByText(/Local Business & Artisan Hub/i)).toBeInTheDocument();
    
    // First business is typically Haji Lacquer Bangles
    const firstBiz = DEMO_LOCAL_BUSINESSES[0];
    expect(screen.getAllByText(new RegExp(firstBiz.name, 'i')).length).toBeGreaterThan(0);

    // Check performance overview metrics container
    expect(screen.getByText(/Profile Views/i)).toBeInTheDocument();
    expect(screen.getByText(/Itinerary Saves/i)).toBeInTheDocument();
    expect(screen.getByText(/Trip Additions/i)).toBeInTheDocument();
    expect(screen.getByText(/Listing Clicks/i)).toBeInTheDocument();
  });

  it('allows switching between different registered businesses', () => {
    render(
      <TourismFlowProvider>
        <BusinessHub />
      </TourismFlowProvider>
    );

    // Find the business selector
    const selector = screen.getByRole('combobox');
    expect(selector).toBeInTheDocument();

    // Switch to Nimrah Café
    const nimrahBiz = DEMO_LOCAL_BUSINESSES.find(b => b.name.includes('Nimrah'))!;
    fireEvent.change(selector, { target: { value: nimrahBiz.id } });

    // Verify Nimrah Café details are now shown
    expect(screen.getAllByText(new RegExp(nimrahBiz.name, 'i')).length).toBeGreaterThan(0);
    expect(screen.getAllByText(new RegExp(nimrahBiz.location, 'i')).length).toBeGreaterThan(0);
  });

  it('updates profile views in real time when prototype triggers a view event', () => {
    render(
      <TourismFlowProvider>
        <BusinessHub />
        <InteractionTrigger />
      </TourismFlowProvider>
    );

    // Find views metric value element
    const viewsLabel = screen.getByText('Profile Views');
    const viewsContainer = viewsLabel.closest('div');
    const initialViews = Number(viewsContainer?.querySelector('.text-2xl')?.textContent || 0);

    // Trigger view event
    const triggerViewBtn = screen.getByTestId('trigger-view-btn');
    fireEvent.click(triggerViewBtn);

    // Metrics should have incremented
    const updatedViews = Number(viewsContainer?.querySelector('.text-2xl')?.textContent || 0);
    expect(updatedViews).toBe(initialViews + 1);
  });

  it('updates saves and trip additions in real time when prototype triggers save or trip_add', () => {
    render(
      <TourismFlowProvider>
        <BusinessHub />
        <InteractionTrigger />
      </TourismFlowProvider>
    );

    const savesLabel = screen.getByText('Itinerary Saves');
    const savesContainer = savesLabel.closest('div');
    const initialSaves = Number(savesContainer?.querySelector('.text-2xl')?.textContent || 0);

    // Trigger save
    fireEvent.click(screen.getByTestId('trigger-save-btn'));
    const updatedSaves = Number(savesContainer?.querySelector('.text-2xl')?.textContent || 0);
    expect(updatedSaves).toBe(initialSaves + 1);

    // Trigger trip addition
    const tripAddLabel = screen.getByText('Trip Additions');
    const tripAddContainer = tripAddLabel.closest('div');
    const initialTripAdds = Number(tripAddContainer?.querySelector('.text-2xl')?.textContent || 0);

    fireEvent.click(screen.getByTestId('trigger-trip-add-btn'));
    const updatedTripAdds = Number(tripAddContainer?.querySelector('.text-2xl')?.textContent || 0);
    expect(updatedTripAdds).toBe(initialTripAdds + 1);
  });

  it('allows opening the listing editor, editing business details, previewing, and saving', () => {
    render(
      <TourismFlowProvider>
        <BusinessHub />
      </TourismFlowProvider>
    );

    // Click "Edit Listing" button
    const editListingBtn = screen.getByRole('button', { name: /Edit Listing/i });
    fireEvent.click(editListingBtn);

    // Form inputs should now be visible
    const descInput = screen.getByPlaceholderText(/Summarize your heritage story/i);
    expect(descInput).toBeInTheDocument();

    fireEvent.change(descInput, { 
      target: { value: 'Updated Master Artisan workshop with 4 generations of handmade lacquer bangles.' } 
    });

    // Price range input
    const priceInput = screen.getByPlaceholderText(/e\.g\. ₹200 – ₹800/i);
    fireEvent.change(priceInput, { target: { value: '₹350 – ₹1200' } });

    // Click Preview Changes
    const previewBtn = screen.getByRole('button', { name: /Preview Changes/i });
    fireEvent.click(previewBtn);

    // Preview modal should appear
    expect(screen.getByText(/Preview Tourist-Facing Listing/i)).toBeInTheDocument();
    expect(screen.getByText(/Updated Master Artisan workshop/i)).toBeInTheDocument();

    // Click Save Listing from preview modal
    const saveListingBtn = screen.getByRole('button', { name: /Save Listing/i });
    fireEvent.click(saveListingBtn);

    // Should show success toast
    expect(screen.getByText(/Listing details updated successfully/i)).toBeInTheDocument();
  });

  it('displays grounded AI Business Advisor recommendations tailored to category', () => {
    render(
      <TourismFlowProvider>
        <BusinessHub />
      </TourismFlowProvider>
    );

    // Advisor card
    expect(screen.getByText(/AI Business Growth Advisor/i)).toBeInTheDocument();

    // Check for presence of category-specific recommendations
    const adviceElements = screen.getAllByText(/(Pricing Transparency|Cultural Storytelling|Experience Package|Heritage Proof|Family Combo|Menu & Packaging)/i);
    expect(adviceElements.length).toBeGreaterThan(0);
  });
});
