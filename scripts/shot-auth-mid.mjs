import { chromium } from "playwright";

const base = process.env.DHANA_BASE || "http://127.0.0.1:5173";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto(base + "/use-cases.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-in")));
await page.locator(".uc-grid:not(.uc-grid--traction)").first().scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.screenshot({ path: "_refs/auth-usecases-scenarios.png" });
console.log("SHOT auth-usecases-scenarios.png");

await page.goto(base + "/resources.html", { waitUntil: "networkidle" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-in")));
await page.locator("#frameworks").scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await page.screenshot({ path: "_refs/auth-resources-fw.png" });
console.log("SHOT auth-resources-fw.png");

await page.goto(base + "/use-cases.html", { waitUntil: "networkidle" });
await page.click('[data-uc-filter="whatsapp"]');
await page.waitForTimeout(200);
const visible = await page.locator("[data-uc-card]:not(.is-hidden)").count();
const hidden = await page.locator("[data-uc-card].is-hidden").count();
console.log(`FILTER whatsapp visible=${visible} hidden=${hidden}`);
if (visible < 1) throw new Error("filter failed");

console.log("MID-SHOTS OK");
await browser.close();
