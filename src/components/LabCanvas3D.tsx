import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  buildCrookesTubeRig,
  buildGhostSlotsGroup,
  buildInductionCoil,
  buildMillikanRig,
  buildRutherfordRig,
  buildThomsonCanalRig,
  buildVacuumPump,
  buildWoodenLabBench,
  createLabMaterialPalette,
  getCathodeColor,
  updateFoilMaterial,
  type CrookesRigHandles,
  type MillikanRigHandles,
  type RutherfordRigHandles,
  type ThomsonRigHandles,
} from '../three/apparatusModels';
import {
  computeBeamTrajectory,
  computeMillikanState,
  evaluateDischargeRegime,
} from '../physics/cathodePhysics';
import { EXPERIMENTS } from '../data/curriculum';
import type { CameraPreset, ExperimentId, LabSimulationParams } from '../types/lab';

interface LabCanvas3DProps {
  params: LabSimulationParams;
  placedIds: Set<string>;
  cameraPreset: CameraPreset;
  presetVersion: number;
  zoomScale: number;
  onToggleMalteseCross: () => void;
  onPlaceEquipment: (id: string) => void;
}

const CAMERA_PRESETS: Record<CameraPreset, { pos: [number, number, number]; target: [number, number, number] }> = {
  overview: { pos: [0.02, 1.48, 3.48], target: [0, 0.42, 0] },
  front: { pos: [0, 0.78, 3.05], target: [0, 0.48, 0] },
  closeup: { pos: [0.35, 0.76, 1.48], target: [0.22, 0.56, 0] },
  top: { pos: [0, 2.55, 1.15], target: [0, 0.3, 0] },
};

// Scratch math allocations outside render loop (zero GC)
const _dummyMatrix = new THREE.Matrix4();
const _dummyPos = new THREE.Vector3();
const _dummyQuat = new THREE.Quaternion();
const _dummyScale = new THREE.Vector3(1, 1, 1);
const _camGoalPos = new THREE.Vector3();
const _camGoalTarget = new THREE.Vector3();
const _alphaGoldColor = new THREE.Color(0xfbbf24);
const _alphaScatterColor = new THREE.Color(0xfb7185);

