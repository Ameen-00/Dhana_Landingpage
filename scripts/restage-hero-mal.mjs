import fs from 'fs'

const path = new URL('../index.html', import.meta.url)
let html = fs.readFileSync(path, 'utf8')

// 1) Remove medallion stuck inside call panel
html = html.replace(
  /\s*<!-- mal\.ai-inspired floating metallic medallion -->[\s\S]*?<\/aside>\s*/,
  '\n',
)

// 2) Split hero: keep left copy, replace #theater sibling with medallion right,
//    then open a new section for theater after hero closes.

const theaterStart = html.indexOf('<div id="theater">')
if (theaterStart < 0) {
  console.error('theater not found')
  process.exit(1)
}

// Find matching close of #theater — it's the div that contains the whole theater.
// Heuristic: from theaterStart, find the closing that ends before </section> of hero.
const heroSectionEnd = html.indexOf('</section>', theaterStart)
if (heroSectionEnd < 0) {
  console.error('hero section end not found')
  process.exit(1)
}

// Walk back to find the last </div> before </section> that closes hero-grid wrap.
// Structure: theater ... </div> (theater) </div> (wrap) </section>
// We'll extract from <div id="theater"> through its closing, by counting divs.
let i = theaterStart
let depth = 0
let theaterEnd = -1
const openDiv = /<div\b/g
const closeDiv = /<\/div>/g
while (i < heroSectionEnd) {
  const slice = html.slice(i, i + 20)
  if (html.startsWith('<div', i)) {
    depth += 1
    i = html.indexOf('>', i) + 1
    continue
  }
  if (html.startsWith('</div>', i)) {
    depth -= 1
    i += 6
    if (depth === 0) {
      theaterEnd = i
      break
    }
    continue
  }
  i += 1
}

if (theaterEnd < 0) {
  console.error('could not balance theater div')
  process.exit(1)
}

const theaterHtml = html.slice(theaterStart, theaterEnd)
console.log('theater extracted', theaterHtml.length, 'chars')

const medallionRight = `<div class="hero-right">
            <div class="hero-medallion hero-medallion--hero" aria-hidden="true">
              <div class="hero-medallion-stage" data-brand-medallion></div>
            </div>
          </div>`

html = html.slice(0, theaterStart) + medallionRight + html.slice(theaterEnd)

// 3) Insert theater as its own section after hero </section>
const heroClose = html.indexOf('</section>', html.indexOf('class="hero"'))
if (heroClose < 0) {
  console.error('hero close missing after rewrite')
  process.exit(1)
}
const insertAt = heroClose + '</section>'.length

const theaterSection = `

      <!-- Product theater (below mal-style hero) -->
      <section class="section section--tight" id="product-demo">
        <div class="wrap">
          <span class="section-label" data-reveal="blur">Live product</span>
          <h2 class="section-title section-title--wide" data-reveal="clip">Try the channels officers actually use.</h2>
          ${theaterHtml}
        </div>
      </section>
`

html = html.slice(0, insertAt) + theaterSection + html.slice(insertAt)

fs.writeFileSync(path, html)
console.log('hero restaged: left copy + right medallion; theater moved below')
