// Unified demo-voice generator with per-scenario provider switching (Fish / Sarvam).
//
// Usage:
//   node --env-file=.env scripts/generate-voices.mjs                 # all clips, routed per voice-config.mjs
//   ONLY=web  node --env-file=.env scripts/generate-voices.mjs       # only the website-flow clips
//   ONLY=call VOICE_PROVIDER=sarvam node --env-file=.env scripts/generate-voices.mjs
//   VOICE_PROVIDER_ML=sarvam node --env-file=.env scripts/generate-voices.mjs
//
// ONLY ∈ {call, web, wa}. Provider routing + precedence live in ./voice-config.mjs.
// Line text lives in ./voice-lines.mjs. Output: public/assets/audio/.

import { mkdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LANGS, CALL, CALL_ROLES, WEB_KEYS, WEB, WA } from "./voice-lines.mjs";
import { PROVIDERS } from "./tts-providers.mjs";
import { resolveProvider } from "./voice-config.mjs";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets", "audio");
const ONLY = (process.env.ONLY || "").toLowerCase();
const want = (kind) => !ONLY || ONLY === kind;

await mkdir(OUT, { recursive: true });

async function render(channel, lang, name, text, role) {
  const provider = resolveProvider(channel, lang);
  const fn = PROVIDERS[provider];
  if (!fn) return console.error(`✗ ${name}: unknown provider "${provider}"`);
  try {
    await fn(OUT, name, text, { lang, role });
    console.log(`✓ ${name}.mp3  [${provider}]`);
  } catch (e) {
    console.error(`✗ ${name} [${provider}]: ${e.message}`);
  }
}

for (const lang of Object.keys(LANGS)) {
  if (want("call")) {
    for (let i = 0; i < CALL[lang].length; i++) {
      await render("call", lang, `call-${lang}-${i}`, CALL[lang][i], CALL_ROLES[i]);
    }
  }
  if (want("web")) {
    for (const key of WEB_KEYS) await render("web", lang, `web-${lang}-${key}`, WEB[lang][key], "agent");
  }
  if (want("wa")) {
    await render("wa", lang, `wa-${lang}-reply`, WA[lang], "agent");
  }
}
console.log("\nDone. Clips written to public/assets/audio/.");
