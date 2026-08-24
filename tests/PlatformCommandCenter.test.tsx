import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PlatformCommandCenter } from '@/components/PlatformCommandCenter';
import type { Project } from '@/types';

const project: Project = {
  id: 'project-test',
  name: 'CloudForge Demo',
  description: 'Test project',
  language: 'en',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  files: [{ path: 'index.html', content: '<main />' }],
};

describe('PlatformCommandCenter', () => {
  it('renders the control plane and switches to the cyber-shield module', () => {
    render(
      <PlatformCommandCenter
        language="en"
        project={project}
        onSelectView={vi.fn()}
        onOpenWorkspace={vi.fn()}
        onOpenDeploy={vi.fn()}
      />
    );

    expect(screen.getByText('Sovereign Cloud Command Center')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Cyber-shield/i }));
    expect(screen.getByText('Protect external sites and apps')).toBeTruthy();
    expect(screen.getByText(/No external change is made/i)).toBeTruthy();
  });

  it('adds a draft campaign and keeps the visible limit at ten', () => {
    render(
      <PlatformCommandCenter
        language="en"
        project={project}
        onSelectView={vi.fn()}
        onOpenWorkspace={vi.fn()}
        onOpenDeploy={vi.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Ad studio/i }));
    fireEvent.change(screen.getByPlaceholderText('New campaign name'), { target: { value: 'Edge launch' } });
    fireEvent.click(screen.getByRole('button', { name: /Add campaign/i }));

    expect(screen.getByText('Edge launch')).toBeTruthy();
    expect(screen.getByText('3 / 10')).toBeTruthy();
  });
});
