import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 960 },
  reducedMotion: "reduce",
});
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.click("[data-call-me]");
await page.waitForTimeout(300);
await page.addStyleTag({
  content: `
    .phone-ring-ripples { display: none !important; }
    .phone-frame[data-state="ringing"] .phone-avatar { animation: none !important; }
  `,
});
await page.waitForTimeout(100);
const box = await page.evaluate(() => {
  const fr = document.querySelector(".phone-frame").getBoundingClientRect();
  const av = document.querySelector(".phone-ringing .phone-avatar").getBoundingClientRect();
  const img = document.querySelector(".phone-ringing .phone-avatar img").getBoundingClientRect();
  return {
    avTop: av.top - fr.top,
    avH: av.height,
    imgTop: img.top - fr.top,
    imgH: img.height,
    frH: fr.height,
  };
});
console.log(box);
await page.locator(".phone-frame").screenshot({ path: "_refs/phone-ringing-clean.png" });
await page.locator("#theater").screenshot({ path: "_refs/theater-ringing-clean.png" });
await browser.close();
