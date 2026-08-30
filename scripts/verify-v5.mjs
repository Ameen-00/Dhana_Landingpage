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
}

/* Light theme: page canvas must not be void black */
await page.goto(base + "/", { waitUntil: "networkidle" });
const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
log(`BODY_BG ${bg}`);
if (bg === "rgb(7, 8, 12)") throw new Error("Body still dark void background");

/* Hero + animated word */
await page.waitForSelector("[data-dhana-word]");
await page.waitForTimeout(500);
await page.screenshot({ path: `${out}/v5-light-hero.png`, fullPage: false });
log("SHOT v5-light-hero.png");

/* Credit CRM */
await page.locator("#credit-file").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.click('[data-crm-tab="bureau"]');
await page.waitForTimeout(200);
await page.click('[data-crm-tab="docs"]');
await page.waitForTimeout(150);
const approve = page.locator('[data-crm-decision] [data-hitl="approve"]');
await approve.click();
await page.waitForTimeout(300);
await page.locator("#credit-file").screenshot({ path: `${out}/v5-credit-crm.png` });
log("SHOT v5-credit-crm.png");

/* Agent Center n8n */
await page.locator("#agents").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.click('[data-flow-node="bureau"]');
await page.waitForTimeout(200);
await page.locator("#agents").screenshot({ path: `${out}/v5-agent-n8n.png` });
log("SHOT v5-agent-n8n.png");

/* Use cases traction */
await page.goto(base + "/use-cases.html", { waitUntil: "networkidle" });
await page.waitForTimeout(400);
const body = await page.locator("main").innerText();
for (const needle of ["MRCB", "PaisaOnClick", "Jeff App", "Kerala State Co-operative", "1,000", "2,000", "500K"]) {
  if (!body.includes(needle)) throw new Error(`Use cases missing ${needle}`);
}
await page.screenshot({ path: `${out}/v5-usecases.png`, fullPage: false });
log("SHOT v5-usecases.png");

/* Calendly + email still wired */
await page.goto(base + "/contact.html", { waitUntil: "networkidle" });
const href = await page.locator("[data-book-pilot]").first().getAttribute("href");
if (!href?.includes("calendly.com/altiora-dhana/pilot")) throw new Error(`Calendly href wrong: ${href}`);
const mail = await page.locator('a[href^="mailto:support@altioracapitalsolution.com"]').count();
if (mail < 1) throw new Error("support@ mailto missing");

/* Self-host section present */
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.waitForSelector("#self-host-home");
await page.waitForSelector(".deploy-card");

log("VERIFY-V5 PASS");
await browser.close();
