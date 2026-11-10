import { useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Layers, Search } from 'lucide-react';
import type { EquipmentItem, Language } from '../types/lab';

interface ToolboxPanelProps {
  lang: Language;
  equipment: EquipmentItem[];
  placedIds: Set<string>;
  collapsed: boolean;
  highlightPulse: boolean;
  onToggleCollapse: () => void;
  onPlaceItem: (id: string) => void;
  onPlaceAll: () => void;
}

function EquipmentGlyph({ type }: { type: EquipmentItem['iconType'] }) {
  switch (type) {
    case 'coil':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#F5C56B]">
          <rect x="6" y="24" width="36" height="6" rx="2" fill="#78350F" />
          <rect x="12" y="12" width="24" height="12" rx="3" fill="currentColor" />
          <circle cx="20" cy="6" r="2.5" fill="#7DD3FC" />
          <circle cx="28" cy="6" r="2.5" fill="#7DD3FC" />
        </svg>
      );
    case 'tube':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#A5F3FC]">
          <rect x="4" y="14" width="26" height="8" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M30 14 L43 9 L43 27 L30 22" fill="none" stroke="currentColor" strokeWidth="2" />
          <line x1="8" y1="18" x2="39" y2="18" stroke="#4ADE80" strokeWidth="2" />
        </svg>
      );
    case 'pump':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#CBD5E1]">
          <circle cx="16" cy="20" r="8" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="32" cy="14" r="6" fill="#F8FAFC" stroke="#D97706" strokeWidth="2" />
          <line x1="32" y1="14" x2="35" y2="11" stroke="#DC2626" strokeWidth="2" />
        </svg>
      );
    case 'cross':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#E2E8F0]">
          <path d="M22 16 L18 6 L24 9 L30 6 L26 16 L36 12 L33 18 L36 24 L26 20 L30 30 L24 27 L18 30 L22 20 L12 24 L15 18 L12 12 Z" fill="currentColor" />
        </svg>
      );
    case 'magnet':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8">
          <path d="M14 8 V20 A10 10 0 0 0 34 20 V8" fill="none" stroke="#94A3B8" strokeWidth="6" />
          <rect x="11" y="6" width="6" height="8" fill="#EF4444" />
          <rect x="31" y="6" width="6" height="8" fill="#3B82F6" />
        </svg>
      );
    case 'plates':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#FBBF24]">
          <rect x="10" y="10" width="28" height="3" fill="currentColor" />
          <rect x="10" y="23" width="28" height="3" fill="currentColor" />
          <path d="M6 18 H42" stroke="#4ADE80" strokeWidth="2" strokeDasharray="3 2" />
        </svg>
      );
    case 'coils':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#EA580C]">
          <circle cx="19" cy="18" r="10" fill="none" stroke="currentColor" strokeWidth="3.5" />
          <circle cx="29" cy="18" r="10" fill="none" stroke="#F59E0B" strokeWidth="3.5" />
        </svg>
      );
    case 'gas':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#38BDF8]">
          <rect x="12" y="10" width="8" height="20" rx="3" fill="currentColor" />
          <rect x="26" y="10" width="8" height="20" rx="3" fill="#F472B6" />
          <rect x="14" y="6" width="4" height="4" fill="#FCD34D" />
          <rect x="28" y="6" width="4" height="4" fill="#FCD34D" />
        </svg>
      );
    case 'chamber':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#D97706]">
          <rect x="12" y="8" width="24" height="22" rx="4" fill="currentColor" />
          <circle cx="24" cy="19" r="5" fill="#0F172A" stroke="#FDE047" strokeWidth="1.5" />
        </svg>
      );
    case 'atomizer':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8">
          <ellipse cx="14" cy="20" rx="8" ry="6" fill="#DC2626" />
          <path d="M22 18 H38" stroke="#D4A448" strokeWidth="3" />
          <circle cx="42" cy="18" r="2" fill="#FDE047" />
        </svg>
      );
    case 'xray':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#38BDF8]">
          <rect x="8" y="13" width="20" height="10" rx="4" fill="none" stroke="#CBD5E1" strokeWidth="2" />
          <path d="M28 18 L42 13 M28 18 L42 18 M28 18 L42 23" stroke="currentColor" strokeWidth="2" />
        </svg>
      );
    case 'microscope':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#E2E8F0]">
          <path d="M16 28 H34 M24 28 V14 L32 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 'source':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#64748B]">
          <rect x="10" y="10" width="20" height="18" rx="2" fill="currentColor" />
          <path d="M30 19 H44" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="3 2" />
        </svg>
      );
    case 'foil':
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#FACC15]">
          <circle cx="24" cy="18" r="10" fill="none" stroke="#D4A448" strokeWidth="2.5" />
          <rect x="22" y="10" width="4" height="16" fill="currentColor" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 48 36" className="w-10 h-8 text-[#4ADE80]">
          <path d="M14 8 A14 14 0 1 1 14 28" fill="none" stroke="currentColor" strokeWidth="3.5" />
        </svg>
      );
  }
}

