import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "_refs");
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 960 },
  reducedMotion: "reduce",
});

await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);

const theater = page.locator("#theater");
await theater.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);

await theater.screenshot({ path: path.join(dir, "theater-idle-v6.png") });
console.log("wrote theater-idle-v6.png");

const phone = page.locator(".phone-frame");
await phone.screenshot({ path: path.join(dir, "phone-idle-v6.png") });
console.log("wrote phone-idle-v6.png");

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await theater.scrollIntoViewIfNeeded();
await theater.screenshot({ path: path.join(dir, "theater-idle-mobile-v6.png") });
console.log("wrote theater-idle-mobile-v6.png");

await browser.close();
