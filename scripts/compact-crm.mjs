import fs from 'fs'

const path = new URL('../index.html', import.meta.url)
let html = fs.readFileSync(path, 'utf8')

const start = html.indexOf('<!-- 6. Credit-ready CRM -->')
const end = html.indexOf('<!-- 6b. Self-host -->')
if (start < 0 || end < 0) {
  console.error('CRM markers missing', { start, end })
  process.exit(1)
}

const compact = `<!-- 6. Credit-ready CRM (compact) -->
      <section class="section" id="credit-file">
        <div class="wrap">
          <span class="section-label" data-reveal="blur">Credit-ready CRM</span>
          <h2 class="section-title section-title--wide" data-reveal="clip">What the officer actually opens.</h2>
          <p class="section-lead" data-reveal>
            One credit-ready brief — applicant, ask, bureau, and insight. Dhana packages; humans decide.
          </p>

          <div class="crm-dash crm-dash--compact reveal" data-crm-dash>
            <header class="crm-strip">
              <div>
                <h3>Shreya M. · working capital</h3>
                <p class="mono crm-ref">REF-DHN-2026-0847 · Voice + DigiLocker</p>
              </div>
              <div class="crm-strip-badges">
                <span class="status-pill status-pill--live">Credit-ready</span>
                <span class="crm-chip ok">Integrity pass</span>
              </div>
            </header>

            <div class="crm-layout crm-layout--compact">
              <div class="crm-main">
                <div class="crm-snap-grid">
                  <article class="crm-tile">
                    <span class="crm-tile-label">CIBIL</span>
                    <strong>782</strong>
                    <span>Excellent</span>
                  </article>
                  <article class="crm-tile">
                    <span class="crm-tile-label">Ask</span>
                    <strong>₹2.5L</strong>
                    <span>36 mo · EMI ₹8,620</span>
                  </article>
                  <article class="crm-tile">
                    <span class="crm-tile-label">FOIR</span>
                    <strong>38.2%</strong>
                    <span>Within policy</span>
                  </article>
                  <article class="crm-tile">
                    <span class="crm-tile-label">KYC</span>
                    <strong>Verified</strong>
                    <span>Aadhaar + PAN + VKYC</span>
                  </article>
                </div>
                <p class="crm-story">
                  Festival-led UPI peaks understate last-month salary. Soft bureau consented. Exception brief ready for the maker.
                </p>
              </div>

              <aside class="crm-decision" data-crm-decision>
                <h4>Maker assist</h4>
                <div class="crm-insight crm-insight--compact">
                  <p class="crm-insight-flag">Worth checking</p>
                  <p class="crm-insight-title">Missed by the usual salary gate</p>
                  <p class="crm-insight-body">
                    12-month UPI average ~34% above last-month salary. Flagged for review — not auto-approved.
                  </p>
                </div>
                <div class="crm-risk">
                  <div class="crm-risk-head"><span>Risk view</span><strong>Low · 12 / 100</strong></div>
                  <div class="crm-risk-bar"><i data-risk-bar style="width:12%"></i></div>
                </div>
                <div class="crm-actions">
                  <button type="button" class="btn btn-verify" data-hitl="review">Open for review</button>
                  <button type="button" class="btn btn-primary" data-hitl="push">Push to Finacle</button>
                </div>
                <p class="crm-disclaimer">Illustrative. Officers decide. HITL always on.</p>
              </aside>
            </div>
          </div>
        </div>
      </section>

      `

html = html.slice(0, start) + compact + html.slice(end)
fs.writeFileSync(path, html)
console.log('CRM compacted')
