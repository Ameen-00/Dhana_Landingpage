import "./styles.css";
import { CALENDLY_URL, SUPPORT_EMAIL } from "./config.js";
import { initAllVoiceOrb3D } from "./voice-orb-3d.js";
import { initMotion, setShreyaView, refreshScroll } from "./motion.js";
import { CONTENT } from "./content-data.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/** @type {ReturnType<typeof initAllVoiceOrb3D> | null} */
let voiceOrbs = null;

/*.-. Nav.-. */
function initNav() {
  const nav = document.querySelector(".nav");
  const hamburger = document.querySelector(".hamburger");
  const drawer = document.querySelector(".mobile-drawer");

  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (hamburger && drawer) {
    const close = () => {
      hamburger.setAttribute("aria-expanded", "false");
      drawer.classList.remove("is-open");
      drawer.hidden = true;
      document.body.classList.remove("drawer-open");
    };
    const open = () => {
      hamburger.setAttribute("aria-expanded", "true");
      drawer.hidden = false;
      requestAnimationFrame(() => drawer.classList.add("is-open"));
      document.body.classList.add("drawer-open");
    };
    hamburger.addEventListener("click", () => {
      const expanded = hamburger.getAttribute("aria-expanded") === "true";
      expanded ? close() : open();
    });
    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
  }
}

/*.-. Toast.-. */
function toast(msg) {
  const el = document.querySelector("[data-toast]");
  if (!el) return;
  el.textContent = msg;
  el.classList.add("is-show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-show"), 2800);
}

/*.-. Ops strip.-. */
function setOps( partial ) {
  const root = document.querySelector("[data-theater]");
  if (!root) return;
  Object.entries(partial).forEach(([k, v]) => {
    const el = root.querySelector(`[data-ops="${k}"]`);
    if (el) el.textContent = v;
  });
}

/*.-. Outcome dock.-. */
function setOutcomes(badge, tone, rows) {
  const dock = document.querySelector("[data-outcome-dock]");
  if (!dock) return;
  const badgeEl = dock.querySelector("[data-outcome-badge]");
  const sideBadge = document.querySelector("[data-side-badge]");
  if (badgeEl) {
    badgeEl.textContent = badge;
    badgeEl.dataset.tone = tone || "";
  }
  if (sideBadge) {
    sideBadge.textContent = badge;
    sideBadge.dataset.tone = tone || "";
  }
  const rowsEl = dock.querySelector("[data-outcome-rows]");
  if (!rowsEl || !rows) return;
  rowsEl.innerHTML = rows
    .map(([k, v, cls]) => {
      const c = cls ? ` class="${cls}"` : "";
      return `<div class="outcome-row"><dt>${k}</dt><dd${c}>${v}</dd></div>`;
    })
    .join("");
}

/*.-. Transcript.-. */
function clearTranscript(emptyMsg) {
  const body = document.querySelector("[data-transcript]");
  if (!body) return;
  body.innerHTML = `<p class="tx-empty">${emptyMsg || "-"}</p>`;
}

function addTranscript(role, meta, text, time) {
  const body = document.querySelector("[data-transcript]");
  if (!body) return;
  const empty = body.querySelector(".tx-empty");
  if (empty) empty.remove();
  const line = document.createElement("div");
  line.className = "tx-line";
  const roleClass = role === "agent" ? "role-agent" : "role-user";
  line.innerHTML = `<div class="tx-meta"><span class="${roleClass}">${meta}</span> · ${time || ""}</div><div class="tx-text">${text}</div>`;
  body.appendChild(line);
  body.scrollTop = body.scrollHeight;
}

