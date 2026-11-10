import * as THREE from 'three';
import {
  createGaugeDialTexture,
  createProtractorTexture,
  createRadialShadowTexture,
  createTeakWoodTextures,
  createZnsMalteseTexture,
} from './proceduralTextures';
import type { CathodeMetal, FoilMaterial, LabSimulationParams } from '../types/lab';

export interface LabMaterialPalette {
  woodBench: THREE.MeshStandardMaterial;
  darkOak: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  copper: THREE.MeshStandardMaterial;
  steel: THREE.MeshStandardMaterial;
  ebonite: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
  glassRim: THREE.MeshStandardMaterial;
  lead: THREE.MeshStandardMaterial;
  rubberRed: THREE.MeshStandardMaterial;
  magnetNorth: THREE.MeshStandardMaterial;
  magnetSouth: THREE.MeshStandardMaterial;
  goldFoil: THREE.MeshStandardMaterial;
  aluminumFoil: THREE.MeshStandardMaterial;
  shadowDisc: THREE.MeshBasicMaterial;
  maxAnisotropy: number;
}

export function createLabMaterialPalette(
  isSoftwareGl: boolean,
  maxAnisotropy: number
): LabMaterialPalette {
  const teak = createTeakWoodTextures(maxAnisotropy);
  const shadowTex = createRadialShadowTexture();

  return {
    woodBench: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: teak.map,
      bumpMap: teak.bumpMap,
      bumpScale: 0.014,
      roughness: 0.56,
      metalness: 0.04,
    }),
    darkOak: new THREE.MeshStandardMaterial({
      color: 0x3b2314,
      roughness: 0.72,
      metalness: 0.05,
    }),
    brass: new THREE.MeshStandardMaterial({
      color: 0xd4a448,
      roughness: 0.28,
      metalness: 0.88,
    }),
    copper: new THREE.MeshStandardMaterial({
      color: 0xc97343,
      roughness: 0.3,
      metalness: 0.85,
    }),
    steel: new THREE.MeshStandardMaterial({
      color: 0xbac3cd,
      roughness: 0.25,
      metalness: 0.9,
    }),
    ebonite: new THREE.MeshStandardMaterial({
      color: 0x1d1f24,
      roughness: 0.65,
      metalness: 0.08,
    }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xdbf4ff,
      metalness: 0.02,
      roughness: 0.07,
      transmission: isSoftwareGl ? 0 : 0.86,
      transparent: true,
      opacity: isSoftwareGl ? 0.36 : 0.44,
      ior: 1.5,
      thickness: 0.16,
      clearcoat: 1.0,
      depthWrite: false,
    }),
    glassRim: new THREE.MeshStandardMaterial({
      color: 0xd6f3ff,
      roughness: 0.14,
      metalness: 0.15,
      transparent: true,
      opacity: 0.68,
    }),
    lead: new THREE.MeshStandardMaterial({
      color: 0x454c57,
      roughness: 0.78,
      metalness: 0.45,
    }),
    rubberRed: new THREE.MeshStandardMaterial({
      color: 0xb5392a,
      roughness: 0.82,
      metalness: 0.02,
    }),
    magnetNorth: new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.45,
      metalness: 0.2,
    }),
    magnetSouth: new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.45,
      metalness: 0.2,
    }),
    goldFoil: new THREE.MeshStandardMaterial({
      color: 0xf5be36,
      roughness: 0.22,
      metalness: 0.94,
      side: THREE.DoubleSide,
    }),
    aluminumFoil: new THREE.MeshStandardMaterial({
      color: 0xd9e1ea,
      roughness: 0.28,
      metalness: 0.92,
      side: THREE.DoubleSide,
    }),
    shadowDisc: new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
    maxAnisotropy,
  };
}

function addContactShadow(parent: THREE.Group, mat: THREE.MeshBasicMaterial, rx: number, rz: number) {
  const disc = new THREE.Mesh(new THREE.PlaneGeometry(rx * 2, rz * 2), mat);
  disc.rotation.x = -Math.PI / 2;
  disc.position.y = 0.008;
  disc.renderOrder = 1;
  parent.add(disc);
}

