// Generate REAL Dhana demo voice with Sarvam Bulbul v3 TTS.
//
// Usage (PowerShell):   $env:SARVAM_API_KEY="sk_xxx"; node scripts/generate-sarvam-voice.mjs
// Usage (bash):         SARVAM_API_KEY=sk_xxx node scripts/generate-sarvam-voice.mjs
// Optional:             SARVAM_SPEAKER=anushka  (Bulbul v3 voice; see list in the repo docs)
//
// Writes .mp3 files into public/assets/audio/ that the site already looks for:
//   dhana-call-greeting-<lang>.mp3   (played on Answer)
//   dhana-web-welcome-<lang>.mp3     (played on website Verify)
// then add the language entries to VOICE_CLIPS in src/main.js to switch them on.
// Requires ffmpeg on PATH (already used elsewhere in this project) to make mp3.

import { writeFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const API_KEY = process.env.SARVAM_API_KEY;
const SPEAKER = process.env.SARVAM_SPEAKER || "priya"; // female voice for "Dhana" (Bulbul v3)
const ENDPOINT = "https://api.sarvam.ai/text-to-speech";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets", "audio");

if (!API_KEY) {
  console.error("Set SARVAM_API_KEY first. Get one at dashboard.sarvam.ai (Model APIs).");
  process.exit(1);
}

// Edit the copy here. Keys map to <lang> in the output filenames.
const LANGS = {
  en: "en-IN",
  hi: "hi-IN",
  ml: "ml-IN",
  ta: "ta-IN",
};

const LINES = {
  "dhana-call-greeting": {
    en: "Namaskaram. This is Dhana, calling from your bank about the working-capital enquiry. Is now a good time to talk?",
    hi: "नमस्ते, मैं आपके बैंक से दhана बोल रही हूँ — वर्किंग कैपिटल पूछताछ के बारे में। क्या अभी बात कर सकते हैं?",
    ml: "നമസ്കാരം, ഞാൻ നിങ്ങളുടെ ബാങ്കിൽ നിന്ന് ദന ആണ് — വർക്കിംഗ് ക്യാപിറ്റൽ അന്വേഷണത്തെക്കുറിച്ച്. ഇപ്പോൾ സംസാരിക്കാമോ?",
    ta: "வணக்கம், நான் உங்கள் வங்கியிலிருந்து தன — வொர்க்கிங் கேபிடல் விசாரணை குறித்து. இப்போது பேசலாமா?",
  },
  "dhana-web-welcome": {
    en: "Namaskaram! I'm your bank's AI Banker. I'll help you apply in your own language. No forms — just a conversation. Shall we begin?",
    hi: "नमस्ते! मैं आपके बैंक का AI बैंकर हूँ। मैं आपकी अपनी भाषा में आवेदन में मदद करूँगी। कोई फ़ॉर्म नहीं — बस बातचीत। शुरू करें?",
    ml: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ബാങ്കിന്റെ AI ബാങ്കരാണ്. നിങ്ങളുടെ ഭാഷയിൽ അപേക്ഷിക്കാൻ ഞാൻ സഹായിക്കും. ഫോമുകളില്ല — സംസാരിച്ചാൽ മതി. തുടങ്ങാമോ?",
    ta: "வணக்கம்! நான் உங்கள் வங்கியின் AI பேங்கர். உங்கள் மொழியில் விண்ணப்பிக்க உதவுவேன். படிவம் இல்லை — பேசினால் போதும். தொடங்கலாமா?",
  },
};

async function tts(text, langCode, speaker = SPEAKER) {
  const res = await fetch(ENDPOINT, {
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
  if (!res.ok) throw new Error(`Sarvam ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const b64 = Array.isArray(data.audios) ? data.audios.join("") : data.audio || data.audios;
  return Buffer.from(b64, "base64"); // WAV bytes
}

function toMp3(wavPath, mp3Path) {
  return new Promise((resolve, reject) => {
    const p = spawn("ffmpeg", ["-y", "-loglevel", "error", "-i", wavPath, "-af", "loudnorm", "-c:a", "libmp3lame", "-q:a", "5", mp3Path]);
    p.on("close", (c) => (c === 0 ? resolve() : reject(new Error("ffmpeg exit " + c))));
    p.on("error", reject);
  });
}

await mkdir(OUT, { recursive: true });
for (const [base, byLang] of Object.entries(LINES)) {
  for (const [lang, text] of Object.entries(byLang)) {
    const code = LANGS[lang];
    if (!code) continue;
    try {
      const wav = await tts(text, code);
      const wavPath = join(OUT, `${base}-${lang}.wav`);
      const mp3Path = join(OUT, `${base}-${lang}.mp3`);
      await writeFile(wavPath, wav);
      await toMp3(wavPath, mp3Path);
      console.log(`✓ ${base}-${lang}.mp3  (${SPEAKER}/${code})`);
    } catch (e) {
      console.error(`✗ ${base}-${lang}: ${e.message}`);
    }
  }
}
// ── Band conversation → dhana-voice-sample.mp3 (two speakers, English) ───────
const BORROWER = process.env.SARVAM_BORROWER || "mohit"; // male voice
const CONVO = [
  [SPEAKER, "Namaskaram. This is Dhana, calling from your bank about the working-capital enquiry. Is now a good time?"],
  [BORROWER, "Yes. I run a boutique. Festival months are strong, but the form said unstable salary."],
  [SPEAKER, "Understood. With your consent, I'll capture that as a twelve-month income story, and a credit-ready file will reach your officer."],
];
try {
  const parts = [];
  for (let i = 0; i < CONVO.length; i++) {
    const [spk, text] = CONVO[i];
    const wav = await tts(text, "en-IN", spk);
    const p = join(OUT, `_convo-${i}.wav`);
    await writeFile(p, wav);
    parts.push(p);
  }
  // concat with 0.45s gaps, loudnorm, → mp3
  await new Promise((resolve, reject) => {
    const args = ["-y", "-loglevel", "error"];
    parts.forEach((p) => args.push("-i", p));
    const fc = parts.slice(0, -1).map((_, i) => `[${i}]apad=pad_dur=0.45[a${i}]`).join(";");
    const seq = parts.map((_, i) => (i < parts.length - 1 ? `[a${i}]` : `[${i}]`)).join("");
    args.push("-filter_complex", `${fc};${seq}concat=n=${parts.length}:v=0:a=1,loudnorm[out]`, "-map", "[out]", "-c:a", "libmp3lame", "-q:a", "5", join(OUT, "dhana-voice-sample.mp3"));
    const pr = spawn("ffmpeg", args);
    pr.on("close", (c) => (c === 0 ? resolve() : reject(new Error("ffmpeg " + c))));
    pr.on("error", reject);
  });
  console.log(`✓ dhana-voice-sample.mp3  (${SPEAKER} + ${BORROWER})`);
} catch (e) {
  console.error("✗ dhana-voice-sample: " + e.message);
}

console.log("\nDone. Real Sarvam voices are in place — the demos auto-use them per language.");
