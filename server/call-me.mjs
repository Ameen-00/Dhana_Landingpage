// "Get a call from Dhana" — places a real outbound call via Sarvam Instant Outbound.
// Credentials come from env only (never the browser). See .env.example.
//
// Compliance note: this is a SELF-REQUESTED call (the visitor enters their own number
// and ticks consent), which is the lawful basis. In production, also check your
// authoritative suppression/DND gate before dialling — Dhana owns that gate; the
// provider's DND list does not cover Instant Outbound (see the voice-agent repo docs).

const SARVAM = {
  apiKey: process.env.PROVIDER_API_KEY,
  base: process.env.PROVIDER_BASE_URL || "https://apps.sarvam.ai",
  org: process.env.PROVIDER_ORG_ID,
  ws: process.env.PROVIDER_WORKSPACE_ID,
  appId: process.env.PROVIDER_APP_ID,
  appVersion: process.env.PROVIDER_APP_VERSION,
  connectionId: process.env.PROVIDER_CONNECTION_ID,
  agentPhone: process.env.PROVIDER_AGENT_PHONE_NUMBER,
};

const E164 = /^\+[1-9]\d{7,14}$/;
const LANG_NAMES = { en: "english", hi: "hindi", ml: "malayalam", ta: "tamil" };

export async function placeCall({ phone, consent, name, language } = {}) {
  if (!consent) return { ok: false, error: "consent_required" };
  if (!E164.test((phone || "").trim())) return { ok: false, error: "invalid_phone", hint: "Use E.164, e.g. +919876543210" };

  const missing = Object.entries(SARVAM).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) return { ok: false, error: "server_not_configured", missing };

  const url = `${SARVAM.base}/api/outbounds/v1/orgs/${SARVAM.org}/workspaces/${SARVAM.ws}/outbounds`;
  const body = {
    app_config: {
      app_id: SARVAM.appId,
      app_version: SARVAM.appVersion, // pin in production
      app_type: "agent",
      connection_config: { connection_id: SARVAM.connectionId, agent_phone_number: SARVAM.agentPhone },
      agent_variables: { customer_name: (name || "there").slice(0, 60) },
      ...(LANG_NAMES[language] ? { app_overrides: { initial_language_name: LANG_NAMES[language] } } : {}),
    },
    user_config: { user_phone_number: phone.trim() },
  };

  let res, data;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": SARVAM.apiKey },
      body: JSON.stringify(body),
    });
    data = await res.json().catch(() => ({}));
  } catch (e) {
    return { ok: false, error: "network_error", detail: String(e.message || e) };
  }
  // 422 = payload wrong (won't succeed on retry); 5xx = retryable upstream.
  if (!res.ok) return { ok: false, error: "provider_error", status: res.status, detail: data };
  return { ok: true, attempt_id: data.attempt_id || data.id || data.outbound_id || null };
}
