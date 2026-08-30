import fs from 'fs'
import { chromium } from 'playwright'

const h = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8')
const iHero = h.indexOf('class="hero"')
const iDemo = h.indexOf('product-demo')
const iTheater = h.indexOf('id="theater"')
const iMed = h.indexOf('data-brand-medallion')
console.log({
  theaterAfterDemo: iTheater > iDemo,
  medInHero: iMed > iHero && (iDemo < 0 || iMed < iDemo),
  hasHeroRight: h.includes('hero-right'),
})

const b = await chromium.launch({ headless: true })
const p = await b.newPage({ viewport: { width: 1440, height: 900 } })
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
await p.goto('http://127.0.0.1:5173/', { waitUntil: 'networkidle' })
await p.waitForTimeout(3200)
console.log('errors', errs)
const layout = await p.evaluate(() => {
  const left = document.querySelector('.hero-left')?.getBoundingClientRect()
  const right = document.querySelector('.hero-right')?.getBoundingClientRect()
  const coin = document.querySelector('[data-brand-medallion] canvas')?.getBoundingClientRect()
  const theater = document.querySelector('#theater')?.getBoundingClientRect()
  return {
    leftX: left && Math.round(left.x),
    rightX: right && Math.round(right.x),
    coinW: coin && Math.round(coin.width),
    coinX: coin && Math.round(coin.x),
    theaterTop: theater && Math.round(theater.top),
    heroH: document.querySelector('.hero')?.offsetHeight,
  }
})
console.log(layout)
await p.screenshot({
  path: new URL('../_refs/mal-match-hero.png', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'),
})
await b.close()