export function buildWoodenLabBench(mats: LabMaterialPalette): THREE.Group {
  const bench = new THREE.Group();

  // Primary tabletop slab (top surface sits strictly at y = 0)
  const topSlab = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.14, 2.3), mats.woodBench);
  topSlab.position.set(0, -0.07, 0.05);
  topSlab.receiveShadow = true;
  bench.add(topSlab);

  // Dark mahogany apron & bevel trim
  const trim = new THREE.Mesh(new THREE.BoxGeometry(4.88, 0.18, 2.36), mats.darkOak);
  trim.position.set(0, -0.22, 0.05);
  bench.add(trim);

  // Front lab bench drawer faces with brass pulls
  for (let i = -1; i <= 1; i++) {
    const drawer = new THREE.Mesh(new THREE.BoxGeometry(1.38, 0.22, 0.04), mats.darkOak);
    drawer.position.set(i * 1.5, -0.22, 1.24);
    bench.add(drawer);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 12), mats.brass);
    handle.rotation.z = Math.PI / 2;
    handle.position.set(i * 1.5, -0.22, 1.27);
    bench.add(handle);
  }

  // Brass corner brackets on tabletop
  const corners = [
    [-2.34, -1.04],
    [2.34, -1.04],
    [-2.34, 1.14],
    [2.34, 1.14],
  ];
  corners.forEach(([cx, cz]) => {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.012, 0.12), mats.brass);
    plate.position.set(cx, 0.005, cz);
    bench.add(plate);
  });

  // Bench rubber terminal bar at rear edge
  const terminalStrip = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.06, 0.12), mats.ebonite);
  terminalStrip.position.set(-1.35, 0.03, -0.82);
  bench.add(terminalStrip);
  for (let i = 0; i < 4; i++) {
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.05, 12),
      i % 2 === 0 ? mats.magnetNorth : mats.ebonite
    );
    post.position.set(-1.75 + i * 0.26, 0.08, -0.82);
    bench.add(post);
  }

  return bench;
}

export function buildInductionCoil(mats: LabMaterialPalette): {
  group: THREE.Group;
  sparkMesh: THREE.Mesh;
} {
  const group = new THREE.Group();
  addContactShadow(group, mats.shadowDisc, 0.42, 0.3);

  // Mahogany base
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.07, 0.42), mats.darkOak);
  base.position.y = 0.035;
  base.castShadow = true;
  group.add(base);

  // Copper coil cylinder
  const coil = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.36, 24), mats.copper);
  coil.rotation.z = Math.PI / 2;
  coil.position.set(0, 0.2, 0);
  coil.castShadow = true;
  group.add(coil);

  // Ebonite end cheeks
  [-0.19, 0.19].forEach((x) => {
    const cheek = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.03, 24), mats.ebonite);
    cheek.rotation.z = Math.PI / 2;
    cheek.position.set(x, 0.2, 0);
    group.add(cheek);
  });

  // Brass discharge rods + spheres on top
  [-0.14, 0.14].forEach((x) => {
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 0.18, 12), mats.brass);
    post.position.set(x, 0.34, 0);
    group.add(post);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.1, 10), mats.brass);
    arm.rotation.z = Math.PI / 2;
    arm.position.set(x * 0.55, 0.42, 0);
    group.add(arm);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.024, 14, 14), mats.brass);
    ball.position.set(x * 0.22, 0.42, 0);
    group.add(ball);
  });

  // Analog HV dial on front face
  const dialTex = createGaugeDialTexture('HV', 'kV', mats.maxAnisotropy);
  const dial = new THREE.Mesh(
    new THREE.CircleGeometry(0.07, 24),
    new THREE.MeshBasicMaterial({ map: dialTex })
  );
  dial.position.set(0.18, 0.15, 0.215);
  group.add(dial);

  // Glowing spark arc between gap spheres
  const sparkMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.006, 0.006, 0.06, 8),
    new THREE.MeshBasicMaterial({ color: 0x7dd3fc, transparent: true, opacity: 0.9 })
  );
  sparkMesh.rotation.z = Math.PI / 2;
  sparkMesh.position.set(0, 0.42, 0);
  sparkMesh.visible = false;
  group.add(sparkMesh);

  return { group, sparkMesh };
}

export function buildVacuumPump(mats: LabMaterialPalette): {
  group: THREE.Group;
  flywheel: THREE.Group;
} {
  const group = new THREE.Group();
  addContactShadow(group, mats.shadowDisc, 0.34, 0.28);

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.06, 0.36), mats.lead);
  base.position.y = 0.03;
  base.castShadow = true;
  group.add(base);

  const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.26, 20), mats.ebonite);
  motor.rotation.z = Math.PI / 2;
  motor.position.set(-0.07, 0.17, 0);
  motor.castShadow = true;
  group.add(motor);

  // Brass Bourdon vacuum gauge
  const gaugeStem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.14, 10), mats.brass);
  gaugeStem.position.set(0.14, 0.19, 0.05);
  group.add(gaugeStem);

  const gaugeCasing = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.035, 24), mats.brass);
  gaugeCasing.rotation.x = Math.PI / 2;
  gaugeCasing.position.set(0.14, 0.3, 0.05);
  group.add(gaugeCasing);

  const dialTex = createGaugeDialTexture('VAC', 'mmHg', mats.maxAnisotropy);
  const dialFace = new THREE.Mesh(
    new THREE.CircleGeometry(0.074, 24),
    new THREE.MeshBasicMaterial({ map: dialTex })
  );
  dialFace.position.set(0.14, 0.3, 0.07);
  group.add(dialFace);

  // Spinning flywheel
  const flywheel = new THREE.Group();
  flywheel.position.set(-0.22, 0.17, 0);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.018, 10, 24), mats.steel);
  rim.rotation.y = Math.PI / 2;
  flywheel.add(rim);
  for (let i = 0; i < 3; i++) {
    const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.23, 8), mats.brass);
    spoke.rotation.x = (i * Math.PI) / 3;
    flywheel.add(spoke);
  }
  group.add(flywheel);

  // Copper hose curving toward tube
  const hoseCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.08, 0.24, -0.02),
    new THREE.Vector3(0.28, 0.36, -0.25),
    new THREE.Vector3(0.55, 0.42, -0.45),
  ]);
  const hose = new THREE.Mesh(new THREE.TubeGeometry(hoseCurve, 18, 0.014, 8, false), mats.copper);
  group.add(hose);

  return { group, flywheel };
}

