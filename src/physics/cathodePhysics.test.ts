import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeBeamTrajectory,
  computeMillikanState,
  computeRutherfordScattering,
  evaluateDischargeRegime,
} from './cathodePhysics';
import type { LabSimulationParams } from '../types/lab';

const BASE_PARAMS: LabSimulationParams = {
  experimentId: 'cathode-tube',
  hvEnabled: true,
  voltageKv: 12,
  pressureMmHg: 0.005,
  gas: 'air',
  cathodeMetal: 'copper',
  malteseCrossUp: false,
  paddleWheelEngaged: false,
  magnetActive: false,
  magnetPolarity: 1,
  thomsonMode: 'cathode-rays',
  electricVoltageV: 0,
  magneticFieldMt: 0,
  dropletChargeN: 2,
  dropletRadiusUm: 1.0,
  millikanVoltageV: 0,
  xrayActive: true,
  sprayPulse: 1,
  alphaBeamEnabled: true,
  detectorAngleDeg: 0,
  foilMaterial: 'gold',
  foilThicknessNm: 400,
  darkRoom: false,
};

test('discharge regime transitions cleanly from atmospheric insulator to cathode fluorescence', () => {
  const off = evaluateDischargeRegime(0.005, 12, 'air', false);
  assert.equal(off.phase, 'no-breakdown');
  assert.equal(off.beamIntensity, 0);

  const atm = evaluateDischargeRegime(760, 12, 'air', true);
  assert.equal(atm.phase, 'no-breakdown');

  const striations = evaluateDischargeRegime(1.0, 12, 'neon', true);
  assert.equal(striations.phase, 'striations');
  assert.equal(striations.plasmaColorHex, '#FF5E2B');
  assert.ok(striations.plasmaIntensity > 0.5);

  const vacuum = evaluateDischargeRegime(0.005, 12, 'air', true);
  assert.equal(vacuum.phase, 'cathode-rays-fluorescence');
  assert.ok(vacuum.znsGlowIntensity > 0.7);
});

test('Thomson electric and magnetic fields bend beam oppositely and balance when E = vB', () => {
  const electricUp = computeBeamTrajectory({
    ...BASE_PARAMS,
    experimentId: 'thomson-canal',
    electricVoltageV: 200,
    magneticFieldMt: 0,
  });
  assert.ok(electricUp.screenDeflectionMm > 5, 'positive top plate attracts negative electrons upward');

  const magneticDown = computeBeamTrajectory({
    ...BASE_PARAMS,
    experimentId: 'thomson-canal',
    electricVoltageV: 0,
    magneticFieldMt: 1.5,
  });
  assert.ok(magneticDown.screenDeflectionMm < -5, 'magnetic force bends electrons downward');

  // At vFactor = sqrt(1.2) ≈ 1.095, eTerm = (200/220)/1.095 ≈ 0.83; bTerm = (1.38/1.5)*0.9 ≈ 0.83
  const balanced = computeBeamTrajectory({
    ...BASE_PARAMS,
    experimentId: 'thomson-canal',
    electricVoltageV: 200,
    magneticFieldMt: 1.38,
  });
  assert.equal(balanced.isBalanced, true);
  assert.ok(Math.abs(balanced.screenDeflectionMm) < 1.8);

  // Canal rays deflect opposite to cathode rays and hydrogen has largest deflection
  const canalH = computeBeamTrajectory({
    ...BASE_PARAMS,
    gas: 'hydrogen',
    electricVoltageV: 200,
  });
  const canalNe = computeBeamTrajectory({
    ...BASE_PARAMS,
    gas: 'neon',
    electricVoltageV: 200,
  });
  assert.ok(canalH.canalRayDeflectionMm < 0, 'positive canal rays bend away from positive plate');
  assert.ok(
    Math.abs(canalH.canalRayDeflectionMm) > Math.abs(canalNe.canalRayDeflectionMm),
    'H+ has highest q/m ratio and largest canal ray deflection'
  );
});

test('Millikan oil drop achieves suspension at exact computed balance voltage', () => {
  const falling = computeMillikanState({
    ...BASE_PARAMS,
    experimentId: 'millikan',
    millikanVoltageV: 0,
  });
  assert.ok(falling.netVelocityMmPerSec < -0.5);
  assert.equal(falling.isSuspended, false);

  const suspended = computeMillikanState({
    ...BASE_PARAMS,
    experimentId: 'millikan',
    millikanVoltageV: falling.balanceVoltageV,
  });
  assert.equal(suspended.isSuspended, true);
  assert.ok(Math.abs(suspended.netVelocityMmPerSec) < 0.045);

  const rising = computeMillikanState({
    ...BASE_PARAMS,
    experimentId: 'millikan',
    millikanVoltageV: falling.balanceVoltageV * 2,
  });
  assert.ok(rising.netVelocityMmPerSec > 0.4);
});

test('Rutherford scattering peaks at 0 deg and shows rare wide-angle backscatter scaled by Z^2', () => {
  const forward = computeRutherfordScattering({
    ...BASE_PARAMS,
    experimentId: 'rutherford',
    detectorAngleDeg: 0,
    foilMaterial: 'gold',
  });
  const wideGold = computeRutherfordScattering({
    ...BASE_PARAMS,
    experimentId: 'rutherford',
    detectorAngleDeg: 150,
    foilMaterial: 'gold',
  });
  const wideAl = computeRutherfordScattering({
    ...BASE_PARAMS,
    experimentId: 'rutherford',
    detectorAngleDeg: 150,
    foilMaterial: 'aluminum',
  });

  assert.ok(forward.expectedCountsPer10Sec > 10000);
  assert.ok(wideGold.expectedCountsPer10Sec >= 1);
  assert.ok(wideGold.expectedCountsPer10Sec < 50);
  assert.ok(wideGold.backscatterPercent > wideAl.backscatterPercent);
  assert.ok(forward.straightThroughPercent > 99);
});
