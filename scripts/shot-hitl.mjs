import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 960 },
  reducedMotion: "reduce",
});

await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);

// WhatsApp tab — confirm no visible scrollbar styling and chat scrolls inside
await page.click('.theater-tab[data-channel="whatsapp"]');
await page.waitForTimeout(400);
await page.locator("#theater").scrollIntoViewIfNeeded();
await page.locator("#theater").screenshot({ path: "_refs/wa-no-scrollbar.png" });
await page.locator(".wa-frame").screenshot({ path: "_refs/wa-phone-only.png" });

const waScroll = await page.evaluate(() => {
  const body = document.querySelector(".wa-body");
  const cs = getComputedStyle(body);
  return {
    overflowY: cs.overflowY,
    scrollbarWidth: cs.scrollbarWidth,
    scrollHeight: body.scrollHeight,
    clientHeight: body.clientHeight,
    canScroll: body.scrollHeight > body.clientHeight,
  };
});
console.log("wa", waScroll);

// CRM section
await page.locator("#credit-file").scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await page.locator("#credit-file").screenshot({ path: "_refs/crm-ai-insight.png" });
await page.locator(".crm-decision").screenshot({ path: "_refs/crm-decision-only.png" });

// Click maker review
await page.click('[data-hitl="review"]');
await page.waitForTimeout(400);
const toast = await page.locator("[data-toast]").textContent();
console.log("toast", toast);

await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(300);
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.click('.theater-tab[data-channel="whatsapp"]');
await page.waitForTimeout(300);
await page.locator("#theater").scrollIntoViewIfNeeded();
await page.locator(".wa-frame").screenshot({ path: "_refs/wa-mobile.png" });

await browser.close();
console.log("done");