export interface CrookesRigHandles {
  group: THREE.Group;
  plasmaColumn: THREE.Mesh;
  striationRings: THREE.Mesh[];
  cathodeDisk: THREE.Mesh;
  cathodeMaterial: THREE.MeshStandardMaterial;
  beamGroup: THREE.Group;
  beamTube: THREE.Mesh;
  electronParticles: THREE.InstancedMesh;
  malteseCrossArm: THREE.Group;
  paddleWheelGroup: THREE.Group;
  paddleSpinner: THREE.Group;
  magnetGroup: THREE.Group;
  znsRedraw: (glow: number, crossShadow: boolean, spotOffset?: number) => void;
  crossHitProxy: THREE.Mesh;
}

const CATHODE_COLORS: Record<CathodeMetal, number> = {
  copper: 0xd17a45,
  aluminum: 0xcbd5e1,
  platinum: 0xe5e7eb,
};

export function buildCrookesTubeRig(mats: LabMaterialPalette): CrookesRigHandles {
  const group = new THREE.Group();
  addContactShadow(group, mats.shadowDisc, 1.15, 0.34);

  // Wooden cradle base with properly cupping bottom brass U-clamps
  const cradleBase = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.07, 0.46), mats.darkOak);
  cradleBase.position.y = 0.035;
  cradleBase.castShadow = true;
  group.add(cradleBase);

  const clampSpecs = [
    { x: -0.55, r: 0.165 },
    { x: 0.35, r: 0.245 },
  ];
  clampSpecs.forEach(({ x, r }) => {
    const saddleBottom = 0.58 - r;
    const pillarH = Math.max(0.12, saddleBottom - 0.07);
    const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.036, pillarH, 14), mats.brass);
    pillar.position.set(x, 0.07 + pillarH / 2, 0);
    pillar.castShadow = true;
    group.add(pillar);

    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.022, 16), mats.brass);
    flange.position.set(x, 0.08, 0);
    group.add(flange);

    // Lower semi-circular cradle cupping underneath tube (-Y)
    const clamp = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.016, 10, 24, Math.PI),
      mats.brass
    );
    clamp.rotation.y = Math.PI / 2;
    clamp.rotation.z = Math.PI;
    clamp.position.set(x, 0.58, 0);
    group.add(clamp);
  });

  // Blown glass Crookes tube silhouette via LatheGeometry (axis along X by rotating -PI/2 around Z)
  const profile = [
    new THREE.Vector2(0.0, -0.95),
    new THREE.Vector2(0.12, -0.92),
    new THREE.Vector2(0.15, -0.78),
    new THREE.Vector2(0.16, -0.15),
    new THREE.Vector2(0.22, 0.25),
    new THREE.Vector2(0.3, 0.72),
    new THREE.Vector2(0.28, 0.95),
    new THREE.Vector2(0.16, 1.04),
    new THREE.Vector2(0.0, 1.06),
  ];
  const glassGeo = new THREE.LatheGeometry(profile, 36);
  glassGeo.rotateZ(-Math.PI / 2);
  const glassMesh = new THREE.Mesh(glassGeo, mats.glass);
  glassMesh.position.y = 0.58;
  glassMesh.renderOrder = 6;
  group.add(glassMesh);

  // Subtle glass highlight rings along neck and flared phosphor bell for clear optical definition
  [
    { x: -0.78, r: 0.152 },
    { x: -0.15, r: 0.162 },
    { x: 0.72, r: 0.302 },
    { x: 0.95, r: 0.282 },
  ].forEach(({ x, r }) => {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 8, 32), mats.glassRim);
    rim.rotation.y = Math.PI / 2;
    rim.position.set(x, 0.58, 0);
    rim.renderOrder = 7;
    group.add(rim);
  });

  // Brass end collar at cathode end + cathode binding post
  const endCap = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 20), mats.brass);
  endCap.rotation.z = Math.PI / 2;
  endCap.position.set(-0.96, 0.58, 0);
  group.add(endCap);

  // Insulated HV cables connecting coil terminal posts to cathode cap & anode arm
  const cathodeLead = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.32, 0.36, -0.25),
        new THREE.Vector3(-1.18, 0.18, -0.18),
        new THREE.Vector3(-1.01, 0.58, 0),
      ]),
      18,
      0.011,
      8,
      false
    ),
    mats.ebonite
  );
  group.add(cathodeLead);

  const anodeLead = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.15, 0.36, -0.25),
        new THREE.Vector3(-0.75, 0.12, -0.18),
        new THREE.Vector3(-0.25, 0.34, 0),
      ]),
      18,
      0.011,
      8,
      false
    ),
    mats.magnetNorth
  );
  group.add(anodeLead);

  // Concave Cathode Disk (swap color dynamically when user changes metal)
  const cathodeMaterial = new THREE.MeshStandardMaterial({
    color: CATHODE_COLORS.copper,
    roughness: 0.22,
    metalness: 0.9,
  });
  const cathodeDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.025, 24), cathodeMaterial);
  cathodeDisk.rotation.z = Math.PI / 2;
  cathodeDisk.position.set(-0.78, 0.58, 0);
  group.add(cathodeDisk);

  // Anode stem dropping down inside lower bulb neck
  const anodeArm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 12), mats.brass);
  anodeArm.position.set(-0.25, 0.42, 0);
  group.add(anodeArm);
  const anodePlate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.1), mats.steel);
  anodePlate.position.set(-0.25, 0.49, 0);
  group.add(anodePlate);

  // ZnS Fluorescent End Screen inside right flared bell
  const zns = createZnsMalteseTexture();
  const znsMat = new THREE.MeshBasicMaterial({
    map: zns.texture,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
  });
  const znsDisc = new THREE.Mesh(new THREE.CircleGeometry(0.28, 32), znsMat);
  znsDisc.rotation.y = -Math.PI / 2;
  znsDisc.position.set(0.95, 0.58, 0);
  znsDisc.renderOrder = 4;
  group.add(znsDisc);

  // Plasma Gas Glow Column inside tube
  const plasmaMat = new THREE.MeshBasicMaterial({
    color: 0xc06cff,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const plasmaColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 1.55, 20, 1, true), plasmaMat);
  plasmaColumn.rotation.z = Math.PI / 2;
  plasmaColumn.position.set(0.05, 0.58, 0);
  plasmaColumn.renderOrder = 3;
  group.add(plasmaColumn);

  // Striation Glow Discs (visible in 0.2 - 5 mmHg regime)
  const striationRings: THREE.Mesh[] = [];
  for (let i = 0; i < 8; i++) {
    const rMat = new THREE.MeshBasicMaterial({
      color: 0xc06cff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.04, 18), rMat);
    ring.rotation.z = Math.PI / 2;
    ring.position.set(-0.45 + i * 0.16, 0.58, 0);
    ring.renderOrder = 3;
    group.add(ring);
    striationRings.push(ring);
  }

  // Curved Electron Beam + Instanced Particles
  const beamGroup = new THREE.Group();
  beamGroup.position.set(0, 0.58, 0);
  const initialCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.75, 0, 0),
    new THREE.Vector3(0.1, 0, 0),
    new THREE.Vector3(0.95, 0, 0),
  ]);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0x7eff9b,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const beamTube = new THREE.Mesh(new THREE.TubeGeometry(initialCurve, 24, 0.032, 10, false), beamMat);
  beamTube.renderOrder = 4;
  beamGroup.add(beamTube);

  const particleGeo = new THREE.SphereGeometry(0.015, 8, 8);
  const particleMat = new THREE.MeshBasicMaterial({
    color: 0xbaffc9,
    transparent: true,
    opacity: 0.9,
  });
  const electronParticles = new THREE.InstancedMesh(particleGeo, particleMat, 24);
  electronParticles.frustumCulled = false;
  beamGroup.add(electronParticles);
  group.add(beamGroup);

  // Hinged Maltese Cross inside wide end bell
  const malteseCrossArm = new THREE.Group();
  malteseCrossArm.position.set(0.48, 0.42, 0);
  const crossStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.16, 10), mats.brass);
  crossStem.position.y = 0.08;
  malteseCrossArm.add(crossStem);
  for (let arm = 0; arm < 4; arm++) {
    const blade = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.1, 4), mats.steel);
    blade.position.y = 0.18;
    const holder = new THREE.Group();
    holder.position.y = 0.18;
    holder.rotation.x = (arm * Math.PI) / 2;
    blade.position.set(0, 0.05, 0);
    blade.rotation.z = Math.PI;
    holder.add(blade);
    malteseCrossArm.add(holder);
  }
  group.add(malteseCrossArm);

  // Invisible larger clickable proxy for Maltese Cross
  const crossHitProxy = new THREE.Mesh(
    new THREE.BoxGeometry(0.32, 0.34, 0.32),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  crossHitProxy.position.set(0.48, 0.58, 0);
  crossHitProxy.userData = { action: 'toggle-cross' };
  group.add(crossHitProxy);

  // Twin Glass Rails + Mica Paddle Wheel inside tube
  const paddleWheelGroup = new THREE.Group();
  paddleWheelGroup.position.set(0, 0.58, 0);
  [-0.045, 0.045].forEach((z) => {
    const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 1.05, 8), mats.glass);
    rail.rotation.z = Math.PI / 2;
    rail.position.set(0.08, -0.075, z);
    paddleWheelGroup.add(rail);
  });

  const paddleSpinner = new THREE.Group();
  paddleSpinner.position.set(-0.2, -0.01, 0);
  const axle = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.13, 10), mats.brass);
  axle.rotation.x = Math.PI / 2;
  paddleSpinner.add(axle);
  for (let v = 0; v < 6; v++) {
    const vane = new THREE.Mesh(
      new THREE.BoxGeometry(0.004, 0.075, 0.06),
      new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.4, metalness: 0.1 })
    );
    const ang = (v * Math.PI) / 3;
    vane.position.set(Math.cos(ang) * 0.045, Math.sin(ang) * 0.045, 0);
    vane.rotation.z = ang;
    paddleSpinner.add(vane);
  }
  paddleWheelGroup.add(paddleSpinner);
  paddleWheelGroup.visible = false;
  group.add(paddleWheelGroup);

  // Horseshoe Deflection Magnet
  const magnetGroup = new THREE.Group();
  magnetGroup.position.set(0.15, 0.38, 0.52);
  const legN = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.09), mats.magnetNorth);
  legN.position.set(0, 0.16, 0.09);
  const legS = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, 0.09), mats.magnetSouth);
  legS.position.set(0, 0.16, -0.09);
  const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.27), mats.steel);
  bridge.position.set(0, 0.04, 0);
  magnetGroup.add(legN, legS, bridge);
  magnetGroup.visible = false;
  group.add(magnetGroup);

  return {
    group,
    plasmaColumn,
    striationRings,
    cathodeDisk,
    cathodeMaterial,
    beamGroup,
    beamTube,
    electronParticles,
    malteseCrossArm,
    paddleWheelGroup,
    paddleSpinner,
    magnetGroup,
    znsRedraw: zns.redraw,
    crossHitProxy,
  };
}

