'use client';

import React from 'react';
import { Language } from '@/types';
import { AcademyLearningCenter } from './AcademyLearningCenter';

interface AcademyPageProps {
  language: Language;
  onOpenWorkspace: (initialCode?: string) => void;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ language, onOpenWorkspace }) => (
  <AcademyLearningCenter language={language} onOpenWorkspace={onOpenWorkspace} />
);