/*.-. Call scripts by language.-. */
const CALL_SCRIPTS = {
  EN: [
    {
      role: "agent",
      meta: "Dhana",
      text: "Good evening. I'm Dhana, calling from your bank about your working-capital enquiry. Is this a good time?",
      status: "Speaking",
      outcomes: [
        ["status", "Speaking", ""],
        ["language", "EN", ""],
        ["consent", "Pending", "warn"],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "user",
      meta: "Borrower",
      text: "Yes. I run a boutique. Sales are strong in the festival months and quieter the rest of the year, so the form flagged my salary as unstable.",
      status: "Listening",
      outcomes: [
        ["status", "Listening", ""],
        ["language", "EN", ""],
        ["intent", "WC · seasonality", ""],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "agent",
      meta: "Dhana",
      text: "I understand. Instead of just last month, we'll look at income as a twelve-month average. With your consent, may I run a soft bureau check? It won't affect your score.",
      status: "Speaking",
      chip: "Yes, you can check",
      outcomes: [
        ["status", "Consent gate", "warn"],
        ["income_frame", "12-mo avg", ""],
        ["soft_bureau", "Awaiting OK", "warn"],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "user",
      meta: "Borrower",
      text: "Yes, you can check. My shop's UPI is much cleaner than the salary field.",
      status: "Listening",
      outcomes: [
        ["status", "Gathering", ""],
        ["soft_bureau", "Consented", "ok"],
        ["upi", "In-session", "ok"],
        ["docs", "Statement next", ""],
      ],
    },
    {
      role: "agent",
      meta: "Dhana",
      text: "I've added an exception file for your credit desk. You'll get a WhatsApp for the documents. Thank you for your time.",
      status: "Complete",
      outcomes: [
        ["status", "Qualified", "ok"],
        ["lead", "Handoff ready", "ok"],
        ["consent", "Logged", "ok"],
        ["file", "Exception ready", "ok"],
      ],
    },
  ],
  HI: [
    {
      role: "agent",
      meta: "Dhana",
      text: "नमस्ते. मैं धना हूँ, आपके बैंक से वर्किंग कैपिटल के बारे में। क्या बात कर सकते हैं?",
      status: "Speaking",
      outcomes: [
        ["status", "Speaking", ""],
        ["language", "HI", ""],
        ["consent", "Pending", "warn"],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "user",
      meta: "Borrower",
      text: "हाँ. मेरी बुटीक है। त्योहारों में सेल अच्छी होती है, फॉर्म ने अस्थिर सैलरी कहा।",
      status: "Listening",
      outcomes: [
        ["status", "Listening", ""],
        ["emotion", "Hesitant → calm", ""],
        ["intent", "WC · seasonality", ""],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "agent",
      meta: "Dhana",
      text: "समझ गई। आय को 12 महीने के औसत से फ्रेम करूँगी। सॉफ्ट ब्यूरो के लिए सहमति दें?",
      status: "Speaking",
      chip: "हाँ, चेक कर सकते हो",
      outcomes: [
        ["status", "Consent gate", "warn"],
        ["income_frame", "12-mo avg", ""],
        ["soft_bureau", "Awaiting OK", "warn"],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "user",
      meta: "Borrower",
      text: "हाँ। दुकान का UPI सैलरी फील्ड से साफ़ है।",
      status: "Listening",
      outcomes: [
        ["status", "Gathering", ""],
        ["soft_bureau", "Consented", "ok"],
        ["upi", "In-session", "ok"],
        ["docs", "Statement next", ""],
      ],
    },
    {
      role: "agent",
      meta: "Dhana",
      text: "क्रेडिट डेस्क के लिए अपवाद फाइल तैयार है। दस्तावेज़ WhatsApp पर आएंगे। धन्यवाद।",
      status: "Complete",
      outcomes: [
        ["status", "Qualified", "ok"],
        ["lead", "Handoff ready", "ok"],
        ["consent", "Logged", "ok"],
        ["file", "Exception ready", "ok"],
      ],
    },
  ],
  ML: [
    {
      role: "agent",
      meta: "Dhana",
      text: "നമസ്കാരം. ഞാൻ ധന, ബാങ്കിൽ നിന്ന് വർക്കിംഗ് ക്യാപിറ്റൽ സംബന്ധിച്ച്. സംസാരിക്കാമോ?",
      status: "Speaking",
      outcomes: [
        ["status", "Speaking", ""],
        ["language", "ML", ""],
        ["consent", "Pending", "warn"],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "user",
      meta: "Borrower",
      text: "ഉവ്വ്. ബൂട്ടിക് നടത്തുന്നു. ഉത്സവക്കാലത്ത് നല്ല സെയിൽ. ഫോം unstable salary എന്ന് പറഞ്ഞു.",
      status: "Listening",
      outcomes: [
        ["status", "Listening", ""],
        ["emotion", "Hesitant → calm", ""],
        ["intent", "WC · seasonality", ""],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "agent",
      meta: "Dhana",
      text: "മനസ്സിലായി. 12 മാസ ശരാശരി ആയി വരുമാനം ഫ്രെയിം ചെയ്യാം. സോഫ്റ്റ് ബ്യൂറോയ്ക്ക് സമ്മതമുണ്ടോ?",
      status: "Speaking",
      chip: "ഉവ്വ്, ചെക്ക് ചെയ്യാം",
      outcomes: [
        ["status", "Consent gate", "warn"],
        ["income_frame", "12-mo avg", ""],
        ["soft_bureau", "Awaiting OK", "warn"],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "user",
      meta: "Borrower",
      text: "ഉവ്വ്. കടയുടെ UPI ശമ്പള ഫീൽഡിനേക്കാൾ വ്യക്തമാണ്.",
      status: "Listening",
      outcomes: [
        ["status", "Gathering", ""],
        ["soft_bureau", "Consented", "ok"],
        ["upi", "In-session", "ok"],
        ["docs", "Statement next", ""],
      ],
    },
    {
      role: "agent",
      meta: "Dhana",
      text: "ക്രെഡിറ്റ് ഡെസ്ക്കിന് എക്സപ്ഷൻ ഫയൽ തയ്യാർ. ഡോക്യുമെന്റുകൾ WhatsApp-ൽ വരും. നന്ദി.",
      status: "Complete",
      outcomes: [
        ["status", "Qualified", "ok"],
        ["lead", "Handoff ready", "ok"],
        ["consent", "Logged", "ok"],
        ["file", "Exception ready", "ok"],
      ],
    },
  ],
  TA: [
    {
      role: "agent",
      meta: "Dhana",
      text: "வணக்கம். நான் தனா, வங்கிலிருந்து working capital பற்றி. பேசலாமா?",
      status: "Speaking",
      outcomes: [
        ["status", "Speaking", ""],
        ["language", "TA", ""],
        ["consent", "Pending", "warn"],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "user",
      meta: "Borrower",
      text: "ஆம். பூட்டிக் நடத்துகிறேன். திருவிழா காலத்தில் விற்பனை நல்லது. படிவம் unstable salary என்றது.",
      status: "Listening",
      outcomes: [
        ["status", "Listening", ""],
        ["emotion", "Hesitant → calm", ""],
        ["intent", "WC · seasonality", ""],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "agent",
      meta: "Dhana",
      text: "புரிந்தது. 12 மாத சராசரியாக வருமானம் அமைப்பேன். Soft bureau ஒப்புதல் தருகிறீர்களா?",
      status: "Speaking",
      chip: "ஆம், பார்க்கலாம்",
      outcomes: [
        ["status", "Consent gate", "warn"],
        ["income_frame", "12-mo avg", ""],
        ["soft_bureau", "Awaiting OK", "warn"],
        ["integrity", "Pass", "ok"],
      ],
    },
    {
      role: "user",
      meta: "Borrower",
      text: "ஆம். கடையின் UPI சம்பள புலத்தை விட தெளிவு.",
      status: "Listening",
      outcomes: [
        ["status", "Gathering", ""],
        ["soft_bureau", "Consented", "ok"],
        ["upi", "In-session", "ok"],
        ["docs", "Statement next", ""],
      ],
    },
    {
      role: "agent",
      meta: "Dhana",
      text: "கிரெடிட் டெஸ்க்குக்கு exception file தயார். ஆவணங்கள் WhatsApp-ல் வரும். நன்றி.",
      status: "Complete",
      outcomes: [
        ["status", "Qualified", "ok"],
        ["lead", "Handoff ready", "ok"],
        ["consent", "Logged", "ok"],
        ["file", "Exception ready", "ok"],
      ],
    },
  ],
};

/*.-. Theater: Call state machine.-. */
function initCallDemo(theater) {
  const phone = theater.querySelector("[data-phone]");
  if (!phone) return { reset() {} };

  let lang = "EN";
  let stepIdx = 0;
  let timer = null;
  let seconds = 0;
  let talkTimer = null;
  let waitingChip = false;
  let callLive = false;

  const statusEl = phone.querySelector("[data-call-status]");
  const timerEl = phone.querySelector("[data-call-timer]");
  const wave = phone.querySelector("[data-waveform]");
  const chips = phone.querySelector("[data-reply-chips]");

  function setState(s) {
    phone.dataset.state = s;
  }

  function stopTimers() {
    clearInterval(timer);
    clearTimeout(talkTimer);
    timer = null;
    talkTimer = null;
  }

  function formatTime(s) {
    const m = String(Math.floor(s / 60)).padStart(2, "0");
    const sec = String(s % 60).padStart(2, "0");
    return `${m}:${sec}`;
  }

  function startTimer() {
    seconds = 0;
    if (timerEl) timerEl.textContent = "00:00";
    timer = setInterval(() => {
      seconds += 1;
      if (timerEl) timerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function ring() {
    stopTimers();
    setState("ringing");
    clearTranscript("Incoming call. Tap Answer.");
    setOutcomes("Incoming", "live", [
      ["status", "Ringing", "warn"],
      ["channel", "Inbound voice", ""],
      ["caller", "Dhana RM", ""],
      ["integrity", "-", ""],
    ]);
    setOps({ session: "call-ringing", channel: "Call", file: "-", hitl: "standby", los: "not synced" });
  }

  function runStep() {
    const script = CALL_SCRIPTS[lang] || CALL_SCRIPTS.EN;
    if (stepIdx >= script.length) {
      endCall();
      return;
    }
    const step = script[stepIdx];
    const t = formatTime(seconds);
    addTranscript(step.role, step.meta, step.text, t);
    const lineAudio = playLineVoice("call", lang, stepIdx);
    if (statusEl) statusEl.textContent = step.status + "…";
    if (wave) wave.classList.toggle("is-speaking", step.role === "agent");
    {
      const map = { agent: "speaking", user: "listening" };
      const st = step.status === "Thinking" ? "thinking" : map[step.role] || "listening";
      const live = phone.querySelector("[data-orb-live]");
      if (live instanceof HTMLElement) {
        voiceOrbs?.setState(live, st);
        voiceOrbs?.instances.get(live)?.setAudioLevel(step.role === "agent" ? 0.65 : 0.2);
      }
    }
    setOutcomes(step.status, step.status === "Complete" ? "verify" : "live", step.outcomes);
    setOps({
      session: "call-live",
      channel: "Call",
      file: step.status === "Complete" ? "building" : "-",
      hitl: "standby",
      los: "not synced",
    });

    const advance = () => {
      if (!callLive) return; // call was ended/declined, do not resume
      stepIdx += 1;
      runStep();
    };

    if (step.chip && !reducedMotion) {
      waitingChip = true;
      chips.hidden = false;
      chips.innerHTML = `<button type="button">${step.chip}</button>`;
      const auto = () => {
        if (!waitingChip) return;
        waitingChip = false;
        chips.hidden = true;
        advance();
      };
      chips.querySelector("button").onclick = () => {
        waitingChip = false;
        chips.hidden = true;
        advance();
      };
      if (lineAudio) {
        // Let Dhana finish the question, then leave a beat to tap the reply before auto-advancing.
        lineAudio.addEventListener("ended", () => { talkTimer = setTimeout(auto, 2200); }, { once: true });
        lineAudio.addEventListener("error", () => { talkTimer = setTimeout(auto, 8000); }, { once: true });
        talkTimer = setTimeout(auto, 24000); // safety cap only; real advance is on 'ended'
      } else {
        talkTimer = setTimeout(auto, 8000);
      }
      return;
    }

    if (reducedMotion) {
      talkTimer = setTimeout(advance, 80);
      return;
    }
    if (lineAudio) {
      let advanced = false;
      const go = () => {
        if (advanced) return;
        advanced = true;
        advance();
      };
      lineAudio.addEventListener("ended", () => { talkTimer = setTimeout(go, 450); }, { once: true });
      lineAudio.addEventListener("error", () => { talkTimer = setTimeout(go, step.role === "agent" ? 2200 : 1800); }, { once: true });
      talkTimer = setTimeout(go, 24000); // safety cap only; real advance is on 'ended'
    } else {
      talkTimer = setTimeout(advance, step.role === "agent" ? 2200 : 1800);
    }
  }

  function answer() {
    stopTimers();
    stopDemoVoice();
    callLive = true;
    setState("active");
    stepIdx = 0;
    clearTranscript("");
    startTimer();
    {
      const live = phone.querySelector("[data-orb-live]");
      if (live instanceof HTMLElement) {
        voiceOrbs?.setState(live, "listening");
        voiceOrbs?.instances.get(live)?.setAudioLevel(0.15);
      }
    }
    setOutcomes("Connected", "live", [
      ["status", "Connected", "ok"],
      ["channel", "Inbound voice", ""],
      ["language", lang, ""],
      ["integrity", "Checking…", ""],
    ]);
    setOps({ session: "call-active", channel: "Call", file: "-", hitl: "standby", los: "not synced" });
    talkTimer = setTimeout(runStep, reducedMotion ? 50 : 600);
  }

  function endCall() {
    callLive = false;
    stopTimers();
    stopDemoVoice();
    setState("ended");
    if (chips) chips.hidden = true;
    setOutcomes("Qualified", "verify", [
      ["status", "Lead qualified", "ok"],
      ["consent", "Logged", "ok"],
      ["file", "Ready to open", "ok"],
      ["integrity", "Pass", "ok"],
    ]);
    setOps({ session: "call-ended", channel: "Call", file: "ready", hitl: "review", los: "not synced" });
  }

  function reset() {
    callLive = false;
    stopTimers();
    stopDemoVoice();
    setState("idle");
    stepIdx = 0;
    waitingChip = false;
    if (chips) chips.hidden = true;
    clearTranscript("Answer the call to see the conversation.");
    setOutcomes("Idle", "", [
      ["status", "-", ""],
      ["channel", "Call", ""],
    ]);
    setOps({ session: "demo-idle", channel: "Call", file: "-", hitl: "standby", los: "not synced" });
  }

  theater.querySelector("[data-call-me]")?.addEventListener("click", ring);
  theater.querySelector("[data-answer]")?.addEventListener("click", answer);
  theater.querySelector("[data-decline]")?.addEventListener("click", () => {
    callLive = false;
    stopTimers();
    stopDemoVoice();
    setState("idle");
    setOutcomes("Declined", "risk", [
      ["status", "Declined", "bad"],
      ["channel", "Call", ""],
    ]);
    setOps({ session: "call-declined", channel: "Call", file: "-", hitl: "standby", los: "not synced" });
  });
  theater.querySelector("[data-hangup]")?.addEventListener("click", endCall);

  return {
    reset,
    setLang(l) {
      lang = l;
    },
    ring,
  };
}

/*.-. Website state machine.-. */
function initWebsiteDemo(theater) {
  const laptop = theater.querySelector("[data-laptop]");
  if (!laptop) return { reset() {} };
  return initWebsiteChat(laptop);
}

// Legacy form-based website flow — retained but no longer used (superseded by initWebsiteChat).
function initWebsiteDemoLegacy(theater) {
  const laptop = theater.querySelector("[data-laptop]");
  if (!laptop) return { reset() {} };

  let step = 0;
  let amount = 250000;
  let purpose = "Festival stock";

  const panels = [...laptop.querySelectorAll("[data-web-panel]")];
  const steps = [...laptop.querySelectorAll("[data-web-step]")];
  const modal = laptop.querySelector("[data-redirect-modal]");

  function fmt(n) {
    return "₹" + n.toLocaleString("en-IN");
  }

  function showStep(n) {
    step = n;
    panels.forEach((p) => {
      const active = Number(p.dataset.webPanel) === n;
      p.classList.toggle("is-active", active);
      p.classList.toggle("is-ml-focus", active && n === 5);
    });
    steps.forEach((s, i) => {
      const idx = Number(s.dataset.webStep);
      s.classList.toggle("is-active", idx === n);
      s.classList.toggle("is-done", idx < n && n !== 5 ? idx < n : false);
    });
    if (n !== 5) {
      const vid = laptop.querySelector("[data-ml-video]");
      if (vid && !vid.paused) {
        try {
          vid.pause();
        } catch (_) {}
      }
    }
  }

  function showMlVideo() {
    sideForWeb();
    clearTranscript("");
    log("Malayalam webflow recording opened.");
    showStep(5);
    setOutcomes("ML webflow", "live", [
      ["channel", "Website", ""],
      ["lang", "ML", "ok"],
      ["asset", "dhana-malayalam-webflow", ""],
    ]);
    setOps({ session: "web-ml-video", channel: "Website", file: "-", hitl: "standby", los: "not synced" });
    const panel = laptop.querySelector("[data-ml-video-panel]");
    panel?.classList.add("is-ml-focus");
  }

  function sideForWeb() {
    const title = document.querySelector("[data-side-title]");
    if (title) title.textContent = "Application log";
    clearTranscript("");
  }

  function log(msg) {
    addTranscript("agent", "Web coach", msg, "");
  }

  function reset() {
    amount = 250000;
    purpose = "Festival stock";
    showStep(0);
    modal?.classList.remove("is-open");
    const label = laptop.querySelector("[data-amount-label]");
    const slider = laptop.querySelector("[data-amount-slider]");
    if (label) label.textContent = fmt(amount);
    if (slider) slider.value = amount;
    laptop.querySelectorAll("[data-amount]").forEach((b) => {
      b.classList.toggle("is-selected", Number(b.dataset.amount) === 250000);
    });
    laptop.querySelectorAll("[data-purpose]").forEach((b) => {
      b.classList.toggle("is-selected", b.dataset.purpose === "Festival stock");
    });
    laptop.querySelectorAll("[data-field]").forEach((i) => {
      i.value = "";
      i.classList.remove("is-filled");
    });
    const after = laptop.querySelector("[data-after-fill]");
    if (after) after.hidden = true;
    const spin = laptop.querySelector("[data-credit-spin]");
    const result = laptop.querySelector("[data-credit-result]");
    const runBtn = laptop.querySelector("[data-run-credit]");
    if (spin) spin.hidden = true;
    if (result) result.hidden = true;
    if (runBtn) runBtn.hidden = false;
    setOutcomes("Idle", "", [
      ["status", "-", ""],
      ["channel", "Website", ""],
    ]);
  }

  laptop.querySelector("[data-web-start]")?.addEventListener("click", () => {
    sideForWeb();
    clearTranscript("");
    log("Session opened on bank apply URL.");
    showStep(1);
    setOutcomes("Session open", "live", [
      ["status", "Amount step", ""],
      ["channel", "Website", ""],
      ["url", "bank.example/apply", ""],
    ]);
    setOps({ session: "web-amount", channel: "Website", file: "draft", hitl: "standby", los: "not synced" });
  });

  laptop.querySelector("[data-web-ml-video]")?.addEventListener("click", showMlVideo);
  laptop.querySelector("[data-web-back-start]")?.addEventListener("click", () => {
    showStep(0);
    setOutcomes("Idle", "", [
      ["status", "-", ""],
      ["channel", "Website", ""],
    ]);
    setOps({ session: "demo-idle", channel: "Website", file: "-", hitl: "standby", los: "not synced" });
  });

  const slider = laptop.querySelector("[data-amount-slider]");
  const amountLabel = laptop.querySelector("[data-amount-label]");
  slider?.addEventListener("input", () => {
    amount = Number(slider.value);
    if (amountLabel) amountLabel.textContent = fmt(amount);
    laptop.querySelectorAll("[data-amount]").forEach((b) => b.classList.remove("is-selected"));
  });
  laptop.querySelectorAll("[data-amount]").forEach((b) => {
    b.addEventListener("click", () => {
      amount = Number(b.dataset.amount);
      if (slider) slider.value = amount;
      if (amountLabel) amountLabel.textContent = fmt(amount);
      laptop.querySelectorAll("[data-amount]").forEach((x) => x.classList.toggle("is-selected", x === b));
    });
  });

  laptop.querySelectorAll("[data-purpose]").forEach((b) => {
    b.addEventListener("click", () => {
      purpose = b.dataset.purpose;
      laptop.querySelectorAll("[data-purpose]").forEach((x) => x.classList.toggle("is-selected", x === b));
    });
  });

  laptop.querySelectorAll("[data-web-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (step === 1) {
        log(`Amount locked: ${fmt(amount)}`);
        setOutcomes("Amount locked", "verify", [
          ["amount", fmt(amount), "ok"],
          ["channel", "Website", ""],
          ["next", "Purpose", ""],
        ]);
        setOps({ session: "web-purpose", channel: "Website", file: "draft", hitl: "standby", los: "not synced" });
        showStep(2);
      } else if (step === 2) {
        log(`Purpose locked: ${purpose}`);
        setOutcomes("Purpose locked", "verify", [
          ["amount", fmt(amount), "ok"],
          ["purpose", purpose, "ok"],
          ["next", "Details", ""],
        ]);
        setOps({ session: "web-details", channel: "Website", file: "draft", hitl: "standby", los: "not synced" });
        showStep(3);
      } else if (step === 3) {
        showStep(4);
        setOutcomes("Profile ready", "live", [
          ["profile", "92% complete", "ok"],
          ["amount", fmt(amount), "ok"],
          ["purpose", purpose, "ok"],
          ["next", "Credit check", ""],
        ]);
        setOps({ session: "web-credit", channel: "Website", file: "draft", hitl: "standby", los: "not synced" });
        log("Ready for soft bureau in sandbox.");
      }
    });
  });

  laptop.querySelector("[data-web-autofill]")?.addEventListener("click", () => {
    const fields = [
      ["name", "Shreya Menon"],
      ["biz", "Shreya Atelier"],
      ["city", "Kochi"],
    ];
    let i = 0;
    const tick = () => {
      if (i >= fields.length) {
        const after = laptop.querySelector("[data-after-fill]");
        if (after) after.hidden = false;
        setOutcomes("Profile 92%", "verify", [
          ["name", "Shreya Menon", "ok"],
          ["business", "Shreya Atelier", "ok"],
          ["city", "Kochi", "ok"],
          ["complete", "92%", "ok"],
        ]);
        log("Fields filled from prior conversation context.");
        return;
      }
      const [key, val] = fields[i];
      const input = laptop.querySelector(`[data-field="${key}"]`);
      if (input) {
        input.value = val;
        input.classList.add("is-filled");
      }
      i += 1;
      setTimeout(tick, reducedMotion ? 40 : 350);
    };
    tick();
  });

  laptop.querySelector("[data-run-credit]")?.addEventListener("click", () => {
    const spin = laptop.querySelector("[data-credit-spin]");
    const result = laptop.querySelector("[data-credit-result]");
    const runBtn = laptop.querySelector("[data-run-credit]");
    if (runBtn) runBtn.hidden = true;
    if (spin) spin.hidden = false;
    setOutcomes("Checking…", "flag", [
      ["bureau", "Sandbox soft pull", "warn"],
      ["consent", "Logged", "ok"],
    ]);
    setTimeout(() => {
      if (spin) spin.hidden = true;
      if (result) result.hidden = false;
      setOutcomes("Blocked (sandbox)", "flag", [
        ["bureau", "Blocked in sandbox", "warn"],
        ["reason", "Partner rail needed", "warn"],
        ["next", "PaisaOnClick", ""],
      ]);
      setOps({ session: "web-blocked", channel: "Website", file: "draft", hitl: "standby", los: "queued?" });
      log("Soft check blocked in sandbox. Offer PaisaOnClick handoff.");
    }, reducedMotion ? 100 : 1400);
  });

  laptop.querySelector("[data-poc-open]")?.addEventListener("click", () => {
    modal?.classList.add("is-open");
  });
  laptop.querySelector("[data-poc-close]")?.addEventListener("click", () => {
    modal?.classList.remove("is-open");
  });
  laptop.querySelector("[data-poc-confirm]")?.addEventListener("click", () => {
    modal?.classList.remove("is-open");
    setOutcomes("Handoff queued", "verify", [
      ["partner", "PaisaOnClick", "ok"],
      ["packet", "Packaged", "ok"],
      ["los", "Adapter queued", "ok"],
    ]);
    setOps({ session: "web-handoff", channel: "Website", file: "packaged", hitl: "standby", los: "queued" });
    log("Partner handoff queued to PaisaOnClick.");
    toast("PaisaOnClick handoff queued (demo)");
  });

  return { reset, activate: sideForWeb, showMlVideo };
}

/*.-. Website conversational apply (AI Banker) .-. */
const WEB_LINES = {
  greet: {
    EN: "Namaskaram 👋 I'm your bank's AI Banker. I'll help you apply in your own language, no forms, just a conversation.",
    HI: "नमस्ते 👋 मैं आपके बैंक का AI बैंकर हूँ। कोई फ़ॉर्म नहीं, बस बातचीत से आवेदन कीजिए।",
    ML: "നമസ്കാരം 👋 ഞാൻ നിങ്ങളുടെ ബാങ്കിന്റെ AI ബാങ്കരാണ്. ഫോംുകളില്ല, നിങ്ങളുടെ ഭാഷയിൽ സംസാരിച്ചു അപേക്ഷിക്കാം.",
    TA: "வணக்கம் 👋 நான் உங்கள் வங்கியின் AI பேங்கர். படிவம் இல்லை, உங்கள் மொழியில் பேசியே விண்ணப்பிக்கலாம்.",
  },
  kyc: {
    EN: "I've pulled your KYC from DigiLocker. Do these details look correct?",
    HI: "मैंने DigiLocker से आपका KYC ले लिया है। क्या ये विवरण सही हैं?",
    ML: "DigiLocker-ൽ നിന്ന് നിങ്ങളുടെ KYC എടുത്തിട്ടുണ്ട്. ഈ വിവരങ്ങൽ ശരിയാണോ?",
    TA: "DigiLocker-இலிருந்து உங்கள் KYC-ஐ எடுத்துள்ளேன். இந்த விவரங்கள் சரியா?",
  },
  loan: {
    EN: "Great. Which loan are you looking for?",
    HI: "बढ़िया। आपको कौन सा ऋण चाहिए?",
    ML: "നല്ലത്. ഏത് വായ്പയാണ് വേണ്ടത്?",
    TA: "நன்று. எந்த கடன் தேவை?",
  },
  amount: {
    EN: "How much do you need, and for how long?",
    HI: "कितनी राशि चाहिए, और कितने समय के लिए?",
    ML: "എത്ര തുക വേണം, എത്ര കാലത്തേക്ക്?",
    TA: "எவ்வளவு தொகை வேண்டும், எவ்வளவு காலம்?",
  },
  emi: {
    EN: "For ₹5,00,000 over 36 months, EMI works out to about ₹17,210. With your consent I'll run a soft credit pull, it won't affect your score.",
    HI: "₹5,00,000, 36 महीनों के लिए, EMI लगभग ₹17,210। आपकी सहमति से soft credit pull करूँगा, स्कोर पर असर नहीं पड़ेगा।",
    ML: "₹5,00,000, 36 മാസത്തേക്ക്, EMI ഏകദേശം ₹17,210. നിങ്ങളുടെ സമ്മതത്തോടെ ഒരു soft credit pull നടത്തും, സ്കോറിനെ ബാധിക്കില്ല.",
    TA: "₹5,00,000, 36 மாதங்களுக்கு, EMI ≈ ₹17,210. உங்கள் சம்மதத்துடன் soft credit pull செய்கிறேன், உங்கள் ஸ்கோரை பாதிக்காது.",
  },
  result: {
    EN: "Soft pull done ✓ CIBIL 782 · you're pre-qualified. I've packaged a credit-ready file for the loan officer. A human makes the final decision.",
    HI: "Soft pull पूरा ✓ CIBIL 782 · आप pre-qualified हैं। अधिकारी के लिए credit-ready file तैयार कर दी है। अंतिम निर्णय एक व्यक्ति लेगा।",
    ML: "Soft pull പൂർത്തിയായി ✓ CIBIL 782 · നിങ്ങൾ pre-qualified ആണ്. ഓഫീസർക്കായി ഒരു credit-ready file തയ്യാറാക്കി. അന്തിമ തീരുമാനം ഒരു മനുഷ്യൻ എടുക്കും.",
    TA: "Soft pull முடிந்தது ✓ CIBIL 782 · நீங்கள் pre-qualified. அதிகாரிக்கு ஒரு credit-ready file தயார். இறுதி முடிவை ஒரு மனிதர் எடுப்பார்.",
  },
};

function initWebsiteChat(laptop) {
  const stages = [...laptop.querySelectorAll("[data-web-stage]")];
  const chat = laptop.querySelector("[data-web-chat]");
  const quick = laptop.querySelector("[data-web-quick]");
  const langBadge = laptop.querySelector("[data-web-lang-badge]");
  const inputPh = laptop.querySelector("[data-web-input-ph]");
  const LANGCLASS = { EN: "", HI: "lang-hi", ML: "lang-ml", TA: "lang-ta" };
  const INPUT_PH = {
    EN: "Type a message…",
    HI: "संदेश लिखें…",
    ML: "സന്ദേശം എഴുതുക…",
    TA: "செய்தியை எழுதுங்க…",
  };

  let lang = "EN";
  let token = 0;

  const wait = (ms) => new Promise((r) => setTimeout(r, reducedMotion ? Math.min(ms, 60) : ms));
  const showStage = (name) => stages.forEach((s) => s.classList.toggle("is-active", s.dataset.webStage === name));
  const scrollDown = () => { if (chat) chat.scrollTop = chat.scrollHeight; };
  const log = (msg) => addTranscript("agent", "AI Banker", msg, "");

  function bubble(side, html, cls) {
    const d = document.createElement("div");
    d.className = "web-msg web-msg--" + side + (cls ? " " + cls : "");
    d.innerHTML = html;
    chat.appendChild(d);
    scrollDown();
    return d;
  }

  async function ai(key, cardHtml) {
    const t = token;
    const typing = bubble("ai", "<span class='web-typing'><i></i><i></i><i></i></span>");
    await wait(780);
    if (t !== token) { typing.remove(); return false; }
    typing.remove();
    bubble("ai", `<span class="web-msg-text ${LANGCLASS[lang]}">${WEB_LINES[key][lang] || WEB_LINES[key].EN}</span>`);
    if (cardHtml) bubble("ai", cardHtml, "web-msg--card");
    const a = playLineVoice("web", lang, key);
    if (a && !reducedMotion) {
      await new Promise((res) => {
        let done = false;
        const go = () => {
          if (done) return;
          done = true;
          res();
        };
        a.addEventListener("ended", go, { once: true });
        setTimeout(go, 9000); // fallback if the clip never loads
      });
    } else {
      await wait(480);
    }
    return t === token;
  }

  function askReplies(replies) {
    return new Promise((resolve) => {
      const t = token;
      quick.innerHTML = "";
      replies.forEach((r) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "web-reply";
        b.textContent = r.label;
        b.addEventListener("click", () => {
          if (t !== token) return;
          quick.innerHTML = "";
          bubble("user", r.label);
          resolve(r);
        });
        quick.appendChild(b);
      });
      scrollDown();
    });
  }

  const IDENTITY_CARD =
    '<div class="web-card">' +
    '<div class="web-card-row"><span>Name</span><b>Shreya Menon</b></div>' +
    "<div class=\"web-card-row\"><span>Business</span><b>Shreya's Atelier · Kochi</b></div>" +
    '<div class="web-card-row"><span>PAN</span><b>ABCPM1234F</b></div>' +
    "</div>";
  const RESULT_CARD =
    '<div class="web-card web-card--ok">' +
    '<div class="web-card-row"><span>CIBIL</span><b>782 · Excellent</b></div>' +
    '<div class="web-card-row"><span>Ask</span><b>₹5,00,000 · 36 mo</b></div>' +
    '<div class="web-card-row"><span>EMI</span><b>₹17,210 / mo</b></div>' +
    '<div class="web-card-row"><span>Status</span><b class="ok">Pre-qualified</b></div>' +
    "</div>";

  async function run() {
    const t = ++token;
    chat.innerHTML = "";
    quick.innerHTML = "";

    if (!(await ai("greet"))) return;
    setOutcomes("Session open", "live", [["status", "Verified", "ok"], ["channel", "Website", ""], ["url", "bank.example/apply", ""]]);
    setOps({ session: "web-chat", channel: "Website", file: "draft", hitl: "standby", los: "not synced" });
    log("Applicant verified via OTP. Conversational apply started.");

    if (!(await ai("kyc", IDENTITY_CARD))) return;
    await askReplies([{ label: "These details look correct" }]);
    if (t !== token) return;
    setOutcomes("KYC confirmed", "verify", [["kyc", "Confirmed", "ok"], ["source", "DigiLocker", "ok"], ["channel", "Website", ""]]);
    log("KYC confirmed by applicant.");

    if (!(await ai("loan"))) return;
    const loan = await askReplies([{ label: "Personal loan" }, { label: "Working capital" }, { label: "Business loan" }]);
    if (t !== token) return;
    setOutcomes("Product chosen", "verify", [["product", loan.label, "ok"], ["channel", "Website", ""]]);
    log(`Product selected: ${loan.label}.`);

    if (!(await ai("amount"))) return;
    await askReplies([{ label: "₹2.5L · 36 months" }, { label: "₹5,00,000 for 36 months" }, { label: "₹10L · 48 months" }]);
    if (t !== token) return;
    setOutcomes("Ask locked", "verify", [["amount", "₹5,00,000", "ok"], ["tenure", "36 months", "ok"], ["channel", "Website", ""]]);
    setOps({ session: "web-underwrite", channel: "Website", file: "draft", hitl: "standby", los: "not synced" });
    log("Ask: ₹5,00,000 over 36 months.");

    if (!(await ai("emi"))) return;
    setOutcomes("Soft pull…", "flag", [["bureau", "Soft pull", "warn"], ["consent", "Logged", "ok"]]);
    await wait(1100);
    if (t !== token) return;

    if (!(await ai("result", RESULT_CARD))) return;
    setOutcomes("Pre-qualified", "verify", [["cibil", "782", "ok"], ["emi", "₹17,210", "ok"], ["decision", "Refer to maker", "ok"]]);
    setOps({ session: "web-ready", channel: "Website", file: "credit-ready", hitl: "review", los: "queued" });
    log("Credit-ready file packaged for the maker.");

    const done = await askReplies([{ label: "Open credit-ready file" }, { label: "Start over" }]);
    if (t !== token) return;
    if (done.label === "Start over") { reset(); return; }
    toast("Credit-ready file handed to the officer (demo)");
    document.querySelector("[data-open-file]")?.click();
  }

  function activate() {
    const title = document.querySelector("[data-side-title]");
    if (title) title.textContent = "Application log";
  }
  function showMlVideo() {
    activate();
    clearTranscript("");
    log("Malayalam webflow recording opened.");
    showStage("mlvideo");
    setOutcomes("ML webflow", "live", [["channel", "Website", ""], ["lang", "ML", "ok"], ["asset", "dhana-malayalam-webflow", ""]]);
    setOps({ session: "web-ml-video", channel: "Website", file: "-", hitl: "standby", los: "not synced" });
  }
  function setLang(l) {
    lang = l;
    if (langBadge) langBadge.textContent = l;
    if (inputPh) {
      inputPh.textContent = INPUT_PH[l] || INPUT_PH.EN;
      inputPh.className = "web-input-ph " + (LANGCLASS[l] || "");
    }
  }
  function reset() {
    token += 1;
    stopDemoVoice();
    if (chat) chat.innerHTML = "";
    if (quick) quick.innerHTML = "";
    showStage("intro");
    const vid = laptop.querySelector("[data-ml-video]");
    if (vid && !vid.paused) { try { vid.pause(); } catch (_) {} }
    setOutcomes("Idle", "", [["status", "-", ""], ["channel", "Website", ""]]);
  }

  laptop.querySelector("[data-web-verify]")?.addEventListener("click", () => {
    activate();
    clearTranscript("");
    showStage("chat");
    run();
  });
  laptop.querySelector("[data-web-ml-video]")?.addEventListener("click", showMlVideo);
  laptop.querySelector("[data-web-back-start]")?.addEventListener("click", () => {
    const vid = laptop.querySelector("[data-ml-video]");
    if (vid && !vid.paused) { try { vid.pause(); } catch (_) {} }
    showStage("intro");
    setOps({ session: "demo-idle", channel: "Website", file: "-", hitl: "standby", los: "not synced" });
  });

  return { reset, activate, showMlVideo, setLang };
}

/*.-. WhatsApp state machine.-. */
function initWhatsAppDemo(theater) {
  const wa = theater.querySelector("[data-wa]");
  if (!wa) return { reset() {} };

  const body = wa.querySelector("[data-wa-body]");
  const typing = wa.querySelector("[data-wa-typing]");
  const quick = wa.querySelector("[data-wa-quick]");
  let phase = "open";

  function sideForWa() {
    const title = document.querySelector("[data-side-title]");
    if (title) title.textContent = "Thread notes";
    clearTranscript("");
    addTranscript("agent", "Prior", "Application rejected · 32d ago", "");
    addTranscript("agent", "Today", "Retarget open. Stronger UPI pattern", "");
  }

  function bubble(dir, html) {
    const el = document.createElement("div");
    el.className = `wa-bubble ${dir}`;
    el.innerHTML = html;
    body.insertBefore(el, typing);
    body.scrollTop = body.scrollHeight;
  }

  function setQuick(buttons) {
    quick.innerHTML = "";
    buttons.forEach(([label, key]) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.dataset.waReply = key;
      b.addEventListener("click", () => onReply(key, label));
      quick.appendChild(b);
    });
  }

  function showTyping(on) {
    typing.classList.toggle("is-on", on);
    if (on) body.scrollTop = body.scrollHeight;
  }

  function waClock() {
    return new Date()
      .toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
      .toLowerCase();
  }

  function setPresence(text) {
    const el = wa.querySelector("[data-wa-presence]");
    if (el) el.textContent = text;
  }

  function agentSay(text, nextQuick, outcomes, ops) {
    showTyping(true);
    setPresence("typing…");
    setTimeout(() => {
      showTyping(false);
      setPresence("online");
      bubble("in", `${text}<span class="wa-meta"><span class="wa-time">${waClock()}</span></span>`);
      if (nextQuick) setQuick(nextQuick);
      if (outcomes) setOutcomes(...outcomes);
      if (ops) setOps(ops);
      addTranscript("agent", "Dhana WA", text, "");
    }, reducedMotion ? 80 : 900);
  }

  function onReply(key, label) {
    bubble(
      "out",
      `${label}<span class="wa-meta"><span class="wa-time">${waClock()}</span><span class="wa-ticks" aria-label="Read">✓✓</span></span>`
    );
    addTranscript("user", "Shreya", label, "");
    quick.innerHTML = "";

    if (key === "recheck" || key === "why") {
      phase = "path";
      const reason =
        key === "why"
          ? "The salary gate saw irregular months. Your UPI average tells a different story. We can reframe income for the desk."
          : "Great. I'll open a recheck with 12-month income framing and soft-bureau consent.";
      agentSay(
        reason,
        [
          ["Fix the income gap", "fix"],
          ["Try a smaller loan", "smaller"],
          ["See investment options", "invest"],
        ],
        [
          "Retarget live",
          "live",
          [
            ["prior", "Rejected · 32d", "bad"],
            ["reason", "Salary gate", "warn"],
            ["offer", "Recheck", "ok"],
          ],
        ],
        { session: "wa-retarget", channel: "WhatsApp", file: "prior", hitl: "standby", los: "not synced" }
      );
    } else if (key === "fix" || key === "smaller") {
      phase = "cross";
      agentSay(
        key === "fix"
          ? "I'll package UPI + AA narrative and request statement upload in-thread."
          : "We can table a lower ticket WC while your festival season settles. Still exception-framed.",
        [
          ["Upload statement", "upload"],
          ["Talk to an officer", "handoff"],
        ],
        [
          "Path chosen",
          "verify",
          [
            ["path", key === "fix" ? "Income reframe" : "Smaller ticket", "ok"],
            ["docs", "In-thread", ""],
            ["cross_sell", "Available", ""],
          ],
        ],
        { session: "wa-path", channel: "WhatsApp", file: "updating", hitl: "standby", los: "not synced" }
      );
    } else if (key === "invest") {
      phase = "cross";
      agentSay(
        "I can introduce a wealth / SIP conversation with our wealth agent. Or keep focus on the loan recheck.",
        [
          ["Stay on loan recheck", "fix"],
          ["Talk to an officer", "handoff"],
        ],
        [
          "Cross-sell",
          "flag",
          [
            ["alternate", "Wealth / SIP", ""],
            ["loan", "Still open", "ok"],
          ],
        ],
        { session: "wa-cross", channel: "WhatsApp", file: "prior", hitl: "standby", los: "not synced" }
      );
    } else if (key === "upload") {
      bubble(
        "out",
        `<div class="wa-voice"><span class="wa-voice-pill">PDF</span><div><strong>statement-feb.pdf</strong><div class="wa-voice-bar"></div></div></div><span class="wa-meta"><span class="wa-time">${waClock()}</span><span class="wa-ticks">✓✓</span></span>`
      );
      agentSay(
        "Received. OCR running. Looks readable. Want me to assign a human desk for final review?",
        [["Assign human desk", "handoff"]],
        [
          "Doc received",
          "verify",
          [
            ["doc", "statement-feb.pdf", "ok"],
            ["ocr", "Readable", "ok"],
          ],
        ],
        { session: "wa-docs", channel: "WhatsApp", file: "updating", hitl: "standby", los: "not synced" }
      );
    } else if (key === "handoff") {
      phase = "done";
      agentSay(
        "Done. Ticket #HD-4421 assigned to Kochi credit desk. They'll call within the allowed window.",
        [],
        [
          "Human assigned",
          "verify",
          [
            ["ticket", "HD-4421", "ok"],
            ["desk", "Kochi credit", "ok"],
            ["hitl", "Assigned", "ok"],
          ],
        ],
        { session: "wa-handoff", channel: "WhatsApp", file: "ready", hitl: "assigned", los: "not synced" }
      );
      toast("Human desk assigned · HD-4421");
      setQuick([]);
    }
  }

  quick.querySelectorAll("[data-wa-reply]").forEach((b) => {
    b.addEventListener("click", () => onReply(b.dataset.waReply, b.textContent));
  });

  function reset() {
    phase = "open";
    // Keep: earlier day, in, out, voice out, today day, open in = 6 nodes
    const nodes = [...body.querySelectorAll(".wa-bubble, .wa-day")];
    let keep = 0;
    nodes.forEach((n) => {
      keep += 1;
      if (keep > 6) n.remove();
    });
    showTyping(false);
    setPresence("online");
    setQuick([
      ["Yes, recheck my file", "recheck"],
      ["Why was I rejected?", "why"],
    ]);
    setOutcomes("Idle", "", [
      ["prior", "Rejected · 32d", "bad"],
      ["channel", "WhatsApp", ""],
    ]);
  }

  let lang = "EN";
  function setLang(l) {
    lang = l;
  }

  const WA_BARS = "<i></i>".repeat(14);
  function recordVoiceNote() {
    // the visitor's own voice note (mock recording)
    bubble(
      "out",
      `<div class="wa-voice"><span class="wa-voice-pill">🎤</span><div class="wa-wave">${WA_BARS}</div><span class="wa-voice-dur">0:06</span></div><span class="wa-meta"><span class="wa-time">${waClock()}</span><span class="wa-ticks">✓✓</span></span>`
    );
    addTranscript("user", "Shreya", "Voice note · 0:06", "");
    setPresence("recording heard · typing…");
    showTyping(true);
    setTimeout(() => {
      showTyping(false);
      setPresence("online");
      const el = document.createElement("div");
      el.className = "wa-bubble in";
      el.innerHTML = `<div class="wa-voice"><button type="button" class="wa-voice-pill" data-wa-play aria-label="Play voice reply">▶</button><div class="wa-wave" data-wa-wave>${WA_BARS}</div><span class="wa-voice-dur">0:14</span></div><span class="wa-meta"><span class="wa-time">${waClock()}</span></span>`;
      body.insertBefore(el, typing);
      body.scrollTop = body.scrollHeight;
      const audio = playLineVoice("wa", lang, "reply");
      const pill = el.querySelector("[data-wa-play]");
      const wave = el.querySelector("[data-wa-wave]");
      const setP = (on) => {
        if (pill) pill.textContent = on ? "❚❚" : "▶";
        if (wave) wave.classList.toggle("is-playing", on);
      };
      setP(true);
      if (audio) {
        audio.addEventListener("play", () => setP(true));
        audio.addEventListener("pause", () => setP(false));
        audio.addEventListener("ended", () => setP(false));
      }
      pill?.addEventListener("click", () => {
        if (!audio) return;
        if (audio.paused) audio.play().catch(() => {});
        else audio.pause();
      });
      addTranscript("agent", "Dhana WA", "Voice reply · reframed income, recheck opened", "");
      setOutcomes("Voice reply", "live", [
        ["channel", "WhatsApp", ""],
        ["mode", "Voice note", "ok"],
        ["language", lang, ""],
      ]);
      setOps({ session: "wa-voice", channel: "WhatsApp", file: "updating", hitl: "standby", los: "not synced" });
    }, reducedMotion ? 80 : 1100);
  }
  wa.querySelector("[data-wa-record]")?.addEventListener("click", recordVoiceNote);

  return { reset, activate: sideForWa, setLang };
}

/*.-. Theater shell.-. */
function initTheater() {
  const theater = document.querySelector("[data-theater]");
  if (!theater) return;

  const call = initCallDemo(theater);
  const web = initWebsiteDemo(theater);
  const wa = initWhatsAppDemo(theater);
  let channel = "call";

  function switchChannel(ch) {
    channel = ch;
    theater.dataset.channel = ch;
    theater.querySelectorAll(".theater-tab").forEach((t) => {
      t.setAttribute("aria-selected", String(t.dataset.channel === ch));
    });
    theater.querySelectorAll(".channel-panel").forEach((p) => {
      p.classList.toggle("is-active", p.dataset.panel === ch);
    });
    const title = document.querySelector("[data-side-title]");
    if (ch === "call") {
      if (title) title.textContent = "Live transcript";
      clearTranscript("Answer the call to see the conversation.");
      setOutcomes("Idle", "", [
        ["status", "-", ""],
        ["channel", "Call", ""],
      ]);
      setOps({ session: "demo-idle", channel: "Call", file: "-", hitl: "standby", los: "not synced" });
    } else if (ch === "website") {
      web.activate?.();
      clearTranscript("Start the application to log steps.");
      setOutcomes("Idle", "", [
        ["status", "-", ""],
        ["channel", "Website", ""],
      ]);
      setOps({ session: "demo-idle", channel: "Website", file: "-", hitl: "standby", los: "not synced" });
    } else {
      wa.activate?.();
      setOutcomes("Prior reject", "risk", [
        ["prior", "Rejected · 32d", "bad"],
        ["channel", "WhatsApp", ""],
        ["retarget", "Ready", "ok"],
      ]);
      setOps({ session: "wa-open", channel: "WhatsApp", file: "prior", hitl: "standby", los: "not synced" });
    }
  }

  theater.querySelectorAll(".theater-tab").forEach((tab) => {
    tab.addEventListener("click", () => switchChannel(tab.dataset.channel));
  });

  theater.querySelectorAll(".lang-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      theater.querySelectorAll(".lang-chip").forEach((c) => c.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      call.setLang?.(chip.dataset.lang);
      web.setLang?.(chip.dataset.lang);
      wa.setLang?.(chip.dataset.lang);
    });
  });

  theater.querySelector("[data-reset-demo]")?.addEventListener("click", () => {
    call.reset();
    web.reset();
    wa.reset();
    switchChannel(channel);
  });

  // Auto-ring shortly after load for Call channel (user must Answer)
  if (!reducedMotion && !window.__dhanaBlockAutoRing) {
    setTimeout(() => {
      if (channel === "call" && theater.querySelector("[data-phone]")?.dataset.state === "idle") {
        call.ring?.();
      }
    }, 1800);
  }
}

/*.-. Credit-ready file drawer.-. */
function initFileDrawer() {
  const backdrop = document.querySelector("[data-file-drawer]");
  if (!backdrop) return;

  const open = () => {
    backdrop.hidden = false;
    requestAnimationFrame(() => backdrop.classList.add("is-open"));
    document.body.classList.add("drawer-open");
    setOps({ file: "open", hitl: "review" });
  };
  const close = () => {
    backdrop.classList.remove("is-open");
    backdrop.hidden = true;
    document.body.classList.remove("drawer-open");
  };

  document.querySelectorAll("[data-open-file]").forEach((b) => b.addEventListener("click", open));
  backdrop.querySelector("[data-close-file]")?.addEventListener("click", close);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("is-open")) close();
  });

  backdrop.querySelectorAll("[data-file-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.fileTab;
      backdrop.querySelectorAll("[data-file-tab]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      backdrop.querySelectorAll("[data-file-pane]").forEach((p) => p.classList.toggle("is-active", p.dataset.filePane === id));
    });
  });

  backdrop.querySelectorAll("[data-doc]").forEach((card) => {
    card.addEventListener("click", () => {
      const ok = Math.random() > 0.35;
      card.dataset.ocr = ok ? "ok" : "flag";
      card.querySelector("span").textContent = ok ? "readable · OCR ok" : "flag · name mismatch";
    });
  });

  let scrubTimer;
  backdrop.querySelector("[data-audio-play]")?.addEventListener("click", (e) => {
    const scrub = backdrop.querySelector("[data-audio-scrub]");
    const t = backdrop.querySelector("[data-audio-t]");
    const btn = e.currentTarget;
    if (btn.dataset.playing === "1") {
      clearInterval(scrubTimer);
      btn.dataset.playing = "0";
      btn.textContent = "▶ Play";
      return;
    }
    btn.dataset.playing = "1";
    btn.textContent = "❚❚ Pause";
    scrubTimer = setInterval(() => {
      let v = Number(scrub.value) + 1;
      if (v >= 100) {
        v = 100;
        clearInterval(scrubTimer);
        btn.dataset.playing = "0";
        btn.textContent = "▶ Play";
      }
      scrub.value = v;
      const secs = Math.floor((v / 100) * 252);
      t.textContent = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
    }, 80);
  });

  document.querySelectorAll("[data-hitl]").forEach((btn) => {
    if (btn.dataset.hitlBound) return;
    btn.dataset.hitlBound = "1";
    btn.addEventListener("click", () => {
      const a = btn.dataset.hitl;
      if (a === "push") {
        const ref = "LOS-" + Math.floor(100000 + Math.random() * 899999);
        toast(`Pushed to Finacle / CRM · ${ref}`);
        setOps({ los: `synced · ${ref}`, hitl: "pushed", file: "synced" });
        setOutcomes("LOS synced", "verify", [
          ["los_ref", ref, "ok"],
          ["hitl", "Pushed", "ok"],
        ]);
      } else if (a === "approve" || a === "review") {
        toast("Queued for maker review. Dhana does not approve");
        setOps({ hitl: "maker review" });
      } else if (a === "more") {
        toast("Request-more note logged for the officer");
      } else {
        toast("Escalated to senior underwriter");
        setOps({ hitl: "escalated" });
      }
    });
  });
}