export interface ThomsonRigHandles {
  group: THREE.Group;
  cathodeMaterial: THREE.MeshStandardMaterial;
  beamTube: THREE.Mesh;
  canalTube: THREE.Mesh;
  electronParticles: THREE.InstancedMesh;
  perforatedCathode: THREE.Group;
  plasmaGlow: THREE.Mesh;
  znsRedraw: (glow: number, crossShadow: boolean, spotOffset?: number) => void;
}

export function buildThomsonCanalRig(mats: LabMaterialPalette): ThomsonRigHandles {
  const group = new THREE.Group();
  addContactShadow(group, mats.shadowDisc, 1.25, 0.35);

  const base = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.07, 0.56), mats.darkOak);
  base.position.y = 0.035;
  base.castShadow = true;
  group.add(base);

  // Supports with brass U-saddle cradles hugging the tube underside
  [
    { x: -0.72, r: 0.132 },
    { x: 0.55, r: 0.235 },
  ].forEach(({ x, r }) => {
    const saddleBottom = 0.6 - r;
    const h = Math.max(0.14, saddleBottom - 0.07);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.032, h, 14), mats.brass);
    post.position.set(x, 0.07 + h / 2, 0);
    group.add(post);

    const clamp = new THREE.Mesh(new THREE.TorusGeometry(r, 0.015, 10, 24, Math.PI), mats.brass);
    clamp.rotation.y = Math.PI / 2;
    clamp.rotation.z = Math.PI;
    clamp.position.set(x, 0.6, 0);
    group.add(clamp);
  });

  // Main long CRT / Canal glass envelope
  const profile = [
    new THREE.Vector2(0.0, -1.05),
    new THREE.Vector2(0.12, -1.0),
    new THREE.Vector2(0.125, -0.3),
    new THREE.Vector2(0.16, 0.05),
    new THREE.Vector2(0.24, 0.65),
    new THREE.Vector2(0.26, 0.96),
    new THREE.Vector2(0.14, 1.04),
    new THREE.Vector2(0.0, 1.06),
  ];
  const tubeGeo = new THREE.LatheGeometry(profile, 36);
  tubeGeo.rotateZ(-Math.PI / 2);
  const glass = new THREE.Mesh(tubeGeo, mats.glass);
  glass.position.y = 0.6;
  glass.renderOrder = 6;
  group.add(glass);

  [
    { x: -0.96, r: 0.124 },
    { x: 0.94, r: 0.26 },
  ].forEach(({ x, r }) => {
    const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 8, 30), mats.glassRim);
    rim.rotation.y = Math.PI / 2;
    rim.position.set(x, 0.6, 0);
    rim.renderOrder = 7;
    group.add(rim);
  });

  const cathodeMaterial = new THREE.MeshStandardMaterial({
    color: CATHODE_COLORS.copper,
    roughness: 0.25,
    metalness: 0.88,
  });
  const cathode = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.024, 24), cathodeMaterial);
  cathode.rotation.z = Math.PI / 2;
  cathode.position.set(-0.78, 0.6, 0);
  group.add(cathode);

  // Perforated Cathode Assembly (slides active in Canal Ray mode)
  const perforatedCathode = new THREE.Group();
  perforatedCathode.position.set(-0.22, 0.6, 0);
  const perfRing = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.02, 10, 24), mats.brass);
  perfRing.rotation.y = Math.PI / 2;
  perforatedCathode.add(perfRing);
  for (let r = 0; r < 6; r++) {
    const a = (r * Math.PI) / 3;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.018, 0.16), mats.copper);
    bar.rotation.x = a;
    perforatedCathode.add(bar);
  }
  perforatedCathode.visible = false;
  group.add(perforatedCathode);

  // Parallel Electrostatic Plates (+ top, - bottom)
  [-0.08, 0.08].forEach((dy, idx) => {
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.012, 0.14), mats.copper);
    plate.position.set(0.12, 0.6 + dy, 0);
    group.add(plate);
    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.18, 8),
      idx === 1 ? mats.magnetNorth : mats.magnetSouth
    );
    wire.position.set(0.12, 0.6 + (idx === 1 ? 0.17 : -0.17), 0);
    group.add(wire);
  });

  // Twin Helmholtz Magnetic Field Coils flanking the deflection region
  [-0.22, 0.22].forEach((z) => {
    const coil = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.032, 12, 28), mats.copper);
    coil.position.set(0.12, 0.6, z);
    coil.castShadow = true;
    group.add(coil);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.04), mats.brass);
    frame.position.set(0.12, 0.22, z);
    group.add(frame);
  });

  // ZnS phosphor end screen
  const zns = createZnsMalteseTexture();
  const znsDisc = new THREE.Mesh(
    new THREE.CircleGeometry(0.24, 32),
    new THREE.MeshBasicMaterial({ map: zns.texture, transparent: true, opacity: 0.95, side: THREE.DoubleSide })
  );
  znsDisc.rotation.y = -Math.PI / 2;
  znsDisc.position.set(0.96, 0.6, 0);
  znsDisc.renderOrder = 4;
  group.add(znsDisc);

  // Forward electron beam
  const beamTube = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([new THREE.Vector3(-0.72, 0.6, 0), new THREE.Vector3(0.96, 0.6, 0)]),
      24,
      0.022,
      10,
      false
    ),
    new THREE.MeshBasicMaterial({
      color: 0x6bff96,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  beamTube.renderOrder = 4;
  group.add(beamTube);

  // Backward positive canal rays stream (between perforated cathode and left end)
  const canalTube = new THREE.Mesh(
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([new THREE.Vector3(-0.22, 0.6, 0), new THREE.Vector3(-0.98, 0.6, 0)]),
      20,
      0.026,
      10,
      false
    ),
    new THREE.MeshBasicMaterial({
      color: 0xff5fa2,
      transparent: true,
      opacity: 0.88,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  canalTube.visible = false;
  canalTube.renderOrder = 4;
  group.add(canalTube);

  // Gas discharge ambient haze
  const plasmaGlow = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16),
    new THREE.MeshBasicMaterial({
      color: 0xff4b91,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  plasmaGlow.rotation.z = Math.PI / 2;
  plasmaGlow.position.set(0, 0.6, 0);
  group.add(plasmaGlow);

  const electronParticles = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.014, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xd1ffe0 }),
    20
  );
  electronParticles.frustumCulled = false;
  group.add(electronParticles);

  return {
    group,
    cathodeMaterial,
    beamTube,
    canalTube,
    electronParticles,
    perforatedCathode,
    plasmaGlow,
    znsRedraw: zns.redraw,
  };
}

export interface MillikanRigHandles {
  group: THREE.Group;
  xrayBeam: THREE.Mesh;
  squeezeBulb: THREE.Mesh;
  oilMistParticles: THREE.InstancedMesh;
}

export function buildMillikanRig(mats: LabMaterialPalette): MillikanRigHandles {
  const group = new THREE.Group();
  addContactShadow(group, mats.shadowDisc, 0.85, 0.55);

  // Heavy tripod oak & brass base
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.5, 0.07, 32), mats.darkOak);
  plinth.position.y = 0.035;
  plinth.castShadow = true;
  group.add(plinth);

  // Three brass leveling legs
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.08, 12), mats.brass);
    foot.position.set(Math.cos(a) * 0.36, 0.08, Math.sin(a) * 0.36);
    group.add(foot);
  }

  // Main cylindrical brass condenser chamber
  const chamberBody = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.56, 32), mats.brass);
  chamberBody.position.y = 0.4;
  chamberBody.castShadow = true;
  group.add(chamberBody);

  // Ebonite central insulating belt + glass viewing port
  const insulatorRing = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.14, 32), mats.ebonite);
  insulatorRing.position.y = 0.4;
  group.add(insulatorRing);

  const viewportWindow = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 20), mats.glass);
  viewportWindow.rotation.z = Math.PI / 2;
  viewportWindow.position.set(0.32, 0.4, 0);
  group.add(viewportWindow);

  // Top dome lid + beveled oil spray intake funnel
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.33, 0.06, 32), mats.brass);
  lid.position.y = 0.71;
  group.add(lid);

  const funnelCup = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.04, 0.06, 24), mats.brass);
  funnelCup.position.y = 0.765;
  group.add(funnelCup);

  const portBezel = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.014, 10, 24), mats.brass);
  portBezel.rotation.y = Math.PI / 2;
  portBezel.position.set(0.325, 0.4, 0);
  group.add(portBezel);

  // Atomizer nozzle + squeeze bulb
  const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.36, 12), mats.brass);
  nozzle.rotation.z = Math.PI / 3;
  nozzle.position.set(-0.42, 0.76, 0);
  group.add(nozzle);

  const squeezeBulb = new THREE.Mesh(new THREE.SphereGeometry(0.11, 18, 16), mats.rubberRed);
  squeezeBulb.scale.set(1.3, 0.9, 0.9);
  squeezeBulb.position.set(-0.62, 0.78, 0);
  squeezeBulb.castShadow = true;
  group.add(squeezeBulb);

  // X-ray tube assembly on grounded ebonite pedestal + brass collar (left flank)
  const xrayStandBase = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.24), mats.darkOak);
  xrayStandBase.position.set(-0.64, 0.025, 0.22);
  group.add(xrayStandBase);
  const xrayPost = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.03, 0.31, 12), mats.brass);
  xrayPost.position.set(-0.64, 0.19, 0.22);
  group.add(xrayPost);
  const xrayCollar = new THREE.Mesh(new THREE.TorusGeometry(0.078, 0.012, 8, 20), mats.brass);
  xrayCollar.rotation.y = Math.PI / 2;
  xrayCollar.position.set(-0.64, 0.4, 0.22);
  group.add(xrayCollar);

  const xrayTube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.34, 18), mats.glass);
  xrayTube.rotation.z = Math.PI / 2;
  xrayTube.position.set(-0.64, 0.4, 0.22);
  group.add(xrayTube);

  const xrayBeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.055, 0.42, 12),
    new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  xrayBeam.rotation.z = Math.PI / 2;
  xrayBeam.position.set(-0.42, 0.4, 0.1);
  group.add(xrayBeam);

  // Viewing Microscope on grounded cast-iron stand with brass saddle aimed cleanly at porthole
  const scopeBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.04, 20), mats.darkOak);
  scopeBase.position.set(0.68, 0.02, 0);
  group.add(scopeBase);

  const scopeStand = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.052, 0.36, 16), mats.lead);
  scopeStand.position.set(0.68, 0.21, 0);
  group.add(scopeStand);

  const scopeSaddle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 8, 18), mats.brass);
  scopeSaddle.rotation.y = Math.PI / 2;
  scopeSaddle.position.set(0.68, 0.4, 0);
  group.add(scopeSaddle);

  const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.032, 0.46, 18), mats.brass);
  scopeTube.rotation.z = Math.PI / 2.15;
  scopeTube.position.set(0.64, 0.4, 0);
  group.add(scopeTube);

  const eyepiece = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.07, 16), mats.ebonite);
  eyepiece.rotation.z = Math.PI / 2.15;
  eyepiece.position.set(0.87, 0.42, 0);
  group.add(eyepiece);

  const oilMistParticles = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.012, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xfde047 }),
    18
  );
  oilMistParticles.frustumCulled = false;
  group.add(oilMistParticles);

  return { group, xrayBeam, squeezeBulb, oilMistParticles };
}

