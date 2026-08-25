import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Marketplace } from '@/components/Marketplace';

describe('Marketplace', () => {
  it('shows the expanded global catalog and filters by category', () => {
    render(<Marketplace language="en" onImportTemplate={vi.fn()} />);

    expect(screen.getByText('20+')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Websites' }));
    expect(screen.getByText('Global Corporate System')).toBeTruthy();
    expect(screen.queryByText('Retail Commerce Core')).toBeNull();
  });

  it('installs a catalog item into the workspace callback', () => {
    const onImportTemplate = vi.fn();
    render(<Marketplace language="en" onImportTemplate={onImportTemplate} />);

    fireEvent.click(screen.getByRole('button', { name: 'Install Global Corporate System' }));
    expect(onImportTemplate).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Installed')).toBeTruthy();
  });
});
