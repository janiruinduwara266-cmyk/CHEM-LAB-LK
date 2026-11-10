import { BookOpen, FlaskConical, Play, RotateCcw, X } from 'lucide-react';
import { ASSET_PATHS, EXPERIMENT_ORDER, EXPERIMENTS } from '../data/curriculum';
import type { CathodeMetal, FoilMaterial, GasType, LabSimulationParams, Language } from '../types/lab';

interface WelcomeTourModalProps {
  open: boolean;
  tourPage: number;
  lang: Language;
  onChangePage: (page: number) => void;
  onClose: () => void;
}

export function WelcomeTourModal({
  open,
  tourPage,
  lang,
  onChangePage,
  onClose,
}: WelcomeTourModalProps) {
  if (!open) return null;

  const pages = [
    {
      title: lang === 'si' ? 'විද්‍යාගාරයට සාදරයෙන් පිළිගනිමු!' : 'Welcome to the 3D Chemistry Lab!',
      body:
        lang === 'si'
          ? 'ආයුබෝවන්! මම ඔබේ රසායන විද්‍යාගාර සහායකයා. උසස් පෙළ 01 වන පාඩමේ (පරමාණුක ව්‍යුහය) කැතෝඩ කිරණ නළ, තොම්සන්, කැනල් කිරණ, මිලිකන් සහ රදර්ෆර්ඩ් පරීක්ෂණ සැබෑ උපකරණවලින් මෙන් මෙහිදී සිදු කරමු.'
          : 'Ayubowan! Welcome to your interactive 3D A/L Chemistry Lab. Assemble real glass discharge tubes, Thomson coils, Millikan oil-drop chambers, and Rutherford’s gold foil setup right on your workbench.',
    },
    {
      title: lang === 'si' ? 'උපකරණ පෙට්ටිය (Toolbox)' : 'Equipment Toolbox',
      body:
        lang === 'si'
          ? 'වම් පස ඇති උපකරණ පෙට්ටියෙන් එක් එක් කොටස මේසය මතට ගෙන තබන්න. ඕනෑම උපකරණයක 🔍 අයිකනය ඔබා එහි කාර්යය කියවිය හැකිය.'
          : 'Click or drag apparatus pieces from the left Toolbox onto the glowing bench markers. You can inspect each instrument with the magnifying glass icon anytime.',
    },
    {
      title: lang === 'si' ? 'සජීවී 3D දර්ශනය හා අඳුරු කාමරය' : 'Interactive 3D View & Darkroom',
      body:
        lang === 'si'
          ? 'මවුසයෙන් මේසය වටේ කරකවා බලන්න. පහළ පාලක පුවරුවෙන් "Darkroom" ON කළ විට කැතෝඩ කිරණ හා ZnS ප්‍රතිදීප්තිය සැබෑ විද්‍යාගාරයක මෙන් දීප්තිමත්ව පෙනේ!'
          : 'Orbit and zoom around the 3D bench freely. Switch on Darkroom mode in the bottom bar to see glowing gas discharges, cathode rays, and ZnS fluorescence vividly!',
    },
  ];

  const current = pages[tourPage] || pages[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Lab Assistant Welcome Tour"
    >
      <div className="relative w-full max-w-[660px] wood-panel rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Tour"
          className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#C93B32] hover:bg-[#DC2626] text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Lab Assistant Character */}
        <div className="shrink-0 flex flex-col items-center">
          <img
            src={ASSET_PATHS.assistantAvatar}
            alt="Chemistry Lab Assistant"
            referrerPolicy="no-referrer"
            className="w-36 h-48 sm:w-44 sm:h-56 rounded-xl object-cover object-top border border-[#A8733B]/60 shadow-lg"
          />
          <div className="mt-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onChangePage(0)}
              aria-label="Restart Tour"
              className="w-7 h-7 rounded-full bg-[#4E3422] border border-[#A8733B] text-[#F5C56B] flex items-center justify-center cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Text & Pagination */}
        <div className="flex-1 flex flex-col">
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#FFE5AD] text-center sm:text-left">
            {current.title}
          </h2>
          <div className="flex items-center justify-center sm:justify-start gap-2 my-2 text-[#A8733B]">
            <span className="h-[1px] flex-1 bg-[#8E6234]/50" />
            <FlaskConical className="w-4 h-4 text-[#F5C56B]" />
            <span className="h-[1px] flex-1 bg-[#8E6234]/50" />
          </div>

          <div className="rounded-xl bg-[#24160D] border border-[#7C5229] p-4 text-xs sm:text-sm text-[#F5E8D5] leading-relaxed min-h-[125px]">
            {current.body}
          </div>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {pages.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onChangePage(idx)}
                  aria-label={`Tour step ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-colors ${
                    idx === tourPage ? 'bg-[#4ADE80]' : 'bg-[#6F533B]'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs font-semibold text-[#D4BFA2] hover:text-white cursor-pointer"
              >
                {lang === 'si' ? 'මඟ හරින්න' : 'Skip'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (tourPage < pages.length - 1) onChangePage(tourPage + 1);
                  else onClose();
                }}
                className="amber-cta px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#1E1005] cursor-pointer"
              >
                {tourPage < pages.length - 1
                  ? 'NEXT >'
                  : lang === 'si'
                    ? 'ආරම්භ කරන්න >'
                    : 'START LAB >'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ApparatusConfigModalProps {
  open: boolean;
  lang: Language;
  params: LabSimulationParams;
  onUpdateParams: (patch: Partial<LabSimulationParams>) => void;
  onClose: () => void;
}

export function ApparatusConfigModal({
  open,
  lang,
  params,
  onUpdateParams,
  onClose,
}: ApparatusConfigModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Configure Apparatus"
    >
      <div className="relative w-full max-w-[440px] wood-panel rounded-2xl p-6 text-center">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Config"
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-[#4E3422] text-[#EADAC2] flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="font-display text-xl font-bold text-[#FFE5AD]">
          {lang === 'si' ? 'ඔබේ උපකරණ සැකසුම තෝරන්න' : 'Configure Your Apparatus'}
        </h2>

        {(params.experimentId === 'cathode-tube' || params.experimentId === 'thomson-canal') && (
          <div className="mt-4 space-y-4 text-left">
            <div>
              <div className="text-xs font-semibold text-[#F5C56B] mb-2">
                {lang === 'si' ? 'නළය තුළ වායුව' : 'Residual Gas Inside Tube'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {(['air', 'hydrogen', 'neon', 'argon'] as GasType[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => onUpdateParams({ gas: g })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border capitalize cursor-pointer ${
                      params.gas === g
                        ? 'bg-[#F5C56B] text-[#1A0E06] border-[#FFF3D1]'
                        : 'bg-[#26170D] text-[#EADAC2] border-[#78512A]'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#F5C56B] mb-2">
                {lang === 'si' ? 'කැතෝඩ ලෝහය' : 'Cathode Electrode Metal'}
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['copper', 'aluminum', 'platinum'] as CathodeMetal[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onUpdateParams({ cathodeMetal: m })}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border capitalize cursor-pointer ${
                      params.cathodeMetal === m
                        ? 'bg-[#F5C56B] text-[#1A0E06] border-[#FFF3D1]'
                        : 'bg-[#26170D] text-[#EADAC2] border-[#78512A]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {params.experimentId === 'rutherford' && (
          <div className="mt-4 text-left">
            <div className="text-xs font-semibold text-[#F5C56B] mb-2">
              {lang === 'si' ? 'ලෝහ පත්‍රය තෝරන්න' : 'Target Metal Foil'}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['gold', 'aluminum'] as FoilMaterial[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => onUpdateParams({ foilMaterial: f })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border capitalize cursor-pointer ${
                    params.foilMaterial === f
                      ? 'bg-[#F5C56B] text-[#1A0E06] border-[#FFF3D1]'
                      : 'bg-[#26170D] text-[#EADAC2] border-[#78512A]'
                  }`}
                >
                  {f === 'gold' ? 'Gold (Au, Z=79)' : 'Aluminum (Al, Z=13)'}
                </button>
              ))}
            </div>
          </div>
        )}

        {params.experimentId === 'millikan' && (
          <div className="mt-4 text-left">
            <div className="text-xs font-semibold text-[#F5C56B] mb-2">
              {lang === 'si' ? 'තෙල් බිංදුවේ ආරෝපණය (q = ne)' : 'Target Droplet Charge (q = ne)'}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => onUpdateParams({ dropletChargeN: n })}
                  className={`py-2 rounded-xl text-xs font-bold border cursor-pointer ${
                    params.dropletChargeN === n
                      ? 'bg-[#F5C56B] text-[#1A0E06] border-[#FFF3D1]'
                      : 'bg-[#26170D] text-[#EADAC2] border-[#78512A]'
                  }`}
                >
                  {n}e
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full amber-cta py-3 rounded-xl text-sm font-bold text-[#1E1005] flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="w-4 h-4" />
          <span>{lang === 'si' ? 'පටන් ගන්න >' : 'Start Practical >'}</span>
        </button>
      </div>
    </div>
  );
}

