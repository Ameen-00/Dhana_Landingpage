// Canonical demo voice lines, shared by every TTS generator (Sarvam, Fish, …).
// Keep these in sync with the on-screen captions in src/main.js (CALL_SCRIPTS / WEB_LINES).
// Text is lightly TTS-tuned (numbers/acronyms spelled out where a model reads them better).

// BCP-47 codes, mostly for providers that want an explicit target language.
export const LANGS = { en: "en-IN", hi: "hi-IN", ml: "ml-IN", ta: "ta-IN" };

// Strip emoji / decorative glyphs and collapse whitespace before sending to a TTS engine.
export const strip = (s) =>
  s.replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}←-⇿⬀-⯿✓●]/gu, "").replace(/\s+/g, " ").trim();

// Role per call step (0..4): who is speaking each line of the phone-call demo.
export const CALL_ROLES = ["agent", "user", "agent", "user", "agent"];

// Phone-call demo. EN is a full-English conversation; HI/ML/TA stay in one language throughout.
export const CALL = {
  en: [
    "Good evening. I'm Dhana, calling from your bank about your working-capital enquiry. Is this a good time?",
    "Yes. I run a boutique. Sales are strong in the festival months and quieter the rest of the year, so the form flagged my salary as unstable.",
    "I understand. Instead of just last month, we'll look at income as a twelve-month average. With your consent, may I run a soft bureau check? It won't affect your score.",
    "Yes, you can check. My shop's UPI is much cleaner than the salary field.",
    "I've added an exception file for your credit desk. You'll get a WhatsApp for the documents. Thank you for your time.",
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

// Website "AI Banker" chat demo.
export const WEB_KEYS = ["greet", "kyc", "loan", "amount", "emi", "result"];
export const WEB = {
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

// WhatsApp voice-note reply (played when the visitor "records" a note).
export const WA = {
  en: "Got your voice note. I've reframed your income as a twelve-month average and opened a recheck with your consent. A credit-ready file is on the way to your officer.",
  hi: "आपका वॉइस नोट मिल गया। मैंने आपकी आय को बारह महीने के औसत के रूप में फ्रेम किया और आपकी सहमति से रीचेक खोल दिया। क्रेडिट-रेडी फाइल आपके अधिकारी के पास जा रही है।",
  ml: "നിങ്ങളുടെ വോയ്‌സ് നോട്ട് കിട്ടി. നിങ്ങളുടെ വരുമാനം പന്ത്രണ്ട് മാസ ശരാശരി ആയി ഫ്രെയിം ചെയ്ത്, സമ്മതത്തോടെ ഒരു റീചെക്ക് തുറന്നു. ഒരു ക്രെഡിറ്റ്-റെഡി ഫയൽ നിങ്ങളുടെ ഓഫീസർക്ക് പോകുന്നു.",
  ta: "உங்கள் குரல் குறிப்பு கிடைத்தது. உங்கள் வருமானத்தை பன்னிரண்டு மாத சராசரியாக அமைத்து, சம்மதத்துடன் ஒரு மறுபரிசோதனையைத் திறந்தேன். ஒரு கிரெடிட்-ரெடி கோப்பு உங்கள் அதிகாரிக்குச் செல்கிறது.",
};
