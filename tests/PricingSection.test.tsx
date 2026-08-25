import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PricingSection } from '@/components/PricingSection';

describe('PricingSection', () => {
  it('shows the global plan ladder and annual/monthly pricing switch', () => {
    render(<PricingSection language="en" onSelectView={vi.fn()} />);

    expect(screen.getByText('Hobby / Free Plan')).toBeTruthy();
    expect(screen.getByText('Pro Developer Plan')).toBeTruthy();
    expect(screen.getByText('Ad-Engine Tier')).toBeTruthy();
    expect(screen.getByText('Standalone Ad Packs')).toBeTruthy();

    fireEvent.click(screen.getByText('Monthly Billing'));
    expect(screen.getByText('$20')).toBeTruthy();
  });
});
