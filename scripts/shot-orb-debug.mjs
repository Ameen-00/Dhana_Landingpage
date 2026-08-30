import { chromium } from "playwright";
const browser = await chromium.launch({ channel: "msedge", headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
const info = await page.evaluate(() => {
  const phone = document.querySelector(".phone-frame");
  const idle = document.querySelector(".phone-idle");
  const ringing = document.querySelector(".phone-ringing");
  const ics = getComputedStyle(idle);
  const rcs = getComputedStyle(ringing);
  return {
    state: phone?.dataset.state,
    idleDisplay: ics.display,
    ringingDisplay: rcs.display,
    idleHTML: idle?.innerHTML.slice(0, 200),
    callMeCount: document.querySelectorAll("[data-call-me]").length,
  };
});
console.log(JSON.stringify(info, null, 2));
await page.locator("#theater").screenshot({ path: "_refs/orb3d-debug.png" });
await browser.close();
