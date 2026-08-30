export const COPY_V2 = {
  en: {
    sample: "Hear this page",
    hero: {
      sub: "One AI relationship manager for the whole loan — she sells, evaluates, onboards, converts and recovers.",
    },
    lifecycle: {
      eyebrow: "One RM. Five jobs.",
      title: "She doesn’t do one call. She does the whole book.",
      caption: "Pick a job. Watch the conversation, and the outcome it leaves behind. Scripted walkthrough.",
      tabs: ["Sales", "Conversion", "Onboarding", "Evaluation", "Recovery"],
      outcomeLabel: "Outcome",
      stages: [
        {
          id: "sales",
          color: "#f9a900",
          title: "She opens the conversation.",
          desc: "Inbound or outbound, she qualifies need, amount intent and timeline — politely persistent, in any language.",
          convo: [
            { who: "dhana", text: "Hi! Looking at a personal loan, or just exploring?" },
            { who: "you", text: "Exploring… maybe five lakh." },
            { who: "dhana", text: "Noted. What’s driving it — renovation, or something else?" },
            { who: "you", text: "Home renovation, mostly." },
            { who: "dhana", text: "Perfect. I’ll hold that and line up options for tomorrow morning." },
          ],
          outcome: [
            ["Lead status", "Qualified · high intent"],
            ["Need", "₹5 lakh · renovation"],
            ["Next step", "Callback booked · 10 am"],
          ],
        },
        {
          id: "conversion",
          color: "#d8441f",
          title: "She closes with options.",
          desc: "Offers compared out loud, objections handled, follow-ups until there’s a decision — never pressure, always presence.",
          convo: [
            { who: "dhana", text: "Two lenders fit your EMI. One disburses same-day." },
            { who: "you", text: "The rate feels a bit high." },
            { who: "dhana", text: "Fair. A longer tenure brings the EMI down — want to see both side by side?" },
            { who: "you", text: "Show me the longer one." },
            { who: "dhana", text: "Sent to your screen. Take your time — I’ll hold the offer." },
          ],
          outcome: [
            ["Offer", "Accepted · tenure extended"],
            ["Objection", "Rate → resolved via tenure"],
            ["Status", "E-sign pending"],
          ],
        },
        {
          id: "onboarding",
          color: "#048244",
          title: "She runs the paperwork.",
          desc: "KYC, documents, verification — collected by voice, filled on the page. No seventeen fields, no branch trip.",
          convo: [
            { who: "dhana", text: "Two things left: identity and address proof. Upload here, or I walk you through it?" },
            { who: "you", text: "I’ll upload now." },
            { who: "dhana", text: "Both received and readable. Your application is complete." },
            { who: "you", text: "That’s it?" },
            { who: "dhana", text: "That’s it. Verification usually closes within a day — I’ll keep you posted." },
          ],
          outcome: [
            ["KYC", "Complete · 2 documents verified"],
            ["Application", "Submitted · #4821"],
            ["Branch visits", "Zero"],
          ],
        },
        {
          id: "evaluation",
          color: "#1f3a6f",
          title: "She checks before anyone hopes.",
          desc: "Soft bureau, eligibility and repayment capacity — consent first, score untouched, answers in minutes.",
          convo: [
            { who: "dhana", text: "Quick check before offers: any EMIs running today?" },
            { who: "you", text: "One car loan." },
            { who: "dhana", text: "Thanks. With your permission I’ll run a soft check — no impact on your score." },
            { who: "you", text: "Go ahead." },
            { who: "dhana", text: "Done. You qualify comfortably — here’s what that means in rupees." },
          ],
          outcome: [
            ["Bureau", "Soft pull · consent logged"],
            ["Eligibility", "Qualified · comfortable margin"],
            ["Time taken", "Under two minutes"],
          ],
        },
        {
          id: "recovery",
          color: "#bb5b02",
          title: "She recovers, with grace.",
          desc: "Reminders before due dates, promises logged, restructuring paths offered — inside calling windows, every time.",
          convo: [
            { who: "dhana", text: "Your EMI is due this Friday. Want me to set a reminder?" },
            { who: "you", text: "Salary comes Saturday." },
            { who: "dhana", text: "Understood — promise for Saturday noted. I’ll check in at 11 am, not before." },
            { who: "you", text: "Thank you for understanding." },
            { who: "dhana", text: "Of course. If Saturday slips, we can look at a small restructure together." },
          ],
          outcome: [
            ["Promise-to-pay", "Logged · Sat 11 am"],
            ["Calling window", "Respected"],
            ["Escalation", "None needed"],
          ],
        },
      ],
    },
    stats: {
      eyebrow: "By design",
      title: "Built to move at conversation speed.",
      items: [
        { v: "5", label: "languages, live from day one", sub: "EN · हिन्दी · മലയാളം · தமிழ் · عربي" },
        { v: "50+", label: "lender partners compared", sub: "banks · NBFCs · fintechs" },
        { v: "0", label: "form fields before an answer", sub: "the page fills itself" },
        { v: "24×7", label: "she never closes at 4:30", sub: "no branch hours" },
      ],
    },
    compare: {
      eyebrow: "The old way vs Dhana",
      title: "You could stand in a queue.",
      caption: "What used to take days now takes a conversation.",
      oldCol: "Branch era",
      newCol: "With Dhana",
      cta: "Talk to Dhana",
      rows: [
        { k: "Know your eligibility", old: "Branch visit, 3–5 days", nw: "One conversation, minutes" },
        { k: "Lenders compared", old: "1–2 — whoever you walk into", nw: "50+ at once" },
        { k: "Language", old: "English, at best", nw: "Yours — five to start" },
        { k: "Paperwork", old: "Seventeen fields before answers", nw: "Answers first, forms later" },
        { k: "Working hours", old: "10 am – 5 pm, Mon–Sat", nw: "Whenever you are" },
      ],
    },
    press: {
      eyebrow: "Backing",
      title: "In good company.",
      items: [
        { t: "Manorama Online Elevate", d: "Selected from 500+ applicants for Kerala’s premier investment showcase." },
        { t: "Kerala Startup Mission", d: "Supported by India’s first and largest startup incubator." },
        { t: "JAIN University", d: "Incubated through the Elevate innovation programme." },
        { t: "Group Meeran", d: "Backed by a diversified group with decades of trust." },
      ],
    },
  },
  hi: {
    sample: "यह पेज सुनें",
    hero: {
      sub: "पूरे लोन-चक्र के लिए एक AI RM — बिक्री, मूल्यांकन, ऑनबोर्डिंग, कन्वर्ज़न और रिकवरी।",
    },
    lifecycle: {
      eyebrow: "एक RM। पाँच काम।",
      title: "वह एक कॉल नहीं करती। पूरी बुक सँभालती है।",
      caption: "कोई काम चुनिए। बातचीत और उसका नतीजा देखिए। स्क्रिप्टेड डेमो।",
      tabs: ["सेल्स", "कन्वर्ज़न", "ऑनबोर्डिंग", "मूल्यांकन", "रिकवरी"],
      outcomeLabel: "नतीजा",
      stages: [
        {
          id: "sales", color: "#f9a900",
          title: "वह बातचीत शुरू करती है।",
          desc: "इनबाउंड या आउटबाउंड — ज़रूरत, राशि और समय समझती है। भाषा कोई भी हो।",
          convo: [
            { who: "dhana", text: "नमस्ते! पर्सनल लोन देख रहे हैं, या बस जानकारी?" },
            { who: "you", text: "बस देख रहा हूँ… शायद पाँच लाख।" },
            { who: "dhana", text: "नोट कर लिया। किसके लिए — घर का सुधार, या और कुछ?" },
            { who: "you", text: "घर का सुधार।" },
            { who: "dhana", text: "ठीक। यह रख लेती हूँ — कल सुबह विकल्प तैयार रखूँगी।" },
          ],
          outcome: [["लीड", "क्वालिफाईड · हाई इंटेंट"], ["ज़रूरत", "₹5 लाख · घर सुधार"], ["अगला कदम", "कॉलबैक · सुबह 10 बजे"]],
        },
        {
          id: "conversion", color: "#d8441f",
          title: "वह विकल्प देकर बंद कराती है।",
          desc: "ऑफ़र खुलकर तुलना, आपत्तियों का जवाब, फ़ैसले तक फ़ॉलो-अप — दबाव नहीं, मौजूदगी।",
          convo: [
            { who: "dhana", text: "आपकी EMI पर दो लेंडर फिट हैं। एक उसी दिन disbursal करता है।" },
            { who: "you", text: "दर थोड़ी ज़्यादा लग रही है।" },
            { who: "dhana", text: "जायज़ है। लंबी अवधि EMI घटा देगी — दोनों साथ देखें?" },
            { who: "you", text: "लंबी दिखाइए।" },
            { who: "dhana", text: "स्क्रीन पर भेज दिया। ऑफ़र होल्ड पर है।" },
          ],
          outcome: [["ऑफ़र", "स्वीकृत · अवधि बढ़ी"], ["आपत्ति", "दर → अवधि से हल"], ["स्थिति", "ई-साइन बाकी"]],
        },
        {
          id: "onboarding", color: "#048244",
          title: "कागज़ी काम वह चलाती है।",
          desc: "KYC, दस्तावेज़, सत्यापन — आवाज़ से इकट्ठा, पेज पर भरा। ब्रांच नहीं।",
          convo: [
            { who: "dhana", text: "दो चीज़ें बाकी: पहचान और पता प्रमाण। यहीं अपलोड करें, या मैं चलाकर बताऊँ?" },
            { who: "you", text: "अभी अपलोड करता हूँ।" },
            { who: "dhana", text: "दोनों मिल गए। आवेदन पूरा हुआ।" },
            { who: "you", text: "बस?" },
            { who: "dhana", text: "बस। सत्यापन आमतौर पर एक दिन में — ख़बर रखूँगी।" },
          ],
          outcome: [["KYC", "पूरा · 2 दस्तावेज़ सत्यापित"], ["आवेदन", "#4821 जमा"], ["ब्रांच विज़िट", "शून्य"]],
        },
        {
          id: "evaluation", color: "#1f3a6f",
          title: "उम्मीद से पहले जाँच।",
          desc: "सॉफ्ट ब्यूरो, पात्रता, चुकौती क्षमता — पहले सहमति, स्कोर अछूता, जवाब मिनटों में।",
          convo: [
            { who: "dhana", text: "ऑफ़र से पहले एक छोटी जाँच: अभी कोई EMI चल रही है?" },
            { who: "you", text: "एक कार लोन।" },
            { who: "dhana", text: "धन्यवाद। इजाज़त से सॉफ्ट चेक करूँ — स्कोर पर असर शून्य।" },
            { who: "you", text: "कर लीजिए।" },
            { who: "dhana", text: "हो गया। आप आराम से क्वालिफाई करते हैं।" },
          ],
          outcome: [["ब्यूरो", "सॉफ्ट पुल · सहमति लॉग"], ["पात्रता", "क्वालिफाई · आराम की गुंजाइश"], ["समय", "दो मिनट से कम"]],
        },
        {
          id: "recovery", color: "#bb5b02",
          title: "वह वापस पाती है — सलीके से।",
          desc: "तारीख़ से पहले अनुस्मारक, वादा लॉग, पुनर्संरचना के रास्ते — हर बार कॉलिंग विंडो के भीतर।",
          convo: [
            { who: "dhana", text: "आपकी EMI शुक्रवार को है। रिमाइंडर लगा दूँ?" },
            { who: "you", text: "सैलरी शनिवार आती है।" },
            { who: "dhana", text: "समझ गई — शनिवार का वादा नोट। सुबह 11 बजे फ़ोन करूँगी, उससे पहले नहीं।" },
            { who: "you", text: "समझने के लिए धन्यवाद।" },
            { who: "dhana", text: "अगर शनिवार फिसले, तो छोटा पुनर्गठन साथ देखेंगे।" },
          ],
          outcome: [["भुगतान-वादा", "लॉग · शनि 11 बजे"], ["कॉलिंग विंडो", "पालना हुआ"], ["एस्केलेशन", "ज़रूरत नहीं"]],
        },
      ],
    },
    stats: {
      eyebrow: "डिज़ाइन से",
      title: "बातचीत की रफ़्तार से चलने के लिए बना।",
      items: [
        { v: "5", label: "भाषाएँ, पहले दिन से", sub: "EN · हिन्दी · മലയാളം · தமிழ் · عربي" },
        { v: "50+", label: "लेंडर पार्टनर की तुलना", sub: "बैंक · NBFC · फिनटेक" },
        { v: "0", label: "जवाब से पहले फ़ॉर्म फ़ील्ड", sub: "पेज खुद भरता है" },
        { v: "24×7", label: "4:30 पर बंद नहीं होती", sub: "ब्रांच टाइम नहीं" },
      ],
    },
    compare: {
      eyebrow: "पुराना तरीका vs Dhana",
      title: "आप कतार में खड़े हो सकते थे।",
      caption: "जो दिनों लेता था, अब एक बातचीत लेता है।",
      oldCol: "ब्रांच ज़माना",
      newCol: "Dhana के साथ",
      cta: "Dhana से बात करें",
      rows: [
        { k: "पात्रता जानिए", old: "ब्रांच जाएँ, 3–5 दिन", nw: "एक बातचीत, कुछ मिनट" },
        { k: "लेंडर्स की तुलना", old: "1–2 — जिस दुकान पर ठहरें", nw: "50+ एक साथ" },
        { k: "भाषा", old: "चलेगा तो अंग्रेज़ी", nw: "आपकी — पाँच से शुरू" },
        { k: "कागज़ी काम", old: "जवाब से पहले सत्रह फ़ील्ड", nw: "पहले जवाब, फ़ॉर्म बाद में" },
        { k: "समय", old: "सुबह 10 – शाम 5, सोम–शनि", nw: "जब आप तैयार हों" },
      ],
    },
    press: {
      eyebrow: "साथ",
      title: "अच्छी संगति में।",
      items: [
        { t: "Manorama Online Elevate", d: "500+ आवेदकों में से चुने गए — केरल का प्रमुख इन्वेस्टमेंट शोकेस।" },
        { t: "Kerala Startup Mission", d: "भारत के सबसे बड़े स्टार्टअप इन्क्यूबेटर का समर्थन।" },
        { t: "JAIN University", d: "Elevate इनोवेशन कार्यक्रम से इन्क्यूबेटेड।" },
        { t: "Group Meeran", d: "दशकों के भरोसे वाले बिज़नेस ग्रुप का साथ।" },
      ],
    },
  },
  ml: {
    sample: "ഈ പേജ് കേൾക്കൂ",
    hero: {
      sub: "വായ്പ ജീവിതചക്രം മുഴുവനുള്ള AI RM — വിൽപ്പന, വിലയിരുത്തൽ, ഓൺബോർഡിംഗ്, പരിവർത്തനം, വസൂലി.",
    },
    lifecycle: {
      eyebrow: "ഒരു RM. അഞ്ച് ജോലികൾ.",
      title: "ഒരു കോൾ മാത്രമല്ല — മുഴുവൻ ബുക്ക്.",
      caption: "ജോലി തിരഞ്ഞെടുക്കൂ. സംഭാഷണവും ഫലവും കാണൂ. സ്ക്രിപ്റ്റഡ് ഡെമോ.",
      tabs: ["വിൽപ്പന", "പരിവർത്തനം", "ഓൺബോർഡിംഗ്", "വിലയിരുത്തൽ", "വസൂലി"],
      outcomeLabel: "ഫലം",
      stages: [
        {
          id: "sales", color: "#f9a900",
          title: "സംഭാഷണം അവൾ തുടങ്ങും.",
          desc: "ഇൻബൗണ്ടോ ഔട്ട്ബൗണ്ടോ — ആവശ്യം, തുക, സമയം മനസ്സിലാക്കും. ഏത് ഭാഷയിലും.",
          convo: [
            { who: "dhana", text: "ഹായ്! പേഴ്‌സണൽ ലോൺ ആണോ, വെറുതെ നോട്ടമോ?" },
            { who: "you", text: "വെറുതെ… അഞ്ച് ലക്ഷം വരും." },
            { who: "dhana", text: "ശരി. എന്തിന് — വീട് നന്നാക്കാനോ?" },
            { who: "you", text: "വീട് നന്നാക്കാൻ." },
            { who: "dhana", text: "ക്കറ്റു. നാളെ രാവിലെ ഓപ്ഷനുകൾ തയ്യാറാക്കാം." },
          ],
          outcome: [["ലീഡ്", "ക്വാളിഫൈഡ് · ഹൈ ഇൻ്റൻ്റ്"], ["ആവശ്യം", "₹5 ലക്ഷം · വീട് നന്നാക്കൽ"], ["അടുത്ത പടി", "കോൾബാക്ക് · രാവിലെ 10"]],
        },
        {
          id: "conversion", color: "#d8441f",
          title: "ഓപ്ഷനുകൾ പറഞ്ഞ് അവസാനിപ്പിക്കും.",
          desc: "ഓഫറുകൾ തുറന്നു താരതമ്യം, എതിർപ്പുകൾക്ക് മറുപടി, തീരുമാനം വരെ ഫോളോ-അപ്പ്.",
          convo: [
            { who: "dhana", text: "നിങ്ങളുടെ EMI-യ്ക്ക് രണ്ട് ലെൻഡർമാർ. ഒരാൾ അന്നേദിവസം തരും." },
            { who: "you", text: "നിരക്ക് കുറച്ച് കൂടുതലാണ്." },
            { who: "dhana", text: "സത്യം. ദൈർഘ്യം കൂട്ടിയാൽ EMI കുറയും — രണ്ടും കൂടെ കാണോ?" },
            { who: "you", text: "ദൈർഘ്യം കൂടിയത് കാണിക്കൂ." },
            { who: "dhana", text: "സ്ക്രീനിൽ അയച്ചു. ഓഫർ ഹോൾഡിലാണ്." },
          ],
          outcome: [["ഓഫർ", "സ്വീകരിച്ചു · ദൈർഘ്യം കൂട്ടി"], ["എതിർപ്പ്", "നിരക്ക് → ദൈർഘ്യം വഴി"], ["നില", "ഇ-സൈൻ ബാക്കി"]],
        },
        {
          id: "onboarding", color: "#048244",
          title: "രേഖകൾ അവൾ നടത്തും.",
          desc: "KYC, രേഖകൾ, സ്ഥിരീകരണം — ശബ്ദത്തിലൂടെ ശേഖരിപ്പ്, പേജിൽ നിരപ്പ്. ബ്രാഞ്ചില്ല.",
          convo: [
            { who: "dhana", text: "രണ്ട് കാര്യങ്ങൾ: ഐഡൻ്റിറ്റിയും വിലാസ തെളിവും. ഇവിടെ അപ്ലോഡ് ചെയ്യാമോ?" },
            { who: "you", text: "ഇപ്പോൾ ചെയ്യാം." },
            { who: "dhana", text: "രണ്ടും ലഭിച്ചു. അപേക്ഷ പൂർത്തിയായി." },
            { who: "you", text: "ഇത്രയോ?" },
            { who: "dhana", text: "ഇത്രയേ. സ്ഥിരീകരണം സാധാരണ ഒരു ദിവസം — അറിയിക്കാം." },
          ],
          outcome: [["KYC", "പൂർത്തം · 2 രേഖകൾ"], ["അപേക്ഷ", "#4821 സമർപ്പിച്ചു"], ["ബ്രാഞ്ച് സന്ദർശനം", "പൂജ്യം"]],
        },
        {
          id: "evaluation", color: "#1f3a6f",
          title: "പ്രതീക്ഷയ്ക്ക് മുമ്പേ പരിശോധന.",
          desc: "സോഫ്റ്റ് ബ്യൂറോ, യോഗ്യത, തിരിച്ചടവ് ശേഷി — ആദ്യം സമ്മതം, സ്കോർ സ്പർശിക്കില്ല.",
          convo: [
            { who: "dhana", text: "ഓഫറിന് മുമ്പ് ഒരു ചെറിയ ചോദ്യം: ഇപ്പോൾ ഏതെങ്കിലും EMI ഉണ്ടോ?" },
            { who: "you", text: "ഒരു കാർ ലോൺ." },
            { who: "dhana", text: "നന്ദി. സമ്മതത്തോടെ സോഫ്റ്റ് ചെക്ക് — സ്കോറിന് ആഘാതമില്ല." },
            { who: "you", text: "ചെയ്യൂ." },
            { who: "dhana", text: "കഴിഞ്ഞു. നിങ്ങൾ സുഖമായി യോഗ്യത നേടുന്നു." },
          ],
          outcome: [["ബ്യൂറോ", "സോഫ്റ്റ് പുൾ · സമ്മതം ലോഗ്"], ["യോഗ്യത", "ക്വാളിഫൈഡ് · സുരക്ഷിത മാർജിൻ"], ["സമയം", "രണ്ട് മിനിറ്റിൽ താഴെ"]],
        },
        {
          id: "recovery", color: "#bb5b02",
          title: "മാന്യമായി വസൂലി ചെയ്യും.",
          desc: "അടയ്ക്കൽ തീയതിക്ക് മുമ്പ് ഓർമ്മിപ്പിക്കൽ, വാഗ്ദാന രേഖപ്പെടുത്തൽ, പുനർഘടന വഴികൾ — വിൻഡോ പാലിച്ച്.",
          convo: [
            { who: "dhana", text: "വെള്ളിയാഴ്ച EMI ആണല്ലോ. ഓർമ്മിപ്പിക്കട്ടെ?" },
            { who: "you", text: "ശനിയാഴ്ചയാണ് ശമ്പളം." },
            { who: "dhana", text: "മനസ്സിലായി — ശനിയാഴ്ച വാഗ്ദാനം രേഖപ്പെടുത്തി. രാവിലെ 11-ന് വിളിക്കാം." },
            { who: "you", text: "മനസ്സിലാക്കിയതിന് നന്ദി." },
            { who: "dhana", text: "ശനി തെറ്റിയാൽ ചെറിയ പുനർഘടന ഒന്നായി നോക്കാം." },
          ],
          outcome: [["വാഗ്ദാനം", "രേഖപ്പെടുത്തി · ശനി 11"], ["കോളിംഗ് വിൻഡോ", "പാലിച്ചു"], ["എസ്കലേഷൻ", "ആവശ്യമില്ല"]],
        },
      ],
    },
    stats: {
      eyebrow: "രൂപകൽപ്പനയിൽ",
      title: "സംഭാഷണത്തിൻ്റെ വേഗതയിൽ പ്രവർത്തിക്കാൻ നിർമ്മിച്ചത്.",
      items: [
        { v: "5", label: "ഭാഷകൾ, ഒന്നാം ദിനം മുതൽ", sub: "EN · हिन्दी · മലയാളം · தமிழ் · عربي" },
        { v: "50+", label: "ലെൻഡർ പങ്കാളികളുടെ താരതമ്യം", sub: "ബാങ്കുകൾ · NBFC · ഫിൻടെക്" },
        { v: "0", label: "ഉത്തരത്തിന് മുമ്പുള്ള ഫോം ഫീൽഡുകൾ", sub: "പേജ് സ്വയം നിറയുന്നു" },
        { v: "24×7", label: "4:30-ന് അടയ്ക്കുന്നില്ല", sub: "ബ്രാഞ്ച് സമയമില്ല" },
      ],
    },
    compare: {
      eyebrow: "പഴയ വഴി vs Dhana",
      title: "നിങ്ങൾക്ക് ക്യൂവിൽ നിർന്നു കോളാമായിരുന്നു.",
      caption: "ദിവസങ്ങളെടുത്തത് ഇപ്പോൾ ഒരു സംഭാഷണം.",
      oldCol: "ബ്രാഞ്ച് കാലം",
      newCol: "Dhanaയോടെ",
      cta: "Dhanaയോട് സംസാരിക്കുക",
      rows: [
        { k: "യോഗ്യത അറിയാം", old: "ബ്രാഞ്ച് സന്ദർശനം, 3–5 ദിവസം", nw: "ഒരു സംഭാഷണം, മിനിറ്റുകൾ" },
        { k: "ലെൻഡർമാരുടെ താരതമ്യം", old: "1–2 — കയറുന്ന ഇടം", nw: "50+ ഒരുമിച്ച്" },
        { k: "ഭാഷ", old: "പറ്റിയാൽ ഇംഗ്ലീഷ്", nw: "നിങ്ങളുടേത് — അഞ്ചിൽ തുടങ്ങും" },
        { k: "രേഖകൾ", old: "ഉത്തരത്തിന് മുമ്പ് പതിനേഴ് ഫീൽഡ്", nw: "ആദ്യം ഉത്തരം, ഫോം പിന്നെ" },
        { k: "പ്രവർത്തന സമയം", old: "രാവിലെ 10 – വൈകുന്നേരം 5", nw: "നിങ്ങൾക്ക് പറ്റുന്ന സമയം" },
      ],
    },
    press: {
      eyebrow: "പിന്തുണ",
      title: "നല്ല കൂട്ടിൽ.",
      items: [
        { t: "Manorama Online Elevate", d: "500+ അപേക്ഷകരിൽ നിന്ന് തിരഞ്ഞെടുക്കപ്പെട്ടു — കേരളത്തിലെ പ്രധാന നിക്ഷേപ വേദി." },
        { t: "Kerala Startup Mission", d: "ഇന്ത്യയിലെ ആദ്യത്തെയും വലിയതുമായ ഇൻക്യുബേറ്ററുടെ പിന്തുണ." },
        { t: "JAIN University", d: "Elevate ഇന്നൊവേഷൻ പ്രോഗ്രാമിലൂടെ ഇൻക്യുബേറ്റഡ്." },
        { t: "Group Meeran", d: "പതിറ്റാണ്ടുകളുടെ വിശ്വാസ്യതയുള്ള ബിസിനസ് ഗ്രൂപ്പിൻ്റെ കൂടെ." },
      ],
    },
  },
  ta: {
    sample: "இந்தப் பக்கத்தைக் கேளுங்கள்",
    hero: {
      sub: "கடன் வாழ்க்கைச் சுழற்சிக்கு ஒரு AI RM — விற்பனை, மதிப்பீடு, ஆன்போர்டிங், மாற்றம், மீட்பு.",
    },
    lifecycle: {
      eyebrow: "ஒரு RM. ஐந்து வேலை.",
      title: "ஒரு அழைப்பு அல்ல — முழு புத்தகம்.",
      caption: "ஒரு வேலையைத் தேர்ந்தெடுங்கள். உரையாடலையும் விளைவையும் பாருங்கள். ஸ்கிரிப்ட் டெமோ.",
      tabs: ["விற்பனை", "மாற்றம்", "ஆன்போர்டிங்", "மதிப்பீடு", "மீட்பு"],
      outcomeLabel: "விளைவு",
      stages: [
        {
          id: "sales", color: "#f9a900",
          title: "உரையாடலை அவள் தொடங்குவாள்.",
          desc: "இன்பவுண்ட்/அவுட்பவுண்ட் — தேவை, தொகை, நேரம் புரிந்துகொள்வாள். எந்த மொழியிலும்.",
          convo: [
            { who: "dhana", text: "வணக்கம்! தனிநபர் கடனா, வெறும் விசாரணையா?" },
            { who: "you", text: "வெறும் விசாரணை… ஐந்து லட்சம் வரை." },
            { who: "dhana", text: "குறித்துக்கொண்டேன். எதற்கு — வீடு புதுப்பிப்பா?" },
            { who: "you", text: "வீட்டு புதுப்பிப்புதான்." },
            { who: "dhana", text: "சரி. நாளை காலை விருப்பங்கள் தயாராக வைக்கிறேன்." },
          ],
          outcome: [["லீட்", "தகுதி · உயர் நோக்கம்"], ["தேவை", "₹5 லட்சம் · வீடு"], ["அடுத்த படி", "கால்பேக் · காலை 10"]],
        },
        {
          id: "conversion", color: "#d8441f",
          title: "விருப்பங்களால் முடிப்பாள்.",
          desc: "சலுகைகள் வெளிப்படை ஒப்பீடு, எதிர்ப்புகளுக்கு பதில், முடிவு வரை தொடர்பு.",
          convo: [
            { who: "dhana", text: "உங்கள் EMI-க்கு இரண்டு வழங்குநர்கள். ஒருவர் அன்றே தருவார்." },
            { who: "you", text: "விகிதம் கொஞ்சம் அதிகம்." },
            { who: "dhana", text: "மெய்தான். கால அளவு நீட்டினால் EMI குறையும் — இரண்டும் பார்க்கவா?" },
            { who: "you", text: "நீட்டியதைக் காட்டுங்கள்." },
            { who: "dhana", text: "திரையில் அனுப்பிவிட்டேன். ஆஃபர் காத்திருக்கும்." },
          ],
          outcome: [["சலுகை", "ஏற்கப்பட்டது · காலம் நீட்டித்தது"], ["எதிர்ப்பு", "விகிதம் → காலத்தால் தீர்வு"], ["நிலை", "இ-சைன் நிலுவை"]],
        },
        {
          id: "onboarding", color: "#048244",
          title: "ஆவணங்களை அவள் நடத்துவாள்.",
          desc: "KYC, ஆவணங்கள், சரிபார்ப்பு — குரலில் சேகரிப்பு, பக்கத்தில் நிரப்பு. கிளை இல்லை.",
          convo: [
            { who: "dhana", text: "இரண்டு மட்டும்: அடையாளம், முகவர் சான்று. இங்கே பதிவேற்றவா, நான் வழிகாட்டவா?" },
            { who: "you", text: "இப்போதே செய்கிறேன்." },
            { who: "dhana", text: "இரண்டும் கிடைத்தன. விண்ணப்பம் முழுமை." },
            { who: "you", text: "அவ்வளவுதானா?" },
            { who: "dhana", text: "அவ்வளவுதான். சரிபார்ப்பு பொதுவாக ஒரு நாளில் — தெரிவிப்பேன்." },
          ],
          outcome: [["KYC", "முழுமை · 2 ஆவணம்"], ["விண்ணப்பம்", "#4821 சமர்ப்பிப்பு"], ["கிளை வருகை", "பூஜ்ஜியம்"]],
        },
        {
          id: "evaluation", color: "#1f3a6f",
          title: "நம்பிக்கைக்கு முன் சரிபார்ப்பு.",
          desc: "மென் பீரோ, தகுதி, திருப்பிச் செலுத்தும் திறன் — முதலில் சம்மதம், மதிப்பெண் பாதிப்பில்லை.",
          convo: [
            { who: "dhana", text: "சலுகைக்கு முன் ஒரு சிறு வினா: இப்போது ஏதும் EMI உண்டா?" },
            { who: "you", text: "ஒரு கார் கடன்." },
            { who: "dhana", text: "நன்றி. அனுமதியோடு மென் செக் — மதிப்பெண்ணுக்கு பாதிப்பில்லை." },
            { who: "you", text: "செய்யுங்கள்." },
            { who: "dhana", text: "முடிந்தது. நீங்கள் வசதியாக தகுதி பெறுகிறீர்கள்." },
          ],
          outcome: [["பீரோ", "மென் புல் · சம்மதம் பதிவு"], ["தகுதி", "தேர்வு · பாதுகாப்பு இடைவெளி"], ["நேரம்", "இரு நிமிடத்திற்குள்"]],
        },
        {
          id: "recovery", color: "#bb5b02",
          title: "கண்ணியமாக மீட்பாள்.",
          desc: "நிலுவைக்கு முன் நினைவூட்டல், வாக்கு பதிவு, மறுசீரமைப்பு வழிகள் — அழைப்பு நேரத்திற்குள் எப்போதும்.",
          convo: [
            { who: "dhana", text: "வெள்ளிக்கிழமை EMI. நினைவூட்டல் வேண்டுமா?" },
            { who: "you", text: "சனிக்கிழமை சம்பளம்." },
            { who: "dhana", text: "புரிந்தது — சனிக்கிழமை வாக்கு பதிவு. காலை 11-க்கு அழைப்பேன், முன்னரில்லை." },
            { who: "you", text: "புரிந்துகொண்டதற்கு நன்றி." },
            { who: "dhana", text: "சனி தவறினால் சிறு மறுசீரமைப்பு சேர்ந்து பார்ப்போம்." },
          ],
          outcome: [["வாக்கு", "பதிவு · சனி 11"], ["அழைப்பு நேரம்", "மதிக்கப்பட்டது"], ["மேல்முறையீடு", "தேவையில்லை"]],
        },
      ],
    },
    stats: {
      eyebrow: "வடிவமைப்பின் மூலம்",
      title: "உரையாடல் வேகத்தில் இயங்க உருவாக்கப்பட்டது.",
      items: [
        { v: "5", label: "மொழிகள், முதல் நாளிலிருந்து", sub: "EN · हिन्दी · മലയാളം · தமிழ் · عربي" },
        { v: "50+", label: "கடன் வழங்குநர் ஒப்பீடு", sub: "வங்கிகள் · NBFC · ஃபின்டெக்" },
        { v: "0", label: "பதிலுக்கு முன் படிவப் புலங்கள்", sub: "பக்கம் தானே நிரப்புகிறது" },
        { v: "24×7", label: "4:30க்கு மூடாது", sub: "கிளை நேரமில்லை" },
      ],
    },
    compare: {
      eyebrow: "பழைய வழி vs Dhana",
      title: "வரிசையில் நிற்கலாம்.",
      caption: "நாட்கள் எடுத்தது இப்போது ஒரு உரையாடல்.",
      oldCol: "கிளை காலம்",
      newCol: "Dhanaவுடன்",
      cta: "Dhanaவிடம் பேசுங்கள்",
      rows: [
        { k: "தகுதியை அறிய", old: "கிளை வருகை, 3–5 நாட்கள்", nw: "ஒரு உரையாடல், நிமிடங்கள்" },
        { k: "வழங்குநர் ஒப்பீடு", old: "1–2 — நுழையும் இடம்", nw: "50+ ஒரே நேரத்தில்" },
        { k: "மொழி", old: "முடிந்தால் ஆங்கிலம்", nw: "உங்களுடையது — ஐந்தில் தொடக்கம்" },
        { k: "ஆவணங்கள்", old: "பதிலுக்கு முன் பதினேழு புலங்கள்", nw: "முதலில் பதில், படிவம் பின்னர்" },
        { k: "வேலை நேரம்", old: "காலை 10 – மாலை 5, திங்க்–சனி", nw: "நீங்கள் இருக்கும் நேரம்" },
      ],
    },
    press: {
      eyebrow: "ஆதரவு",
      title: "நல்ல நிறுவனங்களுடன்.",
      items: [
        { t: "Manorama Online Elevate", d: "500+ விண்ணப்பதாரர்களில் இருந்து தேர்வு — கேரளத்தின் முதன்மை முதலீட்டு மேடை." },
        { t: "Kerala Startup Mission", d: "இந்தியாவின் முதல் மற்றும் பெரிய இன்க்யுபேட்டரின் ஆதரவு." },
        { t: "JAIN University", d: "Elevate கண்டுபிடிப்புத் திட்டத்தின் வழியே இன்க்யுபேட் செய்யப்பட்டது." },
        { t: "Group Meeran", d: "பல தசாப்த நம்பிக்கையுள்ள வணிகக் குழுவின் ஆதரவு." },
      ],
    },
  },
  ar: {
    sample: "استمع لهذه الصفحة",
    hero: {
      sub: "مدير علاقات ذكي لدورة القرض كاملة — يبيع، يقيّم، يُسجّل، يُتمّ، ويستوحي.",
    },
    lifecycle: {
      eyebrow: "مدير واحد. خمس مهام.",
      title: "ليست مكالمة واحدة. إنها المحفظة كاملة.",
      caption: "اختر مهمة. شاهد المحادثة والنتيجة. عرض مُعدّ مسبقاً.",
      tabs: ["المبيعات", "الإتمام", "التسجيل", "التقييم", "التحصيل"],
      outcomeLabel: "النتيجة",
      stages: [
        {
          id: "sales", color: "#f9a900",
          title: "هي تفتح الحوار.",
          desc: "داخلية أو خارجية، تفهم الحاجة والمبلغ والتوقيت — بأي لغة.",
          convo: [
            { who: "dhana", text: "مرحباً! قرض شخصي، أم مجرد استكشاف؟" },
            { who: "you", text: "استكشاف… ربما خمسة لاك." },
            { who: "dhana", text: "حسناً. لأي غرض — ترميم المنزل؟" },
            { who: "you", text: "ترميم المنزل أساساً." },
            { who: "dhana", text: "ممتاز. أحتفظ بذلك وأجهّز الخيارات صباح الغد." },
          ],
          outcome: [["العميل المحتمل", "مؤهل · نية عالية"], ["الحاجة", "٥ لاك · ترميم"], ["الخطوة التالية", "معاودة اتصال · ١٠ صباحاً"]],
        },
        {
          id: "conversion", color: "#d8441f",
          title: "تُنهي بالخيارات.",
          desc: "عروض تُقارن بصوت مسموع، اعتراضات يُجيب عنها، متابعة حتى القرار.",
          convo: [
            { who: "dhana", text: "خياران يناسبان قسطك. أحدهما يصرف في اليوم نفسه." },
            { who: "you", text: "يبدو السعر مرتفعاً." },
            { who: "dhana", text: "منطقي. تمديد المدة يخفض القسط — أعرض الاثنين؟" },
            { who: "you", text: "أرِني الأطول." },
            { who: "dhana", text: "أرسلته إلى شاشتك. العرض محفوظ." },
          ],
          outcome: [["العرض", "مقبول · مدة ممتدة"], ["الاعتراض", "السعر → حُلّ بالمدة"], ["الحالة", "بانتظار التوقيع الإلكتروني"]],
        },
        {
          id: "onboarding", color: "#048244",
          title: "هي تدير الأوراق.",
          desc: "KYC والمستندات والتحقق — بصوتك، وتُملأ على الصفحة. بلا زيارة فرع.",
          convo: [
            { who: "dhana", text: "بقي أمران: هوية وإثبات عنوان. ترفعهما هنا، أم أرشدك؟" },
            { who: "you", text: "سأرفعهما الآن." },
            { who: "dhana", text: "وصل كلاهما. اكتمل الطلب." },
            { who: "you", text: "هذا كل شيء؟" },
            { who: "dhana", text: "هذا كل شيء. التحقق عادة خلال يوم — سأوافيك بالمستجد." },
          ],
          outcome: [["الهوية KYC", "مكتملة · مستندان موثقان"], ["الطلب", "#4821 مُرسل"], ["زيارات الفرع", "صفر"]],
        },
        {
          id: "evaluation", color: "#1f3a6f",
          title: "تحقق قبل أي أمل.",
          desc: "تقرير ائتماني لطيف، أهلية، وقدرة سداد — الموافقة أولاً، والنتيجة دقائق.",
          convo: [
            { who: "dhana", text: "فحص سريع قبل العروض: هل لديك أقساط جارية؟" },
            { who: "you", text: "قرض سيارة واحد." },
            { who: "dhana", text: "شكراً. بموافقتك أجري فحصاً لطيفاً — دون تأثير على درجتك." },
            { who: "you", text: "تفضلي." },
            { who: "dhana", text: "انتهى. أنت مؤهل براحة تامة." },
          ],
          outcome: [["التقرير", "فحص لطيف · موافقة مسجلة"], ["الأهلية", "مؤهل · هامش مريح"], ["الوقت", "أقل من دقيقتين"]],
        },
        {
          id: "recovery", color: "#bb5b02",
          title: "تستعيد بلطف.",
          desc: "تذكير قبل الاستحقاق، تسجيل الوعود، مسارات إعادة جدولة — داخل نوافذ الاتصال دائماً.",
          convo: [
            { who: "dhana", text: "قسطك يوم الجمعة. أضبط تذكيراً؟" },
            { who: "you", text: "الراتب يوم السبت." },
            { who: "dhana", text: "فهمت — وُعد السبت مسجل. سأتصل ١١ صباحاً لا قبلها." },
            { who: "you", text: "شكراً لتفهمك." },
            { who: "dhana", text: "إن فات السبت، ندرس معاً جدولاً بسيطاً." },
          ],
          outcome: [["الوعد بالسداد", "مسجل · السبت ١١"], ["نافذة الاتصال", "محترمة"], ["التصعيد", "غير مطلوب"]],
        },
      ],
    },
    stats: {
      eyebrow: "بالتصميم",
      title: "مصممة لتتحرك بسرعة المحادثة.",
      items: [
        { v: "5", label: "لغات، من اليوم الأول", sub: "EN · हिन्दी · മലയാളം · தமிழ் · عربي" },
        { v: "50+", label: "شريك تمويل للمقارنة", sub: "بنوك · NBFC · تقنية مالية" },
        { v: "0", label: "حقول نموذج قبل الإجابة", sub: "الصفحة تملأ نفسها" },
        { v: "24×7", label: "لا تغلق عند 4:30", sub: "لا ساعات فروع" },
      ],
    },
    compare: {
      eyebrow: "الطريقة القديمة مقابل Dhana",
      title: "كان بإمكانك الوقوف في طابور.",
      caption: "ما كان يستغرق أياماً يستغرق الآن محادثة.",
      oldCol: "عصر الفروع",
      newCol: "مع Dhana",
      cta: "تحدث مع Dhana",
      rows: [
        { k: "اعرف أهليتك", old: "زيارة فرع، ٣–٥ أيام", nw: "محادثة واحدة، دقائق" },
        { k: "المُقرضون المقارَنون", old: "١–٢ — من تدخل إليه", nw: "+٥٠ دفعة واحدة" },
        { k: "اللغة", old: "الإنجليزية في أحسن الأحوال", nw: "لغتك — خمس للبداية" },
        { k: "الأوراق", old: "سبعة عشر حقلاً قبل الإجابات", nw: "إجابات أولاً، النماذج لاحقاً" },
        { k: "ساعات العمل", old: "١٠ صباحاً – ٥ مساءً", nw: "وقتما تكون متاحاً" },
      ],
    },
    press: {
      eyebrow: "الدعم",
      title: "في رفقة طيبة.",
      items: [
        { t: "Manorama Online Elevate", d: "اختير من بين أكثر من ٥٠٠ متقدم — منصة الاستثمار الرائدة في كيرالا." },
        { t: "Kerala Startup Mission", d: "بدعم أول وأكبر حاضنة شركات ناشئة في الهند." },
        { t: "JAIN University", d: "حاضنة عبر برنامج Elevate للابتكار." },
        { t: "Group Meeran", d: "مدعومة بمجموعة أعمال تتمتع بعقود من الثقة." },
      ],
    },
  },
};

export function deepMerge(base, extra) {
  for (const k of Object.keys(extra)) {
    const ev = extra[k];
    const bv = base[k];
    if (Array.isArray(ev)) base[k] = ev;
    else if (ev && typeof ev === "object" && bv && typeof bv === "object" && !Array.isArray(bv))
      deepMerge(bv, ev);
    else base[k] = ev;
  }
}

export function mergeCopy(base, extra) {
  for (const lang of Object.keys(extra)) {
    base[lang] = base[lang] || {};
    deepMerge(base[lang], extra[lang]);
  }
}
