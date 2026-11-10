import { useEffect, useState } from 'react';
import {
  computeBeamTrajectory,
  computeMillikanState,
  computeRutherfordScattering,
  evaluateDischargeRegime,
} from '../physics/cathodePhysics';
import type { LabSimulationParams, Language } from '../types/lab';

interface MagnifierLoupeProps {
  params: LabSimulationParams;
  lang: Language;
  isAssembled: boolean;
}

export function MagnifierLoupe({ params, lang, isAssembled }: MagnifierLoupeProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setPhase((prev) => (prev + 1) % 1000);
    }, 90);
    return () => window.clearInterval(id);
  }, []);

  if (!isAssembled) {
    return (
      <div className="pointer-events-none select-none flex flex-col items-center">
        <div className="bg-[#0F1B24]/95 border-2 border-[#C89242] rounded-xl px-4 py-2 shadow-lg text-center">
          <div className="text-[11px] font-medium text-[#F5C56B]">
            {lang === 'si' ? 'විශාලන නිරීක්ෂණ කවුළුව' : 'Magnified Observation Loupe'}
          </div>
          <div className="text-xs text-[#CBD5E1] mt-0.5">
            {lang === 'si'
              ? 'උපකරණ මේසය මත තැබූ පසු සජීවී නිරීක්ෂණ මෙහි දිස්වේ'
              : 'Live close-up measurements appear once apparatus is placed'}
          </div>
        </div>
      </div>
    );
  }

  if (params.experimentId === 'cathode-tube') {
    const regime = evaluateDischargeRegime(
      params.pressureMmHg,
      params.voltageKv,
      params.gas,
      params.hvEnabled
    );
    const magnetOffset = params.magnetActive ? params.magnetPolarity * -16 : 0;

    return (
      <div className="pointer-events-none select-none flex items-center gap-4 bg-[#0D1A22]/95 border-2 border-[#C89242] rounded-xl px-4 py-2.5 shadow-xl">
        {/* Live ZnS Phosphor Circular End-Screen */}
        <div className="relative w-20 h-20 rounded-full border-2 border-[#4ADE80]/40 bg-[#07110B] overflow-hidden shrink-0 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full transition-opacity duration-200"
            style={{
              opacity: regime.znsGlowIntensity,
              background: `radial-gradient(circle at 50% ${50 + magnetOffset}%, rgba(160,255,145,0.95) 0%, rgba(34,197,94,0.68) 55%, rgba(6,78,59,0.2) 100%)`,
            }}
          />
          {/* Maltese Cross Shadow */}
          {params.malteseCrossUp && !params.paddleWheelEngaged && regime.znsGlowIntensity > 0.08 && (
            <svg viewBox="0 0 100 100" className="relative w-14 h-14 z-10">
              <path
                d="M44 44 L36 12 L50 20 L64 12 L56 44 L88 36 L80 50 L88 64 L56 56 L64 88 L50 80 L36 88 L44 56 L12 64 L20 50 L12 36 Z"
                fill="#060D09"
                fillOpacity="0.95"
              />
            </svg>
          )}
          {/* Magnet spot dot */}
          {!params.malteseCrossUp && regime.beamIntensity > 0.2 && (
            <div
              className="relative z-10 w-3.5 h-3.5 rounded-full bg-[#E6FFED] shadow-[0_0_12px_#4ADE80]"
              style={{ transform: `translateY(${magnetOffset * 0.7}px)` }}
            />
          )}
        </div>

        <div className="text-left min-w-[185px]">
          <div className="text-[11px] font-semibold text-[#F5C56B]">
            {lang === 'si' ? 'ZnS ප්‍රතිදීප්ත තිරය (විශාලනය)' : 'ZnS Phosphor Screen (Loupe)'}
          </div>
          <div className="text-xs text-[#E2E8F0] font-mono-tabular mt-0.5">
            p = {params.pressureMmHg < 0.1 ? params.pressureMmHg.toFixed(3) : params.pressureMmHg.toFixed(1)} mmHg · {params.voltageKv} kV
          </div>
          <div className="text-[11px] text-[#86EFAC] mt-1">
            {regime.phase === 'no-breakdown' &&
              (lang === 'si' ? 'විසර්ජනය නැත (පීඩනය වැඩියි / HV OFF)' : 'No discharge (High pressure or HV OFF)')}
            {regime.phase === 'streamer' &&
              (lang === 'si' ? 'පටු විදුලි කෙටීම්' : 'Narrow spark streamers')}
            {regime.phase === 'striations' &&
              (lang === 'si' ? 'ධන කණුව හා ඉරි (Striations)' : 'Positive column striations')}
            {regime.phase === 'crookes-dark-space' &&
              (lang === 'si' ? 'ක්‍රක්ස් අඳුරු අවකාශය පැතිරේ' : 'Crookes dark space expanding')}
            {regime.phase === 'cathode-rays-fluorescence' &&
              (params.malteseCrossUp
                ? lang === 'si'
                  ? 'තියුණු කුරුස සෙවනැල්ල (සරල රේඛීය ගමන)'
                  : 'Sharp cross shadow (straight-line beam)'
                : lang === 'si'
                  ? 'දීප්තිමත් කොළ ZnS ප්‍රතිදීප්තිය'
                  : 'Bright green ZnS fluorescence')}
          </div>
        </div>
      </div>
    );
  }

  if (params.experimentId === 'thomson-canal') {
    const traj = computeBeamTrajectory(params);
    const ePct = 50 - (traj.screenDeflectionMm / 32) * 38;
    const cPct = 50 - (traj.canalRayDeflectionMm / 32) * 38;
    const isCanal = params.thomsonMode === 'canal-rays';

    return (
      <div className="pointer-events-none select-none flex items-center gap-4 bg-[#0D1A22]/95 border-2 border-[#C89242] rounded-xl px-4 py-2.5 shadow-xl">
        {/* Graduated mm vertical scale */}
        <div className="relative w-28 h-20 rounded-lg border border-[#334155] bg-[#07110C] overflow-hidden shrink-0 flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/25" />
          <div className="absolute inset-y-1 left-1/2 w-[1px] bg-white/20" />
          {[15, 30, 50, 70, 85].map((top) => (
            <div
              key={top}
              className="absolute left-2 w-2 h-[1px] bg-[#94A3B8]/50"
              style={{ top: `${top}%` }}
            />
          ))}
          {/* Electron spot */}
          {params.hvEnabled && (
            <div
              className="absolute w-3.5 h-3.5 rounded-full bg-[#86EFAC] shadow-[0_0_10px_#4ADE80]"
              style={{ top: `${Math.max(10, Math.min(88, ePct))}%`, transform: 'translateY(-50%)' }}
            />
          )}
          {/* Canal positive ion spot */}
          {params.hvEnabled && isCanal && (
            <div
              className="absolute right-4 w-3 h-3 rounded-full bg-[#F472B6] shadow-[0_0_10px_#EC4899]"
              style={{ top: `${Math.max(10, Math.min(88, cPct))}%`, transform: 'translateY(-50%)' }}
            />
          )}
        </div>

        <div className="text-left min-w-[205px]">
          <div className="text-[11px] font-semibold text-[#F5C56B]">
            {lang === 'si' ? 'ZnS පරිමාණිත අපගමනය (Loupe)' : 'Graduated ZnS Scale (Loupe)'}
          </div>
          <div className="text-xs text-[#E2E8F0] font-mono-tabular mt-0.5">
            e⁻ d = {traj.screenDeflectionMm > 0 ? `+${traj.screenDeflectionMm}` : traj.screenDeflectionMm} mm
            {isCanal ? ` · +ion = ${traj.canalRayDeflectionMm} mm` : ''}
          </div>
          <div className="text-[11px] mt-1 font-medium">
            {traj.isBalanced ? (
              <span className="text-[#4ADE80]">
                {lang === 'si' ? 'eE = evB සමතුලිතයි! (v = E/B)' : 'BALANCED: eE = evB (v = E/B)'}
              </span>
            ) : (
              <span className="text-[#CBD5E1]">
                E = {params.electricVoltageV} V · B = {params.magneticFieldMt.toFixed(2)} mT ·{' '}
                {params.gas.toUpperCase()} / {params.cathodeMetal}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (params.experimentId === 'millikan') {
    const m = computeMillikanState(params);
    // Calculate looping vertical position inside reticle based on netVelocityMmPerSec
    const rawPos = ((phase * m.netVelocityMmPerSec * 1.4) % 72 + 72) % 72;
    const dropTop = m.isSuspended ? 50 : 14 + rawPos;

    return (
      <div className="pointer-events-none select-none flex items-center gap-4 bg-[#0D1A22]/95 border-2 border-[#C89242] rounded-xl px-4 py-2.5 shadow-xl">
        {/* Illuminated Reticle Eyepiece */}
        <div className="relative w-20 h-20 rounded-full border-2 border-[#F59E0B]/60 bg-[#0B1218] overflow-hidden shrink-0">
          <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#FCD34D]/45" />
          <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#FCD34D]/45" />
          <div className="absolute inset-x-3 top-1/4 h-[1px] bg-white/15" />
          <div className="absolute inset-x-3 top-3/4 h-[1px] bg-white/15" />
          {params.sprayPulse > 0 && (
            <div
              className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#FEF08A] shadow-[0_0_10px_#FACC15]"
              style={{ top: `${dropTop}%` }}
            />
          )}
        </div>

        <div className="text-left min-w-[215px]">
          <div className="text-[11px] font-semibold text-[#F5C56B]">
            {lang === 'si' ? 'අන්වීක්ෂ කෝෂිකාව (Reticle View)' : 'Microscope Eyepiece (Reticle)'}
          </div>
          <div className="text-xs text-[#E2E8F0] font-mono-tabular mt-0.5">
            v = {m.netVelocityMmPerSec.toFixed(2)} mm/s · V_target ≈ {m.balanceVoltageV} V
          </div>
          <div className="text-[11px] mt-1 font-medium">
            {m.isSuspended ? (
              <span className="text-[#4ADE80]">
                {lang === 'si'
                  ? `සමතුලිතයි! (q = ${params.dropletChargeN}e = ${(m.chargeCoulombs * 1e19).toFixed(2)}×10⁻¹⁹ C)`
                  : `SUSPENDED! q = ${params.dropletChargeN}e (${(m.chargeCoulombs * 1e19).toFixed(2)}×10⁻¹⁹ C)`}
              </span>
            ) : m.netVelocityMmPerSec < 0 ? (
              <span className="text-[#FDE047]">
                {lang === 'si' ? '▼ බිංදුව පහළට වැටේ (mg > qE)' : '▼ Droplet falling (mg > qE)'}
              </span>
            ) : (
              <span className="text-[#38BDF8]">
                {lang === 'si' ? '▲ බිංදුව ඉහළට නගී (qE > mg)' : '▲ Droplet rising (qE > mg)'}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Station 04: Rutherford ZnS Scintillation Scope
  const ruth = computeRutherfordScattering(params);
  const flashVisible =
    params.alphaBeamEnabled &&
    (ruth.detectorAngleDeg <= 12 || phase % Math.max(2, Math.round(12 / Math.max(0.12, ruth.relativeIntensity))) === 0);

  return (
    <div className="pointer-events-none select-none flex items-center gap-4 bg-[#0D1A22]/95 border-2 border-[#C89242] rounded-xl px-4 py-2.5 shadow-xl">
      <div className="relative w-20 h-20 rounded-full border-2 border-[#86EFAC]/45 bg-[#060D09] overflow-hidden shrink-0 flex items-center justify-center">
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-white/20" />
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-white/20" />
        {flashVisible && (
          <>
            <div
              className="absolute w-3 h-3 rounded-full bg-[#BEF264] shadow-[0_0_12px_#84CC16]"
              style={{
                left: `${28 + ((phase * 23) % 44)}%`,
                top: `${26 + ((phase * 37) % 48)}%`,
              }}
            />
            {ruth.detectorAngleDeg <= 15 && (
              <div
                className="absolute w-2.5 h-2.5 rounded-full bg-[#FEF08A] shadow-[0_0_10px_#FACC15]"
                style={{
                  left: `${35 + ((phase * 17) % 34)}%`,
                  top: `${32 + ((phase * 29) % 36)}%`,
                }}
              />
            )}
          </>
        )}
      </div>

      <div className="text-left min-w-[215px]">
        <div className="text-[11px] font-semibold text-[#F5C56B]">
          {lang === 'si' ? 'ZnS ප්‍රතිදීප්ත පුපුරු අන්වීක්ෂය' : 'ZnS Scintillation Microscope'}
        </div>
        <div className="text-xs text-[#E2E8F0] font-mono-tabular mt-0.5">
          θ = {ruth.detectorAngleDeg}° · {ruth.expectedCountsPer10Sec.toLocaleString()} hits / 10s
        </div>
        <div className="text-[11px] text-[#A7F3D0] mt-1">
          {params.foilMaterial.toUpperCase()} (Z={ruth.atomicNumberZ}) ·{' '}
          {ruth.detectorAngleDeg <= 15
            ? lang === 'si'
              ? `${ruth.straightThroughPercent}% කෙළින්ම ගමන් කරයි`
              : `${ruth.straightThroughPercent}% pass straight through`
            : ruth.detectorAngleDeg >= 120
              ? lang === 'si'
                ? 'දුර්ලභ න්‍යෂ්ටික ආපසු හැරීම!'
                : 'Rare nuclear backscatter detected!'
              : lang === 'si'
                ? 'සුළු කෝණ විසිරීම'
                : 'Intermediate Coulomb scattering'}
        </div>
      </div>
    </div>
  );
}
