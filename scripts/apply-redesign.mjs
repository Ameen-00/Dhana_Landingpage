import fs from 'fs'

const path = new URL('../index.html', import.meta.url)
let html = fs.readFileSync(path, 'utf8')

// 1) Hero copy
html = html.replace(
  /<p class="hero-eyebrow">[\s\S]*?<\/div>\s*\n\s*<div id="theater">/,
  `<p class="hero-eyebrow">Virtual RM for banks · NBFCs · co-ops</p>
            <h1>
              <span class="dhana-word" data-dhana-word aria-live="polite">
                <span class="dhana-word-measure" aria-hidden="true">Dhana</span>
                <span class="dhana-word-visible">Dhana</span>
              </span>
              joins your flow — without replacing core.
            </h1>
            <p class="hero-sub">
              Voice-first relationship manager on phone, website, and WhatsApp. Qualifies, verifies, and hands makers a
              credit-ready file. Humans decide.
            </p>
            <div class="cta-row">
              <a class="btn btn-primary" href="https://calendly.com/altiora-dhana/pilot" target="_blank" rel="noopener" data-calendly>Book a bank pilot</a>
              <a class="btn btn-ghost" href="#theater">Hear a credit conversation</a>
            </div>
          </div>

          <div id="theater">`,
)

const start = html.indexOf('<!-- 3. Officers band -->')
const end = html.indexOf('<!-- 6. Credit-ready CRM -->')
if (start < 0 || end < 0) {
  console.error('markers missing', { start, end })
  process.exit(1)
}

const replacement = `<!-- 3. Problem → Promise (merged officers + problem) -->
      <section class="problem-chapter" id="problem" data-problem-chapter>
        <div class="wrap problem-chapter-grid">
          <div class="problem-chapter-copy">
            <span class="section-label" data-reveal="blur">The missing conversation</span>
            <h2 class="section-title" data-reveal="clip">Both sides lose when the form can’t listen.</h2>
            <p class="section-lead" data-reveal>
              Borrowers abandon opaque gates. Officers chase incomplete files. The story that would unlock credit never
              reaches the maker. Dhana holds that conversation — then hands the desk a file.
            </p>
          </div>
          <div class="scrub-cards">
            <article class="scrub-card" data-scrub-card>
              <div class="stat-num">Qualify</div>
              <div class="stat-label">Every inbound channel, 24×7</div>
              <p class="stat-desc">Phone, website, and WhatsApp without night-shift headcount.</p>
            </article>
            <article class="scrub-card" data-scrub-card>
              <div class="stat-num">Verify</div>
              <div class="stat-label">Consent · integrity · docs</div>
              <p class="stat-desc">Soft bureau only after a gate. Voice integrity and OCR land on the file.</p>
            </article>
            <article class="scrub-card" data-scrub-card>
              <div class="stat-num">Hand off</div>
              <div class="stat-label">Assist the maker — never decide</div>
              <p class="stat-desc">Credit-ready briefs to Finacle / LOS / CRM. Humans stay in the loop.</p>
            </article>
          </div>
        </div>
      </section>

      <!-- 4. Shreya — Apple-style pinned scroll story -->
      <section class="chapter-pin section--mist" id="shreya">
        <div class="chapter-pin-sticky" data-shreya-pin>
          <div class="wrap">
            <span class="section-label" data-reveal="blur">Flagship story</span>
            <h2 class="section-title section-title--wide" data-reveal="clip">
              Meet Shreya. The bank didn’t reject her — the form did.
            </h2>
            <p class="shreya-phase" data-shreya-phase>Before · auto-filtered</p>
            <div class="shreya-progress-bar" aria-hidden="true"><i data-shreya-progress></i></div>
            <div class="story-grid" data-shreya>
              <div class="story-copy">
                <h3>Fashion designer. Real UPI velocity. Auto-filtered as “unstable salary.”</h3>
                <p>
                  Festival peaks look irregular to a salary gate. An officer never hears the seasonality story. UPI and
                  Account Aggregator never make the file.
                </p>
                <p>
                  Dhana holds the conversation in her language and turns an incomplete picture into an
                  <strong>exception file ready</strong> for human judgment.
                </p>
                <ul class="story-list">
                  <li>Voice instead of silent form reject</li>
                  <li>UPI / AA narrative with consent</li>
                  <li>Soft bureau only after an explicit gate</li>
                  <li>Retarget when the profile strengthens</li>
                </ul>
                <div class="cta-row">
                  <button type="button" class="btn btn-primary" data-shreya-play>Flip the outcome</button>
                  <a class="btn btn-ghost" href="/use-cases.html">More use cases</a>
                </div>
              </div>
              <div class="story-stage">
                <div class="story-stage-head">
                  <strong>Shreya · credit file</strong>
                  <div class="story-toggle" role="group" aria-label="Outcome view">
                    <button type="button" data-shreya-view="before" aria-pressed="true">Before</button>
                    <button type="button" data-shreya-view="after" aria-pressed="false">After</button>
                  </div>
                </div>
                <div class="story-panel" data-panel="before">
                  <div class="file-row"><span>Salary gate</span><span class="bad">Failed</span></div>
                  <div class="file-row"><span>Income story</span><span class="bad">Missing</span></div>
                  <div class="file-row"><span>UPI / AA</span><span class="warn">Not collected</span></div>
                  <div class="file-row"><span>Officer brief</span><span class="bad">None</span></div>
                  <div class="file-row"><span>Decision</span><span class="bad">Auto-filtered</span></div>
                </div>
                <div class="story-panel" data-panel="after" hidden>
                  <div class="file-row"><span>Income frame</span><span class="ok">12-mo avg + peaks</span></div>
                  <div class="file-row"><span>UPI / AA</span><span class="ok">Consented · in file</span></div>
                  <div class="file-row"><span>Soft bureau</span><span class="ok">Gate passed</span></div>
                  <div class="file-row"><span>Voice integrity</span><span class="ok">Pass</span></div>
                  <div class="file-row"><span>Decision</span><span class="ok">Exception file ready</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. How it works -->
      <section class="section" id="how">
        <div class="wrap">
          <span class="section-label" data-reveal="blur">How it works</span>
          <h2 class="section-title section-title--wide" data-reveal="clip">Join the flow. Don’t rip out the core.</h2>
          <p class="section-lead" data-reveal>
            Four beats from first contact to maker-ready handoff. Adapters into Finacle, LOS, and CRM — Dhana assists;
            it never takes a credit decision.
          </p>
          <div class="how-rail">
            <div class="how-connector" aria-hidden="true">
              <svg viewBox="0 0 400 2" preserveAspectRatio="none">
                <path data-how-line d="M0 1 H400" />
              </svg>
            </div>
            <div class="steps-grid">
              <article class="step-card">
                <div class="step-num">01</div>
                <h3>Meet the borrower</h3>
                <p>Inbound or outbound voice, website coach, or WhatsApp — in their language.</p>
              </article>
              <article class="step-card">
                <div class="step-num">02</div>
                <h3>Gather with consent</h3>
                <p>Docs, AA, UPI framing, soft bureau only after an explicit gate.</p>
              </article>
              <article class="step-card">
                <div class="step-num">03</div>
                <h3>Frame the file</h3>
                <p>Income narrative, integrity checks, fraud flags — human-readable for the maker.</p>
              </article>
              <article class="step-card">
                <div class="step-num">04</div>
                <h3>Hand to the desk</h3>
                <p>Push to LOS / CRM / Finacle. Officers review and decide.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      `

html = html.slice(0, start) + replacement + html.slice(end)
fs.writeFileSync(path, html)
console.log('index.html redesigned sections written')
