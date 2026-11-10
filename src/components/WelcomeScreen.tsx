import { Atom, ArrowRight, Globe } from 'lucide-react';
import { ASSET_PATHS } from '../data/curriculum';
import { FooterBar } from './FooterBar';
import type { Language } from '../types/lab';

interface WelcomeScreenProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  onEnterLab: () => void;
  onDirectSandbox: () => void;
}

export function WelcomeScreen({
  lang,
  onChangeLang,
  onEnterLab,
  onDirectSandbox,
}: WelcomeScreenProps) {
  return (
    <div className="relative w-full min-h-screen flex flex-col bg-[#160F0A] overflow-hidden">
      {/* Main Full-Bleed Fantasy Chemistry Academy Artwork */}
      <div className="relative flex-1 flex items-center justify-center lg:justify-end p-4 sm:p-8 lg:pr-16">
        <img
          src={ASSET_PATHS.welcomeBackdrop}
          alt="ChemLab LK Floating Chemistry Academy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Gentle contrast scrim so right card & left foreground stay crisp */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-black/25 to-black/65" />

        {/* Right-side AP LAB inspired Warm Oak & Brass Welcome Card */}
        <div className="relative z-10 w-full max-w-[440px] wood-panel rounded-2xl p-6 sm:p-8 text-center flex flex-col items-center">
          {/* Top Circular Crest */}
          <div className="w-16 h-16 rounded-full bg-[#FBF5EA] border-2 border-[#C88A3B] shadow-lg flex items-center justify-center mb-4">
            <Atom className="w-9 h-9 text-[#1D3557]" strokeWidth={2.2} />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-wide text-[#FFF7E6]">
            CHEM LAB
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm font-semibold tracking-[0.2em] text-[#F5C56B] uppercase">
            {lang === 'si'
              ? 'A/L CHEMISTRY PRACTICALS · 01 පාඩම'
              : 'A/L CHEMISTRY PRACTICALS · UNIT 01'}
          </p>

          <p className="mt-4 text-sm text-[#EADAC2] leading-relaxed max-w-sm">
            {lang === 'si'
              ? 'උපකරණ නොමැති පාසල් සිසුන් වෙනුවෙන්ම සැකසූ සැබෑ ත්‍රිමාණ (3D) රසායන විද්‍යාගාරය — කැතෝඩ කිරණ නළ, තොම්සන්, කැනල් කිරණ, මිලිකන් හා රදර්ෆර්ඩ් පරීක්ෂණ.'
              : 'Interactive 3D virtual laboratory for Sri Lankan A/L students — explore Cathode Ray Tubes, Thomson e/m, Canal Rays, Millikan Oil Drop, and Rutherford Gold Foil.'}
          </p>

          {/* Language Switcher */}
          <div className="mt-5 inline-flex items-center gap-1 p-1 rounded-lg bg-[#20130B] border border-[#8E6234]">
            <span className="px-2 text-[#D4BFA2]" aria-hidden="true">
              <Globe className="w-3.5 h-3.5" />
            </span>
            <button
              type="button"
              onClick={() => onChangeLang('si')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lang === 'si'
                  ? 'bg-[#F38B21] text-[#1A0E06]'
                  : 'text-[#EADAC2] hover:text-white'
              }`}
            >
              සිංහල
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                lang === 'en'
                  ? 'bg-[#F38B21] text-[#1A0E06]'
                  : 'text-[#EADAC2] hover:text-white'
              }`}
            >
              English
            </button>
          </div>

          {/* Primary Glossy Amber CTA */}
          <button
            type="button"
            onClick={onEnterLab}
            className="mt-6 w-full amber-cta rounded-xl py-3.5 px-6 text-base font-bold text-[#1E1005] flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-[0.98]"
          >
            <span className="whitespace-nowrap">
              {lang === 'si' ? 'විද්‍යාගාරයට පිවිසෙන්න' : 'Enter Chemistry Lab'}
            </span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Secondary Quick Launch Straight to 3D Workbench */}
          <button
            type="button"
            onClick={onDirectSandbox}
            className="mt-3 text-xs sm:text-sm font-medium text-[#F5C56B] hover:text-[#FFE1A8] underline underline-offset-4 cursor-pointer"
          >
            {lang === 'si'
              ? 'සෘජුවම කැතෝඩ කිරණ 3D මේසයට යන්න →'
              : 'Jump straight to Cathode Ray 3D Bench →'}
          </button>

          {/* Requested Designer Credit inside Welcome Card */}
          <div className="mt-6 pt-4 w-full border-t border-[#8E6234]/45 text-xs text-[#D8C3A5]">
            <span className="font-medium">Design by </span>
            <strong className="text-[#FFD98E] font-semibold">Janiru Induwara</strong>
            <span className="mx-1.5 text-[#8E6234]" aria-hidden="true">
              ·
            </span>
            <span>Unit 01 Atomic Structure</span>
          </div>
        </div>
      </div>

      <FooterBar lang={lang} />
    </div>
  );
}
