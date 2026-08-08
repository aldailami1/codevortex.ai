import React from 'react';
import { Language } from './types';
import { Terminal, Shield, Cpu, Heart } from 'lucide-react';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const isAr = language === 'ar';

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-4 px-6 shrink-0 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand Info */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Terminal className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-white tracking-wide">
            CloudForge<span className="text-cyan-400">.ai</span>
          </span>
          <span className="text-slate-600 font-mono">|</span>
          <span className="text-slate-500 text-[11px]">
            {isAr ? 'الجيل القادم لتطوير البرمجيات' : 'Next-Gen Cloud IDE'}
          </span>
        </div>

        {/* Badges / Tech Status */}
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>AI Engine: Active</span>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Secure Environment</span>
          </div>
        </div>

        {/* Rights Notice */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} CloudForge.</span>
          <span>{isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}</span>
        </div>
      </div>
    </footer>
  );
};
