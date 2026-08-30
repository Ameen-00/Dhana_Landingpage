import { chromium } from 'playwright'

const b = await chromium.launch({ headless: true })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
await p.goto('https://mal.ai/', { waitUntil: 'domcontentloaded', timeout: 60000 })
await p.waitForTimeout(5000)
const video = p.locator('video').first()
await video.waitFor({ state: 'visible', timeout: 15000 })
await p.waitForTimeout(2500)
await video.screenshot({ path: '_refs/mal-RIGHT-ELEMENT.png' })
console.log('video box', await video.boundingBox())
await p.locator('[data-framer-name="hero2"]').screenshot({ path: '_refs/mal-hero2-region.png' })
// Capture a few frames over time to see animation
for (let i = 0; i < 4; i++) {
  await p.waitForTimeout(800)
  await video.screenshot({ path: `_refs/mal-video-frame-${i}.png` })
}
await b.close()
console.log('done')
