import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const base = process.env.DHANA_BASE || "http://localhost:5173";
const out = "_refs";
await mkdir(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const log = (m) => console.log(m);

async function shot(route, name, width, height = 900) {
  const page = await browser.newPage({ viewport: { width, height } });
  const res = await page.goto(base + route, { waitUntil: "networkidle" });
  const status = res?.status() ?? 0;
  if (status !== 200) throw new Error(`${route} → ${status}`);
  await page.waitForTimeout(900);
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((n) => n.classList.add("is-in"));
  });
  await page.waitForTimeout(200);
  await page.screenshot({ path: `${out}/${name}`, fullPage: false });
  log(`SHOT ${name} (${width}x${height})`);
  await page.close();
}

/* Desktop */
await shot("/use-cases.html", "auth-usecases.png", 1440);
await shot("/resources.html", "auth-resources.png", 1440);

/* Mobile */
await shot("/use-cases.html", "auth-usecases-mobile.png", 390, 844);
await shot("/resources.html", "auth-resources-mobile.png", 390, 844);

/* Sanity: traction copy + media present */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(base + "/use-cases.html", { waitUntil: "networkidle" });
  const body = await page.locator("main").innerText();
  for (const needle of ["MRCB", "PaisaOnClick", "Jeff App", "Kerala State Co-operative", "1,000", "2,000", "500K"]) {
    if (!body.includes(needle)) throw new Error(`Use cases missing ${needle}`);
  }
  const imgs = await page.locator(".uc-card-media img").count();
  if (imgs < 14) throw new Error(`Expected ≥14 uc media images, got ${imgs}`);
  const srcs = await page.locator(".uc-card-media img").evaluateAll((nodes) => nodes.map((n) => n.getAttribute("src")));
  const unique = new Set(srcs);
  if (unique.size !== srcs.length) throw new Error(`Duplicate uc images: ${srcs.join(", ")}`);

  await page.goto(base + "/resources.html", { waitUntil: "networkidle" });
  for (const id of ["learn", "blog", "videos", "frameworks", "writing"]) {
    if (!(await page.locator(`#${id}`).count())) throw new Error(`Missing hub section #${id}`);
  }
  const hubImgs = await page.locator(".hub-card-media img").evaluateAll((nodes) => nodes.map((n) => n.getAttribute("src")));
  const hubUnique = new Set(hubImgs);
  if (hubUnique.size !== hubImgs.length) {
    log(`WARN hub-card image reuse within Learn/Blog/Videos grids: ${hubImgs.join(" | ")}`);
  } else {
    log(`OK hub-card images unique (${hubImgs.length})`);
  }
  await page.close();
}

log("SHOT-AUTH PASS");
await browser.close();
