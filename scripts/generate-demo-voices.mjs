// Generate ALL demo voice lines with Sarvam Bulbul v3, per language.
// Usage:  SARVAM_API_KEY=sk_xxx node scripts/generate-demo-voices.mjs
// Output: public/assets/audio/{call-<lang>-<i>.mp3, web-<lang>-<key>.mp3}
// Speakers: Dhana / AI = roopa (female); borrower = anand (male).

import { writeFile, mkdir } from "node:fs/promises";
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const API_KEY = process.env.SARVAM_API_KEY;
if (!API_KEY) { console.error("Set SARVAM_API_KEY first."); process.exit(1); }
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "assets", "audio");
const ENDPOINT = "https://api.sarvam.ai/text-to-speech";
const AGENT_BY_LANG = { en: "priya", hi: "priya", ml: "ritu", ta: "priya" }; // Dhana; Malayalam uses ritu
const USER = "mohit"; // borrower (male)
const LANGS = { en: "en-IN", hi: "hi-IN", ml: "ml-IN", ta: "ta-IN" };
const strip = (s) => s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}←-⇿⬀-⯿✓●]/gu, "").replace(/\s+/g, " ").trim();

// role per call step (0..4)
const CALL_ROLES = ["agent", "user", "agent", "user", "agent"];
const CALL = {
  en: [
    "Good evening. I'm Dhana, calling from your bank about the working-capital enquiry. Is this a good time?",
    { t: "हाँ। मेरी एक बुटीक है। त्योहारों के महीनों में सेल अच्छी होती है, बाकी महीने शांत। फॉर्म ने अस्थिर सैलरी बता दिया।", l: "hi" },
    { t: "ठीक है, मैं हिंदी में बात करती हूँ। आय को सिर्फ़ पिछले महीने से नहीं, बल्कि 12 महीने के औसत से देखेंगे। क्या मैं आपकी सहमति से एक सॉफ्ट ब्यूरो जाँच करूँ?", l: "hi" },
    { t: "हाँ, जाँच कर सकते हैं। मेरी दुकान का UPI सैलरी फील्ड से ज़्यादा साफ़ है।", l: "hi" },
    { t: "मैंने आपके क्रेडिट डेस्क के लिए एक अपवाद फाइल जोड़ दी है। दस्तावेज़ों के लिए WhatsApp आएगा। आपके समय के लिए धन्यवाद।", l: "hi" },
  ],
  hi: [
    "नमस्ते. मैं धना हूँ, आपके बैंक से वर्किंग कैपिटल के बारे में। क्या बात कर सकते हैं?",
    "हाँ. मेरी बुटीक है। त्योहारों में सेल अच्छी होती है, फॉर्म ने अस्थिर सैलरी कहा।",
    "समझ गई। आय को बारह महीने के औसत से फ्रेम करूँगी। सॉफ्ट ब्यूरो के लिए सहमति दें?",
    "हाँ। दुकान का यू पी आई सैलरी फील्ड से साफ़ है।",
    "क्रेडिट डेस्क के लिए अपवाद फाइल तैयार है। दस्तावेज़ व्हाट्सएप पर आएंगे। धन्यवाद।",
  ],
  ml: [
    "നമസ്കാരം. ഞാൻ ധന, ബാങ്കിൽ നിന്ന് വർക്കിംഗ് ക്യാപിറ്റൽ സംബന്ധിച്ച്. സംസാരിക്കാമോ?",
    "ഉവ്വ്. ബൂട്ടിക് നടത്തുന്നു. ഉത്സവക്കാലത്ത് നല്ല സെയിൽ. ഫോം അസ്ഥിര ശമ്പളം എന്ന് പറഞ്ഞു.",
    "മനസ്സിലായി. പന്ത്രണ്ട് മാസ ശരാശരി ആയി വരുമാനം ഫ്രെയിം ചെയ്യാം. സോഫ്റ്റ് ബ്യൂറോയ്ക്ക് സമ്മതമുണ്ടോ?",
    "ഉവ്വ്. കടയുടെ യു പി ഐ ശമ്പള ഫീൽഡിനേക്കാൾ വ്യക്തമാണ്.",
    "ക്രെഡിറ്റ് ഡെസ്ക്കിന് എക്സപ്ഷൻ ഫയൽ തയ്യാർ. ഡോക്യുമെന്റുകൾ വാട്സ്ആപ്പിൽ വരും. നന്ദി.",
  ],
  ta: [
    "வணக்கம். நான் தனா, வங்கியிலிருந்து ஒர்க்கிங் கேபிடல் பற்றி. பேசலாமா?",
    "ஆம். பூட்டிக் நடத்துகிறேன். திருவிழா காலத்தில் விற்பனை நல்லது. படிவம் நிலையற்ற சம்பளம் என்றது.",
    "புரிந்தது. பன்னிரண்டு மாத சராசரியாக வருமானம் அமைப்பேன். சாஃப்ட் பீரோ ஒப்புதல் தருகிறீர்களா?",
    "ஆம். கடையின் யு பி ஐ சம்பள புலத்தை விட தெளிவு.",
    "கிரெடிட் டெஸ்க்குக்கு விதிவிலக்கு கோப்பு தயார். ஆவணங்கள் வாட்ஸ்ஆப்பில் வரும். நன்றி.",
  ],
};

