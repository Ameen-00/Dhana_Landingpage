/**
 * Vanilla port of Kerala-bank VoiceOrb3D (Three.js shader icosahedron).
 * Mount into any sized container; call setState / setAudioLevel / destroy.
 */
import * as THREE from "three";

/** @typedef {"idle" | "listening" | "thinking" | "speaking"} OrbState */

/**
 * @typedef {object} StatePreset
 * @property {number} speed
 * @property {number} noiseDensity
 * @property {number} noiseStrength
 * @property {[number, number, number]} color1
 * @property {[number, number, number]} color2
 * @property {number} fresnelPower
 * @property {number} audioInfluence
 * @property {number} colorIntensity
 */

/** @type {Record<OrbState, StatePreset>} */
const STATE_PRESETS = {
  idle: {
    speed: 0.15,
    noiseDensity: 0.8,
    noiseStrength: 0.2,
    color1: [0.5, 0.6, 1.0],
    color2: [0.7, 0.5, 0.95],
    fresnelPower: 1.8,
    audioInfluence: 0.0,
    colorIntensity: 0.2,
  },
  listening: {
    speed: 0.2,
    noiseDensity: 0.9,
    noiseStrength: 0.22,
    color1: [0.2, 0.85, 0.9],
    color2: [0.3, 0.6, 1.0],
    fresnelPower: 1.6,
    audioInfluence: 0.15,
    colorIntensity: 0.5,
  },
  thinking: {
    speed: 0.25,
    noiseDensity: 1.0,
    noiseStrength: 0.18,
    color1: [0.9, 0.5, 0.3],
    color2: [0.85, 0.3, 0.7],
    fresnelPower: 1.8,
    audioInfluence: 0.0,
    colorIntensity: 0.6,
  },
  speaking: {
    speed: 0.25,
    noiseDensity: 0.8,
    noiseStrength: 0.2,
    color1: [0.95, 0.3, 0.5],
    color2: [0.5, 0.3, 1.0],
    fresnelPower: 2.0,
    audioInfluence: 1.0,
    colorIntensity: 0.8,
  },
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uNoiseStrength;
  uniform float uNoiseDensity;
  uniform float uSpeed;

  varying float vDistort;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(
      permute(
        permute(
          i.z + vec4(0.0, i1.z, i2.z, 1.0)
        ) + i.y + vec4(0.0, i1.y, i2.y, 1.0)
      ) + i.x + vec4(0.0, i1.x, i2.x, 1.0)
    );

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vec3 norm = normalize(normal);

    float t = uTime * uSpeed;
    float n1 = snoise(norm * uNoiseDensity + t);
    float n2 = snoise(norm * uNoiseDensity * 0.5 + t * 0.7 + 100.0);
    float noise = n1 * 0.7 + n2 * 0.3;

    float displacement = noise * uNoiseStrength;
    vDistort = noise;

    vec3 newPosition = position + norm * displacement;

    vNormal = normalize(normalMatrix * norm);

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    vViewPosition = -mvPosition.xyz;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uFresnelPower;
  uniform float uColorIntensity;

  varying float vDistort;
  varying vec3 vNormal;
  varying vec3 vViewPosition;

  vec3 pastelIridescence(float angle, float distort, vec3 base, vec3 accent) {
    float shift = angle * 2.5 + distort * 2.0;
    float t = fract(shift * 0.4 + 0.5);

    vec3 c1 = base;
    vec3 c2 = accent;
    vec3 c3 = vec3(0.95, 0.6, 0.7);
    vec3 c4 = vec3(0.92, 0.94, 1.0);

    vec3 color;
    if (t < 0.25) {
      color = mix(c4, c1, t / 0.25);
    } else if (t < 0.5) {
      color = mix(c1, c2, (t - 0.25) / 0.25);
    } else if (t < 0.75) {
      color = mix(c2, c3, (t - 0.5) / 0.25);
    } else {
      color = mix(c3, c4, (t - 0.75) / 0.25);
    }
    return color;
  }

  void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vNormal);

    float NdotV = max(dot(viewDir, normal), 0.0);
    float fresnel = pow(1.0 - NdotV, uFresnelPower);

    vec3 iriColor = pastelIridescence(NdotV, vDistort, uColor1, uColor2);

    float whiteBlend = 0.45 * (1.0 - uColorIntensity * 0.5);
    vec3 pastel = mix(iriColor, vec3(1.0), whiteBlend);

    float centerWhite = smoothstep(0.0, 0.8, NdotV);
    float centerBlend = 0.55 * (1.0 - uColorIntensity * 0.35);
    vec3 surfaceColor = mix(pastel, vec3(0.97, 0.97, 1.0), centerWhite * centerBlend);

    float dMask = smoothstep(-0.5, 0.7, vDistort);
    surfaceColor = mix(surfaceColor, pastel * 1.05, (1.0 - centerWhite) * dMask * 0.5);

    float warmZone = smoothstep(0.1, 0.4, vDistort) * smoothstep(0.7, 0.4, vDistort);
    surfaceColor += warmZone * vec3(0.08, 0.0, 0.02) * (1.0 - NdotV);

    surfaceColor = mix(surfaceColor, vec3(1.0), fresnel * 0.4);

    float alpha = smoothstep(0.0, 0.15, NdotV) * (1.0 - fresnel * 0.35);
    alpha = max(alpha, 0.08);

    gl_FragColor = vec4(surfaceColor, alpha);
  }