export interface RutherfordRigHandles {
  group: THREE.Group;
  detectorArm: THREE.Group;
  foilMesh: THREE.Mesh;
  alphaParticles: THREE.InstancedMesh;
  scintillationGlow: THREE.Mesh;
}

export function buildRutherfordRig(mats: LabMaterialPalette): RutherfordRigHandles {
  const group = new THREE.Group();
  addContactShadow(group, mats.shadowDisc, 1.05, 1.05);

  // Circular optical table pedestal with 360 degree protractor scale
  const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.96, 0.08, 48), mats.darkOak);
  pedestal.position.y = 0.04;
  pedestal.receiveShadow = true;
  group.add(pedestal);

  const protractorTex = createProtractorTexture(mats.maxAnisotropy);
  const protractor = new THREE.Mesh(
    new THREE.CircleGeometry(0.89, 48),
    new THREE.MeshStandardMaterial({ map: protractorTex, roughness: 0.55, metalness: 0.1 })
  );
  protractor.rotation.x = -Math.PI / 2;
  protractor.position.y = 0.082;
  group.add(protractor);

  // Central upright foil frame
  const foilMountBase = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.28, 16), mats.brass);
  foilMountBase.position.y = 0.22;
  group.add(foilMountBase);

  const foilFrame = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.015, 10, 28), mats.brass);
  foilFrame.rotation.y = Math.PI / 2;
  foilFrame.position.y = 0.5;
  group.add(foilFrame);

  const foilMesh = new THREE.Mesh(new THREE.CircleGeometry(0.148, 28), mats.goldFoil);
  foilMesh.rotation.y = Math.PI / 2;
  foilMesh.position.y = 0.5;
  group.add(foilMesh);

  // Heavy Lead Block Alpha Source at -X (angle 180° incoming -> exits toward +X = 0° forward)
  const leadBlock = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.3, 0.3), mats.lead);
  leadBlock.position.set(-0.68, 0.44, 0);
  leadBlock.castShadow = true;
  group.add(leadBlock);

  const leadStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.11, 0.24, 16), mats.ebonite);
  leadStand.position.set(-0.68, 0.18, 0);
  group.add(leadStand);

  const collimator = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.044, 0.14, 16), mats.brass);
  collimator.rotation.z = Math.PI / 2;
  collimator.position.set(-0.46, 0.5, 0);
  group.add(collimator);

  // Rotatable ZnS Detector Ring + Microscope Arm pivoting around (0, 0, 0)
  const detectorArm = new THREE.Group();
  const armBar = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.03, 0.09), mats.brass);
  armBar.position.set(0.46, 0.1, 0);
  detectorArm.add(armBar);

  // Curved ZnS screen segment
  const znsPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.24, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.4, metalness: 0.1 })
  );
  znsPlate.position.set(0.72, 0.5, 0);
  detectorArm.add(znsPlate);

  const scintillationGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 12, 12),
    new THREE.MeshBasicMaterial({
      color: 0x86efac,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })
  );
  scintillationGlow.position.set(0.7, 0.5, 0);
  detectorArm.add(scintillationGlow);

  const detStand = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.045, 0.38, 14), mats.brass);
  detStand.position.set(0.78, 0.28, 0);
  detectorArm.add(detStand);

  const detScope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.028, 0.34, 16), mats.ebonite);
  detScope.rotation.z = Math.PI / 2;
  detScope.position.set(0.9, 0.5, 0);
  detectorArm.add(detScope);

  group.add(detectorArm);

  // Animated 3D alpha particle projectiles (white material tinted per instance)
  const alphaParticles = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.018, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
    36
  );
  alphaParticles.frustumCulled = false;
  group.add(alphaParticles);

  return { group, detectorArm, foilMesh, alphaParticles, scintillationGlow };
}