const WEB_KEYS = ["greet", "kyc", "loan", "amount", "emi", "result"];
const WEB = {
  en: {
    greet: "Namaskaram! I'm your bank's AI Banker. I'll help you apply in your own language — no forms, just a conversation.",
    kyc: "I've pulled your KYC from DigiLocker. Do these details look correct?",
    loan: "Great. Which loan are you looking for?",
    amount: "How much do you need, and for how long?",
    emi: "For ₹5,00,000 over 36 months, the EMI works out to about ₹17,210. With your consent I'll run a soft credit pull — it won't affect your score.",
    result: "Soft pull done. Your CIBIL score is 782 — you're pre-qualified. I've packaged a credit-ready file for the loan officer. A human makes the final decision.",
  },
  hi: {
    greet: "नमस्ते! मैं आपके बैंक का AI बैंकर हूँ। कोई फ़ॉर्म नहीं — बस बातचीत से आवेदन कीजिए।",
    kyc: "मैंने डिजिलॉकर से आपका के वाई सी ले लिया है। क्या ये विवरण सही हैं?",
    loan: "बढ़िया। आपको कौन सा ऋण चाहिए?",
    amount: "कितनी राशि चाहिए, और कितने समय के लिए?",
    emi: "₹5,00,000 के लिए, 36 महीनों में — EMI लगभग ₹17,210 होगी। आपकी सहमति से सॉफ्ट क्रेडिट पुल करूँगी — स्कोर पर असर नहीं पड़ेगा।",
    result: "सॉफ्ट पुल पूरा। आपका CIBIL स्कोर 782 है — आप प्री-क्वालिफाइड हैं। अधिकारी के लिए क्रेडिट-रेडी फाइल तैयार कर दी है। अंतिम निर्णय एक व्यक्ति लेगा।",
  },
  ml: {
    greet: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ ബാങ്കിന്റെ AI ബാങ്കരാണ്. ഫോമുകളില്ല — സംസാരിച്ചു തന്നെ അപേക്ഷിക്കാം.",
    kyc: "ഡിജിലോക്കറിൽ നിന്ന് നിങ്ങളുടെ കെ വൈ സി എടുത്തിട്ടുണ്ട്. ഈ വിവരങ്ങൾ ശരിയാണോ?",
    loan: "നല്ലത്. ഏത് വായ്പയാണ് വേണ്ടത്?",
    amount: "എത്ര തുക വേണം, എത്ര കാലത്തേക്ക്?",
    emi: "₹5,00,000 ന്, 36 മാസത്തേക്ക് — EMI ഏകദേശം ₹17,210 ആകും. നിങ്ങളുടെ സമ്മതത്തോടെ ഒരു സോഫ്റ്റ് ക്രെഡിറ്റ് പുൾ നടത്തും — സ്കോറിനെ ബാധിക്കില്ല.",
    result: "സോഫ്റ്റ് പുൾ പൂർത്തിയായി. നിങ്ങളുടെ CIBIL സ്കോർ 782 — നിങ്ങൾ പ്രീ-ക്വാളിഫൈഡ് ആണ്. ഓഫീസർക്കായി ഒരു ക്രെഡിറ്റ്-റെഡി ഫയൽ തയ്യാറാക്കി. അന്തിമ തീരുമാനം ഒരു മനുഷ്യൻ എടുക്കും.",
  },
  ta: {
    greet: "வணக்கம்! நான் உங்கள் வங்கியின் AI பேங்கர். படிவம் இல்லை — பேசியே விண்ணப்பிக்கலாம்.",
    kyc: "டிஜிலாக்கரில் இருந்து உங்கள் கே ஒய் சி எடுத்துள்ளேன். இந்த விவரங்கள் சரியா?",
    loan: "நன்று. எந்த கடன் தேவை?",
    amount: "எவ்வளவு தொகை வேண்டும், எவ்வளவு காலத்திற்கு?",
    emi: "₹5,00,000 க்கு, 36 மாதங்களுக்கு — EMI சுமார் ₹17,210 ஆகும். உங்கள் சம்மதத்துடன் சாஃப்ட் கிரெடிட் புல் செய்கிறேன் — உங்கள் ஸ்கோரை பாதிக்காது.",
    result: "சாஃப்ட் புல் முடிந்தது. உங்கள் CIBIL மதிப்பெண் 782 — நீங்கள் ப்ரீ-குவாலிஃபைடு. அதிகாரிக்கு ஒரு கிரெடிட்-ரெடி கோப்பு தயார். இறுதி முடிவை ஒரு மனிதர் எடுப்பார்.",
  },
};

