/**
 * Hero motion: one large bubble → splits into many → reforms as "dhana." wordmark.
 * Inspired by mal.ai medallion morph energy; end state is Dhana branding.
 */

const WORD = 'dhana.'
const PHASES = {
  IDLE_BIG: 0,
  SPLIT: 1,
  SCATTER: 2,
  GATHER: 3,
  HOLD: 4,
}

/**
 * @param {HTMLElement} mount
 * @param {{ reducedMotion?: boolean }} [opts]
 */
export function mountBubbleLogo(mount, opts = {}) {
  if (!mount) return { destroy() {} }
  const reduced = !!opts.reducedMotion

  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  mount.appendChild(canvas)
  const ctx = canvas.getContext('2d')

  /** @type {{ x:number, y:number, r:number, tx:number, ty:number, tr:number, vx:number, vy:number, hue:number }[]} */
  let particles = []
  let targets = []
  let phase = PHASES.IDLE_BIG
  let phaseT = 0
  let raf = 0
  let w = 0
  let h = 0
  let dpr = 1
  let big = { x: 0, y: 0, r: 0 }

  const indigo = { h: 252, s: 98, l: 60 } // #533afd-ish

  function resize() {
    const rect = mount.getBoundingClientRect()
    w = Math.max(rect.width, 280)
    h = Math.max(rect.height, 280)
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.floor(w * dpr)
    canvas.height = Math.floor(h * dpr)
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    big = { x: w * 0.5, y: h * 0.48, r: Math.min(w, h) * 0.34 }
    targets = sampleWordTargets(WORD, w, h)
    if (particles.length === 0) resetBig()
    else if (phase >= PHASES.GATHER) retargetParticles()
  }

  function sampleWordTargets(text, width, height) {
    const off = document.createElement('canvas')
    const ow = Math.floor(width)
    const oh = Math.floor(height)
    off.width = ow
    off.height = oh
    const octx = off.getContext('2d')
    octx.clearRect(0, 0, ow, oh)
    octx.fillStyle = '#fff'
    octx.textAlign = 'center'
    octx.textBaseline = 'middle'
    const fontSize = Math.min(ow * 0.22, oh * 0.28, 96)
    octx.font = `600 ${fontSize}px Inter, system-ui, sans-serif`
    octx.fillText(text, ow / 2, oh / 2)

    const { data } = octx.getImageData(0, 0, ow, oh)
    const pts = []
    const step = Math.max(3, Math.floor(fontSize / 18))
    for (let y = 0; y < oh; y += step) {
      for (let x = 0; x < ow; x += step) {
        const a = data[(y * ow + x) * 4 + 3]
        if (a > 128) {
          // jitter inside glyph for organic bubble pack
          pts.push({
            x: x + (Math.random() - 0.5) * step * 0.4,
            y: y + (Math.random() - 0.5) * step * 0.4,
            r: step * (0.35 + Math.random() * 0.35),
          })
        }
      }
    }
    // Cap particle count for performance
    if (pts.length > 220) {
      const out = []
      const stride = Math.ceil(pts.length / 220)
      for (let i = 0; i < pts.length; i += stride) out.push(pts[i])
      return out
    }
    return pts
  }

  function resetBig() {
    particles = [
      {
        x: big.x,
        y: big.y,
        r: big.r,
        tx: big.x,
        ty: big.y,
        tr: big.r,
        vx: 0,
        vy: 0,
        hue: indigo.h,
      },
    ]
    phase = PHASES.IDLE_BIG
    phaseT = 0
  }

  function explode() {
    const n = Math.max(targets.length, 80)
    const next = []
    for (let i = 0; i < n; i++) {
      const ang = Math.random() * Math.PI * 2
      const dist = Math.random() * big.r * 0.35
      const t = targets[i % targets.length]
      next.push({
        x: big.x + Math.cos(ang) * dist,
        y: big.y + Math.sin(ang) * dist,
        r: big.r * (0.08 + Math.random() * 0.12),
        tx: t.x,
        ty: t.y,
        tr: t.r,
        vx: Math.cos(ang) * (2 + Math.random() * 5),
        vy: Math.sin(ang) * (2 + Math.random() * 5),
        hue: indigo.h + (Math.random() - 0.5) * 18,
      })
    }
    particles = next
    phase = PHASES.SPLIT
    phaseT = 0
  }

  function retargetParticles() {
    particles.forEach((p, i) => {
      const t = targets[i % targets.length]
      p.tx = t.x
      p.ty = t.y
      p.tr = t.r
    })
  }

  function drawBubble(p, alpha = 1) {
    const g = ctx.createRadialGradient(
      p.x - p.r * 0.3,
      p.y - p.r * 0.35,
      p.r * 0.1,
      p.x,
      p.y,
      p.r,
    )
    g.addColorStop(0, `hsla(${p.hue}, 90%, 78%, ${0.95 * alpha})`)
    g.addColorStop(0.45, `hsla(${p.hue}, 98%, 58%, ${0.85 * alpha})`)
    g.addColorStop(1, `hsla(${p.hue}, 90%, 28%, ${0.55 * alpha})`)
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fillStyle = g
    ctx.fill()
    // gloss
    ctx.beginPath()
    ctx.ellipse(p.x - p.r * 0.25, p.y - p.r * 0.3, p.r * 0.35, p.r * 0.22, -0.5, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255,255,255,${0.35 * alpha})`
    ctx.fill()
  }

  function tick() {
    raf = requestAnimationFrame(tick)
    phaseT += 1 / 60
    ctx.clearRect(0, 0, w, h)

    if (reduced) {
      // Static wordmark as soft bubble mosaic
      if (particles.length < 2) {
        particles = targets.map((t) => ({
          x: t.x,
          y: t.y,
          r: t.r,
          tx: t.x,
          ty: t.y,
          tr: t.r,
          vx: 0,
          vy: 0,
          hue: indigo.h,
        }))
      }
      particles.forEach((p) => drawBubble(p))
      return
    }

    if (phase === PHASES.IDLE_BIG) {
      // gentle breathe
      const breathe = 1 + Math.sin(phaseT * 2.2) * 0.03
      const p = particles[0]
      p.r = big.r * breathe
      p.x = big.x
      p.y = big.y + Math.sin(phaseT * 1.4) * 6
      drawBubble(p)
      if (phaseT > 2.2) explode()
      return
    }

    if (phase === PHASES.SPLIT || phase === PHASES.SCATTER) {
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.965
        p.vy *= 0.965
        p.r += (Math.min(p.tr * 1.8, big.r * 0.14) - p.r) * 0.08
        drawBubble(p, 0.9)
      })
      if (phase === PHASES.SPLIT && phaseT > 0.45) {
        phase = PHASES.SCATTER
        phaseT = 0
      }
      if (phase === PHASES.SCATTER && phaseT > 1.1) {
        phase = PHASES.GATHER
        phaseT = 0
        retargetParticles()
      }
      return
    }

    if (phase === PHASES.GATHER) {
      let settled = 0
      particles.forEach((p) => {
        p.x += (p.tx - p.x) * 0.08
        p.y += (p.ty - p.y) * 0.08
        p.r += (p.tr - p.r) * 0.1
        const dx = p.tx - p.x
        const dy = p.ty - p.y
        if (dx * dx + dy * dy < 4) settled += 1
        drawBubble(p)
      })
      // soft word outline hint late in gather
      if (phaseT > 1.2) {
        ctx.save()
        ctx.globalAlpha = Math.min(0.35, (phaseT - 1.2) * 0.25)
        ctx.fillStyle = '#533afd'
        ctx.font = `600 ${Math.min(w * 0.22, h * 0.28, 96)}px Inter, system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(WORD, w / 2, h / 2)
        ctx.restore()
      }
      if (settled > particles.length * 0.85 && phaseT > 1.6) {
        phase = PHASES.HOLD
        phaseT = 0
      }
      return
    }

    if (phase === PHASES.HOLD) {
      if (phaseT < 2.8) {
        particles.forEach((p, i) => {
          p.x = p.tx + Math.sin(phaseT * 2 + i) * 0.4
          p.y = p.ty + Math.cos(phaseT * 2.1 + i) * 0.4
          drawBubble(p)
        })
        ctx.save()
        ctx.globalAlpha = Math.min(0.55, phaseT * 0.45)
        ctx.fillStyle = '#061b31'
        ctx.font = `600 ${Math.min(w * 0.22, h * 0.28, 96)}px Inter, system-ui, sans-serif`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(WORD, w / 2, h / 2)
        ctx.restore()
      } else {
        // implode → single bubble → loop
        let merged = true
        particles.forEach((p) => {
          p.x += (big.x - p.x) * 0.12
          p.y += (big.y - p.y) * 0.12
          p.r += (4 - p.r) * 0.12
          drawBubble(p, 0.85)
          if (Math.hypot(p.x - big.x, p.y - big.y) > 10) merged = false
        })
        if (merged || phaseT > 4.2) resetBig()
      }
    }
  }

  resize()
  if (reduced) {
    particles = targets.map((t) => ({
      x: t.x,
      y: t.y,
      r: t.r,
      tx: t.x,
      ty: t.y,
      tr: t.r,
      vx: 0,
      vy: 0,
      hue: indigo.h,
    }))
  }
  tick()

  const ro = new ResizeObserver(() => resize())
  ro.observe(mount)

  // Replay on click
  const onClick = () => {
    if (reduced) return
    resetBig()
  }
  mount.addEventListener('click', onClick)
  mount.style.cursor = 'pointer'
  mount.title = 'Replay animation'

  return {
    destroy() {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mount.removeEventListener('click', onClick)
      if (canvas.parentNode === mount) mount.removeChild(canvas)
    },
    replay: onClick,
  }
}

export function initAllBubbleLogos({ reducedMotion = false } = {}) {
  const instances = []
  document.querySelectorAll('[data-bubble-logo]').forEach((el) => {
    instances.push(mountBubbleLogo(el, { reducedMotion }))
  })
  return {
    destroy() {
      instances.forEach((i) => i.destroy?.())
    },
  }
}
