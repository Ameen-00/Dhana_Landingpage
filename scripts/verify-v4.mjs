import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.DHANA_BASE || "http://localhost:5173";
const out = "_refs";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const log = (m) => console.log(m);

const routes = ["/", "/pricing.html", "/use-cases.html", "/resources.html", "/contact.html"];
for (const r of routes) {
  const res = await page.goto(base + r, { waitUntil: "networkidle" });
  const status = res?.status() ?? 0;
  log(`ROUTE ${r} → ${status}`);
  if (status !== 200) throw new Error(`Route ${r} status ${status}`);
  const html = await page.content();
  if (html.includes("alameen@paisaonclick.com")) {
    throw new Error(`Old email still present on ${r}`);
  }
}

/* Resources hub */
await page.goto(base + "/resources.html", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
for (const id of ["learn", "blog", "videos", "frameworks", "writing", "consent", "hitl"]) {
  await page.waitForSelector(`#${id}`);
}
const videoSrc = await page.locator("#videos video source").getAttribute("src");
if (!videoSrc?.includes("dhana-malayalam-webflow.mp4")) throw new Error("Resources video src missing");
const chips = await page.locator("[data-hub-nav]").count();
if (chips < 5) throw new Error("Resources hub chips missing");
await page.screenshot({ path: `${out}/v4-resources.png`, fullPage: false });
log("SHOT v4-resources.png");

/* Use cases traction */
await page.goto(base + "/use-cases.html", { waitUntil: "networkidle" });
await page.waitForTimeout(500);
const body = await page.locator("main").innerText();
for (const needle of ["MRCB", "PaisaOnClick", "Jeff App", "Kerala State Co-operative", "1,000", "2,000", "500K"]) {
  if (!body.includes(needle)) throw new Error(`Use cases missing ${needle}`);
}
const before = await page.locator("[data-uc-card]:not(.is-hidden)").count();
await page.click('[data-uc-filter="whatsapp"]');
await page.waitForTimeout(200);
const after = await page.locator("[data-uc-card]:not(.is-hidden)").count();
log(`UC filter all=${before} whatsapp=${after}`);
if (after < 1 || after >= before) throw new Error("Use-case WhatsApp filter did not narrow");
await page.click('[data-uc-filter="traction"]');
await page.waitForTimeout(200);
const traction = await page.locator("[data-uc-card]:not(.is-hidden)").count();
log(`UC traction=${traction}`);
if (traction < 4) throw new Error("Traction filter expected ≥4 cards");
await page.screenshot({ path: `${out}/v4-usecases.png`, fullPage: false });
log("SHOT v4-usecases.png");

/* Calendly CTAs */
await page.goto(base + "/contact.html", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const calendlyBtn = page.locator("[data-book-pilot]").filter({ hasText: /Schedule on Calendly/i }).first();
await calendlyBtn.waitFor();
const href = await calendlyBtn.getAttribute("href");
if (!href?.includes("calendly.com")) throw new Error(`Calendly href wrong: ${href}`);
const note = await page.locator(".calendly-note").innerText();
if (!/placeholder/i.test(note)) throw new Error("Calendly placeholder note missing");
const mail = await page.locator('a[href^="mailto:support@altioracapitalsolution.com"]').count();
if (mail < 1) throw new Error("support@ mailto missing on contact");
await page.locator(".calendly-panel").scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({ path: `${out}/v4-calendly-cta.png`, fullPage: false });
log("SHOT v4-calendly-cta.png");

/* Home primary CTA */
await page.goto(base + "/", { waitUntil: "networkidle" });
const homePilot = page.locator("[data-book-pilot], [data-calendly]").first();
const homeHref = await homePilot.getAttribute("href");
if (!homeHref?.includes("calendly.com")) throw new Error(`Home Book a pilot not Calendly: ${homeHref}`);

/* Pricing 3-month + waitlist */
await page.goto(base + "/pricing.html", { waitUntil: "networkidle" });
const pricingMain = await page.locator("main").innerText();
if (!/3 months/i.test(pricingMain)) throw new Error("Pricing missing 3-month pitch");
await page.waitForSelector("[data-waitlist-form]");

log("VERIFY-V4 PASS");
await browser.close();
