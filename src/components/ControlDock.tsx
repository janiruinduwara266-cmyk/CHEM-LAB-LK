import { ChevronDown, ChevronUp, Eye, Moon, Power, Sparkles, Sun, Zap } from 'lucide-react';
import type {
  CameraPreset,
  CathodeMetal,
  FoilMaterial,
  GasType,
  LabSimulationParams,
  Language,
} from '../types/lab';

interface ControlDockProps {
  lang: Language;
  params: LabSimulationParams;
  isAssembled: boolean;
  cameraPreset: CameraPreset;
  dockCollapsed: boolean;
  onToggleDock: () => void;
  onUpdateParams: (patch: Partial<LabSimulationParams>) => void;
  onSelectCameraPreset: (preset: CameraPreset) => void;
}

const PRESSURE_STOPS = [760, 40, 10, 1.5, 0.2, 0.05, 0.008, 0.002];

function pressureToSlider(p: number): number {
  let bestIdx = 0;
  let bestDiff = Infinity;
  PRESSURE_STOPS.forEach((val, idx) => {
    const diff = Math.abs(Math.log10(Math.max(0.001, val)) - Math.log10(Math.max(0.001, p)));
    if (diff < bestDiff) {
      bestDiff = diff;
      bestIdx = idx;
    }
  });
  return bestIdx;
}

