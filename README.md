# Dhana (v2)

Institutional marketing site for **Dhana** — the AI relationship layer / voice-first virtual RM for BFSI (banks, NBFCs, co-operative banks).

Joins existing website, phone, and WhatsApp flows **without replacing core**. Public product name is **Dhana**; Altiora / AiBanker appear in footer and legal only.

A PaisaOnClick product from **Altiora Capital Solution Private Limited**, Ernakulam.

## Run

```bash
npm install
npm run dev
```

Build: `npm run build` → `dist/`. Netlify uses `netlify.toml`.

Preview: `npm run preview`.

## Pages

| Route | File |
|-------|------|
| `/` | `index.html` |
| `/pricing` | `pricing.html` |
| `/use-cases` | `use-cases.html` |
| `/resources` | `resources.html` |
| `/contact` | `contact.html` |

## Design (v2)

Visual law: `DESIGN.md` — **dark premium** (void `#07080c`, accent `#6d7cff`, Inter 700–800 display).

Product / IA: `SITE-BRIEF.md`.

**Pricing:** setup + monthly + usage structure only — **no public rupee figures**. Contact / Book a pilot.

## Product theater

Three unmistakable channel UIs on home:

- **Call** — phone frame, ring → Answer, live transcript, credit-ready file
- **Website** — laptop/browser, Amount → Purpose → Details → Credit → PaisaOnClick redirect
- **WhatsApp** — retarget after rejection → path / cross-sell → human handoff

Plus credit-ready file drawer, Agent Center, and integrations board.

## Stack

Vite + vanilla HTML/CSS/JS. Tokens and chrome in `src/styles.css`; interactions in `src/main.js`.

## Verify

```bash
npm run dev
node scripts/verify-v2.mjs
```

Screenshots land in `_refs/v2-*.png`.