/*.-. Inline CRM dashboard tabs + OCR.-. */
function initCrmDash() {
  const root = document.querySelector("[data-crm-dash]");
  if (!root) return;

  root.querySelectorAll("[data-crm-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.dataset.crmTab;
      root.querySelectorAll("[data-crm-tab]").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      root.querySelectorAll("[data-crm-pane]").forEach((p) => p.classList.toggle("is-active", p.dataset.crmPane === id));
    });
  });

  root.querySelectorAll("[data-doc]").forEach((card) => {
    card.addEventListener("click", () => {
      const ok = Math.random() > 0.35;
      card.dataset.ocr = ok ? "ok" : "flag";
      const span = card.querySelector("span");
      if (span) span.textContent = ok ? "readable · OCR ok" : "flag · name mismatch";
    });
  });
}

/*.-. Dhana animated word (EN / ML / HI / TA).-. */
function initDhanaWords() {
  const words = ["Dhana", "ധന", "धन", "தன"];
  const fonts = ["", "lang-ml", "lang-hi", "lang-ta"];
  document.querySelectorAll("[data-dhana-word]").forEach((el) => {
    const measure = el.querySelector(".dhana-word-measure");
    const visible = el.querySelector(".dhana-word-visible");
    if (!measure || !visible) return;
    let i = 0;

    const fitWidth = () => {
      // Absolute measure can under-report before layout; pad so glyphs never clip
      const w = Math.ceil(Math.max(measure.scrollWidth, measure.getBoundingClientRect().width, 1) + 8);
      el.style.width = `${w}px`;
    };

    const paint = (animate) => {
      const next = words[i % words.length];
      const font = fonts[i % fonts.length];
      measure.textContent = next;
      measure.className = `dhana-word-measure ${font}`.trim();
      // Double-rAF so web fonts / Indic shaping settle before measuring
      requestAnimationFrame(() => {
        fitWidth();
        requestAnimationFrame(fitWidth);
      });
      const swap = () => {
        visible.textContent = next;
        visible.className = `dhana-word-visible ${font}`.trim();
        fitWidth();
        if (animate && !reducedMotion) {
          void visible.offsetWidth;
          visible.classList.add("is-enter");
          requestAnimationFrame(() => visible.classList.remove("is-enter"));
        }
      };
      if (!animate || reducedMotion) {
        swap();
      } else {
        visible.classList.add("is-exit");
        setTimeout(swap, 220);
      }
      i += 1;
    };

    // Ensure fonts ready so first "Dhana" isn't truncated
    const start = () => {
      paint(false);
      if (!reducedMotion) setInterval(() => paint(true), 2400);
    };
    if (document.fonts?.ready) document.fonts.ready.then(start).catch(start);
    else start();
  });
}

