// Single source of truth for Resources content. The Resources page renders cards
// from this, and article.html renders the full item by ?slug=. Images are placeholders
// (existing /assets/resources covers) — swap for real art later.

export const CONTENT = {
  // ——— BLOG ———
  "voice-first-vs-form-first": {
    type: "blog",
    category: "Perspective",
    title: "Why voice-first beats form-first in Indian lending",
    excerpt: "A form asks the borrower to translate their life into fields. A conversation lets them just talk, and Dhana does the translating.",
    date: "2026-08-22",
    read: "5 min read",
    image: "assets/resources/cover-learn.jpg",
    body: `
      <p>Most digital lending journeys begin with a form. The form assumes the borrower already knows their FOIR, can classify their income, and will not abandon halfway. For a salaried metro applicant, that assumption often holds. For a boutique owner in Kochi with festival-led UPI velocity, it collapses at the first gate.</p>
      <h2>The form can't listen</h2>
      <p>A "salary" field has no room for seasonality. A drop-down has no room for a story. So the applicant is auto-filtered as "unstable", not because the bank rejected her, but because the form could not hear her. The officer never sees the file.</p>
      <h2>Voice is the interface most people already have</h2>
      <p>Dhana starts with a call, a website coach, or a WhatsApp thread, in Malayalam, Hindi, Tamil or English. The borrower speaks; Dhana qualifies, verifies with consent, frames twelve months of income instead of last month alone, and hands the desk a credit-ready file. The voice is the product, not a chatbot bolted onto a form.</p>
      <p>Humans still decide. Dhana never approves, it packages the exception brief so a maker can make the call with the full picture.</p>
    `,
  },
  "consent-before-the-bureau": {
    type: "blog",
    category: "Compliance UX",
    title: "Consent before the soft bureau fires",
    excerpt: "Designing the verbal gate so the borrower hears the ask, the officer sees the log, and Digital Lending Directions stay on the happy path.",
    date: "2026-08-14",
    read: "4 min read",
    image: "assets/resources/res-consent-glass.jpg",
    body: `
      <p>A soft bureau pull is cheap to run and expensive to get wrong. Under the RBI Digital Lending Directions, consent is not a checkbox buried in a T&C scroll, it is an explicit, auditable moment.</p>
      <h2>Say the ask out loud</h2>
      <p>Dhana asks for consent in plain language, in the borrower's own tongue, before any bureau or Account Aggregator call. "May I check your credit with a soft pull? It won't affect your score." The borrower answers. The answer is timestamped and logged.</p>
      <h2>The officer sees the trail</h2>
      <p>Every consent artifact (outreach, bureau, AA, DPDP notice, recording) carries a source and a time. Nothing is inferred without a consented pull. That is what turns a conversation into evidence a credit desk can stand behind.</p>
    `,
  },
  "festival-income-isnt-unstable": {
    type: "blog",
    category: "Credit thinking",
    title: "Festival income isn't unstable income",
    excerpt: "Seasonality reads as risk to a salary gate. Twelve months of UPI tells a steadier story than a single payslip.",
    date: "2026-08-06",
    read: "6 min read",
    image: "assets/resources/cover-shreya.jpg",
    body: `
      <p>Retail, weddings, tailoring, catering: huge swathes of Indian self-employment peak around festivals and taper in between. A salary-shaped underwriting model sees the peaks as volatility and the troughs as default risk.</p>
      <h2>The twelve-month average</h2>
      <p>When Dhana reframes income as a twelve-month average with the festival peaks in view, a "spiky" applicant often turns out to be steadier than a salaried one whose single bad month would have sailed through. UPI inflow and Account Aggregator data, pulled only after an explicit gate, corroborate the story.</p>
      <h2>An exception, not an override</h2>
      <p>This is not auto-approval. It is an exception brief: here is why the usual gate misfired, here is the corroborating evidence, here is the risk view. A human maker decides. The point is simply that the maker now gets to decide at all.</p>
    `,
  },
  "one-layer-many-products": {
    type: "blog",
    category: "Platform",
    title: "One layer, many products: how Dhana scales",
    excerpt: "Deploy once, inside your perimeter. Lending is live; each product after it reuses the same layer and the same security review.",
    date: "2026-07-28",
    read: "4 min read",
    image: "assets/resources/res-selfhost.jpg",
    body: `
      <p>Adding a new lending product to a bank usually means a new integration, a new security review, and a new quarter. Dhana is built so a new product is a journey, not a rebuild.</p>
      <h2>The relationship layer is the moat</h2>
      <p>Voice, web and WhatsApp, consent, session audit, and adapter pushes to Finacle / LOS / CRM live in one layer, inside your perimeter. Lending (Rin) is live. Insurance (Raksha), investments (Artha), account opening (Nova) and collections (Setu) ride the same rails.</p>
      <h2>One security review</h2>
      <p>Because the perimeter and the control plane don't change, the second product does not restart the security conversation. A new language is a sprint; a new product is a journey.</p>
    `,
  },

  "digital-lending-moneylender": {
    type: "blog",
    category: "Opinion",
    title: "Digital lending is quietly rebuilding the moneylender",
    excerpt: "Instant, app-based credit was supposed to end the village lender. Priced at 30–60% APR and pushed by notification, a lot of it just gave him an app.",
    date: "2026-08-28",
    read: "6 min read",
    image: "assets/resources/res-free-ai.jpg",
    body: `
      <p>The pitch for digital lending was liberation: no forms, no branch, no moneylender. Tap, get ₹10,000 in ninety seconds. What too much of the market actually shipped was the moneylender with better UX: effective rates of 30–60% a year, rollover by design, and collection pressure delivered by push notification instead of a knock on the door.</p>
      <h2>Speed is not access</h2>
      <p>"Instant approval" sounds like inclusion. In practice it rewards the applicants who least need help. Thin-file, seasonal-income, first-time borrowers get a fast <em>no</em>, or a fast <em>yes</em> at a rate that assumes they'll struggle. Speed optimises the lender's funnel, not the borrower's outcome.</p>
      <h2>The uncomfortable part</h2>
      <p>A conversation is slower than a form, and slower looks worse on a growth dashboard. But a borrower who can explain festival seasonality, or ask what an EMI really means, is a borrower who defaults less and complains less. Dhana's bet is that voice-first, consent-gated origination, with a human maker on the credit call, is not the charitable option. It's the one that ages well when the regulator, and the borrower, look back.</p>
      <p>We would rather lose the ninety-second-loan race than win it the way it's usually won.</p>
    `,
  },
  "credit-score-privilege": {
    type: "blog",
    category: "Opinion",
    title: "The credit score is often a proxy for privilege, not repayment",
    excerpt: "A clean bureau file mostly means you've had credit before. For half of India that's a chicken-and-egg trap, not a risk signal.",
    date: "2026-08-18",
    read: "5 min read",
    image: "assets/resources/res-framework-scales.jpg",
    body: `
      <p>Bureau scores are treated as objective truth. They aren't. A high score largely reflects a history of <em>having been given credit</em>, a salaried job, a metro address, a family that could co-sign. For a boutique owner, a gig worker, or a first-generation borrower, "no history" is read as "risk," when it usually just means "no one lent to them yet."</p>
      <h2>Thin file ≠ high risk</h2>
      <p>Twelve months of UPI inflow, GST turnover, or Account Aggregator cash-flow can be a better repayment signal than a two-year-old credit card. But those signals only reach the desk if someone gathers them, with consent, and frames them. A salary-only gate throws them away before an officer ever sees the file.</p>
      <h2>What we do about it</h2>
      <p>Dhana doesn't overrule the score; it adds the story the score can't see, and hands a human the exception. Nobody is auto-approved. The point is narrower and, we think, harder to argue with: the maker should at least get to decide.</p>
    `,
  },
  "against-full-automation": {
    type: "blog",
    category: "Opinion",
    title: "The case against fully automated lending decisions",
    excerpt: "'AI decides, human reviews' is usually a fig leaf. If the model can't be argued with, the human isn't in the loop: they're in the audit trail.",
    date: "2026-08-02",
    read: "5 min read",
    image: "assets/resources/res-hitl-stamp.jpg",
    body: `
      <p>Every lender now says "human in the loop." Most mean a screen where an officer rubber-stamps whatever the model already decided, because reversing it means explaining yourself and missing your SLA. That is not a loop. That is liability laundering.</p>
      <h2>HITL has to have teeth</h2>
      <p>For human review to be real, three things have to be true: the officer sees <em>why</em>, in language they can argue with; overriding is cheap and normal, not a career risk; and the model never silently auto-approves a credit-relevant outcome. The RBI FREE-AI direction is pushing this way for a reason.</p>
      <h2>Dhana assists; it never approves</h2>
      <p>Our agents package a credit-ready file (bureau, income frame, integrity, the exception and why it matters) and stop. The credit call is locked to a maker and cannot be turned off. It's slower. It's also the version we'd want if it were our loan being decided.</p>
    `,
  },

  "whatsapp-after-hours": {
    type: "blog",
    category: "Field notes",
    title: "The loan is won at 9pm, not 11am",
    excerpt: "A shop owner can't take a bank call during business hours. The channel that reopens a dead lead is the one that waits until the shutters are down.",
    date: "2026-08-20",
    read: "4 min read",
    image: "assets/resources/res-blog-capacity.jpg",
    body: `
      <p>Look at when a self-employed borrower actually replies. Not 11am, that's when the shop is full. It's 9pm, after the shutters are down, the till is counted, and there's finally a free minute. The bank's call-centre closed four hours earlier.</p>
      <h2>The channel has to wait</h2>
      <p>Dhana's WhatsApp thread doesn't sleep. A borrower who ignored three daytime calls will send a voice note at night (in Malayalam, half-finished, mid-thought) and Dhana picks it up, answers in the same language, and moves the file forward. No agent had to be awake.</p>
      <h2>Continuity, not spam</h2>
      <p>The line between "helpful follow-up" and "harassment" is consent and cadence. Dhana reopens a lead the borrower paused, on the borrower's clock, and stops the moment they ask it to. That restraint is a product decision, not an afterthought.</p>
    `,
  },
  "language-is-the-relationship": {
    type: "blog",
    category: "Perspective",
    title: "Language isn't a feature. It's the whole relationship.",
    excerpt: "Bolting a translation layer onto an English product isn't 'supporting Malayalam.' The borrower can tell in the first sentence.",
    date: "2026-08-10",
    read: "5 min read",
    image: "assets/resources/cover-video.jpg",
    body: `
      <p>Most "multilingual" fintech is an English product with Google Translate stapled to the front. The borrower notices immediately: the phrasing is stiff, the numbers are read out in a foreign cadence, and the whole thing feels like a form pretending to be a person.</p>
      <h2>Speaking is trust</h2>
      <p>When Dhana greets a borrower in her own language (right pacing, the right way of saying ₹17,000, the right register of politeness), she relaxes. She explains the seasonality. She asks what the EMI really means. That candour is underwriting signal you cannot get from a dropdown.</p>
      <h2>Per-borrower, not per-market</h2>
      <p>Language in Dhana is chosen per conversation, not per deployment. The same agent meets a Tamil borrower in Tamil and a Hindi borrower in Hindi, an hour apart, tuned once. Eleven Indian languages today; Gulf dialects next.</p>
    `,
  },
  "exception-brief-anatomy": {
    type: "blog",
    category: "Credit thinking",
    title: "Anatomy of a good exception brief",
    excerpt: "If you want a human to make the credit call, you have to hand them something they can actually argue with. Here's what goes in the packet.",
    date: "2026-07-24",
    read: "6 min read",
    image: "assets/resources/res-hitl-stamp.jpg",
    body: `
      <p>"Human in the loop" is meaningless if the human gets a green tick and a score. A real exception brief is a packet a credit officer can interrogate in ninety seconds and defend in an audit.</p>
      <h2>What's in the packet</h2>
      <p>The consent trail (who asked, when, in what language). The bureau pull and its timestamp. Income framed over twelve months, not one, with the UPI and AA evidence attached. The integrity check. And the exception itself: <em>here is why the standard gate misfired, and here is what changes the picture.</em></p>
      <h2>Why it has to be legible</h2>
      <p>An officer who can't see the reasoning will either rubber-stamp or reject to be safe. Both are failures. Dhana writes the brief in plain language so overriding the model is cheap, normal, and defensible, which is the only way HITL stops being theatre.</p>
    `,
  },
  "coop-banks-sleeping-giant": {
    type: "blog",
    category: "Opinion",
    title: "Co-operative banks are the sleeping giant everyone ignores",
    excerpt: "Fintech chases the metro salaried customer who's already over-served. The real underwriting frontier is a co-op branch in a Tier-3 town.",
    date: "2026-08-04",
    read: "5 min read",
    image: "assets/resources/res-blog-officers.jpg",
    body: `
      <p>Every neobank is fighting over the same 60 million salaried, credit-carded, metro customers. Meanwhile India's urban and rural co-operative banks sit on deep local relationships with exactly the borrowers the mainstream models throw away, and almost no one is building for them.</p>
      <h2>Relationships the score can't see</h2>
      <p>A co-op officer knows the borrower's shop, their family, their festival cycle. That knowledge dies in a spreadsheet. Dhana's bet is to <em>amplify</em> that relationship (capture the conversation, frame the income, keep the human decision) rather than replace the officer with a national black-box model that's never seen the town.</p>
      <h2>The unglamorous frontier</h2>
      <p>It's not a flashy market. It's a better one: less competed, more underserved, and structurally aligned with lending that listens. We'd rather build here than add one more app to the metro pile-on.</p>
    `,
  },
  "collections-without-harassment": {
    type: "blog",
    category: "Opinion",
    title: "AI collections without the harassment playbook",
    excerpt: "Most 'AI collections' is just an autodialer that never gets tired of calling. That's not innovation, it's the abusive part, automated.",
    date: "2026-07-18",
    read: "6 min read",
    image: "assets/resources/res-consent-glass.jpg",
    body: `
      <p>The dirty secret of a lot of "AI collections" is that the AI part is the harassment part. Tireless auto-dialing, scripted guilt, calls to contacts who never borrowed anything. Automation makes the worst human behaviour cheaper and infinitely repeatable. Regulators are right to be circling.</p>
      <h2>A different default</h2>
      <p>Setu, Dhana's collections agent, is built the other way: it opens with context and options, not pressure. It respects calling windows and do-not-disturb by design, logs every contact, and escalates a genuinely stuck case to a human, instead of dialing the borrower's cousin.</p>
      <h2>Recovery is a relationship problem</h2>
      <p>A borrower who's treated like a person in month three is a borrower who restructures instead of ghosting. Softer isn't weaker. On real portfolios, dignity recovers more money than dialers do, and it doesn't end up in a newspaper.</p>
    `,
  },
  "compliance-as-moat": {
    type: "blog",
    category: "Perspective",
    title: "We treat RBI compliance as a moat, not a tax",
    excerpt: "Everyone complains about the Digital Lending Directions. We think they're the best thing that ever happened to a company that wants to do this right.",
    date: "2026-07-12",
    read: "4 min read",
    image: "assets/resources/res-free-ai.jpg",
    body: `
      <p>Founders love to grumble that RBI's Digital Lending Directions slow everything down. We take the opposite view: hard, enforceable rules on consent, disclosure and human accountability are a gift to anyone building the honest version of this.</p>
      <h2>Rules punish the shortcut</h2>
      <p>When consent must be explicit and logged, when a human must own the credit decision, when you can't hide the rate, the players whose whole model was the shortcut lose their edge. The discipline that used to be a cost becomes a differentiator.</p>
      <h2>Designed to support, not "certified for everything"</h2>
      <p>We're careful with our language: Dhana is <em>aligned with</em> and <em>designed to support</em> the frameworks, not "certified" for things nobody certifies. That honesty is part of the moat too: it's what a regulated buyer can actually stand behind.</p>
    `,
  },

  // ——— VIDEOS ———
  "film-relationship-layer": {
    type: "video",
    category: "Film",
    title: "Dhana, in ninety seconds",
    excerpt: "The relationship layer for BFSI: voice-first origination, consent-gated, human-decided. A short film.",
    date: "2026-08-29",
    read: "Watch · 1:28",
    image: "assets/videos/dhana-film2-poster.jpg",
    video: "assets/videos/dhana-film2.mp4",
    body: `
      <p>A short film on what Dhana is: a borrower speaks, in her own language, and a consent-gated, credit-ready file appears on a banker's desk, with a human still making the call.</p>
      <p>No forms. No black box. The voice is the product.</p>
    `,
  },
  "demo-live-call": {
    type: "video",
    category: "Live agent",
    title: "Dhana on a live call: lead capture from speech",
    excerpt: "A real product recording. Lead fields fill from speech as the call runs: disposition, income, employer, channel, language.",
    date: "2026-08-27",
    read: "Watch · demo",
    image: "assets/videos/dhana-voice-demo-1-poster.jpg",
    video: "assets/videos/dhana-voice-demo-1.mp4",
    body: `
      <p>This is not a mockup. Dhana takes a live call and populates a credit-ready lead in real time (disposition, income, employer, channel and detected language) while the conversation is still happening.</p>
      <p>The officer watches the file build itself, then decides. Nothing is auto-approved.</p>
    `,
  },
  "demo-capture-console": {
    type: "video",
    category: "Live agent",
    title: "The capture-lead console",
    excerpt: "Classify-from-speech, auto-detected language, and matched lenders on the side. The real operator console, recorded live.",
    date: "2026-08-26",
    read: "Watch · demo",
    image: "assets/videos/dhana-voice-demo-2-poster.jpg",
    video: "assets/videos/dhana-voice-demo-2.mp4",
    body: `
      <p>The operator's side of Dhana: speech is classified into structured fields, language is auto-detected, and matched lenders appear alongside, all from a running conversation.</p>
      <p>This is the console a credit desk actually works in. Recorded from the live product.</p>
    `,
  },

  // ——— NEWS ———
  "dhana-live-mrcb": {
    type: "news",
    category: "Milestone",
    title: "Dhana goes live at MRCB co-operative bank",
    excerpt: "Voice-first origination in Malayalam is running in an evening-window co-op pilot, with HITL locked on every credit decision.",
    date: "2026-08-25",
    read: "2 min read",
    image: "assets/resources/res-blog-capacity.jpg",
    body: `
      <p>Dhana is live at Mayyanad Regional Co-operative Bank (MRCB), handling inbound and scheduled voice origination in Malayalam within RBI calling windows. The pilot targets working-capital enquiries that a salary gate would otherwise filter out.</p>
      <p>Every credit-relevant outcome routes to a human maker. Dhana packages the file; the officer decides. Early themes: calling-window discipline, Malayalam pacing, and officer callbacks that actually stick.</p>
    `,
  },
  "dhana-adds-languages": {
    type: "news",
    category: "Product",
    title: "Dhana now speaks Malayalam, Hindi, Tamil and English",
    excerpt: "The relationship layer runs the full origination conversation in the borrower's language, with more Indic languages and Gulf dialects on the roadmap.",
    date: "2026-08-12",
    read: "2 min read",
    image: "assets/resources/cover-video.jpg",
    body: `
      <p>Dhana's voice agent now conducts the entire origination conversation (greeting, KYC confirmation, consent, income framing and handoff) in Malayalam, Hindi, Tamil and English. A new language is a sprint, not a rebuild: eleven Indian languages are supported, with Arabic and Gulf dialects next.</p>
      <p>Language is per-call. The same agent, tuned once, meets each borrower where they are.</p>
    `,
  },
  "altiora-launches-dhana": {
    type: "news",
    category: "Launch",
    title: "Altiora launches Dhana, the AI relationship layer for BFSI",
    excerpt: "A white-label voice-agent platform for banks, NBFCs and co-ops, operating in Indian languages, self-hosted inside the institution's perimeter.",
    date: "2026-07-30",
    read: "3 min read",
    image: "assets/resources/cover-dhana.jpg",
    body: `
      <p>Altiora Capital Solutions has launched Dhana, an AI relationship layer that lets institutions run their own voice-first origination without ripping out the core. Clients configure Dhana-branded agents, upload leads, watch calls live, and pull outcome reports, with the voice stack running on infrastructure inside India.</p>
      <p>Dhana joins the flow rather than replacing it: adapters to Finacle, LOS, CRM, bureau, DigiLocker and Account Aggregator stay inside the institution's trust boundary.</p>
    `,
  },

  // ——— EVENTS ———
  "webinar-voice-first-coops": {
    type: "event",
    category: "Webinar",
    title: "Voice-first origination for co-operative banks",
    excerpt: "A 45-minute session on running consent-gated, Malayalam-first origination inside RBI calling windows, with a live Dhana walkthrough.",
    date: "2026-09-18",
    read: "Register",
    image: "assets/resources/res-library-ribbon.jpg",
    body: `
      <p>Join the Dhana team for a practical walkthrough of voice-first origination for co-operative banks: the consent gate, twelve-month income framing, the credit-ready file, and where the human maker sits in the loop.</p>
      <p><strong>When:</strong> 18 September 2026, 4:00 PM IST · <strong>Where:</strong> Online.</p>
      <p>Bring one journey you'd like to see demoed and we'll run it live.</p>
    `,
  },
  "rbi-free-ai-roundtable": {
    type: "event",
    category: "Roundtable",
    title: "Dhana at the responsible-AI in lending roundtable",
    excerpt: "A conversation on the RBI FREE-AI framework, HITL on credit decisions, and honest compliance claims, not overclaiming certification.",
    date: "2026-09-05",
    read: "Details",
    image: "assets/resources/res-framework-scales.jpg",
    body: `
      <p>Dhana joins a roundtable on responsible AI in lending: aligning with the RBI FREE-AI committee's direction, keeping humans in the loop on credit decisions, and talking about compliance without overclaiming.</p>
      <p>We say "designed to support" and "aligned with", not "certified for everything." This session is about what that discipline looks like in practice.</p>
    `,
  },
  "demo-day": {
    type: "event",
    category: "Live demo",
    title: "Dhana demo day: book a slot",
    excerpt: "Pick one journey and one channel. We'll wire it to your stack in a sandbox and show you the metrics before you commit.",
    date: "2026-09-25",
    read: "Book",
    image: "assets/resources/res-blog-officers.jpg",
    body: `
      <p>Use Dhana for three months, look at the metrics, then decide. Demo day is a scoped, hands-on session: pick one journey (say, working-capital origination) and one channel (voice, web or WhatsApp), and we'll show it running end to end.</p>
      <p>Book a slot and tell us your stack (Finacle, LOS, CRM) and we'll scope the sandbox.</p>
    `,
  },

  // ——— FRAMEWORKS (each opens a read page with a link to the authority) ———
  "fw-free-ai": {
    type: "framework",
    category: "Framework",
    title: "RBI FREE-AI Committee Report",
    excerpt: "Board-governed AI, explainable outcomes, and clear consumer awareness when a borrower is talking to an AI relationship manager.",
    date: "2026-08-01",
    read: "Framework note",
    image: "assets/resources/res-free-ai.jpg",
    authority: { name: "Reserve Bank of India", url: "https://www.rbi.org.in/", note: "Verify the latest FREE-AI releases on the official RBI site." },
    body: `
      <p>The RBI's FREE-AI (Framework for Responsible and Ethical Enablement of AI) direction sets the tone for how regulated entities should deploy AI in financial services: with board-level ownership, explainability, and honesty with the customer.</p>
      <h2>What we design against</h2>
      <p>Three principles map directly onto how Dhana is built. <strong>Governance:</strong> deployment is owned by the institution, not a vendor black box. <strong>Explainability:</strong> every session produces an outcome a human can read and argue with. <strong>Awareness:</strong> the borrower is told, in plain language, that they are speaking with an AI relationship manager.</p>
      <h2>Honest about scope</h2>
      <p>We say <em>aligned with</em> and <em>designed to support</em>, not "certified." The credit decision stays with a human maker; Dhana packages the file and stops. Always cross-check the current text at the official source before relying on any claim.</p>
    `,
  },
  "fw-digital-lending": {
    type: "framework",
    category: "Framework",
    title: "RBI (Digital Lending) Directions, 2025",
    excerpt: "LSP/RE accountability, consent before outreach, and disciplined data practices. Dhana sits under the regulated entity, not a shadow-lender UX.",
    date: "2026-07-25",
    read: "Framework note",
    image: "assets/resources/res-lending-directions.jpg",
    authority: { name: "Reserve Bank of India", url: "https://www.rbi.org.in/", note: "Read the official Digital Lending Directions on rbi.org.in." },
    body: `
      <p>The RBI Digital Lending Directions put accountability squarely on the Regulated Entity and its Lending Service Providers: consent before outreach, transparent pricing, and an auditable trail. A lot of "instant loan" apps were built to route around exactly this. Dhana is built to sit inside it.</p>
      <h2>How Dhana stays on the happy path</h2>
      <ul>
        <li>Consent is captured before any outbound voice or WhatsApp contact.</li>
        <li>Every soft-bureau and Account Aggregator fetch is logged with a source and timestamp.</li>
        <li>Human-in-the-loop is required on any credit-relevant decision; the model never auto-approves.</li>
      </ul>
      <h2>Under the regulated entity, by design</h2>
      <p>Dhana runs inside the institution's perimeter as its agent, not as a parallel lender. That structural choice is what keeps the directions a design constraint rather than a compliance scramble.</p>
    `,
  },
  "fw-dpdp": {
    type: "framework",
    category: "Framework",
    title: "Digital Personal Data Protection Act, 2023",
    excerpt: "Purpose limitation, consent, and deletion rights in the session flow. Retention follows the institution's policy; Dhana doesn't invent a parallel data estate.",
    date: "2026-07-20",
    read: "Framework note",
    image: "assets/resources/res-dpdp-shield.jpg",
    authority: { name: "MeitY (Government of India)", url: "https://www.meity.gov.in/", note: "Government of India DPDP materials are published by MeitY." },
    body: `
      <p>The DPDP Act, 2023 gives Indian borrowers real rights over their personal data: consent, purpose limitation, and deletion. For a voice agent that hears a lot in a single call, those rights have to be built into the flow, not bolted on afterwards.</p>
      <h2>What that means in a Dhana session</h2>
      <p>Data is collected for a stated purpose and bound to it. Consent is explicit and revocable. Retention follows the institution's own policy; by default Dhana does not create a separate data estate outside your perimeter, so there is no shadow copy to reconcile against a deletion request.</p>
      <h2>Your policy, enforced</h2>
      <p>Because the data stays inside your trust boundary, your existing DPDP posture extends to Dhana rather than competing with it. Check the current statutory text and rules at the official MeitY source.</p>
    `,
  },
  "fw-self-host": {
    type: "framework",
    category: "Deployment",
    title: "Self-host / in-perimeter",
    excerpt: "Customer data need not leave institution servers. On-prem, private VPC, or managed cloud; adapters stay inside your trust boundary.",
    date: "2026-07-15",
    read: "Deployment note",
    image: "assets/resources/res-vault-perimeter.jpg",
    authority: { name: "RBI (IT & cyber governance)", url: "https://www.rbi.org.in/", note: "Cross-check RBI's IT governance and outsourcing guidance at the official source." },
    body: `
      <p>The safest place for a borrower's conversation is inside the bank that's already trusted with their money. Dhana is built to deploy there: on-prem, in a private VPC, or in a managed cloud for pilots. Your choice.</p>
      <h2>Adapters, not exfiltration</h2>
      <p>Connections to Finacle / CBS, LOS, CRM, bureau, DigiLocker and Account Aggregator all live inside your perimeter. Dhana joins the flow through adapters; it does not copy your customer data out to a vendor cloud to function.</p>
      <h2>One perimeter, many products</h2>
      <p>Because the control plane and the trust boundary don't change between products, adding insurance, investments or collections later doesn't restart the security review. See the live architecture diagram on the product page.</p>
    `,
  },
  "fw-consent": {
    type: "framework",
    category: "Practice",
    title: "Consent before outreach",
    excerpt: "Outbound voice and WhatsApp only after an explicit, logged consent basis, purpose-bound, revocable, and visible on the credit-ready file.",
    date: "2026-07-10",
    read: "Practice note",
    image: "assets/resources/res-selfhost.jpg",
    authority: { name: "Reserve Bank of India", url: "https://www.rbi.org.in/", note: "Cross-check consent and LSP conduct duties at the official source." },
    body: `
      <p>Reaching out to a borrower is not a neutral act; it's regulated conduct. Dhana treats consent as a gate, not a footnote: no outbound voice or WhatsApp contact happens without an explicit, logged basis.</p>
      <h2>What "consent" means here</h2>
      <p>It is purpose-bound (tied to a specific reason for contact), revocable (the borrower can stop it and Dhana stops), and visible: the consent artifact travels with the credit-ready file so an officer and an auditor can both see it.</p>
      <h2>Said out loud</h2>
      <p>Where consent is asked mid-conversation (say, before a soft bureau pull), Dhana asks in the borrower's own language and records the answer with a timestamp. That's what turns a conversation into evidence.</p>
    `,
  },
  "fw-hitl": {
    type: "framework",
    category: "Control",
    title: "Human-in-the-loop on credit decisions",
    excerpt: "Dhana assists bankers and makers; it never approves, declines, or revises a decision. Approve/decline paths are locked and escalation keywords route to a human.",
    date: "2026-07-05",
    read: "Control note",
    image: "assets/resources/res-hitl-stamp.jpg",
    authority: { name: "Reserve Bank of India (FREE-AI)", url: "https://www.rbi.org.in/", note: "Human oversight expectations are set out in RBI's responsible-AI direction." },
    body: `
      <p>"Human in the loop" is only real if the human can actually change the outcome. In Dhana, the credit call is locked to a human maker: the agent cannot approve, decline, or revise a decision, and that lock cannot be turned off when you configure the agent.</p>
      <h2>Where the human sits</h2>
      <p>Dhana packages the exception brief (bureau, income frame, integrity, and why the standard gate misfired) and hands it over. Overriding the model is cheap and normal, not a career risk. Complaint and regulator keywords escalate to a human immediately.</p>
      <h2>Slower, on purpose</h2>
      <p>Keeping a maker in the loop is slower than auto-approval. It is also the version we'd want if it were our loan being decided, and the direction responsible-AI guidance is pushing everyone toward.</p>
    `,
  },
};

// Section config for the Resources page (in render order).
export const RES_SECTIONS = [
  { id: "blog", label: "Blog", type: "blog", title: "Field notes & perspective", lead: "How we think about voice-first, consent, and credit that listens." },
  { id: "news", label: "News", type: "news", title: "News & announcements", lead: "Milestones, launches and product updates." },
  { id: "events", label: "Events", type: "event", title: "Events & webinars", lead: "Come see Dhana live, or catch us at a roundtable." },
];
