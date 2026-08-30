import { chromium } from "playwright";

const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:5173/", { waitUntil: "domcontentloaded", timeout: 20000 });
await p.waitForTimeout(1500);
await p.screenshot({ path: "_refs/orb-png-home.png", clip: { x: 350, y: 80, width: 900, height: 700 } });
console.log("home orb count", await p.locator('img[src*="dhana-orb.png"]').count());
await p.goto("http://localhost:5173/use-cases.html", { waitUntil: "domcontentloaded" });
await p.waitForTimeout(1000);
await p.screenshot({ path: "_refs/uc-film.png" });
console.log("film video", await p.locator('video source[src*="dhana-film2"]').count());
await b.close();
console.log("done");
