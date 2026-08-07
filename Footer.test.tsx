import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Footer } from '../components/Footer';
import { Language, ViewMode } from '../types';

describe('Footer Component', () => {
  it('renders correctly in Arabic', () => {
    const handleSelectView = vi.fn();
    render(<Footer language="ar" onSelectView={handleSelectView} />);

    expect(screen.getAllByText(/CodeVortex/i)).toBeTruthy();
  });

  it('triggers view navigation when links are clicked', () => {
    const handleSelectView = vi.fn();
    render(<Footer language="en" onSelectView={handleSelectView} />);

    const supportLink = screen.getByText(/Help Center/i);
    fireEvent.click(supportLink);

    expect(handleSelectView).toHaveBeenCalledWith('support');
  });
});
