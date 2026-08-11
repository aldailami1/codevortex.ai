import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from '@/components/Header';
import type { Project, ViewMode, Language } from '@/types';

const mockProject: Project = {
  id: 'proj_1',
  name: 'Test Application',
  description: 'Test Description',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  language: 'en',
  isRTL: false,
  files: [
    {
      path: '/src/App.tsx',
      content: 'console.log("hello")',
      language: 'typescript',
    },
  ],
};

describe('Header Component', () => {
  it('renders platform brand and view options', () => {
    const handleSelectView = vi.fn();
    const handleUpdateProjectName = vi.fn();

    render(
      <Header
        currentProject={mockProject}
        onUpdateProjectName={handleUpdateProjectName}
        activeView="landing"
        onSelectView={handleSelectView}
        language="en"
        onToggleLanguage={vi.fn()}
        onOpenProjectsDrawer={vi.fn()}
        onOpenDeployModal={vi.fn()}
        onExportZip={vi.fn()}
        onOpenCommandPalette={vi.fn()}
      />
    );

    expect(screen.getAllByText('CloudForge')).toBeTruthy();
  });

  it('allows changing language when language button clicked', () => {
    const handleToggleLanguage = vi.fn();

    render(
      <Header
        currentProject={mockProject}
        onUpdateProjectName={vi.fn()}
        activeView="landing"
        onSelectView={vi.fn()}
        language="en"
        onToggleLanguage={handleToggleLanguage}
        onOpenProjectsDrawer={vi.fn()}
        onOpenDeployModal={vi.fn()}
        onExportZip={vi.fn()}
        onOpenCommandPalette={vi.fn()}
      />
    );

    // Find and click the language selector button
    const langButton = screen.getAllByTitle(/Change Language/i)[0] || screen.getByText(/EN/i);
    fireEvent.click(langButton);

    // Click on another language, e.g. Arabic or Spanish
    const arOption = screen.getByText(/العربية/i);
    fireEvent.click(arOption);

    expect(handleToggleLanguage).toHaveBeenCalledWith('ar');
  });
});