/*.-. Voice orb. Purple particle sphere from Malayalam product video.-. */
const ORB_PRESETS = {
  idle: { c1: [180, 120, 255], c2: [90, 40, 200], c3: [255, 100, 220], speed: 0.35, intensity: 0.55, rings: false },
  listening: { c1: [200, 140, 255], c2: [100, 50, 220], c3: [255, 120, 230], speed: 0.55, intensity: 0.85, rings: true },
  thinking: { c1: [220, 100, 255], c2: [120, 40, 210], c3: [255, 80, 200], speed: 0.7, intensity: 0.75, rings: true },
  speaking: { c1: [230, 130, 255], c2: [80, 30, 190], c3: [255, 90, 210], speed: 0.9, intensity: 1, rings: true },
};

function initVoiceOrbs() {
  document.querySelectorAll("[data-voice-orb]").forEach((orb) => {
    const canvas = orb.querySelector("[data-orb-canvas]");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Number(canvas.getAttribute("width")) || 200;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Seed particles on a sphere-ish distribution (matches video density)
    const particles = Array.from({ length: 220 }, () => {
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      return {
        theta,
        phi,
        r: 0.55 + Math.random() * 0.4,
        tw: Math.random() * Math.PI * 2,
        size: 0.6 + Math.random() * 1.8,
      };
    });

    const rgb = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    let t0 = performance.now();

    const draw = (now) => {
      if (!orb.isConnected) return;
      const state = orb.dataset.orbState || "idle";
      const p = ORB_PRESETS[state] || ORB_PRESETS.idle;
      const t = ((now - t0) / 1000) * p.speed;
      const cx = size / 2;
      const cy = size / 2;
      const baseR = size * 0.28;
      const pulse = 1 + Math.sin(t * 5) * 0.05 * p.intensity;

      ctx.clearRect(0, 0, size, size);

      // Outer glow
      const glow = ctx.createRadialGradient(cx, cy, baseR * 0.2, cx, cy, baseR * 2.2);
      glow.addColorStop(0, rgb(p.c1, 0.35 * p.intensity));
      glow.addColorStop(0.45, rgb(p.c2, 0.18 * p.intensity));
      glow.addColorStop(1, rgb(p.c2, 0));
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * 2.2 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Core volume
      const core = ctx.createRadialGradient(cx - baseR * 0.15, cy - baseR * 0.2, 2, cx, cy, baseR * 1.15);
      core.addColorStop(0, rgb([255, 230, 255], 0.55));
      core.addColorStop(0.25, rgb(p.c1, 0.85));
      core.addColorStop(0.7, rgb(p.c2, 0.75));
      core.addColorStop(1, rgb(p.c2, 0.05));
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(cx, cy, baseR * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Particle shell (video look)
      for (const pt of particles) {
        const spin = t * (0.8 + pt.r);
        const th = pt.theta + spin;
        const ph = pt.phi + Math.sin(t + pt.tw) * 0.08;
        const rr = baseR * pt.r * pulse;
        const x = cx + rr * Math.sin(ph) * Math.cos(th);
        const y = cy + rr * Math.sin(ph) * Math.sin(th);
        const z = Math.cos(ph);
        const a = (0.25 + 0.75 * ((z + 1) / 2)) * p.intensity;
        const s = pt.size * (0.7 + ((z + 1) / 2) * 0.8);
        const col = z > 0.2 ? p.c3 : z > -0.2 ? p.c1 : p.c2;
        ctx.fillStyle = rgb(col, a);
        ctx.beginPath();
        ctx.arc(x, y, s, 0, Math.PI * 2);
        ctx.fill();
      }

      // Specular highlight
      ctx.fillStyle = rgb([255, 255, 255], 0.22);
      ctx.beginPath();
      ctx.ellipse(cx - baseR * 0.25, cy - baseR * 0.35, baseR * 0.28, baseR * 0.16, -0.5, 0, Math.PI * 2);
      ctx.fill();

      // Sync CSS rings for listening/speaking
      const rings = orb.querySelector(".voice-orb-rings");
      if (rings) rings.classList.toggle("is-pulse", Boolean(p.rings));

      if (!reducedMotion) requestAnimationFrame(draw);
    };

    draw(performance.now());
  });
}

/*.-. Integrations.-. */
function initIntegrations() {
  const board = document.querySelector("[data-integrations]");
  if (!board) return;
  const detail = board.querySelector("[data-topo-detail]");
  const copy = {
    dhana: ["Dhana", "Relationship layer. Voice, web, WhatsApp. Orchestrates consent, session audit, and adapter pushes. Does not replace CBS."],
    finacle: ["Finacle / CBS", "Core banking adapter. Push qualified packets and status sync. Consent required for customer data movement."],
    los: ["LOS", "Loan origination system handoff. Application #, docs, exception brief."],
    crm: ["CRM", "Officer tasking, callback windows, ticket assignment."],
    bureau: ["Bureau", "Soft pull only after explicit consent gate. Sandbox blocks live pulls in demo."],
    digilocker: ["DigiLocker", "Document fetch with user consent. Aadhaar/PAN where institution allows."],
    aa: ["Account Aggregator", "Income and cashflow narrative with purpose limitation under DPDP."],
  };

  board.querySelectorAll("[data-node]").forEach((node) => {
    node.addEventListener("click", () => {
      board.querySelectorAll("[data-node]").forEach((n) => n.classList.remove("is-selected"));
      node.classList.add("is-selected");
      const [title, body] = copy[node.dataset.node] || ["Node", ""];
      detail.innerHTML = `<strong>${title}</strong>${body}`;
    });
  });

  board.querySelector("[data-push-test]")?.addEventListener("click", () => {
    const edge = board.querySelector("[data-edge]");
    edge?.classList.remove("is-packet");
    void edge?.offsetWidth;
    edge?.classList.add("is-packet");
    setTimeout(() => {
      toast("Push test OK · Finacle green check");
      setOps({ los: "test sync OK" });
      detail.innerHTML = `<strong>Push test · Finacle</strong>Packet acknowledged (illustrative). <span class="ok">Green check</span>`;
    }, 850);
  });
}

/*.-. Agent Center (n8n-style graph).-. */
function initAgentCenter() {
  const root = document.querySelector("[data-agent-center]");
  if (!root) return;
  return initAgentTune(root);
}

function initAgentTune(root) {
  const AGENTS = {
    lending: { name: "Rin", live: true },
    collections: { name: "Setu", tag: "Collections agent", desc: "Gentle reminders and promise-to-pay, always inside RBI calling windows. Retargets earlier rejects when the profile strengthens." },
    insurance: { name: "Raksha", tag: "Insurance agent", desc: "Advisory, proposal and submission in plain language, renewals and consent-based cross-sell. IRDAI aligned; suitability first." },
    wealth: { name: "Artha", tag: "Investment agent", desc: "Conversational investment onboarding and advisory: SIPs, deposits and goals, risk-profiled to each customer. SEBI aligned." },
    account: { name: "Nova", tag: "Account-opening agent", desc: "Conversational account opening with video-KYC and eSign, in the customer's own language. RBI compliant." },
  };
  const PREVIEW = {
    EN: "“Namaskaram, this is Rin from your bank about the working-capital enquiry. Is now a good time?”",
    ML: "“നമസ്കാരം, ഞാൻ നിങ്ങളുടെ ബാങ്കിൽ നിന്ന് Rin ആണ്, വർക്കിംഗ് ക്യാപിറ്റൽ അന്വേഷണത്തെക്കുറിച്ച്. ഇപ്പോൾ സംസാരിക്കാമോ?”",
    HI: "“नमस्ते, मैं आपके बैंक से Rin, वर्किंग कैपिटल पूछताछ के बारे में। क्या अभी बात कर सकते हैं?”",
    TA: "“வணக்கம், நான் உங்கள் வங்கியிலிருந்து Rin, வொர்க்கிங் கேபிடல் விசாரணை குறித்து. இப்போது பேசலாமா?”",
  };
  const PREVIEW_CLASS = { EN: "", ML: "lang-ml", HI: "lang-hi", TA: "lang-ta" };

  const rulesEl = root.querySelector("[data-rules]");
  const previewEl = root.querySelector("[data-preview-line]");
  const input = root.querySelector("[data-rule-input]");
  const panes = [...root.querySelectorAll("[data-agent-pane]")];

  let rules = ["Greet in the customer's language", "Confirm consent before any bureau pull"];

  const detectLang = () => {
    const j = rules.join(" ").toLowerCase();
    if (/malayalam|മലയാളം/.test(j)) return "ML";
    if (/hindi|हिंदी/.test(j)) return "HI";
    if (/tamil|தமிழ்/.test(j)) return "TA";
    return "EN";
  };
  function renderPreview() {
    if (!previewEl) return;
    const l = detectLang();
    previewEl.textContent = PREVIEW[l];
    previewEl.className = "agent-preview-line " + (PREVIEW_CLASS[l] || "");
  }
  function renderRules() {
    if (!rulesEl) return;
    rulesEl.innerHTML = "";
    rules.forEach((r, i) => {
      const li = document.createElement("li");
      li.className = "agent-rule";
      const span = document.createElement("span");
      span.textContent = r;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", "Remove");
      btn.textContent = "×";
      btn.addEventListener("click", () => { rules.splice(i, 1); renderRules(); });
      li.append(span, btn);
      rulesEl.appendChild(li);
    });
    renderPreview();
  }
  function addRule(text) {
    const t = (text || "").trim();
    if (!t) return;
    rules.push(t);
    renderRules();
    toast("Rin updated · " + (t.length > 34 ? t.slice(0, 34) + "…" : t));
  }

  root.querySelector("[data-rule-add]")?.addEventListener("click", () => { addRule(input?.value); if (input) input.value = ""; });
  input?.addEventListener("keydown", (e) => { if (e.key === "Enter") { addRule(input.value); input.value = ""; } });
  root.querySelectorAll("[data-suggest]").forEach((b) => b.addEventListener("click", () => addRule(b.dataset.suggest)));

  const showPane = (name) => panes.forEach((p) => p.classList.toggle("is-active", p.dataset.agentPane === name));

  root.querySelectorAll("[data-agent]").forEach((item) => {
    item.addEventListener("click", () => {
      const key = item.dataset.agent;
      root.querySelectorAll("[data-agent]").forEach((i) => i.setAttribute("aria-selected", String(i === item)));
      if (key === "lending") {
        showPane("lending");
      } else {
        const a = AGENTS[key] || AGENTS.collections;
        const nm = root.querySelector("[data-locked-name]");
        const tg = root.querySelector("[data-locked-tag]");
        const ds = root.querySelector("[data-locked-desc]");
        if (nm) nm.textContent = a.name;
        if (tg) tg.textContent = a.tag;
        if (ds) ds.textContent = a.desc;
        showPane("locked");
      }
    });
  });

  root.querySelector("[data-locked-notify]")?.addEventListener("click", () => {
    const name = root.querySelector("[data-locked-name]")?.textContent || "This agent";
    toast(`${name}, we'll tell you at launch`);
  });
  root.querySelector("[data-agent-test]")?.addEventListener("click", () => {
    document.querySelector("#theater")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    document.querySelector('.theater-tab[data-channel="call"]')?.click();
  });

  renderRules();
}

// Legacy n8n graph editor — dead code, superseded by initAgentTune.
function initAgentCenterLegacy() {
  const root = document.querySelector("[data-agent-center]");
  if (!root) return;

  const meta = {
    lending: { title: "Lending RM", sub: "Live · origination + exception framing", live: true },
    insurance: { title: "Insurance", sub: "Draft · product explain + cross-sell", live: false },
    wealth: { title: "Wealth", sub: "Draft · SIP / deposit coaching", live: false },
    collections: { title: "Collections", sub: "Draft · PTP with calling-window respect", live: false },
  };

  const flowCopy = {
    call: ["Call", "Answer inbound / scheduled voice. Language pack, calling windows, and voice-integrity badge attach here."],
    verify: ["Verify", "Consent gate, DigiLocker / KYC attach, and identity checks before any bureau pull."],
    bureau: ["Bureau", "Soft pull only after explicit consent. Score + remarks land on the credit-ready CRM."],
    los: ["LOS", "Build the officer packet. Docs, income frame, exception brief. Ready for Finacle / LOS push."],
    human: ["Human", "HITL lock on credit-relevant outcomes. Approve, request more, or escalate. Never silent auto-decide."],
  };

  root.querySelectorAll("[data-agent]").forEach((item) => {
    item.addEventListener("click", () => {
      root.querySelectorAll("[data-agent]").forEach((i) => i.setAttribute("aria-selected", "false"));
      item.setAttribute("aria-selected", "true");
      const m = meta[item.dataset.agent];
      root.querySelector("[data-agent-title]").textContent = m.title;
      root.querySelector("[data-agent-sub]").textContent = m.sub;
    });
  });

  root.querySelectorAll("[data-flow-node]").forEach((node) => {
    node.addEventListener("click", () => {
      root.querySelectorAll("[data-flow-node]").forEach((n) => n.classList.remove("is-active"));
      node.classList.add("is-active");
      const [title, body] = flowCopy[node.dataset.flowNode] || ["Node", ""];
      const detail = root.querySelector("[data-flow-detail]");
      if (detail) detail.innerHTML = `<strong>${title}</strong><p>${body}</p>`;
    });

    node.addEventListener("dragstart", (e) => {
      node.classList.add("is-dragging");
      e.dataTransfer?.setData("text/plain", node.dataset.flowNode || "");
    });
    node.addEventListener("dragend", () => node.classList.remove("is-dragging"));
  });

  const canvas = root.querySelector("[data-n8n-canvas]");
  canvas?.addEventListener("dragover", (e) => e.preventDefault());
  canvas?.addEventListener("drop", (e) => {
    e.preventDefault();
    toast("Node position saved (illustrative) · draft dirty");
  });

  root.querySelector("[data-agent-save]")?.addEventListener("click", () => {
    toast("Draft saved · pending compliance review");
    setOps({ hitl: "compliance review" });
  });

  root.querySelector("[data-deploy-insurance]")?.addEventListener("click", () => {
    const selected = root.querySelector('[data-agent][aria-selected="true"]');
    const key = selected?.dataset.agent || "insurance";
    const target = root.querySelector(`[data-agent="${key}"]`) || root.querySelector('[data-agent="insurance"]');
    if (target) {
      const dot = target.querySelector(".dot");
      dot?.classList.remove("draft");
      dot?.classList.add("live");
      root.querySelectorAll("[data-agent]").forEach((i) => i.setAttribute("aria-selected", String(i === target)));
      const m = meta[target.dataset.agent] || meta.insurance;
      root.querySelector("[data-agent-title]").textContent = m.title;
      root.querySelector("[data-agent-sub]").textContent = "Deployed · pending compliance review";
    }
    toast(`${(meta[key] || meta.insurance).title} deployed · pending compliance review`);
    setOps({ hitl: "compliance review", session: "agent-deploy" });
  });

  root.querySelector("[data-test-call]")?.addEventListener("click", () => {
    document.querySelector("#theater")?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
    const callTab = document.querySelector('.theater-tab[data-channel="call"]');
    callTab?.click();
    toast("Opening Dhana login. Purple AI sphere");
  });
}

/*.-. Shreya flip — self-playing rebuild.-. */
function initShreya() {
  const root = document.querySelector("[data-shreya]");
  if (!root) return;
  const section = document.querySelector("#shreya");
  const phaseEl = section?.querySelector("[data-shreya-phase]");
  const progressEl = section?.querySelector("[data-shreya-progress]");
  const playBtn = root.querySelector("[data-shreya-play]");
  let playing = false;

  root.querySelectorAll("[data-shreya-view]").forEach((b) => {
    b.addEventListener("click", () => setShreyaView(b.dataset.shreyaView));
  });

  const wait = (ms) => new Promise((r) => setTimeout(r, reducedMotion ? Math.min(ms, 40) : ms));
  const setProgress = (pct) => { if (progressEl) progressEl.style.width = pct + "%"; };

  async function play() {
    if (playing) return;
    playing = true;
    if (playBtn) playBtn.disabled = true;
    setShreyaView("before");
    if (phaseEl) phaseEl.textContent = "Before · auto-filtered";
    setProgress(6);
    await wait(450);

    root.classList.add("is-talking");
    const steps = [
      ["Holding the conversation in her language…", 30],
      ["UPI + Account Aggregator, with consent…", 52],
      ["Soft bureau: gate passed…", 72],
      ["Voice integrity: pass…", 88],
    ];
    for (const [label, pct] of steps) {
      if (phaseEl) phaseEl.textContent = "Conversation · " + label;
      setProgress(pct);
      await wait(820);
    }

    root.classList.remove("is-talking");
    setShreyaView("after");
    if (phaseEl) phaseEl.textContent = "After · exception file ready";
    setProgress(100);
    if (playBtn) {
      playBtn.disabled = false;
      playBtn.textContent = "Open the credit-ready file";
      playBtn.dataset.done = "1";
    }
    playing = false;
  }

  playBtn?.addEventListener("click", () => {
    if (playBtn.dataset.done === "1") {
      document.querySelector("[data-open-file]")?.click();
      return;
    }
    play();
  });
}

function formPayload(form) {
  const data = new FormData(form);
  const obj = {};
  data.forEach((v, k) => {
    obj[k] = String(v).trim();
  });
  return obj;
}

function mailtoSupport(subject, fields) {
  const body = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v || "-"}`)
    .join("\n");
  const href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

/*.-. Book a pilot → Calendly (primary CTAs).-. */
function initBookPilot() {
  document.querySelectorAll("[data-book-pilot], [data-calendly]").forEach((el) => {
    if (el.tagName === "A") {
      el.setAttribute("href", CALENDLY_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    } else {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
      });
    }
  });
}

/*.-. Resources hub subnav.-. */
function initResourcesHub() {
  const hub = document.querySelector("[data-resources-hub]");
  if (!hub) return;
  const links = [...hub.querySelectorAll("[data-hub-nav]")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const target = id ? document.querySelector(id) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      links.forEach((l) => l.classList.toggle("is-active", l === a));
      history.replaceState(null, "", id);
    });
  });

  if (!sections.length) return;
  // Position-based scrollspy on a per-frame rAF loop: the active section is the
  // last one whose top has scrolled above a line ~1/3 down the viewport. Reading
  // position every frame is bulletproof across any scroll mechanism — Lenis
  // smooth-scroll (which suppresses native scroll events), native scroll, and
  // programmatic scrollIntoView — and reliable for very tall sections (e.g.
  // Frameworks) that intersection-ratio thresholds miss. The DOM is only touched
  // when the active section actually changes, so the loop stays cheap.
  let lastId = "";
  const tick = () => {
    const line = window.innerHeight * 0.33;
    let current = sections[0];
    for (const s of sections) {
      if (s.getBoundingClientRect().top - line <= 0) current = s;
    }
    if (current.id !== lastId) {
      lastId = current.id;
      const id = `#${current.id}`;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === id));
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/*.-. Contact form.-. */
function initContact() {
  const form = document.querySelector("[data-contact-form]");
  if (!form) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = formPayload(form);
    console.info("[dhana contact]", fields);
    mailtoSupport("Dhana pilot request", {
      Name: fields.name,
      Institution: fields.institution,
      Type: fields.type,
      Email: fields.email,
      Phone: fields.phone,
      Notes: fields.message,
    });
    const success = form.querySelector(".form-success");
    if (success) {
      success.classList.add("is-show");
      success.hidden = false;
    }
    toast(`Opening mail to ${SUPPORT_EMAIL}`);
  });
}

