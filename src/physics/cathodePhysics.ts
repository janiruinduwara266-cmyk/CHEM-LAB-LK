import type { FoilMaterial, GasType, LabSimulationParams } from '../types/lab';

export type DischargePhase =
  | 'no-breakdown'
  | 'streamer'
  | 'striations'
  | 'crookes-dark-space'
  | 'cathode-rays-fluorescence';

export interface DischargeRegimeResult {
  phase: DischargePhase;
  plasmaColorHex: string;
  plasmaIntensity: number; // 0..1
  beamIntensity: number; // 0..1
  znsGlowIntensity: number; // 0..1
  regimeCode: string;
}

const GAS_COLORS: Record<GasType, string> = {
  air: '#C06CFF',
  neon: '#FF5E2B',
  hydrogen: '#FF4B91',
  argon: '#6588FF',
};

const POSITIVE_ION_MASS_RATIO: Record<GasType, number> = {
  hydrogen: 1.0, // H+ (Proton - highest q/m!)
  air: 14.0, // N+ / O+
  neon: 20.0, // Ne+
  argon: 40.0, // Ar+
};

export function evaluateDischargeRegime(
  pressureMmHg: number,
  voltageKv: number,
  gas: GasType,
  hvEnabled: boolean
): DischargeRegimeResult {
  const plasmaColorHex = GAS_COLORS[gas];

  if (!hvEnabled || voltageKv < 2) {
    return {
      phase: 'no-breakdown',
      plasmaColorHex,
      plasmaIntensity: 0,
      beamIntensity: 0,
      znsGlowIntensity: 0,
      regimeCode: 'OFF',
    };
  }

  const vFactor = Math.min(1, Math.max(0.35, (voltageKv - 2) / 10));

  if (pressureMmHg > 40) {
    return {
      phase: 'no-breakdown',
      plasmaColorHex,
      plasmaIntensity: 0,
      beamIntensity: 0,
      znsGlowIntensity: 0,
      regimeCode: 'ATM_INSULATOR',
    };
  }

  if (pressureMmHg > 5) {
    return {
      phase: 'streamer',
      plasmaColorHex,
      plasmaIntensity: 0.45 * vFactor,
      beamIntensity: 0.05,
      znsGlowIntensity: 0.05,
      regimeCode: 'SPARK_STREAMER',
    };
  }

  if (pressureMmHg > 0.2) {
    return {
      phase: 'striations',
      plasmaColorHex,
      plasmaIntensity: 0.85 * vFactor,
      beamIntensity: 0.25 * vFactor,
      znsGlowIntensity: 0.18 * vFactor,
      regimeCode: 'POSITIVE_COLUMN',
    };
  }

  if (pressureMmHg > 0.02) {
    return {
      phase: 'crookes-dark-space',
      plasmaColorHex,
      plasmaIntensity: 0.35 * vFactor,
      beamIntensity: 0.72 * vFactor,
      znsGlowIntensity: 0.65 * vFactor,
      regimeCode: 'CROOKES_DARK_SPACE',
    };
  }

  return {
    phase: 'cathode-rays-fluorescence',
    plasmaColorHex,
    plasmaIntensity: 0.08 * vFactor,
    beamIntensity: 1.0 * vFactor,
    znsGlowIntensity: 0.96 * vFactor,
    regimeCode: 'CATHODE_FLUORESCENCE',
  };
}

export interface BeamTrajectoryResult {
  points: Array<{ x: number; y: number; z: number }>;
  screenDeflectionMm: number; // -32 to +32 mm
  balanceErrorRatio: number; // 0 = perfectly balanced (E = v*B)
  isBalanced: boolean;
  electronSpeedFactor: number;
  canalRayDeflectionMm: number; // opposite sign, scaled by q/m of gas ion
}

export function computeBeamTrajectory(params: LabSimulationParams): BeamTrajectoryResult {
  // Effective beam kinetic factor from accelerating voltage (kV)
  const vFactor = Math.sqrt(Math.max(1, params.voltageKv) / 10);
  // Normalize E-field contribution (+V plate on top deflects negative electrons upward +Y)
  const eTerm = (params.electricVoltageV / 220) * (1 / Math.max(0.5, vFactor));
  // Normalize B-field contribution (Lorentz force F = -e(v x B) opposes E when same sign)
  const bTerm = (params.magneticFieldMt / 1.5) * 0.9;

  // Net upward acceleration inside field region (negative charge -> +E pushes up, +B pushes down)
  const netForce = eTerm - bTerm;
  const screenDeflectionMm = Number(
    Math.max(-32, Math.min(32, netForce * 24)).toFixed(2)
  );

  const hasFields =
    Math.abs(params.electricVoltageV) >= 40 && Math.abs(params.magneticFieldMt) >= 0.3;
  const balanceErrorRatio = hasFields
    ? Math.abs(netForce) / Math.max(0.15, Math.abs(eTerm) + Math.abs(bTerm))
    : 1;
  const isBalanced = hasFields && Math.abs(screenDeflectionMm) <= 1.8;

  // 18 points along x in [-0.72, 0.98] (field zone x in [-0.18, 0.42])
  const points: Array<{ x: number; y: number; z: number }> = [];
  const steps = 18;
  const startX = -0.72;
  const endX = 0.98;
  const fieldStart = -0.18;
  const fieldEnd = 0.42;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = startX + t * (endX - startX);
    let y = 0;

    if (x > fieldStart && x <= fieldEnd) {
      const u = (x - fieldStart) / (fieldEnd - fieldStart);
      y = 0.5 * netForce * 0.24 * u * u;
    } else if (x > fieldEnd) {
      const uEnd = 1.0;
      const yExit = 0.5 * netForce * 0.24 * uEnd * uEnd;
      const slope = (netForce * 0.24 * uEnd) / (fieldEnd - fieldStart);
      y = yExit + slope * (x - fieldEnd);
    }

    y = Math.max(-0.22, Math.min(0.22, y));
    points.push({ x, y, z: 0 });
  }

  // Positive canal rays deflect in opposite direction, inversely proportional to ion mass
  const massRatio = POSITIVE_ION_MASS_RATIO[params.gas];
  const canalDeflectionScale = 1.0 / Math.sqrt(massRatio);
  const canalRayDeflectionMm = Number(
    Math.max(-28, Math.min(28, -netForce * 18 * canalDeflectionScale)).toFixed(2)
  );

  return {
    points,
    screenDeflectionMm,
    balanceErrorRatio,
    isBalanced,
    electronSpeedFactor: vFactor,
    canalRayDeflectionMm,
  };
}