export function getCathodeColor(metal: CathodeMetal): number {
  return CATHODE_COLORS[metal];
}

export function updateFoilMaterial(
  foilMesh: THREE.Mesh,
  materialType: FoilMaterial,
  mats: LabMaterialPalette
) {
  foilMesh.material = materialType === 'gold' ? mats.goldFoil : mats.aluminumFoil;
}

export function buildGhostSlotsGroup(
  slots: Array<{ id: string; x: number; z: number }>,
  placedIds: Set<string>
): THREE.Group {
  const ghostGroup = new THREE.Group();
  slots.forEach((s) => {
    if (placedIds.has(s.id)) return;
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.22, 28),
      new THREE.MeshBasicMaterial({
        color: 0xfbbf24,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.78,
      })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(s.x, 0.018, s.z);
    ring.userData = { slotId: s.id };
    ghostGroup.add(ring);

    const innerDot = new THREE.Mesh(
      new THREE.CircleGeometry(0.06, 20),
      new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.38,
      })
    );
    innerDot.rotation.x = -Math.PI / 2;
    innerDot.position.set(s.x, 0.016, s.z);
    ghostGroup.add(innerDot);
  });
  return ghostGroup;
}

export type AnyRig =
  | CrookesRigHandles
  | ThomsonRigHandles
  | MillikanRigHandles
  | RutherfordRigHandles;

export function getBeamStartEndFromParams(params: LabSimulationParams): {
  showBeam: boolean;
} {
  return {
    showBeam: params.hvEnabled && params.pressureMmHg <= 0.2,
  };
}
