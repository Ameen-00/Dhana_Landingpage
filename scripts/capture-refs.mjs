import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const out = path.join(__dirname, '..', '_refs')

const sites = [
  ['monday', 'https://monday.com'],
  ['linear', 'https://linear.app'],
  ['stripe', 'https://stripe.com'],
  ['duolingo', 'https://www.duolingo.com'],
  ['hers', 'https://www.forhers.com'],
]

const browser = await chromium.launch({ headless: true })
for (const [name, url] of sites) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 })
    await page.waitForTimeout(2200)
    await page.screenshot({ path: path.join(out, `ref2-${name}-hero.png`) })
    const notes = await page.evaluate(() => {
      const h1 = document.querySelector('h1')
      const cs = h1 ? getComputedStyle(h1) : null
      return {
        title: document.title,
        h1: h1?.innerText?.slice(0, 120),
        h1Size: cs?.fontSize,
        h1Weight: cs?.fontWeight,
        bg: getComputedStyle(document.body).backgroundColor,
      }
    })
    console.log(name, JSON.stringify(notes))
  } catch (e) {
    console.log(name, 'ERR', e.message.slice(0, 100))
  }
  await page.close()
}
await browser.close()
