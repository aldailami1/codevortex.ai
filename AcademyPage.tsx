import React from 'react';
import { Language } from '../types';
import { AcademyModule } from './AcademyModule';

interface AcademyPageProps {
  language: Language;
  onOpenWorkspace: (initialCode?: string) => void;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ language, onOpenWorkspace }) => {
  return <AcademyModule language={language} onOpenWorkspace={onOpenWorkspace} />;
};