`;

/**
 * @param {HTMLElement} container
 * @param {{
 *   state?: OrbState,
 *   audioLevel?: number,
 *   detail?: number,
 *   pixelRatioLimit?: number,
 *   reducedMotion?: boolean,
 * }} [opts]
 */
export function mountVoiceOrb3D(container, opts = {}) {
  if (!container) return null;

  const detail = opts.detail ?? 4;
  const pixelRatioLimit = opts.pixelRatioLimit ?? 2;
  const reducedMotion = Boolean(opts.reducedMotion);
  let state = /** @type {OrbState} */ (opts.state || "idle");
  let audioLevel = opts.audioLevel ?? 0;

  const width = container.clientWidth || 160;
  const height = container.clientHeight || 160;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 3);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return null;
  }

  renderer.setClearColor(0x000000, 0);
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioLimit));
  renderer.domElement.style.display = "block";
  renderer.domElement.style.width = "100%";
  renderer.domElement.style.height = "100%";
  container.appendChild(renderer.domElement);

  const uniforms = {
    uTime: { value: 0 },
    uNoiseStrength: { value: 0.2 },
    uNoiseDensity: { value: 0.8 },
    uSpeed: { value: 0.15 },
    uColor1: { value: new THREE.Vector3(0.5, 0.6, 1.0) },
    uColor2: { value: new THREE.Vector3(0.7, 0.5, 0.95) },
    uFresnelPower: { value: 1.8 },
    uColorIntensity: { value: 0.2 },
  };

  const geometry = new THREE.IcosahedronGeometry(1, detail);
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let smoothAudio = 0;
  /** @type {StatePreset} */
  const current = { ...STATE_PRESETS.idle, color1: [...STATE_PRESETS.idle.color1], color2: [...STATE_PRESETS.idle.color2] };
  let prevTime = performance.now();
  let animId = 0;
  let running = true;
  let visible = true;

  const tick = () => {
    if (!running) return;
    animId = requestAnimationFrame(tick);

    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!visible || w < 2 || h < 2) return;

    const now = performance.now();
    const delta = reducedMotion ? 0 : Math.min((now - prevTime) / 1000, 0.1);
    prevTime = now;

    const preset = STATE_PRESETS[state] || STATE_PRESETS.idle;
    const stateLerp = reducedMotion ? 1 : 1 - Math.pow(0.001, Math.max(delta, 0.001));
    const audioLerp = reducedMotion ? 1 : 1 - Math.pow(0.05, Math.max(delta, 0.001));

    smoothAudio = THREE.MathUtils.lerp(smoothAudio, audioLevel, audioLerp);

    current.speed = THREE.MathUtils.lerp(current.speed, preset.speed, stateLerp);
    current.noiseDensity = THREE.MathUtils.lerp(current.noiseDensity, preset.noiseDensity, stateLerp);
    current.fresnelPower = THREE.MathUtils.lerp(current.fresnelPower, preset.fresnelPower, stateLerp);
    current.colorIntensity = THREE.MathUtils.lerp(current.colorIntensity, preset.colorIntensity, stateLerp);

    for (let i = 0; i < 3; i++) {
      current.color1[i] = THREE.MathUtils.lerp(current.color1[i], preset.color1[i], stateLerp);
      current.color2[i] = THREE.MathUtils.lerp(current.color2[i], preset.color2[i], stateLerp);
    }

    let baseNoise = preset.noiseStrength;
    if (state === "thinking") {
      baseNoise += Math.sin(uniforms.uTime.value * 3.0) * 0.04;
    }

    const effectiveNoise = baseNoise + smoothAudio * 0.3 * preset.audioInfluence;
    current.noiseStrength = THREE.MathUtils.lerp(current.noiseStrength, effectiveNoise, audioLerp);

    const scale = 1.0 + smoothAudio * 0.04 * preset.audioInfluence;
    mesh.scale.setScalar(scale);

    if (!reducedMotion) {
      uniforms.uTime.value += delta;
      mesh.rotation.y += delta * 0.08;
      mesh.rotation.x += delta * 0.03;
    }

    uniforms.uSpeed.value = current.speed;
    uniforms.uNoiseDensity.value = current.noiseDensity;
    uniforms.uNoiseStrength.value = current.noiseStrength;
    uniforms.uFresnelPower.value = current.fresnelPower;
    uniforms.uColorIntensity.value = current.colorIntensity;
    uniforms.uColor1.value.set(current.color1[0], current.color1[1], current.color1[2]);
    uniforms.uColor2.value.set(current.color2[0], current.color2[1], current.color2[2]);

    renderer.render(scene, camera);
  };

  const onResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w < 2 || h < 2) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  };

  const observer = new ResizeObserver(onResize);
  observer.observe(container);

  let io = null;
  if (typeof IntersectionObserver !== "undefined") {
    io = new IntersectionObserver(
      (entries) => {
        visible = entries.some((e) => e.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(container);
  }

  const renderStatic = () => {
    const preset = STATE_PRESETS[state] || STATE_PRESETS.idle;
    uniforms.uNoiseStrength.value = preset.noiseStrength;
    uniforms.uNoiseDensity.value = preset.noiseDensity;
    uniforms.uSpeed.value = preset.speed;
    uniforms.uFresnelPower.value = preset.fresnelPower;
    uniforms.uColorIntensity.value = preset.colorIntensity;
    uniforms.uColor1.value.set(...preset.color1);
    uniforms.uColor2.value.set(...preset.color2);
    if (container.clientWidth > 1) renderer.render(scene, camera);
  };

  if (reducedMotion) {
    renderStatic();
  } else {
    tick();
  }

  return {
    /** @param {OrbState} next */
    setState(next) {
      if (STATE_PRESETS[next]) state = next;
      if (reducedMotion) {
        const preset = STATE_PRESETS[state];
        uniforms.uNoiseStrength.value = preset.noiseStrength;
        uniforms.uNoiseDensity.value = preset.noiseDensity;
        uniforms.uColorIntensity.value = preset.colorIntensity;
        uniforms.uColor1.value.set(...preset.color1);
        uniforms.uColor2.value.set(...preset.color2);
        if (container.clientWidth > 1) renderer.render(scene, camera);
      }
    },
    /** @param {number} level */
    setAudioLevel(level) {
      audioLevel = Math.max(0, Math.min(1, level));
    },
    destroy() {
      running = false;
      cancelAnimationFrame(animId);
      observer.disconnect();
      io?.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}

/**
 * Mount every [data-voice-orb-3d] on the page.
 * Defers WebGL until the container has a real size (hidden phone states).
 * @param {{ reducedMotion?: boolean }} [opts]
 */
export function initAllVoiceOrb3D(opts = {}) {
  const reducedMotion =
    opts.reducedMotion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /** @type {Map<HTMLElement, ReturnType<typeof mountVoiceOrb3D>>} */
  const instances = new Map();

  /** @param {HTMLElement} el */
  const tryMount = (el) => {
    if (instances.has(el)) return;
    if (el.clientWidth < 8 || el.clientHeight < 8) return;
    const detail = Number(el.dataset.orbDetail || 4);
    const state = /** @type {OrbState} */ (el.dataset.orbState || "idle");
    const inst = mountVoiceOrb3D(el, { state, detail, reducedMotion });
    if (inst) {
      instances.set(el, inst);
      el.dataset.orbMounted = "1";
    }
  };

  document.querySelectorAll("[data-voice-orb-3d]").forEach((el) => {
    if (!(el instanceof HTMLElement)) return;
    tryMount(el);
    if (instances.has(el)) return;

    const ro = new ResizeObserver(() => {
      tryMount(el);
      if (instances.has(el)) ro.disconnect();
    });
    ro.observe(el);
  });

  return {
    instances,
    /** @param {HTMLElement | string} target @param {OrbState} state */
    setState(target, state) {
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      if (!(el instanceof HTMLElement)) return;
      el.dataset.orbState = state;
      tryMount(el);
      instances.get(el)?.setState(state);
    },
    /** Sync all orbs inside a root to one state */
    setStateAll(state, root = document) {
      root.querySelectorAll("[data-voice-orb-3d]").forEach((el) => {
        if (el instanceof HTMLElement) {
          el.dataset.orbState = state;
          tryMount(el);
          instances.get(el)?.setState(state);
        }
      });
    },
    destroy() {
      instances.forEach((inst) => inst?.destroy());
      instances.clear();
    },
  };
}