export interface MillikanStateResult {
  dropletMassKg: number;
  chargeCoulombs: number;
  gravitationalForceN: number;
  electricForceN: number;
  balanceVoltageV: number;
  netVelocityMmPerSec: number; // + upward, - downward
  isSuspended: boolean;
}

const ELEMENTARY_CHARGE_C = 1.602176634e-19;
const PLATE_SEPARATION_M = 0.008; // 8 mm parallel brass plates
const OIL_DENSITY_KG_M3 = 886;
const GRAVITY_M_S2 = 9.81;

export function computeMillikanState(params: LabSimulationParams): MillikanStateResult {
  const rMeters = params.dropletRadiusUm * 1e-6;
  const volume = (4 / 3) * Math.PI * Math.pow(rMeters, 3);
  const dropletMassKg = volume * OIL_DENSITY_KG_M3;
  const n = Math.max(1, Math.round(params.dropletChargeN));
  const chargeCoulombs = n * ELEMENTARY_CHARGE_C;

  const gravitationalForceN = dropletMassKg * GRAVITY_M_S2;
  const electricField = params.millikanVoltageV / PLATE_SEPARATION_M;
  const electricForceN = chargeCoulombs * electricField;

  const balanceVoltageV = (gravitationalForceN * PLATE_SEPARATION_M) / chargeCoulombs;
  const netForce = electricForceN - gravitationalForceN;
  // Scaled Stokes drag terminal speed in mm/s for clear lab microscope observation
  const normalizedForce = netForce / Math.max(1e-16, gravitationalForceN);
  const netVelocityMmPerSec = Number(
    Math.max(-1.8, Math.min(1.8, normalizedForce * 0.65)).toFixed(3)
  );

  const isSuspended = Math.abs(netVelocityMmPerSec) < 0.045;

  return {
    dropletMassKg,
    chargeCoulombs,
    gravitationalForceN,
    electricForceN,
    balanceVoltageV: Number(balanceVoltageV.toFixed(1)),
    netVelocityMmPerSec,
    isSuspended,
  };
}

export interface RutherfordScatteringResult {
  detectorAngleDeg: number;
  expectedCountsPer10Sec: number;
  straightThroughPercent: number;
  deflectedPercent: number;
  backscatterPercent: number;
  relativeIntensity: number; // 0..1 normalized
  atomicNumberZ: number;
}

const FOIL_Z: Record<FoilMaterial, number> = {
  gold: 79,
  aluminum: 13,
};

export function computeRutherfordScattering(
  params: LabSimulationParams
): RutherfordScatteringResult {
  if (!params.alphaBeamEnabled) {
    return {
      detectorAngleDeg: params.detectorAngleDeg,
      expectedCountsPer10Sec: 0,
      straightThroughPercent: 0,
      deflectedPercent: 0,
      backscatterPercent: 0,
      relativeIntensity: 0,
      atomicNumberZ: FOIL_Z[params.foilMaterial],
    };
  }

  const z = FOIL_Z[params.foilMaterial];
  const zScale = Math.pow(z / 79, 2);
  const thicknessScale = params.foilThicknessNm / 400;
  const thetaDeg = Math.max(0, Math.min(180, params.detectorAngleDeg));
  const halfAngleRad = ((Math.max(4, thetaDeg) / 2) * Math.PI) / 180;

  // Rutherford scattering law: N(theta) proportional to Z^2 * thickness / sin^4(theta/2)
  const csc4 = 1 / Math.pow(Math.sin(halfAngleRad), 4);
  const rawCounts =
    thetaDeg <= 4
      ? Math.round(14800 * (1 - 0.02 * zScale * thicknessScale))
      : Math.max(1, Math.round(0.45 * zScale * thicknessScale * csc4));

  const relativeIntensity =
    thetaDeg <= 6 ? 1.0 : Math.min(1.0, Math.pow(Math.sin((5 * Math.PI) / 180) / Math.sin(halfAngleRad), 1.6));

  const backscatterBase = 0.005 * zScale * thicknessScale;
  const deflectedBase = 0.25 * zScale * thicknessScale;
  const straightThroughPercent = Number(
    Math.max(96, 100 - deflectedBase - backscatterBase).toFixed(3)
  );

  return {
    detectorAngleDeg: thetaDeg,
    expectedCountsPer10Sec: rawCounts,
    straightThroughPercent,
    deflectedPercent: Number(deflectedBase.toFixed(3)),
    backscatterPercent: Number(backscatterBase.toFixed(4)),
    relativeIntensity,
    atomicNumberZ: z,
  };
}
