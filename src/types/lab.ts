export type Language = 'si' | 'en';

export type ScreenState = 'welcome' | 'map' | 'workbench';

export type ExperimentId =
  | 'cathode-tube'
  | 'thomson-canal'
  | 'millikan'
  | 'rutherford';

export type GasType = 'air' | 'neon' | 'hydrogen' | 'argon';

export type CathodeMetal = 'copper' | 'aluminum' | 'platinum';

export type FoilMaterial = 'gold' | 'aluminum';

export type CameraPreset = 'overview' | 'front' | 'closeup' | 'top';

export interface LocalizedText {
  si: string;
  en: string;
}

export interface EquipmentItem {
  id: string;
  slotLabel: LocalizedText;
  name: LocalizedText;
  description: LocalizedText;
  iconType: 'coil' | 'tube' | 'pump' | 'cross' | 'magnet' | 'plates' | 'coils' | 'gas' | 'chamber' | 'atomizer' | 'xray' | 'microscope' | 'source' | 'foil' | 'screen';
  benchSlot: { x: number; z: number };
}

export interface LabStep {
  id: string;
  title: LocalizedText;
  taskTitle: LocalizedText;
  instruction: LocalizedText;
  whyText: LocalizedText;
  assistantHint: LocalizedText;
  validationType:
    | 'assemble'
    | 'evacuate-pressure'
    | 'maltese-shadow'
    | 'paddle-wheel'
    | 'magnet-deflection'
    | 'electric-deflection'
    | 'magnetic-balance'
    | 'gas-independence'
    | 'canal-rays'
    | 'spray-ionize'
    | 'balance-droplet'
    | 'rutherford-forward'
    | 'rutherford-backscatter';
  quizQuestion?: {
    prompt: LocalizedText;
    options: LocalizedText[];
    correctIndex: number;
    explanation: LocalizedText;
  };
}

export interface LabSimulationParams {
  experimentId: ExperimentId;
  // Power & vacuum (Stations 01 & 02)
  hvEnabled: boolean;
  voltageKv: number; // 1..20 kV
  pressureMmHg: number; // 0.001..760 mmHg (logarithmic slider)
  gas: GasType;
  cathodeMetal: CathodeMetal;
  // Station 01 inserts
  malteseCrossUp: boolean;
  paddleWheelEngaged: boolean;
  magnetActive: boolean;
  magnetPolarity: 1 | -1; // +1 N-up, -1 S-up
  // Station 02 fields & Canal mode
  thomsonMode: 'cathode-rays' | 'canal-rays';
  electricVoltageV: number; // -300..+300 V
  magneticFieldMt: number; // -2.5..+2.5 mT
  // Station 03 Millikan
  dropletChargeN: number; // 1..5 elementary charges
  dropletRadiusUm: number; // 0.8..1.6 um
  millikanVoltageV: number; // 0..1000 V
  xrayActive: boolean;
  sprayPulse: number; // counter incremented when spraying
  // Station 04 Rutherford
  alphaBeamEnabled: boolean;
  detectorAngleDeg: number; // 0..180 deg
  foilMaterial: FoilMaterial;
  foilThicknessNm: number; // 100..600 nm
  // Environment
  darkRoom: boolean;
}
