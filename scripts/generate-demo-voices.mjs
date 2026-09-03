// Generate ALL demo voice lines with Sarvam Bulbul v3, per language.
// Usage:  node --env-file=.env scripts/generate-demo-voices.mjs
// Output: public/assets/audio/{call-<lang>-<i>.mp3, web-<lang>-<key>.mp3, wa-<lang>-reply.mp3}
// Speakers: Dhana / AI = priya (ritu for Malayalam); borrower = mohit (male).
// Line text lives in ./voice-lines.mjs (shared with generate-fish-voices.mjs).

import { writeFile, mkdir, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { LANGS, CALL, CALL_ROLES, WEB_KEYS, WEB, WA, strip } from "./voice-lines.mjs";

const API_KEY = process.env.SARVAM_API_KEY;
if (!API_KEY) { console.error("Set SARVAM_API_KEY first."); process.exit(1); }
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets", "audio");
const ENDPOINT = "https://api.sarvam.ai/text-to-speech";
const AGENT_BY_LANG = { en: "priya", hi: "priya", ml: "ritu", ta: "priya" }; // Dhana; Malayalam uses ritu
const USER = "mohit"; // borrower (male)

async function tts(text, langCode, speaker) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "api-subscription-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: strip(text), target_language_code: langCode, speaker, model: "bulbul:v3", pace: 1.0, speech_sample_rate: 44100, enable_preprocessing: true }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  const d = await res.json();
  // Sarvam returns `audios` as an array where EACH element is a complete, self-contained WAV
  // file (long text is split into segments). Decode each separately and concatenate the decoded
  // audio downstream — joining the base64 strings first splices a WAV header into the middle of
  // the stream, producing an audible click/break at every seam (worst on the longest lines).
  const chunks = Array.isArray(d.audios) ? d.audios : [d.audio];
  return chunks.filter(Boolean).map((b64) => Buffer.from(b64, "base64"));
}

// Concatenate one or more WAV segments end-to-end, then loudness-normalize the whole line once.
const wavsToMp3 = (wavPaths, mp3) => new Promise((ok, no) => {
  const inputs = wavPaths.flatMap((p) => ["-i", p]);
  const labels = wavPaths.map((_, i) => `[${i}:a]`).join("");
  const filter = `${labels}concat=n=${wavPaths.length}:v=0:a=1[c];[c]loudnorm`;
  const p = spawn("ffmpeg", ["-y", "-loglevel", "error", ...inputs, "-filter_complex", filter, "-c:a", "libmp3lame", "-q:a", "6", mp3]);
  p.on("close", (c) => (c === 0 ? ok() : no(new Error("ffmpeg " + c))));
  p.on("error", no);
});

async function gen(name, text, langCode, speaker) {
  const parts = [];
  try {
    const wavs = await tts(text, langCode, speaker);
    if (!wavs.length) throw new Error("no audio returned");
    for (let k = 0; k < wavs.length; k++) {
      const p = join(OUT, `${name}.part${k}.wav`);
      await writeFile(p, wavs[k]);
      parts.push(p);
    }
    await wavsToMp3(parts, join(OUT, name + ".mp3"));
    console.log("✓ " + name + ".mp3" + (parts.length > 1 ? ` (${parts.length} segments joined)` : ""));
  } catch (e) {
    console.error("✗ " + name + ": " + e.message);
  } finally {
    for (const p of parts) { try { await rm(p); } catch (_) {} }
  }
}

await mkdir(OUT, { recursive: true });
const WA_ONLY = process.env.WA_ONLY === "1";
for (const [lang, code] of Object.entries(LANGS)) {
  if (!WA_ONLY) {
    for (let i = 0; i < CALL[lang].length; i++) {
      const speaker = CALL_ROLES[i] === "user" ? USER : AGENT_BY_LANG[lang];
      await gen(`call-${lang}-${i}`, CALL[lang][i], code, speaker);
    }
    for (const key of WEB_KEYS) {
      await gen(`web-${lang}-${key}`, WEB[lang][key], code, AGENT_BY_LANG[lang]);
    }
  }
  await gen(`wa-${lang}-reply`, WA[lang], code, AGENT_BY_LANG[lang]);
}
console.log("\nDone. Clips written to public/assets/audio/.");
