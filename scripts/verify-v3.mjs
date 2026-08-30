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

await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

const h1 = await page.locator(".hero h1").innerText();
log(`HERO h1: ${h1.slice(0, 80)}`);
if (!/virtual banker|24/i.test(h1)) throw new Error("Hero H1 not updated");

const heroColor = await page.locator(".hero h1").evaluate((el) => getComputedStyle(el).color);
log(`HERO h1 color: ${heroColor}`);

const leftW = await page.locator(".hero-left").boundingBox();
const theaterW = await page.locator(".theater").boundingBox();
log(`HERO left≈${Math.round(leftW?.width || 0)} theater≈${Math.round(theaterW?.width || 0)}`);
if ((theaterW?.width || 0) < (leftW?.width || 0)) throw new Error("Theater should be wider than left copy");

await page.screenshot({ path: `${out}/v3-home-hero.png` });

/* WhatsApp chrome */
await page.click('.theater-tab[data-channel="whatsapp"]');
await page.waitForTimeout(400);
const waHeader = page.locator(".wa-header");
await waHeader.waitFor();
const bg = await waHeader.evaluate((el) => getComputedStyle(el).backgroundImage + getComputedStyle(el).backgroundColor);
log(`WA header bg: ${bg.slice(0, 120)}`);
const name = await page.locator(".wa-header-info strong").innerText();
if (name.trim() !== "Dhana") throw new Error(`WA name expected Dhana, got ${name}`);
const ticks = await page.locator(".wa-ticks").count();
const wave = await page.locator(".wa-wave").count();
log(`WA ticks=${ticks} wave=${wave}`);
if (ticks < 1 || wave < 1) throw new Error("WA missing ticks or voice waveform");
await page.screenshot({ path: `${out}/v3-whatsapp.png` });

/* Malayalam video */
await page.click('.theater-tab[data-channel="website"]');
await page.waitForTimeout(300);
await page.click("[data-web-ml-video]");
await page.waitForTimeout(400);
const video = page.locator("[data-ml-video]");
await video.waitFor();
const src = await video.locator("source").getAttribute("src");
log(`VIDEO src: ${src}`);
if (!src?.includes("dhana-malayalam-webflow.mp4")) throw new Error("Video src incorrect");
const panelActive = await page.locator("[data-ml-video-panel]").evaluate((el) => el.classList.contains("is-active"));
if (!panelActive) throw new Error("ML video panel not active");
await page.screenshot({ path: `${out}/v3-ml-video.png` });

await page.click('.lang-chip[data-lang="ML"]');
await page.waitForTimeout(500);
const mlPanel = await page.locator("[data-ml-video-panel]").evaluate((el) => el.classList.contains("is-active"));
log(`ML chip → video panel active: ${mlPanel}`);
if (!mlPanel) throw new Error("ML lang chip did not open video panel");

/* Waitlist on home */
await page.goto(base + "/", { waitUntil: "networkidle" });
const wl = page.locator("[data-waitlist-form]");
await wl.waitFor();
await page.fill("#wl-name", "Verify User");
await page.fill("#wl-institution", "Demo Bank");
await page.fill("#wl-email", "verify@example.com");
await page.selectOption("#wl-type", "Bank");
log("WAITLIST home form fields OK");

/* Contact mailto fields */
await page.goto(base + "/contact.html", { waitUntil: "networkidle" });
await page.fill("#name", "Verify User");
await page.fill("#institution", "Demo Bank");
await page.selectOption("#type", "NBFC");
await page.fill("#email", "verify@example.com");
log("CONTACT form fields OK");
const mail = await page.locator('a[href^="mailto:support@altioracapitalsolution.com"]').count();
if (mail < 1) throw new Error("support@ mailto missing on contact");

/* Use cases filter */
await page.goto(base + "/use-cases.html", { waitUntil: "networkidle" });
const before = await page.locator("[data-uc-card]:not(.is-hidden)").count();
await page.click('[data-uc-filter="whatsapp"]');
await page.waitForTimeout(200);
const after = await page.locator("[data-uc-card]:not(.is-hidden)").count();
log(`UC filter all=${before} whatsapp=${after}`);
if (after < 1 || after >= before) throw new Error("Use-case WhatsApp filter did not narrow results");
await page.screenshot({ path: `${out}/v3-use-cases.png` });

/* Reveal */
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.evaluate(() => window.scrollTo(0, 1200));
await page.waitForTimeout(700);
const revealed = await page.locator(".reveal.is-in").count();
log(`REVEAL is-in count after scroll: ${revealed}`);
if (revealed < 3) throw new Error("Scroll reveal did not fire");

/* Footer address color */
const addrColor = await page.locator(".footer-address").first().evaluate((el) => getComputedStyle(el).color);
log(`FOOTER address color: ${addrColor}`);

/* Pricing waitlist */
await page.goto(base + "/pricing.html", { waitUntil: "networkidle" });
const pricingMain = await page.locator("main").innerText();
if (!/3 months/i.test(pricingMain)) throw new Error("Pricing missing 3-month pitch");
if (!page.locator("[data-waitlist-form]")) throw new Error("Pricing waitlist missing");
await page.screenshot({ path: `${out}/v3-pricing.png` });

/* Resources anchors */
await page.goto(base + "/resources.html#consent", { waitUntil: "networkidle" });
await page.waitForSelector("#consent");
await page.goto(base + "/resources.html#hitl", { waitUntil: "networkidle" });
await page.waitForSelector("#hitl");
log("RESOURCES consent + hitl OK");
await page.screenshot({ path: `${out}/v3-resources.png` });

log("VERIFY-V3 PASS");
await browser.close();
