import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TourismInsights } from '../components/TourismInsights';
import { TourismFlowProvider } from '../context/TourismFlowContext';

describe('Tourism Insights Calculations, Influx Simulation & Destination Filtering', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders insights dashboard with default Hyderabad metrics', () => {
    render(
      <TourismFlowProvider>
        <TourismInsights />
      </TourismFlowProvider>
    );

    expect(screen.getByText(/Macro Visitor Dispersion & Economic Impact Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Charminar & Mecca Masjid Core/i)).toBeInTheDocument();
    expect(screen.getByText(/Laad Bazaar Lacquer & Zari Studios/i)).toBeInTheDocument();
  });

  it('filters data and updates zones and recommendations when destination is changed', () => {
    render(
      <TourismFlowProvider>
        <TourismInsights />
      </TourismFlowProvider>
    );

    // Destination selector
    const filterSelect = screen.getByRole('combobox');
    
    // Switch to Visakhapatnam
    fireEvent.change(filterSelect, { target: { value: 'Visakhapatnam' } });

    // Should display Vizag specific zones
    expect(screen.getByText(/RK Beach Promenade & INS Kursura/i)).toBeInTheDocument();
    expect(screen.getByText(/Etikoppaka Lacquer Toy Cooperative/i)).toBeInTheDocument();
    expect(screen.getByText(/Thotlakonda & Bavikonda Buddhist Monasteries/i)).toBeInTheDocument();

    // Switch to Jaipur
    fireEvent.change(filterSelect, { target: { value: 'Jaipur' } });
    expect(screen.getByText(/Hawa Mahal & Badi Chaupar Junction/i)).toBeInTheDocument();
    expect(screen.getByText(/Sanganer Block Print & Blue Pottery Hub/i)).toBeInTheDocument();

    // Switch to Goa
    fireEvent.change(filterSelect, { target: { value: 'Goa' } });
    expect(screen.getByText(/North Coastal Strip \(Calangute-Baga\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Fontainhas Azulejo Tile & Bakery Walk/i)).toBeInTheDocument();
  });

  it('dynamically recalculates simulated daily footfall and local economic impact when slider changes', () => {
    render(
      <TourismFlowProvider>
        <TourismInsights />
      </TourismFlowProvider>
    );

    // Influx simulation slider (50% - 250%)
    const slider = screen.getByRole('slider');
    expect(slider).toBeInTheDocument();
    expect((slider as HTMLInputElement).value).toBe('100');

    // Default Hyderabad base visitors = 18,500
    // Total spend = 18,500 * 1,950 = 36,075,000 * 2.3 = 82,972,500 (~ ₹8.30 Cr)
    expect(screen.getByText(/18,500/)).toBeInTheDocument();

    // Increase slider to 150%
    fireEvent.change(slider, { target: { value: '150' } });

    // 18,500 * 1.5 = 27,750
    expect(screen.getByText(/27,750/)).toBeInTheDocument();
  });

  it('updates congestion status tag appropriately based on influx level', () => {
    render(
      <TourismFlowProvider>
        <TourismInsights />
      </TourismFlowProvider>
    );

    const slider = screen.getByRole('slider');

    // At 100%: 38 * 1.0 = 38 (< 50 => Sustainable / Low Pressure)
    expect(screen.getByText(/Sustainable \/ Low Pressure/i)).toBeInTheDocument();

    // Move to 160%: 38 * 1.6 = ~61 (50-75 => Moderate Footfall Pressure)
    fireEvent.change(slider, { target: { value: '160' } });
    expect(screen.getByText(/Moderate Footfall Pressure/i)).toBeInTheDocument();

    // Move to 220%: 38 * 2.2 = ~84 (> 75 => High Overtourism Alert)
    fireEvent.change(slider, { target: { value: '220' } });
    expect(screen.getByText(/High Overtourism Alert/i)).toBeInTheDocument();
  });

  it('calculates small business wealth retention and crowd dispersion indices', () => {
    render(
      <TourismFlowProvider>
        <TourismInsights />
      </TourismFlowProvider>
    );

    // Small business wealth retention label
    expect(screen.getByText(/Direct Small-Business Wealth Retention/i)).toBeInTheDocument();

    // Crowd dispersion index
    expect(screen.getByText(/Crowd Dispersion Index/i)).toBeInTheDocument();
  });
});