export function LabCanvas3D({
  params,
  placedIds,
  cameraPreset,
  presetVersion,
  zoomScale,
  onToggleMalteseCross,
  onPlaceEquipment,
}: LabCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({
    params,
    placedIds,
    cameraPreset,
    presetVersion,
    zoomScale,
    onToggleMalteseCross,
    onPlaceEquipment,
  });

  stateRef.current = {
    params,
    placedIds,
    cameraPreset,
    presetVersion,
    zoomScale,
    onToggleMalteseCross,
    onPlaceEquipment,
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = (() => {
      const probe = document.createElement('canvas').getContext('webgl2');
      if (!probe) return true;
      const ext = probe.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : probe.RENDERER;
      const gpu = String(probe.getParameter(param));
      probe.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = Math.max(320, container.clientWidth);
    const height = Math.max(240, container.clientHeight);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 40);
    const initialPreset = CAMERA_PRESETS.overview;
    camera.position.set(...initialPreset.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...initialPreset.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1.0;
    controls.maxDistance = 4.6;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.enablePan = true;

    let camAnimating = false;
    let lastPresetVer = stateRef.current.presetVersion;
    let lastZoomScale = stateRef.current.zoomScale;

    controls.addEventListener('start', () => {
      camAnimating = false;
    });

    // Balanced 3-point warm/cool laboratory lighting
    const hemiLight = new THREE.HemisphereLight(0xfff5e4, 0x3b2618, 0.95);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff0d6, 2.2);
    keyLight.position.set(-2.6, 3.8, 2.8);
    if (!isSoftwareGl) {
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      keyLight.shadow.camera.left = -2.8;
      keyLight.shadow.camera.right = 2.8;
      keyLight.shadow.camera.top = 2.2;
      keyLight.shadow.camera.bottom = -2.2;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 10;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa5d8ff, 0.75);
    rimLight.position.set(2.5, 2.2, -2.5);
    scene.add(rimLight);

    // Local plasma / fluorescence glow light inside active tube
    const tubePointLight = new THREE.PointLight(0x6bff96, 0, 2.5, 1.5);
    tubePointLight.position.set(0.25, 0.65, 0.15);
    scene.add(tubePointLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const mats = createLabMaterialPalette(isSoftwareGl, maxAniso);

    // Wooden Chemistry Lab Workbench
    const bench = buildWoodenLabBench(mats);
    scene.add(bench);

    // Build shared auxiliary apparatus (Coil + Vacuum Pump) and all 4 experiment rigs once
    const coilRig = buildInductionCoil(mats);
    coilRig.group.position.set(-1.32, 0, -0.34);
    coilRig.group.scale.setScalar(0.88);
    scene.add(coilRig.group);

    const pumpRig = buildVacuumPump(mats);
    pumpRig.group.position.set(-0.92, 0, 0.48);
    pumpRig.group.scale.setScalar(0.88);
    scene.add(pumpRig.group);

    const crookesRig: CrookesRigHandles = buildCrookesTubeRig(mats);
    crookesRig.group.scale.setScalar(0.84);
    crookesRig.group.position.set(0.08, 0, 0);
    scene.add(crookesRig.group);

    const thomsonRig: ThomsonRigHandles = buildThomsonCanalRig(mats);
    thomsonRig.group.scale.setScalar(0.82);
    thomsonRig.group.position.set(0.08, 0, 0);
    scene.add(thomsonRig.group);

    const millikanRig: MillikanRigHandles = buildMillikanRig(mats);
    millikanRig.group.scale.setScalar(0.95);
    scene.add(millikanRig.group);

    const rutherfordRig: RutherfordRigHandles = buildRutherfordRig(mats);
    rutherfordRig.group.scale.setScalar(0.88);
    scene.add(rutherfordRig.group);

    // Ghost slot layer rebuilt only when experiment or placed set changes
    let ghostGroup = new THREE.Group();
    scene.add(ghostGroup);
    let lastExpId: ExperimentId | null = null;
    let lastPlacedSig = '';

    // Smooth animated variables
    let crossAngle = 0;
    let paddleAngle = 0;
    let paddlePosX = -0.22;
    let magnetZ = 0.58;
    let lastBeamSig = '';
    let lastCanalSig = '';

    // Pre-generate deterministic alpha particle trajectories for Rutherford
    const alphaSeeds = Array.from({ length: 36 }, (_, idx) => ({
      phase: idx / 36,
      bNorm: ((idx * 37) % 100) / 100,
      scatterAngle:
        idx === 17
          ? 2.65 // Rare ~152° backscatter!
          : idx % 7 === 0
            ? (idx % 2 === 0 ? 1 : -1) * (0.45 + ((idx % 5) * 0.22))
            : (idx % 2 === 0 ? 1 : -1) * 0.03 * ((idx % 4) + 1),
    }));

    // Oil mist seeds for Millikan
    const oilSeeds = Array.from({ length: 18 }, (_, i) => ({
      x: ((i % 6) - 2.5) * 0.045,
      z: ((Math.floor(i / 6) % 3) - 1) * 0.045,
      yOffset: (i / 18) * 0.22,
    }));

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Raycaster for 3D interactive clicking
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownPos = { x: e.clientX, y: e.clientY };
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
      if (dist > 6) return; // Was an orbit drag

      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const targets: THREE.Object3D[] = [...ghostGroup.children];
      if (stateRef.current.params.experimentId === 'cathode-tube') {
        targets.push(crookesRig.crossHitProxy);
      }

      const hits = raycaster.intersectObjects(targets, false);
      if (hits.length > 0) {
        const hitData = hits[0].object.userData;
        if (hitData?.slotId) {
          stateRef.current.onPlaceEquipment(hitData.slotId);
        } else if (hitData?.action === 'toggle-cross') {
          stateRef.current.onToggleMalteseCross();
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

    const handleResize = () => {
      if (!container) return;
      const w = Math.max(320, container.clientWidth);
      const h = Math.max(240, container.clientHeight);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const status = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (status === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function updateScene(dt: number, elapsed: number) {
      const { params: p, placedIds: placed, cameraPreset: preset, presetVersion: pVer, zoomScale: zScale } =
        stateRef.current;

      // Trigger smooth camera preset animation when changed
      if (pVer !== lastPresetVer || zScale !== lastZoomScale) {
        lastPresetVer = pVer;
        lastZoomScale = zScale;
        camAnimating = true;
      }

      if (camAnimating) {
        const spec = CAMERA_PRESETS[preset];
        const factor = 1 / Math.max(0.65, zScale);
        _camGoalTarget.set(...spec.target);
        _camGoalPos
          .set(...spec.pos)
          .sub(_camGoalTarget)
          .multiplyScalar(factor)
          .add(_camGoalTarget);

        const dampAlpha = 1 - Math.exp(-6.5 * dt);
        camera.position.lerp(_camGoalPos, dampAlpha);
        controls.target.lerp(_camGoalTarget, dampAlpha);
        if (camera.position.distanceTo(_camGoalPos) < 0.015) {
          camAnimating = false;
        }
      }

      // Darkroom smooth lighting transition
      const targetHemi = p.darkRoom ? 0.16 : 0.95;
      const targetKey = p.darkRoom ? 0.28 : 2.2;
      const targetRim = p.darkRoom ? 0.25 : 0.75;
      const lightDamp = 1 - Math.exp(-7 * dt);
      hemiLight.intensity = THREE.MathUtils.lerp(hemiLight.intensity, targetHemi, lightDamp);
      keyLight.intensity = THREE.MathUtils.lerp(keyLight.intensity, targetKey, lightDamp);
      rimLight.intensity = THREE.MathUtils.lerp(rimLight.intensity, targetRim, lightDamp);

      // Rebuild ghost slots only on diff
      const placedSig = Array.from(placed).sort().join(',');
      if (lastExpId !== p.experimentId || lastPlacedSig !== placedSig) {
        lastExpId = p.experimentId;
        lastPlacedSig = placedSig;
        scene.remove(ghostGroup);
        const exp = EXPERIMENTS[p.experimentId];
        ghostGroup = buildGhostSlotsGroup(
          exp.equipment.map((eq) => ({ id: eq.id, x: eq.benchSlot.x, z: eq.benchSlot.z })),
          placed
        );
        scene.add(ghostGroup);
      }

      // Animate ghost slot gentle pulse
      ghostGroup.children.forEach((child, idx) => {
        if (idx % 2 === 0) {
          const s = 1 + Math.sin(elapsed * 3.5) * 0.06;
          child.scale.set(s, s, 1);
        }
      });

      // Visibility per experiment + placed equipment
      const isCathode = p.experimentId === 'cathode-tube';
      const isThomson = p.experimentId === 'thomson-canal';
      const isMillikan = p.experimentId === 'millikan';
      const isRutherford = p.experimentId === 'rutherford';

      coilRig.group.visible =
        (isCathode && placed.has('hv-coil')) || (isThomson && placed.has('hv-supply-2'));
      pumpRig.group.visible =
        (isCathode && placed.has('vacuum-pump')) || (isThomson && placed.has('helmholtz-coils'));
      crookesRig.group.visible = isCathode && placed.has('crookes-tube');
      thomsonRig.group.visible = isThomson && placed.has('thomson-tube');
      millikanRig.group.visible = isMillikan && placed.has('brass-chamber');
      rutherfordRig.group.visible = isRutherford && placed.has('gold-foil');

      // Pump & HV coil spark animation
      if (p.hvEnabled && coilRig.group.visible) {
        coilRig.sparkMesh.visible = Math.sin(elapsed * 42) > -0.35;
      } else {
        coilRig.sparkMesh.visible = false;
      }
      if (pumpRig.group.visible && p.pressureMmHg < 100) {
        pumpRig.flywheel.rotation.x += dt * 5.2;
      }

      // 1. CROOKES CATHODE TUBE UPDATE
      if (crookesRig.group.visible) {
        const regime = evaluateDischargeRegime(p.pressureMmHg, p.voltageKv, p.gas, p.hvEnabled);
        crookesRig.cathodeMaterial.color.setHex(getCathodeColor(p.cathodeMetal));

        const pMat = crookesRig.plasmaColumn.material as THREE.MeshBasicMaterial;
        pMat.color.set(regime.plasmaColorHex);
        pMat.opacity = regime.plasmaIntensity * 0.55;

        const showStriations = regime.phase === 'striations';
        crookesRig.striationRings.forEach((ring, idx) => {
          const rm = ring.material as THREE.MeshBasicMaterial;
          rm.color.set(regime.plasmaColorHex);
          rm.opacity = showStriations ? (0.42 + 0.15 * Math.sin(elapsed * 6 + idx)) : 0;
        });

        // Maltese Cross smooth hinge (folds down in X out of beam path when inactive) + Paddle Wheel + Magnet
        const hasCrossAndWheel = placed.has('cross-wheel');
        const crossBlockingBeam = hasCrossAndWheel && p.malteseCrossUp && !p.paddleWheelEngaged;
        crookesRig.malteseCrossArm.visible = hasCrossAndWheel && !p.paddleWheelEngaged;
        const targetCrossRot = p.malteseCrossUp ? 0 : Math.PI / 2.25;
        crossAngle = THREE.MathUtils.lerp(crossAngle, targetCrossRot, 1 - Math.exp(-9 * dt));
        crookesRig.malteseCrossArm.rotation.x = crossAngle;

        crookesRig.paddleWheelGroup.visible = hasCrossAndWheel && p.paddleWheelEngaged;
        if (crookesRig.paddleWheelGroup.visible) {
          if (regime.beamIntensity > 0.25) {
            paddleAngle -= dt * 7.5 * regime.beamIntensity;
            paddlePosX = Math.min(0.45, paddlePosX + dt * 0.12 * regime.beamIntensity);
            if (paddlePosX >= 0.44) paddlePosX = -0.25;
          }
          crookesRig.paddleSpinner.rotation.z = paddleAngle;
          crookesRig.paddleSpinner.position.x = paddlePosX;
        }

        crookesRig.magnetGroup.visible = placed.has('bar-magnet') && p.magnetActive;
        const targetMagZ = p.magnetActive ? 0.25 : 0.62;
        magnetZ = THREE.MathUtils.lerp(magnetZ, targetMagZ, 1 - Math.exp(-8 * dt));
        crookesRig.magnetGroup.position.z = magnetZ;
        crookesRig.magnetGroup.rotation.x = p.magnetPolarity === 1 ? 0 : Math.PI;

        // Magnetic bend curve for Crookes beam (terminates center beam at x = 0.48 if blocked by Maltese Cross)
        const bend = p.magnetActive ? p.magnetPolarity * 0.14 : 0;
        const beamEndX = crossBlockingBeam ? 0.48 : 0.95;
        const cSig = `${bend.toFixed(3)}|${beamEndX.toFixed(2)}`;
        if (cSig !== lastBeamSig) {
          lastBeamSig = cSig;
          const endFactor = (beamEndX + 0.75) / 1.7;
          const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.75, 0, 0),
            new THREE.Vector3(-0.1, bend * 0.25, 0),
            new THREE.Vector3(0.45, bend * 0.72, 0),
            new THREE.Vector3(beamEndX, bend * endFactor, 0),
          ]);
          crookesRig.beamTube.geometry.dispose();
          crookesRig.beamTube.geometry = new THREE.TubeGeometry(curve, 24, 0.032, 10, false);
        }

        const bMat = crookesRig.beamTube.material as THREE.MeshBasicMaterial;
        bMat.opacity = regime.beamIntensity * 0.78;
        crookesRig.electronParticles.visible = regime.beamIntensity > 0.12;

        // Update traveling electrons along beam span (terminating on Maltese cross when raised)
        const span = beamEndX - -0.75;
        for (let i = 0; i < 24; i++) {
          const t = (elapsed * 1.45 + i / 24) % 1;
          const x = -0.75 + t * span;
          const normT = (x + 0.75) / 1.7;
          const y = bend * (normT > 0.35 ? Math.pow((normT - 0.35) / 0.65, 1.4) : 0);
          _dummyPos.set(x, y, 0);
          _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
          crookesRig.electronParticles.setMatrixAt(i, _dummyMatrix);
        }
        crookesRig.electronParticles.instanceMatrix.needsUpdate = true;

        // ZnS screen fluorescence + Maltese cross shadow
        crookesRig.znsRedraw(
          regime.znsGlowIntensity,
          crossBlockingBeam,
          p.magnetActive ? p.magnetPolarity * 0.45 : 0
        );

        tubePointLight.color.set(regime.beamIntensity > 0.3 ? '#6bff96' : regime.plasmaColorHex);
        tubePointLight.intensity = Math.max(regime.plasmaIntensity, regime.znsGlowIntensity) * 1.8;
      }

      // 2. THOMSON e/m & GOLDSTEIN CANAL RAYS UPDATE
      if (thomsonRig.group.visible) {
        const regime = evaluateDischargeRegime(0.005, p.voltageKv, p.gas, p.hvEnabled);
        thomsonRig.cathodeMaterial.color.setHex(getCathodeColor(p.cathodeMetal));
        const traj = computeBeamTrajectory(p);
        const isCanal = p.thomsonMode === 'canal-rays';
        thomsonRig.perforatedCathode.visible = isCanal;
        thomsonRig.canalTube.visible = isCanal && p.hvEnabled;

        const pMat = thomsonRig.plasmaGlow.material as THREE.MeshBasicMaterial;
        pMat.color.set(regime.plasmaColorHex);
        pMat.opacity = p.hvEnabled ? (isCanal ? 0.32 : 0.14) : 0;

        // Forward cathode beam
        const tSig = traj.points.map((pt) => pt.y.toFixed(3)).join(',');
        if (tSig !== lastCanalSig) {
          lastCanalSig = tSig;
          const vecs = traj.points.map((pt) => new THREE.Vector3(pt.x, 0.6 + pt.y, pt.z));
          const cCurve = new THREE.CatmullRomCurve3(vecs);
          thomsonRig.beamTube.geometry.dispose();
          thomsonRig.beamTube.geometry = new THREE.TubeGeometry(cCurve, 26, 0.02, 10, false);

          // Backward canal ray curve
          const canalEndY = 0.6 + (traj.canalRayDeflectionMm / 32) * 0.2;
          const canalCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.22, 0.6, 0),
            new THREE.Vector3(-0.6, 0.6 + (canalEndY - 0.6) * 0.45, 0),
            new THREE.Vector3(-0.98, canalEndY, 0),
          ]);
          thomsonRig.canalTube.geometry.dispose();
          thomsonRig.canalTube.geometry = new THREE.TubeGeometry(canalCurve, 18, 0.024, 10, false);
        }

        (thomsonRig.beamTube.material as THREE.MeshBasicMaterial).opacity = p.hvEnabled ? 0.85 : 0;
        (thomsonRig.canalTube.material as THREE.MeshBasicMaterial).color.set(regime.plasmaColorHex);

        thomsonRig.electronParticles.visible = p.hvEnabled;
        for (let i = 0; i < 20; i++) {
          const u = (elapsed * 1.5 + i / 20) % 1;
          const idxF = u * (traj.points.length - 1);
          const i0 = Math.floor(idxF);
          const i1 = Math.min(traj.points.length - 1, i0 + 1);
          const frac = idxF - i0;
          const px = THREE.MathUtils.lerp(traj.points[i0].x, traj.points[i1].x, frac);
          const py = 0.6 + THREE.MathUtils.lerp(traj.points[i0].y, traj.points[i1].y, frac);
          _dummyPos.set(px, py, 0);
          _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
          thomsonRig.electronParticles.setMatrixAt(i, _dummyMatrix);
        }
        thomsonRig.electronParticles.instanceMatrix.needsUpdate = true;

        thomsonRig.znsRedraw(p.hvEnabled ? 0.9 : 0, false, traj.screenDeflectionMm / 32);
        tubePointLight.color.set(isCanal ? regime.plasmaColorHex : '#6bff96');
        tubePointLight.intensity = p.hvEnabled ? 1.6 : 0;
      }

      // 3. MILLIKAN OIL DROP CHAMBER UPDATE
      if (millikanRig.group.visible) {
        const mState = computeMillikanState(p);
        millikanRig.xrayBeam.visible = placed.has('xray-source') && p.xrayActive;
        millikanRig.squeezeBulb.visible = placed.has('oil-atomizer');

        const activeMist = p.sprayPulse > 0;
        millikanRig.oilMistParticles.visible = activeMist;
        if (activeMist) {
          for (let i = 0; i < oilSeeds.length; i++) {
            const s = oilSeeds[i];
            const drift = (elapsed * mState.netVelocityMmPerSec * 0.08 + s.yOffset) % 0.22;
            const yPos = 0.34 + (drift < 0 ? drift + 0.22 : drift);
            _dummyPos.set(s.x, yPos, s.z);
            _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
            millikanRig.oilMistParticles.setMatrixAt(i, _dummyMatrix);
          }
          millikanRig.oilMistParticles.instanceMatrix.needsUpdate = true;
        }
        tubePointLight.color.set(p.xrayActive ? '#38bdf8' : '#facc15');
        tubePointLight.intensity = p.xrayActive ? 0.9 : 0.2;
      }

      // 4. RUTHERFORD GOLD FOIL UPDATE
      if (rutherfordRig.group.visible) {
        updateFoilMaterial(rutherfordRig.foilMesh, p.foilMaterial, mats);
        const targetYaw = -(p.detectorAngleDeg * Math.PI) / 180;
        rutherfordRig.detectorArm.rotation.y = THREE.MathUtils.lerp(
          rutherfordRig.detectorArm.rotation.y,
          targetYaw,
          1 - Math.exp(-8 * dt)
        );
        rutherfordRig.detectorArm.visible = placed.has('zns-ring') || placed.has('ruth-microscope');

        rutherfordRig.alphaParticles.visible = p.alphaBeamEnabled;
        rutherfordRig.scintillationGlow.visible = p.alphaBeamEnabled;
        if (p.alphaBeamEnabled) {
          const pulse = 0.5 + 0.5 * Math.sin(elapsed * 16);
          (rutherfordRig.scintillationGlow.material as THREE.MeshBasicMaterial).opacity =
            p.detectorAngleDeg < 20 ? 0.65 + 0.35 * pulse : 0.15 + 0.35 * pulse;

          for (let i = 0; i < alphaSeeds.length; i++) {
            const seed = alphaSeeds[i];
            const t = (elapsed * 1.15 + seed.phase) % 1;
            const x = -0.45 + t * 1.2;
            let px = x;
            let pz = (seed.bNorm - 0.5) * 0.04;
            if (x > 0) {
              const distAfterFoil = x;
              px = Math.cos(seed.scatterAngle) * distAfterFoil;
              pz = Math.sin(seed.scatterAngle) * distAfterFoil;
            }
            _dummyPos.set(px, 0.5 + (seed.bNorm - 0.5) * 0.03, pz);
            _dummyMatrix.compose(_dummyPos, _dummyQuat, _dummyScale);
            rutherfordRig.alphaParticles.setMatrixAt(i, _dummyMatrix);
            rutherfordRig.alphaParticles.setColorAt(
              i,
              Math.abs(seed.scatterAngle) > 0.35 && x > 0 ? _alphaScatterColor : _alphaGoldColor
            );
          }
          rutherfordRig.alphaParticles.instanceMatrix.needsUpdate = true;
          if (rutherfordRig.alphaParticles.instanceColor) {
            rutherfordRig.alphaParticles.instanceColor.needsUpdate = true;
          }
        }
        tubePointLight.color.set('#fbbf24');
        tubePointLight.intensity = p.alphaBeamEnabled ? 1.1 : 0;
      }
    }

    function tick() {
      if (disposed) return;
      const dt = Math.min(0.08, clock.getDelta());
      const elapsed = clock.getElapsedTime();
      controls.update();
      updateScene(dt, elapsed);
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      data-testid="lab-3d-canvas"
      className="w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
}
