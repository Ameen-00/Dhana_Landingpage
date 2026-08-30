/**
 * Floating chrome medallion — motion + composition from mal.ai hero coin
 * (Screenshot 3278: large right-side metallic disc, slow float + tilt).
 */
import * as THREE from "three";

/**
 * @param {HTMLElement} mount
 * @param {{ reducedMotion?: boolean }} [opts]
 */
export function mountBrandMedallion(mount, opts = {}) {
  if (!mount) return { destroy() {} };
  const reduced = !!opts.reducedMotion;

  const width = Math.max(mount.clientWidth || 480, 200);
  const height = Math.max(mount.clientHeight || 480, 200);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100);
  camera.position.set(0, 0.05, 3.6);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(width, height);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  mount.appendChild(renderer.domElement);

  // Studio lights — hard specular like mal chrome coin
  const key = new THREE.DirectionalLight(0xffffff, 2.1);
  key.position.set(3.2, 4.2, 5);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xa8b4ff, 0.7);
  fill.position.set(-4, 0.5, 2);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.1);
  rim.position.set(-1, -3, -4);
  scene.add(rim);
  scene.add(new THREE.AmbientLight(0x8890aa, 0.45));

  // Fake env for metal reflections
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  envScene.add(new THREE.HemisphereLight(0xffffff, 0x222233, 1.2));
  const envTex = pmrem.fromScene(envScene, 0.04).texture;
  scene.environment = envTex;
  pmrem.dispose();

  const coin = buildCoin();
  coin.scale.setScalar(1.15);
  scene.add(coin);

  // Soft violet ground bloom under coin (mal ambient)
  const glow = new THREE.Mesh(
    new THREE.CircleGeometry(1.5, 64),
    new THREE.MeshBasicMaterial({
      color: 0x533afd,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    }),
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -1.25;
  scene.add(glow);

  let raf = 0;
  const clock = new THREE.Clock();

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    if (!reduced) {
      // mal.ai feel: slow yaw + gentle pitch rock + float
      coin.rotation.y = t * 0.28;
      coin.rotation.x = 0.35 + Math.sin(t * 0.65) * 0.22;
      coin.rotation.z = Math.sin(t * 0.4) * 0.06;
      coin.position.y = Math.sin(t * 0.85) * 0.14;
      glow.scale.setScalar(1 + Math.sin(t * 0.85) * 0.08);
      glow.material.opacity = 0.11 + Math.sin(t * 0.85) * 0.05;
    } else {
      coin.rotation.x = 0.35;
      coin.rotation.y = 0.4;
    }
    renderer.render(scene, camera);
  };
  tick();

  const ro = new ResizeObserver(() => {
    const w = Math.max(mount.clientWidth || 480, 200);
    const h = Math.max(mount.clientHeight || 480, 200);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(mount);

  return {
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    },
  };
}

function buildCoin() {
  const group = new THREE.Group();

  const metal = new THREE.MeshStandardMaterial({
    color: 0x3a425c,
    metalness: 1,
    roughness: 0.18,
    envMapIntensity: 1.6,
  });
  const chrome = new THREE.MeshStandardMaterial({
    color: 0xb8c0e0,
    metalness: 1,
    roughness: 0.12,
    envMapIntensity: 1.8,
  });

  const body = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.05, 0.12, 96), metal);
  group.add(body);

  const rim = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.05, 16, 96), chrome);
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  const inner = new THREE.Mesh(
    new THREE.TorusGeometry(0.78, 0.018, 12, 96),
    new THREE.MeshStandardMaterial({ color: 0x1a1e2e, metalness: 0.9, roughness: 0.3 }),
  );
  inner.rotation.x = Math.PI / 2;
  inner.position.y = 0.065;
  group.add(inner);

  const faceMat = new THREE.MeshStandardMaterial({
    map: makeFaceTexture(),
    metalness: 0.85,
    roughness: 0.22,
    envMapIntensity: 1.3,
  });
  const face = new THREE.Mesh(new THREE.CircleGeometry(0.98, 96), faceMat);
  face.rotation.x = -Math.PI / 2;
  face.position.y = 0.062;
  group.add(face);

  const back = face.clone();
  back.rotation.x = Math.PI / 2;
  back.position.y = -0.062;
  group.add(back);

  return group;
}

function makeFaceTexture() {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d");

  const g = ctx.createRadialGradient(size * 0.35, size * 0.3, 8, size * 0.5, size * 0.5, size * 0.55);
  g.addColorStop(0, "#6a7398");
  g.addColorStop(0.35, "#2e354d");
  g.addColorStop(1, "#0d1018");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // Engraved radial geometry (mal-like)
  ctx.strokeStyle = "rgba(210, 218, 255, 0.32)";
  ctx.lineWidth = 4;
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(size / 2 + Math.cos(a) * 70, size / 2 + Math.sin(a) * 70);
    ctx.lineTo(size / 2 + Math.cos(a) * 420, size / 2 + Math.sin(a) * 420);
    ctx.stroke();
  }
  ;[380, 300, 220, 140].forEach((r, idx) => {
    ctx.beginPath();
    ctx.lineWidth = idx === 0 ? 5 : 3;
    ctx.arc(size / 2, size / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  });

  // Center glyph
  ctx.fillStyle = "#eef0ff";
  ctx.font = "600 280px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("ध", size / 2, size / 2 + 12);

  ctx.fillStyle = "rgba(238, 240, 255, 0.5)";
  ctx.font = "500 42px Inter, system-ui, sans-serif";
  ctx.fillText("DHANA", size / 2, size * 0.82);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function initAllBrandMedallions({ reducedMotion = false } = {}) {
  const instances = [];
  document.querySelectorAll("[data-brand-medallion]").forEach((el) => {
    instances.push(mountBrandMedallion(el, { reducedMotion }));
  });
  return {
    destroy() {
      instances.forEach((i) => i.destroy());
    },
  };
}