/*.-. Waitlist forms.-. */
function initWaitlist() {
  document.querySelectorAll("[data-waitlist-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = formPayload(form);
      console.info("[dhana waitlist]", fields);
      mailtoSupport("Dhana waitlist", {
        Name: fields.name,
        Institution: fields.institution,
        Email: fields.email,
        Type: fields.type,
      });
      toast(`Waitlist noted. Opening mail to ${SUPPORT_EMAIL}`);
      form.reset();
    });
  });
  document.querySelectorAll("[data-pilot-form]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fields = formPayload(form);
      console.info("[dhana pilot]", fields);
      mailtoSupport("Dhana pilot invite", { Institution: fields.institution, Email: fields.email });
      const status = document.querySelector("[data-pilot-status]");
      if (status) {
        status.hidden = false;
        status.textContent = `You're on the pilot list, we'll reach out at ${fields.email}.`;
      }
      toast("Pilot invite requested");
      form.reset();
    });
  });
}

/*.-. Use cases search / filter.-. */
function initUseCases() {
  const root = document.querySelector("[data-uc-page]");
  if (!root) return;
  const search = root.querySelector("[data-uc-search]");
  const chips = [...root.querySelectorAll("[data-uc-filter]")];
  const cards = [...root.querySelectorAll("[data-uc-card]")];
  const empty = root.querySelector("[data-uc-empty]");
  let filter = "all";

  function apply() {
    const q = (search?.value || "").trim().toLowerCase();
    let visible = 0;
    cards.forEach((card) => {
      const tags = (card.dataset.tags || "").toLowerCase();
      const hay = `${card.textContent} ${tags}`.toLowerCase();
      const tagOk = filter === "all" || tags.split(/\s+/).includes(filter);
      const textOk = !q || hay.includes(q);
      const show = tagOk && textOk;
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    empty?.classList.toggle("is-show", visible === 0);
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      filter = chip.dataset.ucFilter || "all";
      chips.forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      apply();
    });
  });
  search?.addEventListener("input", apply);
  apply();
}

