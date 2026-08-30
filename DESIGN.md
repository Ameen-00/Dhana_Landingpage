# Dhana — Style Reference (v5)
> White-primary relationship layer for BFSI

**Theme:** light canvas (Augmen-like soft off-white) · dark device chrome only  
**Audience:** banks · NBFCs · co-ops  
**Product:** voice-first virtual RM — Call / Website / WhatsApp — without replacing core

## Sources
Augmen (light IA) · Mercury/Linear (restraint) · Kerala Bank demo (Dhana word · voice orb · credit CRM) · n8n (Agent Center graph)

## Tokens — Colors

| Name | Value | Role |
|------|-------|------|
| Void | `#f8f8f5` | Page canvas (soft off-white) |
| Graphite | `#f0f0ec` | Mist / elevated bands |
| Panel | `#ffffff` | Cards / docks |
| Panel-2 | `#f4f4f0` | Nested surfaces |
| Line | `#e2e2dc` | Hairline borders |
| Ivory | `#12141a` | Primary near-black text |
| Mute | `#5a6172` | Secondary text |
| Dim | `#8a91a3` | Tertiary / captions |
| Accent | `#6d7cff` | Primary CTA / live states |
| Accent-soft | `#6d7cff18` | Selected washes |
| Gold | `#c9a227` | Optional warm accent |
| Verify | `#1fa971` | Success / verified |
| Flag | `#d97706` | Attention |
| Risk | `#e11d48` | Fail / fraud |
| WA | `#25d366` | WhatsApp accent only inside WA frame |
| Answer | `#34c759` | Phone answer button |

### Device chrome (scoped)
Phone / WhatsApp / laptop screens keep dark tokens (`#07080c` canvas, light text). Marketing page chrome stays light.

## Typography
- UI: Inter 400–600 body; **700–800 display**
- Mono: JetBrains Mono for transcripts, IDs, outcomes
- Scripts: Noto Sans Malayalam / Devanagari / Tamil for animated `Dhana` word
- Display: 48–64px tight tracking; body 15–16px

## Shape
- Radius controls: 10px · devices: 28–36px phone, 12px browser · pills 9999
- Elevation: soft panel `0 0 0 1px #e2e2dc, 0 18px 40px rgba(18,20,26,.06)`

## Motion
- Dhana word cycles EN / ML / HI / TA (~2.4s) with width morph + blur slide
- Voice orb states: idle · listening · thinking · speaking (Kerala demo palette)
- Ring / speak / typing loops only for live status
- Honor `prefers-reduced-motion`

## Flagship surfaces
- **Credit CRM** — tabs (Applicant / Loan / Bureau / Docs / Conversation) + sticky Decision Support (Approve / Request more / Push to Finacle)
- **Agent Center** — n8n-style node graph (Call → Verify → Bureau → LOS → Human), deploy natures
- **Self-host** — on-prem / VPC / cloud cards + in-perimeter adapter diagram

## Rules
- One accent on marketing chrome (Accent). WA green only inside WhatsApp frame.
- Page background is never void/graphite black — white / `#f8f8f5` only.
- Call / Website / WhatsApp must be visually unmistakable.
- No price figures on public pricing page — structure + Contact only.
- No fake production bank logos.