export function ToolboxPanel({
  lang,
  equipment,
  placedIds,
  collapsed,
  highlightPulse,
  onToggleCollapse,
  onPlaceItem,
  onPlaceAll,
}: ToolboxPanelProps) {
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const placedCount = equipment.filter((e) => placedIds.has(e.id)).length;
  const allPlaced = placedCount === equipment.length;

  const inspectedItem = equipment.find((e) => e.id === inspectedId) || null;

  return (
    <div className="relative z-20 flex items-start pointer-events-auto">
      {!collapsed && (
        <aside
          aria-label={lang === 'si' ? 'උපකරණ පෙට්ටිය' : 'Equipment Toolbox'}
          className={`w-[238px] sm:w-[252px] wood-panel rounded-2xl p-3.5 transition-all ${
            highlightPulse ? 'ring-4 ring-[#FACC15]' : ''
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h2 className="font-display text-sm font-bold text-[#FFE5AD]">
              {lang === 'si' ? 'උපකරණ පෙට්ටිය' : 'Equipment Toolbox'}
            </h2>
            <span className="text-xs font-mono-tabular font-semibold text-[#F5C56B]">
              {placedCount}/{equipment.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#20130B] rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#F59E0B] transition-all duration-300"
              style={{ width: `${(placedCount / Math.max(1, equipment.length)) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto lab-scroll pr-0.5">
            {equipment.map((item) => {
              const placed = placedIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`relative rounded-xl border p-2 flex flex-col items-center text-center transition-colors ${
                    placed
                      ? 'bg-[#172820] border-[#4ADE80]/60'
                      : 'bg-[#1D2532] border-[#475569]/70 hover:border-[#F59E0B]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setInspectedId(inspectedId === item.id ? null : item.id)}
                    aria-label={`Inspect ${item.name[lang]}`}
                    className="absolute top-1.5 left-1.5 w-5 h-5 rounded-full bg-black/40 text-[#CBD5E1] hover:text-white flex items-center justify-center cursor-pointer"
                  >
                    <Search className="w-3 h-3" />
                  </button>

                  {placed && (
                    <span className="absolute top-1.5 right-1.5 text-[#4ADE80]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </span>
                  )}

                  <button
                    type="button"
                    draggable={!placed}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('text/plain', item.id);
                    }}
                    onClick={() => onPlaceItem(item.id)}
                    disabled={placed}
                    aria-label={
                      placed
                        ? `${item.slotLabel[lang]} placed`
                        : `Place ${item.slotLabel[lang]} on bench`
                    }
                    className="w-full pt-3 flex flex-col items-center cursor-pointer disabled:cursor-default"
                  >
                    <EquipmentGlyph type={item.iconType} />
                    <span className="mt-1.5 text-[11px] font-semibold text-[#F8FAFC] leading-tight line-clamp-2">
                      {item.slotLabel[lang]}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          {!allPlaced && (
            <button
              type="button"
              onClick={onPlaceAll}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-[#F38B21] hover:bg-[#FFA13B] text-[#1E1005] text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">
                {lang === 'si' ? 'සියල්ල මේසයට තබන්න' : 'Place All on Bench'}
              </span>
            </button>
          )}

          {inspectedItem && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-[#1A110B] border border-[#A8733B] text-left">
              <div className="text-[11px] font-bold text-[#FCD34D]">
                {inspectedItem.name[lang]}
              </div>
              <p className="text-[11px] text-[#EADAC2] mt-1 leading-snug">
                {inspectedItem.description[lang]}
              </p>
            </div>
          )}
        </aside>
      )}

      {/* Collapse / Expand Tab */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Open Toolbox' : 'Collapse Toolbox'}
        className="mt-8 -ml-[1px] px-1.5 py-3 rounded-r-xl bg-[#362214] border-2 border-l-0 border-[#A8733B] text-[#F5C56B] hover:text-white cursor-pointer shadow-lg"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </div>
  );
}
