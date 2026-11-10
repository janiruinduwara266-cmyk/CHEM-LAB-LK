import type { Language } from '../types/lab';

interface FooterBarProps {
  lang: Language;
  className?: string;
}

export function FooterBar({ lang, className = '' }: FooterBarProps) {
  return (
    <footer
      className={`w-full py-1.5 px-4 text-center text-[11px] sm:text-xs text-[#EADAC2]/90 bg-[#1B110A]/90 border-t border-[#8B5E2E]/40 select-none ${className}`}
    >
      <span>
        © 2026 All Rights Reserved by <strong className="text-[#F8C872] font-semibold">Janiru Induwara</strong>
      </span>
      <span className="mx-2 text-[#A8733B]" aria-hidden="true">
        ·
      </span>
      <span className="text-[#D4BFA2]">
        {lang === 'si'
          ? 'ශ්‍රී ලංකා උසස් පෙළ රසායන විද්‍යාව (01 පාඩම)'
          : 'G.C.E. A/L Chemistry Unit 01 Virtual Lab'}
      </span>
    </footer>
  );
}