function initHeroMedallionVideo() {
  const video = document.querySelector(".hero-medallion-video video");
  if (!video) return;
  video.muted = true;
  const play = () => video.play().catch(() => {});
  play();
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) play();
  });
}

function initPhoneMedallion() {
  const vids = Array.from(document.querySelectorAll(".phone-medallion"));
  if (!vids.length) return;
  // Hide the WebGL orb only once the medallion is actually rendering, so
  // browsers that can't play alpha-webm keep showing the orb underneath.
  vids.forEach((v) => {
    v.addEventListener("playing", () => {
      v.closest(".phone-avatar")?.classList.add("has-medallion");
    });
  });
  const playAll = () => vids.forEach((v) => {
    v.muted = true;
    v.play().catch(() => {});
  });
  playAll();
  // Phone states are display:none until active; replay when one becomes visible.
  const phone = document.querySelector("[data-phone]");
  if (phone && "MutationObserver" in window) {
    new MutationObserver(playAll).observe(phone, {
      attributes: true,
      attributeFilter: ["data-state"],
    });
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) playAll();
  });
}

/* ——— Demo voice clips ———
   Plays /assets/audio/<base>-<lang>.mp3 when present (real Sarvam voices, generated by
   scripts/generate-sarvam-voice.mjs), else falls back to the English <base>.mp3. So the
   demos auto-upgrade per language the moment the Sarvam clips are dropped in — no code change. */