async function tts(text, langCode, speaker) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "api-subscription-key": API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ text: strip(text), target_language_code: langCode, speaker, model: "bulbul:v3", pace: 1.0, speech_sample_rate: 44100, enable_preprocessing: true }),
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  const d = await res.json();
  return Buffer.from(Array.isArray(d.audios) ? d.audios.join("") : d.audio, "base64");
}
const toMp3 = (wav, mp3) => new Promise((ok, no) => {
  const p = spawn("ffmpeg", ["-y", "-loglevel", "error", "-i", wav, "-af", "loudnorm", "-c:a", "libmp3lame", "-q:a", "6", mp3]);
  p.on("close", (c) => (c === 0 ? ok() : no(new Error("ffmpeg " + c))));
  p.on("error", no);
});
async function gen(name, text, langCode, speaker) {
  try {
    const wav = await tts(text, langCode, speaker);
    const wavP = join(OUT, name + ".wav"), mp3P = join(OUT, name + ".mp3");
    await writeFile(wavP, wav);
    await toMp3(wavP, mp3P);
    await writeFile(wavP, ""); // clear intermediate
    console.log("✓ " + name + ".mp3");
  } catch (e) { console.error("✗ " + name + ": " + e.message); }
}

// WhatsApp voice-note reply (played when the visitor "records" a note)
const WA = {
  en: "Got your voice note. I've reframed your income as a twelve-month average and opened a recheck with your consent. A credit-ready file is on the way to your officer.",
  hi: "आपका वॉइस नोट मिल गया। मैंने आपकी आय को बारह महीने के औसत के रूप में फ्रेम किया और आपकी सहमति से रीचेक खोल दिया। क्रेडिट-रेडी फाइल आपके अधिकारी के पास जा रही है।",
  ml: "നിങ്ങളുടെ വോയ്‌സ് നോട്ട് കിട്ടി. നിങ്ങളുടെ വരുമാനം പന്ത്രണ്ട് മാസ ശരാശരി ആയി ഫ്രെയിം ചെയ്ത്, സമ്മതത്തോടെ ഒരു റീചെക്ക് തുറന്നു. ഒരു ക്രെഡിറ്റ്-റെഡി ഫയൽ നിങ്ങളുടെ ഓഫീസർക്ക് പോകുന്നു.",
  ta: "உங்கள் குரல் குறிப்பு கிடைத்தது. உங்கள் வருமானத்தை பன்னிரண்டு மாத சராசரியாக அமைத்து, சம்மதத்துடன் ஒரு மறுபரிசோதனையைத் திறந்தேன். ஒரு கிரெடிட்-ரெடி கோப்பு உங்கள் அதிகாரிக்குச் செல்கிறது.",
};

await mkdir(OUT, { recursive: true });
const WA_ONLY = process.env.WA_ONLY === "1";
for (const [lang, code] of Object.entries(LANGS)) {
  if (!WA_ONLY) {
    for (let i = 0; i < CALL[lang].length; i++) {
      const entry = CALL[lang][i];
      const text = typeof entry === "string" ? entry : entry.t;
      const lineLang = typeof entry === "string" ? lang : entry.l || lang;
      const speaker = CALL_ROLES[i] === "user" ? USER : AGENT_BY_LANG[lineLang];
      await gen(`call-${lang}-${i}`, text, LANGS[lineLang], speaker);
    }
    for (const key of WEB_KEYS) {
      await gen(`web-${lang}-${key}`, WEB[lang][key], code, AGENT_BY_LANG[lang]);
    }
  }
  await gen(`wa-${lang}-reply`, WA[lang], code, AGENT_BY_LANG[lang]);
}
console.log("\nDone. Wire src/main.js to play call-<lang>-<i>.mp3 and web-<lang>-<key>.mp3.");
