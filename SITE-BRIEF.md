# Dhana site brief — product, stories, pages, pricing

Working brief for the institutional marketing site. Complements `DESIGN.md`.
Sources: user direction (2026-03), `AiBanker_Seed_Deck.pdf`, Sarvam voice-agent UX patterns, Refero ledger-light system.

**Public product name on site:** **Dhana** (AI relationship manager) — primary everywhere  
**Deck / company framing:** AiBanker / Altiora in footer + legal only — “the relationship layer for financial institutions”  
**Canonical domain:** dhana.app (aibanker.live can demo/redirect later)

---

## 1. North star (locked)

Banks don’t reject people like **Shreya** because she is a bad customer.  
They reject her because their **tech cannot talk to her** — cannot gather her UPI story, cannot hold a non-judgmental conversation in her language, cannot assemble an exception file a credit manager can approve.

Dhana is that missing conversation: **voice-first virtual RM** that joins the institution’s existing flow (website, phone, WhatsApp) **without replacing core**, and hands the bank a complete, verified, fraud-aware picture.

---

## 2. Custom interactive elements (hero + product stage)

Build these as **real story demos**, not icon grids. Each mode leaves an **Outcome panel** a banker can read.

### A. Phone call RM
- Inbound / outbound voice
- Connecting → listening → speaking (emotion-aware tone shift)
- Regional language switch mid-call
- Deepfake / spoof risk strip (passive layer: “voice integrity: pass / review”)
- Outcome: lead qualified, callback booked, PTP logged

### B. Lender website workflow
- Embedded on bank/NBFC site (white-label stage)
- Customer lands on apply → Dhana guides steps in-page
- Form fields fill as she talks (Anve-style guided origination)
- Outcome: application #, docs requested, soft bureau consent logged
- Story beat: **does not rewrite Finacle / LOS** — adapter layer

### C. WhatsApp AI desk
- Chat + voice-note hybrid
- Document chase in-thread (PDF/JPG received → OCR → verified / flag)
- Retarget nudge in language
- Outcome: docs complete, session handed to officer

### D. Trust layers (always-on chrome inside demos)
| Layer | What the UI shows |
|-------|-------------------|
| Regional voice | EN / HI / ML / TA / AR (+ roadmap languages) |
| Emotion-aware | Soft status: calm / hesitant / stressed → pacing adapts (illustrative) |
| Deepfake / spoof detection | Integrity badge on live audio (pass / needs human) |
| Fraud / tamper | Doc inconsistency flagged with reason |
| Soft bureau | Consent gate before pull |
| Data framing | Officer brief: “12-month average, not last month” |

**Sarvam-inspired UX (steal pattern, not brand):** live “Start speaking” agent picker, illustrative transcript, workflow branching diagram, goal-aligned conversation — applied to **credit RM**, not cart recovery.

---

## 3. Flagship use case — Shreya

**Shreya** — small fashion designer. Clean UPI velocity, real customers, irregular monthly peaks (festival collections). Traditional bank gating sees “unstable salary” → auto-filter → treated as high risk.

| Without Dhana | With Dhana |
|---------------|------------|
| Form rejects / silent drop | Voice conversation in her language |
| Officer never hears the story | She explains seasonality like she would to a person |
| No UPI / AA narrative | Account Aggregator + UPI patterns gathered in-session |
| No social / network context | Optional consented signals framed for the file (not creepy scraping theatre) |
| Lost forever | Retarget when profile strengthens |
| “Bad customer” label | **Incomplete picture** → complete file to credit manager |

**Landing page story block:** cinematic but ledger-light — left narrative, right live stage playing Shreya’s call → outcome panel flips from `Auto-filtered` to `Exception file ready · soft bureau OK · income framed`.

Secondary use cases (Use cases page):
1. Co-op bank evening applicant (Malayalam, post-6pm)
2. NBFC gold / personal loan WhatsApp chase
3. Collections PTP with calling-window respect
4. GCC / Arabic + Indic bilingual household (roadmap story)
5. Deepfake attempt on video/voice KYC — flagged to human

---

## 4. Site map

| Route | Purpose |
|-------|---------|
| `/` Home | Category + Shreya story + channel stage + jobs of RM + “without touching core” + proof |
| `/pricing` | Setup + monthly + usage structure only (no public figures) → Contact |
| `/use-cases` | Shreya + 4–5 institutional scenarios with interactive stages |
| `/resources` | Security, compliance, integration notes, blog/deck excerpts, languages |
| `/contact` | Book pilot / Talk to sales — bank vs NBFC vs co-op form |

Nav: Product · Use cases · Pricing · Resources · Contact · `Book a pilot`

---

## 5. Pricing (public site — revised lock)

**Do NOT publish rupee figures on the website.**  
**No ₹50k / ₹200k / ₹500k / ₹400 (or any public price figures) on any page.**

Show commercial shape only → CTA Contact / Book a pilot:
1. **Setup fee** — implementation, integration, security review  
2. **Monthly platform fee** — agents / journeys live  
3. **Usage-based** — per qualified conversation / handoff  

Internal numbers (₹50k / ₹200k / ₹500k setup, ₹400 usage) are sales-only, off-page.

---

## 6. Home page section order (v2)

1. Nav  
2. Dark hero + **3-channel product theater** (Phone / Laptop / WhatsApp — distinct UIs + outcome dock)  
3. Trust chip row (RBI FREE-AI · Digital Lending 2025 · DPDP · self-host) → Resources  
4. Problem — both sides lose the conversation  
5. Shreya story (flagship)  
6. How it works (join the flow)  
7. Credit-ready file drawer + Integrations board  
8. Agent Center (interactive)  
9. Pricing shape teaser (**Contact us** — no figures)  
10. Trust & compliance deep links  
11. Pilot invite band · Close  

---

## 7. Deck alignment (do not contradict)

From `AiBanker_Seed_Deck.pdf`:

- Relationship manager who never judges — talks, asks, verifies, advocates  
- Public rails: Aadhaar, DigiLocker, AA, UPI  
- Moat: journey design + integrations + in-perimeter + language depth  
- Runs inside bank infrastructure; customer data doesn’t leave  
- Roadmap products: Lending → Raksha → Artha → Nova  
- India forges, Dubai sells  
- Honest: pilots pre-commercial; no end-to-end loan through AiBanker yet  

Site may be **more product-marketing forward** than the deck, but must stay honest on proof.

---

## 8. Open confirms before build

1. ~~Brand~~ → **Locked:** Dhana primary; Altiora/AiBanker footer/legal  
2. Exact outcome unit name: “qualified lead” vs “completed application handoff”  
3. Is annual platform fee public or sales-only?  
4. Deepfake layer: ship as **illustrative** on marketing demos until prod-ready copy is approved  
5. Social profiling: keep as **consented alternative data / network context** — never “scrape her friends” tone  

---

## 9. Build order (when you say go)

1. Lock copy for Shreya + ₹400 stack  
2. Implement `/` with channel stage + Shreya  
3. `/pricing`  
4. `/use-cases`  
5. `/resources` + `/contact`  
6. Visual verify against `DESIGN.md`
