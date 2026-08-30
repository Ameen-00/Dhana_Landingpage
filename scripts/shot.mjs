import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "_refs");
const browser = await chromium.launch({ channel: "msedge", headless: true });

async function shot(name, opts, action) {
  const page = await browser.newPage({
    viewport: opts.viewport,
    reducedMotion: "reduce",
  });
  await page.goto("http://localhost:5173/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  if (action) await action(page);
  await page.screenshot({
    path: path.join(dir, name),
    fullPage: !!opts.fullPage,
  });
  await page.close();
  console.log("wrote", name);
}

await shot("verify-desktop.png", { viewport: { width: 1440, height: 900 } });
await shot("verify-mobile.png", { viewport: { width: 390, height: 844 } });
await shot("verify-call.png", { viewport: { width: 1440, height: 900 } }, async (page) => {
  await page.click("#init-call");
  await page.waitForTimeout(900);
});
await shot("verify-guided.png", { viewport: { width: 1440, height: 900 } }, async (page) => {
  await page.locator("#meeting").scrollIntoViewIfNeeded();
  await page.click("#g-play");
  await page.waitForTimeout(200);
  await page.click("#g-next");
  await page.click("#g-next");
  await page.click("#g-next");
  await page.waitForTimeout(500);
});
await shot("verify-hi.png", { viewport: { width: 1440, height: 900 } }, async (page) => {
  await page.click('[data-lang="hi"]');
  await page.waitForTimeout(400);
});
await shot("verify-faq.png", { viewport: { width: 1440, height: 900 } }, async (page) => {
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const items = page.locator(".faq-item button");
  await items.nth(1).click();
});
await shot("verify-full.png", { viewport: { width: 1440, height: 1800 }, fullPage: true });

await browser.close();