const VOICE_BASES = {
  callGreeting: "dhana-call-greeting",
  webWelcome: "dhana-web-welcome",
};
let __demoAudio = null;
function playDemoVoice(kind, lang) {
  const base = VOICE_BASES[kind];
  if (!base) return;
  const enSrc = `assets/audio/${base}.mp3`;
  const langSrc = `assets/audio/${base}-${(lang || "en").toLowerCase()}.mp3`;
  try {
    if (__demoAudio) __demoAudio.pause();
    const a = new Audio(langSrc);
    a.addEventListener(
      "error",
      () => {
        if (__demoAudio !== a) return; // a newer clip took over
        const b = new Audio(enSrc);
        __demoAudio = b;
        b.play().catch(() => {});
      },
      { once: true },
    );
    __demoAudio = a;
    a.play().catch(() => {});
  } catch (_) {}
}
function stopDemoVoice() {
  try {
    if (__demoAudio) {
      __demoAudio.pause();
      __demoAudio = null;
    }
  } catch (_) {}
}
// Play one scripted line: /assets/audio/<channel>-<lang>-<key>.mp3 (real Sarvam voices).
function playLineVoice(channel, lang, key) {
  const src = `assets/audio/${channel}-${(lang || "en").toLowerCase()}-${key}.mp3`;
  try {
    if (__demoAudio) __demoAudio.pause();
    const a = new Audio(src);
    __demoAudio = a;
    a.play().catch(() => {});
    return a;
  } catch (_) {
    return null;
  }
}

