// TTS provider renderers. Each renders ONE line to <outDir>/<name>.mp3, loudness-normalized.
// Providers: "fish" (Fish Audio) and "sarvam" (Sarvam Bulbul v3).
// Shared by scripts/generate-voices.mjs; text comes from ./voice-lines.mjs.

import { writeFile, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { strip, LANGS } from "./voice-lines.mjs";

const ff = (args) =>
  new Promise((ok, no) => {
    const p = spawn("ffmpeg", ["-y", "-loglevel", "error", ...args]);
    p.on("close", (c) => (c === 0 ? ok() : no(new Error("ffmpeg " + c))));
    p.on("error", no);
  });

// ── Fish Audio ──────────────────────────────────────────────────────────────
// One voice speaks every language, so Dhana's timbre stays identical across EN/HI/ML/TA.
// Returns finished MP3 bytes directly (no base64/chunk assembly needed).
async function renderFish(outDir, name, text, { role }) {
  const API_KEY = process.env.FISH_API_KEY;
  const dhana = process.env.FISH_VOICE_DHANA;
  const voice = role === "user" ? process.env.FISH_VOICE_BORROWER || dhana : dhana;
  if (!API_KEY) throw new Error("FISH_API_KEY missing");
  if (!voice) throw new Error("FISH_VOICE_DHANA missing");
  const res = await fetch("https://api.fish.audio/v1/tts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      model: process.env.FISH_MODEL || "s1",
    },
    body: JSON.stringify({
      text: strip(text),
      reference_id: voice,
      format: "mp3",
      mp3_bitrate: 128,
      sample_rate: 44100,
      normalize: true,
      prosody: { speed: 1.0 },
    }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) throw new Error("no audio returned");
  const raw = join(outDir, `${name}.raw.mp3`);
  await writeFile(raw, buf);
  await ff(["-i", raw, "-af", "loudnorm", "-c:a", "libmp3lame", "-q:a", "6", join(outDir, name + ".mp3")]);
  await rm(raw).catch(() => {});
}

// ── Sarvam Bulbul v3 ─────────────────────────────────────────────────────────
const SARVAM_AGENT = { en: "priya", hi: "priya", ml: "ritu", ta: "priya" }; // Dhana (ritu for Malayalam)
const SARVAM_USER = "mohit"; // borrower (male)
async function renderSarvam(outDir, name, text, { lang, role }) {
  const API_KEY = process.env.SARVAM_API_KEY;
  if (!API_KEY) throw new Error("SARVAM_API_KEY missing");
  const speaker = role === "user" ? SARVAM_USER : SARVAM_AGENT[lang];
  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: { "api-subscription-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text: strip(text),
      target_language_code: LANGS[lang],
      speaker,
      model: "bulbul:v3",
      pace: 1.0,
      speech_sample_rate: 44100,
      enable_preprocessing: true,
    }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  const d = await res.json();
  // Sarvam splits long text into an array of self-contained WAV files; decode each separately and
  // concatenate the decoded audio (joining base64 first would splice a header mid-stream → clicks).
  const chunks = (Array.isArray(d.audios) ? d.audios : [d.audio]).filter(Boolean).map((b) => Buffer.from(b, "base64"));
  if (!chunks.length) throw new Error("no audio returned");
  const parts = [];
  try {
    for (let k = 0; k < chunks.length; k++) {
      const p = join(outDir, `${name}.part${k}.wav`);
      await writeFile(p, chunks[k]);
      parts.push(p);
    }
    const labels = parts.map((_, i) => `[${i}:a]`).join("");
    const filter = `${labels}concat=n=${parts.length}:v=0:a=1[c];[c]loudnorm`;
    await ff([...parts.flatMap((p) => ["-i", p]), "-filter_complex", filter, "-c:a", "libmp3lame", "-q:a", "6", join(outDir, name + ".mp3")]);
  } finally {
    for (const p of parts) await rm(p).catch(() => {});
  }
}

export const PROVIDERS = { fish: renderFish, sarvam: renderSarvam };
