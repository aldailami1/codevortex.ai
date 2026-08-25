import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Certificate } from '@/components/Certificate';

describe('Certificate', () => {
  it('renders the international credential layout and verification QR', () => {
    render(<Certificate certificate={{ id: 'cert-1', courseId: 'track-1', courseTitleEn: 'Full-Stack AI Cloud Architecture', courseTitleAr: 'معمارية السحابة والذكاء الاصطناعي', studentName: 'Amin Cloud', issueDate: 'August 25, 2026', score: 96, verificationCode: 'CF-8890-X26' }} isArabic={false} />);

    expect(screen.getByText('CERTIFICATE OF PROFICIENCY & COMPLETION')).toBeTruthy();
    expect(screen.getByText('Certified Cloud Automation & Full-Stack AI Engineer')).toBeTruthy();
    expect(screen.getByText('CF-8890-X26')).toBeTruthy();
    expect(screen.getByAltText('Certificate verification QR code')).toBeTruthy();
  });
});
