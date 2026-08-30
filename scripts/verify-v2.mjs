import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.DHANA_BASE || "http://localhost:5173";
const out = "_refs";

await mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const results = [];

function log(msg) {
  console.log(msg);
  results.push(msg);
}

/* ——— Routes 200 ——— */
const routes = ["/", "/pricing.html", "/use-cases.html", "/resources.html", "/contact.html"];
for (const r of routes) {
  const res = await page.goto(base + r, { waitUntil: "networkidle" });
  const status = res?.status() ?? 0;
  const title = await page.title();
  log(`ROUTE ${r} → ${status} | ${title}`);
  if (status !== 200) throw new Error(`Route ${r} status ${status}`);
}

/* ——— Pricing: no forbidden figures ——— */
await page.goto(base + "/pricing.html", { waitUntil: "networkidle" });
const pricingText = await page.locator("main").innerText();
for (const bad of ["₹50,000", "₹50k", "₹200,000", "₹2,00,000", "₹500,000", "₹5,00,000", "₹400"]) {
  if (pricingText.includes(bad)) throw new Error(`Pricing page contains forbidden figure: ${bad}`);
}
log("PRICING no public figures OK");
await page.screenshot({ path: `${out}/v2-pricing.png`, fullPage: true });

/* ——— Home desktop theater ——— */
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(2000);

/* 1. Answer ringing phone → transcript → credit file */
const phone = page.locator("[data-phone]");
const state = await phone.getAttribute("data-state");
log(`CALL initial state: ${state}`);
if (state === "idle") {
  await page.click("[data-call-me]");
  await page.waitForTimeout(400);
}
await page.locator("[data-answer]").click({ force: true });
await page.waitForTimeout(reducedDelay(3500));
const txCount = await page.locator(".tx-line").count();
log(`CALL transcript lines: ${txCount}`);
if (txCount < 1) throw new Error("Transcript did not fill after Answer");

// Wait for call to end or force hangup near end
await page.waitForTimeout(reducedDelay(9000));
const state2 = await phone.getAttribute("data-state");
if (state2 !== "ended") {
  await page.click("[data-hangup]");
  await page.waitForTimeout(400);
}
log(`CALL ended state: ${await phone.getAttribute("data-state")}`);
await page.screenshot({ path: `${out}/v2-call-ended.png` });

await page.locator("[data-open-file]").first().click();
await page.waitForTimeout(500);
const drawerOpen = await page.locator("[data-file-drawer]").evaluate((el) => el.classList.contains("is-open"));
log(`FILE drawer open: ${drawerOpen}`);
if (!drawerOpen) throw new Error("Credit-ready file drawer did not open");
await page.screenshot({ path: `${out}/v2-credit-file.png` });
await page.click("[data-close-file]");
await page.waitForTimeout(300);

/* 2. Website amount → purpose → credit → PaisaOnClick */
await page.click('.theater-tab[data-channel="website"]');
await page.waitForTimeout(500);
const webPanel = page.locator('.channel-panel[data-panel="website"]');
await webPanel.locator("[data-web-start]").click();
await page.waitForTimeout(400);
await webPanel.locator('.web-panel.is-active [data-web-next]').click(); // lock amount
await page.waitForTimeout(300);
await webPanel.locator('.web-panel.is-active [data-web-next]').click(); // purpose
await page.waitForTimeout(300);
await webPanel.locator("[data-web-autofill]").click();
await page.waitForTimeout(reducedDelay(1600));
await webPanel.locator("[data-after-fill]").click();
await page.waitForTimeout(400);
await webPanel.locator("[data-run-credit]").click();
await page.waitForTimeout(reducedDelay(1800));
await webPanel.locator("[data-poc-open]").click();
await page.waitForTimeout(300);
const modalOpen = await page.locator("[data-redirect-modal]").evaluate((el) => el.classList.contains("is-open"));
log(`WEB PaisaOnClick modal: ${modalOpen}`);
if (!modalOpen) throw new Error("PaisaOnClick modal not open");
await page.screenshot({ path: `${out}/v2-website-poc.png` });
await webPanel.locator("[data-poc-confirm]").click();
await page.waitForTimeout(400);

/* 3. WhatsApp retarget → handoff */
await page.click('.theater-tab[data-channel="whatsapp"]');
await page.waitForTimeout(400);
await page.click('[data-wa-reply="recheck"]');
await page.waitForTimeout(reducedDelay(1200));
await page.click('[data-wa-reply="fix"]');
await page.waitForTimeout(reducedDelay(1200));
await page.click('[data-wa-reply="handoff"]');
await page.waitForTimeout(reducedDelay(1200));
const badge = (await page.locator("[data-outcome-badge]").textContent())?.trim();
log(`WA outcome badge: ${badge}`);
await page.screenshot({ path: `${out}/v2-whatsapp-handoff.png` });

/* 4. Agent Center deploy insurance */
await page.locator("#agents").scrollIntoViewIfNeeded();
await page.click("[data-deploy-insurance]");
await page.waitForTimeout(500);
const insDot = page.locator('[data-agent="insurance"] .dot');
const hasLive = await insDot.evaluate((el) => el.classList.contains("live"));
log(`AGENT insurance live: ${hasLive}`);
if (!hasLive) throw new Error("Insurance agent not marked live after deploy");
await page.screenshot({ path: `${out}/v2-agent-center.png` });

/* Desktop full hero */
await page.locator("#theater").scrollIntoViewIfNeeded();
await page.click('.theater-tab[data-channel="call"]');
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/v2-home-desktop.png`, fullPage: false });

/* Mobile 390 */
await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/v2-home-mobile.png` });
await page.click(".hamburger");
await page.waitForTimeout(300);
log(`MOBILE drawer: ${await page.locator(".mobile-drawer").evaluate((el) => el.classList.contains("is-open"))}`);
await page.screenshot({ path: `${out}/v2-home-mobile-nav.png` });

await browser.close();
log("ALL VERIFICATIONS PASSED");

function reducedDelay(ms) {
  return ms;
}
