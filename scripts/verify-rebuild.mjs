import { chromium } from "playwright";

const base = "http://localhost:5173";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

const routes = ["/", "/pricing.html", "/use-cases.html", "/resources.html", "/contact.html"];
for (const r of routes) {
  await page.goto(base + r, { waitUntil: "networkidle" });
  const title = await page.title();
  const h1 = ((await page.locator("h1").first().textContent()) || "").trim().slice(0, 70);
  console.log(r, "|", title, "|", h1);
}

await page.goto(base + "/", { waitUntil: "networkidle" });
await page.click("[data-play]");
await page.waitForTimeout(2500);
console.log("after play badge:", await page.locator(".outcome-badge").first().textContent());

await page.click('.rm-tab[data-channel="website"]');
await page.waitForTimeout(300);
console.log("tab:", (await page.locator('.rm-tab[aria-selected="true"]').textContent()).trim());

await page.click("[data-shreya-play]");
await page.waitForTimeout(1600);
const afterHidden = await page.locator('[data-panel="after"]').first().evaluate((el) => el.hidden);
console.log("shreya after hidden?", afterHidden);

await page.screenshot({ path: "_refs/verify-home-rebuild.png" });

await page.setViewportSize({ width: 390, height: 844 });
await page.goto(base + "/", { waitUntil: "networkidle" });
await page.click(".hamburger");
await page.waitForTimeout(200);
console.log("drawer open class:", await page.locator(".mobile-drawer").evaluate((el) => el.className));
await page.screenshot({ path: "_refs/verify-home-mobile.png" });

await page.setViewportSize({ width: 1280, height: 800 });
await page.goto(base + "/pricing.html", { waitUntil: "networkidle" });
await page.screenshot({ path: "_refs/verify-pricing.png" });

await page.goto(base + "/use-cases.html", { waitUntil: "networkidle" });
await page.locator('[data-uc-stage="coop"] [data-play]').click();
await page.waitForTimeout(2000);
console.log(
  "coop badge:",
  await page.locator('[data-uc-stage="coop"] .outcome-badge').textContent()
);

await page.goto(base + "/contact.html", { waitUntil: "networkidle" });
await page.fill("#name", "Test Buyer");
await page.fill("#institution", "Sample Co-op");
await page.selectOption("#type", "Co-op");
await page.fill("#email", "buyer@example.com");
await page.fill("#phone", "+919999999999");
await page.fill("#message", "Gold loan evening Malayalam pilot");
await page.click('button[type="submit"]');
await page.waitForTimeout(300);
console.log("form success visible:", !(await page.locator(".form-success").isHidden()));

await browser.close();
console.log("screenshots ok");
