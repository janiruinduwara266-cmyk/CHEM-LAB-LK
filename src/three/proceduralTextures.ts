import * as THREE from 'three';

export interface WoodTexturePair {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

export function createTeakWoodTextures(maxAnisotropy: number): WoodTexturePair {
  const size = 512;
  const colorCanvas = document.createElement('canvas');
  colorCanvas.width = size;
  colorCanvas.height = size;
  const ctx = colorCanvas.getContext('2d')!;

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  // Rich warm Sri Lankan laboratory teak / oak base
  ctx.fillStyle = '#8F572B';
  ctx.fillRect(0, 0, size, size);
  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  // Subtle plank seams
  const plankCount = 4;
  const plankH = size / plankCount;
  for (let p = 0; p < plankCount; p++) {
    const y0 = p * plankH;
    const toneShift = (p % 2 === 0 ? 1 : -1) * 7;
    ctx.fillStyle = `rgb(${144 + toneShift}, ${86 + toneShift}, ${42 + Math.floor(toneShift * 0.5)})`;
    ctx.fillRect(0, y0, size, plankH);

    // Fine wood grain lines
    for (let i = 0; i < 65; i++) {
      const y = y0 + (i / 65) * plankH;
      const alpha = 0.06 + ((i * 17) % 10) * 0.012;
      ctx.strokeStyle = i % 3 === 0 ? `rgba(58, 30, 12, ${alpha})` : `rgba(195, 130, 72, ${alpha * 0.7})`;
      ctx.lineWidth = 1 + (i % 2);
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= size; x += 32) {
        const wave = Math.sin(x * 0.018 + p * 2.1 + i * 0.4) * 2.5;
        ctx.lineTo(x, y + wave);
      }
      ctx.stroke();

      bCtx.strokeStyle = i % 2 === 0 ? 'rgba(40,40,40,0.22)' : 'rgba(210,210,210,0.18)';
      bCtx.lineWidth = 1;
      bCtx.beginPath();
      bCtx.moveTo(0, y);
      for (let x = 0; x <= size; x += 32) {
        const wave = Math.sin(x * 0.018 + p * 2.1 + i * 0.4) * 2.5;
        bCtx.lineTo(x, y + wave);
      }
      bCtx.stroke();
    }

    // Plank seam groove
    ctx.fillStyle = 'rgba(42, 20, 8, 0.45)';
    ctx.fillRect(0, y0, size, 2);
    bCtx.fillStyle = '#202020';
    bCtx.fillRect(0, y0, size, 3);
  }

  const map = new THREE.CanvasTexture(colorCanvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 1.5);
  map.anisotropy = maxAnisotropy;

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(2, 1.5);
  bumpMap.anisotropy = maxAnisotropy;

  return { map, bumpMap };
}

export function createRadialShadowTexture(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 4, size / 2, size / 2, size / 2);
  grad.addColorStop(0, 'rgba(12, 6, 2, 0.72)');
  grad.addColorStop(0.55, 'rgba(12, 6, 2, 0.28)');
  grad.addColorStop(1, 'rgba(12, 6, 2, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createProtractorTexture(maxAnisotropy: number): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.arc(cx, cy, 242, 0, Math.PI * 2);
  ctx.fillStyle = '#1D2832';
  ctx.fill();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#C99649';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 198, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(220, 195, 140, 0.45)';
  ctx.stroke();

  ctx.font = 'bold 17px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  for (let deg = 0; deg < 360; deg += 5) {
    const rad = (deg * Math.PI) / 180;
    const isMajor = deg % 30 === 0;
    const isMed = deg % 15 === 0;
    const rOut = 232;
    const rIn = isMajor ? 204 : isMed ? 214 : 222;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(rad) * rIn, cy + Math.sin(rad) * rIn);
    ctx.lineTo(cx + Math.cos(rad) * rOut, cy + Math.sin(rad) * rOut);
    ctx.strokeStyle = isMajor ? '#FCD34D' : 'rgba(255, 245, 220, 0.65)';
    ctx.lineWidth = isMajor ? 3 : 1.3;
    ctx.stroke();

    if (isMajor) {
      const labelDeg = deg <= 180 ? deg : 360 - deg;
      const lx = cx + Math.cos(rad) * 180;
      const ly = cy + Math.sin(rad) * 180;
      ctx.fillStyle = '#F8EFE0';
      ctx.fillText(`${labelDeg}°`, lx, ly);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createGaugeDialTexture(title: string, unit: string, maxAnisotropy: number): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;

  ctx.fillStyle = '#F7F2E7';
  ctx.beginPath();
  ctx.arc(cx, cy, 124, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#8B5A2B';
  ctx.stroke();

  for (let i = 0; i <= 10; i++) {
    const angle = Math.PI * 0.75 + (i / 10) * Math.PI * 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * 86, cy + Math.sin(angle) * 86);
    ctx.lineTo(cx + Math.cos(angle) * 106, cy + Math.sin(angle) * 106);
    ctx.strokeStyle = i >= 8 ? '#B91C1C' : '#1F2937';
    ctx.lineWidth = i % 2 === 0 ? 3 : 1.5;
    ctx.stroke();
  }

  ctx.fillStyle = '#1E293B';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, cx, cy - 22);
  ctx.font = 'bold 16px monospace';
  ctx.fillStyle = '#B45309';
  ctx.fillText(unit, cx, cy + 52);

  // Needle
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + 68, cy - 42);
  ctx.strokeStyle = '#DC2626';
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, 8, 0, Math.PI * 2);
  ctx.fillStyle = '#1E293B';
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = maxAnisotropy;
  return tex;
}

export function createZnsMalteseTexture(): {
  canvas: HTMLCanvasElement;
  texture: THREE.CanvasTexture;
  redraw: (glowIntensity: number, crossShadow: boolean, spotOffsetNorm?: number) => void;
} {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const redraw = (glowIntensity: number, crossShadow: boolean, spotOffsetNorm = 0) => {
    const cx = size / 2;
    const cy = size / 2;

    ctx.fillStyle = '#0F1A14';
    ctx.fillRect(0, 0, size, size);

    if (glowIntensity > 0.02) {
      const g = ctx.createRadialGradient(
        cx,
        cy - spotOffsetNorm * 62,
        6,
        cx,
        cy,
        size * 0.48
      );
      g.addColorStop(0, `rgba(145, 255, 130, ${0.95 * glowIntensity})`);
      g.addColorStop(0.55, `rgba(45, 225, 90, ${0.72 * glowIntensity})`);
      g.addColorStop(1, `rgba(12, 85, 32, ${0.15 * glowIntensity})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, size, size);
    }

    if (crossShadow && glowIntensity > 0.05) {
      // Draw crisp dark Maltese Cross shadow centered on ZnS screen
      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = `rgba(5, 12, 8, ${0.94})`;
      for (let arm = 0; arm < 4; arm++) {
        ctx.save();
        ctx.rotate((arm * Math.PI) / 2);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-28, -88);
        ctx.lineTo(0, -72);
        ctx.lineTo(28, -88);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    texture.needsUpdate = true;
  };

  redraw(0, false, 0);
  return { canvas, texture, redraw };
}
