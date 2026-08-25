import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AcademyLearningCenter } from '@/components/AcademyLearningCenter';

describe('AcademyLearningCenter', () => {
  it('renders the three engineering paths and student dashboard', () => {
    render(<AcademyLearningCenter language="en" onOpenWorkspace={vi.fn()} />);

    expect(screen.getByText('Full-Stack AI Cloud Architecture')).toBeTruthy();
    expect(screen.getByText('Supabase & Database Engineering')).toBeTruthy();
    expect(screen.getByText('Agentic AI & Automation Workflows')).toBeTruthy();
    expect(screen.getByText('Student dashboard')).toBeTruthy();
    expect(screen.getByText('Interactive code sandbox')).toBeTruthy();
  });

  it('evaluates the safe starter exercise before completion', () => {
    render(<AcademyLearningCenter language="en" onOpenWorkspace={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: 'Run evaluation' }));
    expect(screen.getByText(/Passed:/)).toBeTruthy();
  });
});
