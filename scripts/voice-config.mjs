// Which TTS provider renders each clip — the "dynamic switch" between Fish and Sarvam.
// Resolved per (channel, lang). Edit the defaults here, or override per-run with env vars
// (env always wins). channel ∈ {call, web, wa}; lang ∈ {en, hi, ml, ta}.

export const ROUTING = {
  default: "sarvam", // Indian languages (hi/ml/ta) use Sarvam's priya (ritu for Malayalam)
  byLang: {
    en: "fish", // English uses Fish Audio
  },
  byChannel: {},
};

// Precedence (highest first):
//   VOICE_PROVIDER_<CHANNEL>_<LANG>  e.g. VOICE_PROVIDER_WEB_ML=sarvam
//   VOICE_PROVIDER_<LANG>            e.g. VOICE_PROVIDER_ML=sarvam
//   VOICE_PROVIDER_<CHANNEL>         e.g. VOICE_PROVIDER_CALL=fish
//   ROUTING.byLang[lang]
//   ROUTING.byChannel[channel]
//   VOICE_PROVIDER                   global default override
//   ROUTING.default
export function resolveProvider(channel, lang) {
  const e = process.env;
  const C = channel.toUpperCase();
  const L = lang.toUpperCase();
  return (
    e[`VOICE_PROVIDER_${C}_${L}`] ||
    e[`VOICE_PROVIDER_${L}`] ||
    e[`VOICE_PROVIDER_${C}`] ||
    ROUTING.byLang[lang] ||
    ROUTING.byChannel[channel] ||
    e.VOICE_PROVIDER ||
    ROUTING.default
  );
}
