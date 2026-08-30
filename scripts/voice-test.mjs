// A/B a few Sarvam Bulbul v3 voices for "Dhana", with better params.
// SARVAM_API_KEY=xxx node scripts/voice-test.mjs   → then open /_voicetest.html
import { writeFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const API_KEY = process.env.SARVAM_API_KEY;
if (!API_KEY) { console.error("Set SARVAM_API_KEY"); process.exit(1); }
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "public", "assets", "audio", "_voicetest");

const SPEAKERS = ["roopa", "priya", "neha", "ishita", "tanya", "shreya", "kavya", "shruti"];
const LINES = {
  en: "Namaskaram. This is Dhana from your bank, about your working-capital enquiry. Is now a good time to talk? Your UPI shows strong festival months, so I'll frame income as a 12-month average.",
  ml: "നമസ്കാരം. ഞാൻ ധന, ബാങ്കിൽ നിന്ന്. വർക്കിംഗ് ക്യാപിറ്റൽ അന്വേഷണത്തെക്കുറിച്ച്. ഇപ്പോൾ സംസാരിക്കാമോ? നിങ്ങളുടെ UPI ഉത്സവ മാസങ്ങളിൽ ശക്തമാണ്, അതിനാൽ വരുമാനം 12 മാസ ശരാശരിയായി കണക്കാക്കും.",
};
const CODE = { en: "en-IN", ml: "ml-IN" };

async function tts(text, langCode, speaker) {
  const res = await fetch("https://api.sarvam.ai/text-to-speech", {
    method: "POST",
    headers: { "api-subscription-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      text,
      target_language_code: langCode,
      speaker,
      model: "bulbul:v3",
      pace: 1.0,
      speech_sample_rate: 44100,
      enable_preprocessing: true,
    }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  const d = await res.json();
  return Buffer.from(Array.isArray(d.audios) ? d.audios.join("") : d.audio, "base64");
}
const toMp3 = (wav, mp3) => new Promise((ok, no) => {
  const p = spawn("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-c:a", "libmp3lame", "-q:a", "2", mp3]);
  p.on("close", (c) => (c === 0 ? ok() : no(new Error("ffmpeg " + c))));
});

await mkdir(OUT, { recursive: true });
for (const spk of SPEAKERS) {
  for (const lang of Object.keys(LINES)) {
    try {
      const wav = await tts(LINES[lang], CODE[lang], spk);
      const w = join(OUT, `${spk}-${lang}.wav`), m = join(OUT, `${spk}-${lang}.mp3`);
      await writeFile(w, wav);
      await toMp3(w, m);
      await writeFile(w, "");
      console.log(`✓ ${spk}-${lang}`);
    } catch (e) { console.error(`✗ ${spk}-${lang}: ${e.message}`); }
  }
}

// build a comparison page
const rows = SPEAKERS.map((s) => `
  <div class="row"><b>${s}</b>
    <audio controls preload="none" src="/assets/audio/_voicetest/${s}-en.mp3"></audio><span>EN</span>
    <audio controls preload="none" src="/assets/audio/_voicetest/${s}-ml.mp3"></audio><span>ML</span>
  </div>`).join("");
await writeFile(join(ROOT, "public", "_voicetest.html"),
`<!doctype html><meta charset="utf-8"><title>Voice A/B</title>
<style>body{font-family:system-ui;max-width:720px;margin:40px auto;padding:0 16px}h1{font-size:20px}.row{display:flex;gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #eee;flex-wrap:wrap}.row b{width:80px}audio{height:32px}span{color:#888;font-size:12px}</style>
<h1>Pick Dhana's voice (Bulbul v3, 44.1kHz)</h1><p>Tell me which speaker sounds best and I'll regenerate every demo clip with it.</p>${rows}`);
console.log("\nOpen http://127.0.0.1:5173/_voicetest.html");
