import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EXPERIMENT_ORDER,
  EXPERIMENTS,
  evaluateStepCompletion,
} from './curriculum';
import type { LabSimulationParams } from '../types/lab';

const PARAMS: LabSimulationParams = {
  experimentId: 'cathode-tube',
  hvEnabled: true,
  voltageKv: 12,
  pressureMmHg: 760,
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
  xrayActive: false,
  sprayPulse: 0,
  alphaBeamEnabled: false,
  detectorAngleDeg: 0,
  foilMaterial: 'gold',
  foilThicknessNm: 400,
  darkRoom: false,
};

test('Unit 1 curriculum covers 4 early experiments and excludes Hydrogen Spectrum experiment', () => {
  assert.deepEqual(EXPERIMENT_ORDER, [
    'cathode-tube',
    'thomson-canal',
    'millikan',
    'rutherford',
  ]);
  EXPERIMENT_ORDER.forEach((id) => {
    const exp = EXPERIMENTS[id];
    assert.ok(!exp.shortTitle.en.toLowerCase().includes('spectrum'));
    assert.ok(exp.equipment.length >= 4);
    assert.ok(exp.steps.length >= 3);
  });
});

test('step completion validates assembly and evacuation transitions accurately', () => {
  const exp = EXPERIMENTS['cathode-tube'];
  const required = exp.equipment.map((e) => e.id);
  const partial = new Set(['hv-coil', 'crookes-tube']);

  assert.equal(
    evaluateStepCompletion(exp.steps[0], partial, required, PARAMS, false, false, false, false, false),
    false
  );
  assert.equal(
    evaluateStepCompletion(
      exp.steps[0],
      new Set(required),
      required,
      PARAMS,
      false,
      false,
      false,
      false,
      false
    ),
    true
  );

  // Step 2 requires hvEnabled and pressure <= 0.015
  assert.equal(
    evaluateStepCompletion(exp.steps[1], new Set(required), required, PARAMS, false, false, false, false, false),
    false
  );
  assert.equal(
    evaluateStepCompletion(
      exp.steps[1],
      new Set(required),
      required,
      { ...PARAMS, pressureMmHg: 0.008 },
      false,
      false,
      false,
      false,
      false
    ),
    true
  );
});