interface LabNotebookModalProps {
  open: boolean;
  lang: Language;
  onClose: () => void;
}

export function LabNotebookModal({ open, lang, onClose }: LabNotebookModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Unit 1 Lab Theory Notebook"
    >
      <div className="relative w-full max-w-3xl parchment-panel rounded-2xl p-6 sm:p-8 text-[#2B1B12] max-h-[88vh] overflow-y-auto lab-scroll">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close Notebook"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#7F1D1D] text-white flex items-center justify-center cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <BookOpen className="w-6 h-6 text-[#7F1D1D]" />
          <h2 className="font-display text-2xl font-bold text-[#7F1D1D]">
            {lang === 'si'
              ? 'විද්‍යාගාර සටහන් පොත — 01 පාඩම (මුල් කොටස්)'
              : 'A/L Chemistry Unit 01 Notebook (Early Experiments)'}
          </h2>
        </div>
        <p className="text-xs text-[#5C4430] mb-5">
          {lang === 'si'
            ? 'හයිඩ්‍රජන් වර්ණාවලියට පෙර ඇති සියලුම උප-පරමාණුක අංශු සොයාගැනීමේ පරීක්ෂණ සාරාංශය'
            : 'Complete exam-ready summary of subatomic particle discovery experiments prior to Hydrogen Spectrum'}
        </p>

        <div className="space-y-4">
          {EXPERIMENT_ORDER.map((id) => {
            const exp = EXPERIMENTS[id];
            return (
              <div
                key={id}
                className="rounded-xl bg-white/90 border border-[#D4C3A3] p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-[#7F1D1D]">
                    {exp.number}. {exp.shortTitle[lang]}
                  </h3>
                  <span className="text-xs font-semibold text-[#6B5B4A]">
                    {exp.notebookSummary.scientist[lang]} ({exp.notebookSummary.year})
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-[#332419] list-disc pl-4">
                  {exp.notebookSummary.keyFindings.map((f, idx) => (
                    <li key={idx}>{f[lang]}</li>
                  ))}
                </ul>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {exp.notebookSummary.equations.map((eq, idx) => (
                    <code
                      key={idx}
                      className="px-2.5 py-1 rounded bg-[#F5EFE2] border border-[#D6C6A8] text-[11px] font-mono-tabular text-[#1E293B]"
                    >
                      {eq}
                    </code>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