/* ——— Resources content (blog / news / events, data-driven) ——— */
function initResourcesContent() {
  const grids = document.querySelectorAll("[data-content-grid]");
  if (!grids.length) return;
  const fmtDate = (d) => {
    try {
      return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    } catch (_) {
      return d;
    }
  };
  grids.forEach((grid) => {
    const type = grid.dataset.contentGrid;
    const items = Object.entries(CONTENT)
      .filter(([, c]) => c.type === type)
      .sort((a, b) => (a[1].date < b[1].date ? 1 : -1));
    grid.classList.remove("reveal-stagger");
    const isVideo = type === "video";
    grid.innerHTML = items
      .map(
        ([slug, c]) => `
      <article class="hub-card${isVideo ? " hub-card--video" : ""}">
        <a class="hub-card-media" href="/article.html?slug=${slug}" aria-label="${c.title}"><img src="${c.image}" alt="" loading="lazy" />${isVideo ? '<span class="hub-play" aria-hidden="true">▶</span>' : ""}</a>
        <div class="hub-card-body">
          <span class="hub-kicker">${c.category}</span>
          <h3><a href="/article.html?slug=${slug}">${c.title}</a></h3>
          <p>${c.excerpt}</p>
          <span class="hub-meta">${fmtDate(c.date)} · ${c.read}</span>
          <a class="hub-card-link" href="/article.html?slug=${slug}">${isVideo ? "Watch" : type === "event" ? "Details" : "Read"} →</a>
        </div>
      </article>`,
      )
      .join("");
  });
}

/* ——— Article detail page (article.html?slug=) ——— */
function initArticle() {
  const root = document.querySelector("[data-article]");
  if (!root) return;
  const slug = new URLSearchParams(location.search).get("slug");
  const c = slug && CONTENT[slug];
  if (!c) {
    root.innerHTML = `<div class="wrap article-wrap"><p class="article-kicker">Not found</p><h1>That article isn't here.</h1><p><a class="hub-card-link" href="/resources.html">← Back to resources</a></p></div>`;
    return;
  }
  document.title = `${c.title} | Dhana`;
  const date = (() => {
    try {
      return new Date(c.date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    } catch (_) {
      return c.date;
    }
  })();
  const backMap = { blog: "blog", news: "news", event: "events", video: "videos", framework: "frameworks" };
  const hero = c.video
    ? `<div class="article-hero article-hero--video"><video controls playsinline preload="metadata" poster="${c.image}" aria-label="${c.title}"><source src="${c.video}" type="video/mp4" /></video></div>`
    : `<div class="article-hero"><img src="${c.image}" alt="" /></div>`;
  root.innerHTML = `
    <div class="wrap article-wrap">
      <a class="article-back" href="/resources.html#${backMap[c.type] || "blog"}">← Resources</a>
      <span class="article-kicker">${c.category} · ${date} · ${c.read}</span>
      <h1 class="article-title">${c.title}</h1>
      <p class="article-lead">${c.excerpt}</p>
      ${hero}
      <div class="article-body">${c.body}</div>
      ${
        c.authority
          ? `<a class="article-authority" href="${c.authority.url}" target="_blank" rel="noopener noreferrer">
        <div class="article-authority-txt">
          <span class="article-authority-label">Official source</span>
          <strong>${c.authority.name}</strong>
          ${c.authority.note ? `<span class="article-authority-note">${c.authority.note}</span>` : ""}
        </div>
        <span class="article-authority-ext" aria-hidden="true">↗</span>
      </a>`
          : ""
      }
      <div class="article-foot">
        <a class="btn btn-primary" href="${CALENDLY_URL}" target="_blank" rel="noopener noreferrer">Book a demo</a>
        <a class="btn btn-ghost" href="/resources.html${c.type === "framework" ? "#frameworks" : ""}">${c.type === "framework" ? "All frameworks" : "More from Dhana"}</a>
      </div>
    </div>`;
}

/* ——— "Get a call from Dhana" (live outbound via server/call-me.mjs) ——— */
function initCallMe() {
  const form = document.querySelector("[data-callme-form]");
  if (!form) return;
  const status = form.querySelector("[data-callme-status]");
  const btn = form.querySelector('button[type="submit"]');
  const show = (msg, kind) => {
    if (!status) return;
    status.hidden = false;
    status.textContent = msg;
    status.dataset.kind = kind || "";
  };
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const payload = {
      name: (fd.get("name") || "").toString().trim(),
      phone: (fd.get("phone") || "").toString().replace(/\s+/g, ""),
      language: fd.get("language") || "en",
      consent: fd.get("consent") === "on",
    };
    if (!payload.consent) return show("Please tick consent so we can call you.", "err");
    btn.disabled = true;
    show("Requesting your call…", "");
    try {
      const res = await fetch("/api/call-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (data.ok) show("Calling you now, please pick up. 📞", "ok");
      else if (data.error === "server_not_configured") show("Live calling isn't switched on yet, add Sarvam credentials to .env.", "err");
      else if (data.error === "invalid_phone") show("Enter a valid number with country code, e.g. +91…", "err");
      else if (data.error === "consent_required") show("Please tick consent so we can call you.", "err");
      else show("Couldn't place the call just now. Please try again shortly.", "err");
    } catch (_) {
      show("Backend not reachable. Start it: node --env-file=.env server/dev-server.mjs", "err");
    } finally {
      btn.disabled = false;
    }
  });
}

/* ——— Voice-first band audio ——— */
function initVoiceBand() {
  const audio = document.querySelector("[data-vfb-audio]");
  if (!audio) return;
  const band = document.querySelector(".vfb");
  const icon = document.querySelector(".vfb-play-icon");
  const ctas = [...document.querySelectorAll("[data-vfb-play].btn")];
  const setState = (playing) => {
    band?.classList.toggle("is-playing", playing);
    if (icon) icon.textContent = playing ? "❚❚" : "▶";
    ctas.forEach((b) => (b.textContent = playing ? "❚❚ Pause" : "▶ Hear a credit conversation"));
  };
  document.querySelectorAll("[data-vfb-play]").forEach((b) => {
    b.addEventListener("click", () => {
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
    });
  });
  audio.addEventListener("play", () => setState(true));
  audio.addEventListener("pause", () => setState(false));
  audio.addEventListener("ended", () => {
    setState(false);
    audio.currentTime = 0;
  });
}

/* ——— Architecture data-flow diagram: curved connectors from each channel into the
   Dhana hub and out to each core system, drawn from measured positions so they stay
   correct at every resolution, with energy flowing along every line. ——— */
function initArchFlow() {
  const fc = document.querySelector("[data-arch]");
  if (!fc) return;
  const svg = fc.querySelector(".fc-svg");
  const hub = fc.querySelector("[data-arch-hub]");
  if (!svg || !hub) return;
  const srcs = [...fc.querySelectorAll("[data-arch-src]")];
  const dsts = [...fc.querySelectorAll("[data-arch-dst]")];

  const rel = (el, edge) => {
    const r = el.getBoundingClientRect();
    const f = fc.getBoundingClientRect();
    return { x: r.left + r.width / 2 - f.left, y: (edge === "bottom" ? r.bottom : r.top) - f.top };
  };
  const curve = (a, b) => {
    const my = (a.y + b.y) / 2;
    return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} C ${a.x.toFixed(1)} ${my.toFixed(1)}, ${b.x.toFixed(1)} ${my.toFixed(1)}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
  };
  const draw = () => {
    const f = fc.getBoundingClientRect();
    if (!f.width) return;
    svg.setAttribute("viewBox", `0 0 ${f.width.toFixed(0)} ${f.height.toFixed(0)}`);
    const hubTop = rel(hub, "top");
    const hubBot = rel(hub, "bottom");
    let out = "";
    let i = 0;
    const add = (d) => {
      out += `<path class="fc-track" d="${d}"/><path class="fc-line" d="${d}" style="animation-delay:${(i * 0.1).toFixed(2)}s"/>`;
      i += 1;
    };
    srcs.forEach((s) => add(curve(rel(s, "bottom"), hubTop)));
    dsts.forEach((s) => add(curve(hubBot, rel(s, "top"))));
    svg.innerHTML = out;
  };

  draw();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw).catch(() => {});
  setTimeout(draw, 350);
  let raf = 0;
  const redraw = () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(draw);
  };
  if (typeof ResizeObserver !== "undefined") new ResizeObserver(redraw).observe(fc);
  window.addEventListener("resize", redraw);
}

/* ——— Reach-out section: waitlist / call / demo tabs (waitlist opens by default) ——— */
function initReachTabs() {
  const tabsWrap = document.querySelector("[data-reach-tabs]");
  if (!tabsWrap) return;
  const tabs = [...tabsWrap.querySelectorAll("[data-reach-tab]")];
  const panels = [...document.querySelectorAll("[data-reach-panel]")];
  const show = (name) => {
    tabs.forEach((t) => {
      const on = t.dataset.reachTab === name;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    panels.forEach((p) => p.classList.toggle("is-active", p.dataset.reachPanel === name));
  };
  tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.reachTab)));
}

/* ——— Boot ——— */
initNav();
initMotion();
initDhanaWords();
voiceOrbs = initAllVoiceOrb3D({ reducedMotion });
initHeroMedallionVideo();
initPhoneMedallion();
initTheater();
initFileDrawer();
initCrmDash();
initIntegrations();
initAgentCenter();
initArchFlow();
initShreya();
initBookPilot();
initResourcesHub();
initResourcesContent();
initArticle();
initVoiceBand();
initCallMe();
initContact();
initWaitlist();
initReachTabs();
initUseCases();
requestAnimationFrame(() => refreshScroll());
window.addEventListener("load", () => refreshScroll());
