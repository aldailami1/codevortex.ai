import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { FloatingSupportWidget } from '@/components/FloatingSupportWidget';

describe('FloatingSupportWidget Component', () => {
  it('renders chat toggle button initially', () => {
    render(<FloatingSupportWidget language="en" />);
    const toggleBtn = screen.getByRole('button');
    expect(toggleBtn).toBeTruthy();
  });

  it('opens chat window when clicked', () => {
    render(<FloatingSupportWidget language="en" />);
    const toggleBtn = screen.getAllByRole('button')[0];
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/CloudForge Support/i)).toBeTruthy();
  });
});
