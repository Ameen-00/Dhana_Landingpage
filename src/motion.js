/**
 * International scroll craft — Lenis + GSAP ScrollTrigger.
 * Functional motion only. Respects prefers-reduced-motion.
 */
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** @type {Lenis | null} */
let lenis = null;

export function initMotion() {
  document.documentElement.classList.add("anim", "motion-ready");

  if (!reducedMotion) {
    initLenis();
  }

  initReveals();
  initProblemScrub();
  initShreyaPin();
  initHowConnector();
  initCrmAssemble();
  initAgentEdges();
  initTrustStagger();
  initStickyPilot();

  if (reducedMotion) {
    document.querySelectorAll(".reveal, [data-reveal]").forEach((el) => {
      el.classList.add("is-in");
    });
    document.querySelectorAll("[data-shreya]").forEach((root) => {
      showShreyaPanel(root, "after");
    });
  }
}

function initLenis() {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Disable native smooth so Lenis owns it
  document.documentElement.style.scrollBehavior = "auto";
}

function initReveals() {
  const nodes = gsap.utils.toArray(".reveal, [data-reveal]");
  if (!nodes.length) return;

  if (reducedMotion) {
    nodes.forEach((n) => n.classList.add("is-in"));
    return;
  }

  nodes.forEach((el) => {
    const type = el.dataset.reveal || "rise";
    const delay = Number(el.style.getPropertyValue("--i") || 0) * 0.08;

    const from =
      type === "clip"
        ? { autoAlpha: 0, y: 28, clipPath: "inset(12% 0 88% 0)" }
        : type === "blur"
          ? { autoAlpha: 0, y: 16, filter: "blur(8px)" }
          : { autoAlpha: 0, y: 36 };

    gsap.fromTo(
      el,
      from,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        clipPath: "inset(0% 0 0% 0)",
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
        onStart: () => el.classList.add("is-in"),
      },
    );
  });
}

/** Sticky claim + scrubbed outcome cards */
function initProblemScrub() {
  const section = document.querySelector("[data-problem-chapter]");
  if (!section || reducedMotion) return;

  const cards = section.querySelectorAll("[data-scrub-card]");
  if (!cards.length) return;

  gsap.fromTo(
    cards,
    { autoAlpha: 0.35, y: 40 },
    {
      autoAlpha: 1,
      y: 0,
      stagger: 0.15,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "center 40%",
        scrub: 0.6,
      },
    },
  );
}

/** Apple-style pin: scroll morphs Shreya credit file before → after */
function initShreyaPin() {
  const section = document.querySelector("#shreya");
  const root = section?.querySelector("[data-shreya]");
  const pin = section?.querySelector("[data-shreya-pin]");
  if (!section || !root || !pin) return;

  const progressEl = section.querySelector("[data-shreya-progress]");
  const labelEl = section.querySelector("[data-shreya-phase]");
  let lastPhase = "";

  const applyProgress = (p) => {
    if (progressEl) progressEl.style.width = `${Math.round(p * 100)}%`;
    let phase = "before";
    if (p >= 0.65) phase = "after";
    else if (p >= 0.35) phase = "talk";

    if (phase === lastPhase) return;
    lastPhase = phase;

    if (phase === "before") {
      root.classList.remove("is-talking");
      showShreyaPanel(root, "before");
      if (labelEl) labelEl.textContent = "Before · auto-filtered";
    } else if (phase === "talk") {
      root.classList.add("is-talking");
      showShreyaPanel(root, "before");
      if (labelEl) labelEl.textContent = "Conversation · gathering story";
    } else {
      root.classList.remove("is-talking");
      showShreyaPanel(root, "after", true);
      if (labelEl) labelEl.textContent = "After · exception file ready";
    }
  };

  if (reducedMotion) {
    applyProgress(1);
    return;
  }

  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    end: "+=220%",
    pin: pin,
    scrub: 0.65,
    anticipatePin: 1,
    onUpdate: (self) => applyProgress(self.progress),
  });
}

function showShreyaPanel(root, which, animateRows = false) {
  const before = root.querySelector('[data-panel="before"]');
  const after = root.querySelector('[data-panel="after"]');
  if (!before || !after) return;

  const showingAfter = which === "after";
  before.hidden = showingAfter;
  after.hidden = !showingAfter;

  root.querySelectorAll("[data-shreya-view]").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.shreyaView === which));
  });

  if (showingAfter && animateRows && !reducedMotion) {
    const rows = after.querySelectorAll(".file-row");
    gsap.fromTo(
      rows,
      { autoAlpha: 0, x: 12 },
      { autoAlpha: 1, x: 0, stagger: 0.07, duration: 0.45, ease: "power2.out" },
    );
  }
}

