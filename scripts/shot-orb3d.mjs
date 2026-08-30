import { chromium } from "playwright";

const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 960 },
  // allow motion so orb animates; block auto-ring by answering path ourselves
});

page.on("pageerror", (e) => console.log("PAGEERROR", e.message));

await page.addInitScript(() => {
  // Prevent auto-ring so we can capture idle
  window.__dhanaBlockAutoRing = true;
});

// Patch: load page then immediately reset call to idle and stop timers
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(400);

// Force idle before auto-ring (1.8s)
await page.evaluate(() => {
  const phone = document.querySelector("[data-phone]");
  if (phone) phone.dataset.state = "idle";
});
await page.waitForTimeout(300);

await page.locator("#theater").scrollIntoViewIfNeeded();
await page.waitForTimeout(500);

const info = await page.evaluate(() => {
  const phone = document.querySelector("[data-phone]");
  const orbs = [...document.querySelectorAll("[data-voice-orb-3d]")].map((el) => ({
    state: el.dataset.orbState,
    mounted: el.dataset.orbMounted || "0",
    w: el.clientWidth,
    h: el.clientHeight,
    hasCanvas: !!el.querySelector("canvas"),
  }));
  const brand = document.querySelector(".call-brand-orb canvas");
  return {
    state: phone?.dataset.state,
    orbs,
    brandCanvas: brand
      ? { w: brand.width, h: brand.height, style: brand.getAttribute("style") }
      : null,
  };
});
console.log(JSON.stringify(info, null, 2));

await page.locator("#theater").screenshot({ path: "_refs/orb3d-idle.png" });
await page.locator(".phone-frame").screenshot({ path: "_refs/orb3d-phone-idle.png" });
await page.locator(".call-brand-card").screenshot({ path: "_refs/orb3d-brand.png" });

await page.click("[data-call-me]", { timeout: 5000 });
await page.waitForTimeout(700);
await page.locator(".phone-frame").screenshot({ path: "_refs/orb3d-phone-ring.png" });

await page.click("[data-answer]");
await page.waitForTimeout(900);
await page.locator(".phone-frame").screenshot({ path: "_refs/orb3d-phone-active.png" });
await page.locator("#theater").screenshot({ path: "_refs/orb3d-theater-active.png" });

await browser.close();
console.log("done");