export function ControlDock({
  lang,
  params,
  isAssembled,
  cameraPreset,
  dockCollapsed,
  onToggleDock,
  onUpdateParams,
  onSelectCameraPreset,
}: ControlDockProps) {
  return (
    <div className="relative z-20 flex flex-col items-center pointer-events-auto">
      {/* Collapse / Expand Tab */}
      <button
        type="button"
        onClick={onToggleDock}
        className="px-3.5 py-1 rounded-t-xl bg-[#2B1B10]/95 border border-b-0 border-[#A8733B] text-[11px] font-semibold text-[#F5C56B] hover:text-white flex items-center gap-1.5 cursor-pointer"
      >
        {dockCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        <span className="whitespace-nowrap">
          {dockCollapsed
            ? lang === 'si'
              ? 'පාලන පුවරුව පෙන්වන්න'
              : 'Show Lab Controls'
            : lang === 'si'
              ? 'පාලන පුවරුව සඟවන්න'
              : 'Hide Controls'}
        </span>
      </button>

      {!dockCollapsed && (
        <div className="w-full max-w-[940px] wood-panel rounded-2xl px-4 py-3 text-[#FBF5EA]">
          {!isAssembled ? (
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-[#F5C56B] font-medium">
                {lang === 'si'
                  ? 'උපකරණ පෙට්ටියෙන් සියලු කොටස් මේසයට ගත් පසු පරීක්ෂණ පාලක සක්‍රීය වේ.'
                  : 'Place all apparatus items onto the 3D bench to unlock live instrument controls.'}
              </span>
              <div className="flex items-center gap-1.5">
                {(['overview', 'front', 'closeup', 'top'] as CameraPreset[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => onSelectCameraPreset(p)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold capitalize cursor-pointer ${
                      cameraPreset === p
                        ? 'bg-[#F38B21] text-[#1E1005]'
                        : 'bg-[#1D130B] text-[#D4BFA2] hover:text-white'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2.5">
              {/* STATION 01: CATHODE RAY TUBE CONTROLS */}
              {params.experimentId === 'cathode-tube' && (
                <>
                  <button
                    type="button"
                    onClick={() => onUpdateParams({ hvEnabled: !params.hvEnabled })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                      params.hvEnabled
                        ? 'bg-[#16A34A] text-white'
                        : 'bg-[#7F1D1D] text-[#FECACA]'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>HV: {params.hvEnabled ? 'ON' : 'OFF'}</span>
                  </button>

                  <label className="flex flex-col gap-1 min-w-[140px]">
                    <span className="text-[11px] text-[#F5C56B] font-mono-tabular">
                      {lang === 'si' ? 'පීඩනය' : 'Pressure'}:{' '}
                      {params.pressureMmHg < 0.1
                        ? params.pressureMmHg.toFixed(3)
                        : params.pressureMmHg}{' '}
                      mmHg
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={PRESSURE_STOPS.length - 1}
                      step={1}
                      value={pressureToSlider(params.pressureMmHg)}
                      onChange={(e) =>
                        onUpdateParams({ pressureMmHg: PRESSURE_STOPS[Number(e.target.value)] })
                      }
                      className="lab-slider w-36"
                    />
                  </label>

                  <label className="flex flex-col gap-1 min-w-[115px]">
                    <span className="text-[11px] text-[#F5C56B] font-mono-tabular">
                      {lang === 'si' ? 'වෝල්ටීයතාව' : 'Voltage'}: {params.voltageKv} kV
                    </span>
                    <input
                      type="range"
                      min={2}
                      max={20}
                      step={1}
                      value={params.voltageKv}
                      onChange={(e) => onUpdateParams({ voltageKv: Number(e.target.value) })}
                      className="lab-slider w-28"
                    />
                  </label>

                  <div className="flex flex-wrap items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateParams({
                          malteseCrossUp: !params.malteseCrossUp,
                          paddleWheelEngaged: false,
                        })
                      }
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                        params.malteseCrossUp
                          ? 'bg-[#F38B21] text-[#1A0E06]'
                          : 'bg-[#1D130B] border border-[#8E6234] text-[#EADAC2]'
                      }`}
                    >
                      {lang === 'si' ? 'මෝල්ටීස් කුරුසය' : 'Maltese Cross'}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        onUpdateParams({
                          paddleWheelEngaged: !params.paddleWheelEngaged,
                          malteseCrossUp: false,
                        })
                      }
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                        params.paddleWheelEngaged
                          ? 'bg-[#F38B21] text-[#1A0E06]'
                          : 'bg-[#1D130B] border border-[#8E6234] text-[#EADAC2]'
                      }`}
                    >
                      {lang === 'si' ? 'පැඩල් රෝදය' : 'Paddle Wheel'}
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateParams({ magnetActive: !params.magnetActive })}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold cursor-pointer whitespace-nowrap ${
                        params.magnetActive
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-[#1D130B] border border-[#8E6234] text-[#EADAC2]'
                      }`}
                    >
                      {lang === 'si' ? 'චුම්බකය' : 'Magnet'}
                    </button>

                    {params.magnetActive && (
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateParams({ magnetPolarity: params.magnetPolarity === 1 ? -1 : 1 })
                        }
                        className="px-2 py-1.5 rounded-lg text-[11px] font-bold bg-[#334155] text-white cursor-pointer whitespace-nowrap"
                      >
                        {params.magnetPolarity === 1 ? 'N↑/S↓' : 'S↑/N↓'}
                      </button>
                    )}
                  </div>
                </>
              )}

              {/* STATION 02: THOMSON & CANAL RAYS CONTROLS */}
              {params.experimentId === 'thomson-canal' && (
                <>
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#1C110A] border border-[#8E6234]">
                    <button
                      type="button"
                      onClick={() => onUpdateParams({ thomsonMode: 'cathode-rays' })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer whitespace-nowrap ${
                        params.thomsonMode === 'cathode-rays'
                          ? 'bg-[#F38B21] text-[#1A0E06]'
                          : 'text-[#EADAC2]'
                      }`}
                    >
                      {lang === 'si' ? 'කැතෝඩ කිරණ' : 'Cathode Rays'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateParams({ thomsonMode: 'canal-rays' })}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-bold cursor-pointer whitespace-nowrap ${
                        params.thomsonMode === 'canal-rays'
                          ? 'bg-[#EC4899] text-white'
                          : 'text-[#EADAC2]'
                      }`}
                    >
                      {lang === 'si' ? 'කැනල් කිරණ (+)' : 'Canal Rays (+)'}
                    </button>
                  </div>

                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#F5C56B] font-mono-tabular">
                      E-Plates: {params.electricVoltageV} V
                    </span>
                    <input
                      type="range"
                      min={-260}
                      max={260}
                      step={10}
                      value={params.electricVoltageV}
                      onChange={(e) => onUpdateParams({ electricVoltageV: Number(e.target.value) })}
                      className="lab-slider w-32"
                    />
                  </label>

                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#F5C56B] font-mono-tabular">
                      B-Field: {params.magneticFieldMt.toFixed(2)} mT
                    </span>
                    <input
                      type="range"
                      min={-2.2}
                      max={2.2}
                      step={0.04}
                      value={params.magneticFieldMt}
                      onChange={(e) => onUpdateParams({ magneticFieldMt: Number(e.target.value) })}
                      className="lab-slider w-32"
                    />
                  </label>

                  <div className="flex items-center gap-2">
                    <label className="text-[11px] flex items-center gap-1">
                      <span className="text-[#D4BFA2]">Gas:</span>
                      <select
                        value={params.gas}
                        onChange={(e) => onUpdateParams({ gas: e.target.value as GasType })}
                        className="bg-[#1D130B] border border-[#8E6234] rounded-md px-1.5 py-1 text-[11px] text-white"
                      >
                        <option value="air">Air</option>
                        <option value="hydrogen">Hydrogen (H₂)</option>
                        <option value="neon">Neon (Ne)</option>
                        <option value="argon">Argon (Ar)</option>
                      </select>
                    </label>

                    <label className="text-[11px] flex items-center gap-1">
                      <span className="text-[#D4BFA2]">Cathode:</span>
                      <select
                        value={params.cathodeMetal}
                        onChange={(e) =>
                          onUpdateParams({ cathodeMetal: e.target.value as CathodeMetal })
                        }
                        className="bg-[#1D130B] border border-[#8E6234] rounded-md px-1.5 py-1 text-[11px] text-white"
                      >
                        <option value="copper">Copper (Cu)</option>
                        <option value="aluminum">Aluminum (Al)</option>
                        <option value="platinum">Platinum (Pt)</option>
                      </select>
                    </label>
                  </div>
                </>
              )}

              {/* STATION 03: MILLIKAN OIL DROP CONTROLS */}
              {params.experimentId === 'millikan' && (
                <>
                  <button
                    type="button"
                    onClick={() => onUpdateParams({ sprayPulse: params.sprayPulse + 1 })}
                    className="px-3 py-1.5 rounded-lg bg-[#F38B21] hover:bg-[#FFA13B] text-[#1E1005] text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'si' ? 'තෙල් බිංදු ඉසින්න' : 'Spray Oil Droplets'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onUpdateParams({ xrayActive: !params.xrayActive })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      params.xrayActive
                        ? 'bg-[#0284C7] text-white'
                        : 'bg-[#1D130B] border border-[#8E6234] text-[#EADAC2]'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>X-Ray: {params.xrayActive ? 'ON' : 'OFF'}</span>
                  </button>

                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#F5C56B] font-mono-tabular">
                      Plate Voltage: {params.millikanVoltageV} V
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={1000}
                      step={2}
                      value={params.millikanVoltageV}
                      onChange={(e) => onUpdateParams({ millikanVoltageV: Number(e.target.value) })}
                      className="lab-slider w-44"
                    />
                  </label>

                  <label className="text-[11px] flex items-center gap-1.5">
                    <span className="text-[#D4BFA2]">
                      {lang === 'si' ? 'ආරෝපණය' : 'Charge'}:
                    </span>
                    <select
                      value={params.dropletChargeN}
                      onChange={(e) => onUpdateParams({ dropletChargeN: Number(e.target.value) })}
                      className="bg-[#1D130B] border border-[#8E6234] rounded-md px-2 py-1 text-[11px] text-white"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          q = {n}e
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              )}

              {/* STATION 04: RUTHERFORD GOLD FOIL CONTROLS */}
              {params.experimentId === 'rutherford' && (
                <>
                  <button
                    type="button"
                    onClick={() => onUpdateParams({ alphaBeamEnabled: !params.alphaBeamEnabled })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                      params.alphaBeamEnabled ? 'bg-[#16A34A] text-white' : 'bg-[#7F1D1D] text-white'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>α-Beam: {params.alphaBeamEnabled ? 'ON' : 'OFF'}</span>
                  </button>

                  <label className="flex flex-col gap-1">
                    <span className="text-[11px] text-[#F5C56B] font-mono-tabular">
                      {lang === 'si' ? 'අනාවරක කෝණය' : 'Detector Angle'} θ: {params.detectorAngleDeg}°
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={180}
                      step={5}
                      value={params.detectorAngleDeg}
                      onChange={(e) => onUpdateParams({ detectorAngleDeg: Number(e.target.value) })}
                      className="lab-slider w-44"
                    />
                  </label>

                  <label className="text-[11px] flex items-center gap-1.5">
                    <span className="text-[#D4BFA2]">{lang === 'si' ? 'පත්‍රය' : 'Foil'}:</span>
                    <select
                      value={params.foilMaterial}
                      onChange={(e) =>
                        onUpdateParams({ foilMaterial: e.target.value as FoilMaterial })
                      }
                      className="bg-[#1D130B] border border-[#8E6234] rounded-md px-2 py-1 text-[11px] text-white"
                    >
                      <option value="gold">Gold (Au, Z=79)</option>
                      <option value="aluminum">Aluminum (Al, Z=13)</option>
                    </select>
                  </label>
                </>
              )}

              {/* Shared Darkroom & Camera View Presets */}
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  type="button"
                  onClick={() => onUpdateParams({ darkRoom: !params.darkRoom })}
                  title={lang === 'si' ? 'අඳුරු කාමර ප්‍රකාරය' : 'Toggle Darkroom Lighting'}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 cursor-pointer whitespace-nowrap ${
                    params.darkRoom
                      ? 'bg-[#312E81] text-[#E0E7FF] border border-[#818CF8]'
                      : 'bg-[#1D130B] border border-[#8E6234] text-[#FDE68A]'
                  }`}
                >
                  {params.darkRoom ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                  <span>{params.darkRoom ? 'Darkroom' : 'Daylight'}</span>
                </button>

                <div className="hidden md:flex items-center gap-1 bg-[#1C110A] p-0.5 rounded-lg border border-[#8E6234]">
                  <Eye className="w-3.5 h-3.5 text-[#D4BFA2] ml-1.5" />
                  {(['overview', 'front', 'closeup', 'top'] as CameraPreset[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => onSelectCameraPreset(p)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold capitalize cursor-pointer ${
                        cameraPreset === p
                          ? 'bg-[#F38B21] text-[#1E1005]'
                          : 'text-[#D4BFA2] hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