export function setShreyaView(which) {
  const root = document.querySelector("[data-shreya]");
  if (!root) return;
  showShreyaPanel(root, which, which === "after");
}

function initHowConnector() {
  const section = document.querySelector("#how");
  const line = section?.querySelector("[data-how-line]");
  const steps = section?.querySelectorAll(".step-card");
  if (!section || !steps?.length) return;

  if (reducedMotion) {
    steps.forEach((s) => s.classList.add("is-in"));
    if (line) line.style.strokeDashoffset = "0";
    return;
  }

  if (line) {
    const len = line.getTotalLength?.() || 400;
    line.style.strokeDasharray = String(len);
    line.style.strokeDashoffset = String(len);
    gsap.to(line, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "center 45%",
        scrub: true,
      },
    });
  }

  gsap.fromTo(
    steps,
    { autoAlpha: 0, y: 28 },
    {
      autoAlpha: 1,
      y: 0,
      stagger: 0.12,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        once: true,
      },
    },
  );
}

function initCrmAssemble() {
  const dash = document.querySelector(".crm-dash");
  if (!dash || reducedMotion) return;

  const chips = dash.querySelectorAll(".crm-chip, [data-crm-chip], .integrity-chip");
  const tiles = dash.querySelectorAll(".crm-tile, .applicant-tile, [data-crm-tile]");
  const bar = dash.querySelector("[data-risk-bar], .risk-bar-fill");

  ScrollTrigger.create({
    trigger: dash,
    start: "top 75%",
    once: true,
    onEnter: () => {
      if (chips.length) {
        gsap.fromTo(
          chips,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, stagger: 0.06, duration: 0.4, ease: "power2.out" },
        );
      }
      if (tiles.length) {
        gsap.fromTo(
          tiles,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.5, delay: 0.1, ease: "power2.out" },
        );
      }
      if (bar) {
        gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power2.out", transformOrigin: "left" });
      }
    },
  });
}

function initAgentEdges() {
  const center = document.querySelector(".agent-center, #agents");
  if (!center || reducedMotion) return;

  const edges = center.querySelectorAll("[data-edge-line], .agent-edge path, svg [data-edge]");
  const nodes = center.querySelectorAll(".agent-node, [data-agent-node]");

  ScrollTrigger.create({
    trigger: center,
    start: "top 70%",
    once: true,
    onEnter: () => {
      edges.forEach((edge) => {
        const len = edge.getTotalLength?.();
        if (!len) return;
        edge.style.strokeDasharray = String(len);
        edge.style.strokeDashoffset = String(len);
        gsap.to(edge, { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" });
      });
      if (nodes.length) {
        gsap.fromTo(
          nodes,
          { autoAlpha: 0.4, scale: 0.92 },
          { autoAlpha: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: "power2.out" },
        );
      }
      const human = center.querySelector("[data-node='human'], .node-human, .hitl-node");
      if (human) {
        gsap.fromTo(
          human,
          { boxShadow: "0 0 0 0 rgba(83,58,253,0)" },
          {
            boxShadow: "0 0 0 4px rgba(83,58,253,0.25)",
            duration: 0.6,
            delay: 0.8,
            yoyo: true,
            repeat: 1,
          },
        );
      }
    },
  });
}

function initTrustStagger() {
  const rail = document.querySelector(".trust-rail .badge-row");
  if (!rail || reducedMotion) return;
  const badges = rail.querySelectorAll(".badge");
  gsap.fromTo(
    badges,
    { autoAlpha: 0, y: 12 },
    {
      autoAlpha: 1,
      y: 0,
      stagger: 0.05,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: { trigger: rail, start: "top 90%", once: true },
    },
  );
}

/** Persistent Book a pilot bar after hero — Refero / LiveKit pattern */
function initStickyPilot() {
  const bar = document.querySelector("[data-sticky-pilot]");
  const hero = document.querySelector(".hero");
  if (!bar || !hero) return;

  bar.hidden = false;
  ScrollTrigger.create({
    trigger: hero,
    start: "bottom top+=40",
    onEnter: () => {
      bar.hidden = false;
      bar.classList.add("is-show");
    },
    onLeaveBack: () => bar.classList.remove("is-show"),
  });
}

export function refreshScroll() {
  ScrollTrigger.refresh();
}

export { reducedMotion, lenis };
