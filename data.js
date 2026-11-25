// Everything on the site comes from this file. Players sit on a 100 x 140 pitch:
// y = 3 is the goal we attack, y = 137 is our goal. The ball passes from the back
// (largest y) to the front, so put older work further back.

window.SITE = {
  name: "Stanley Chen",
  intro:
    "EECS at UC Berkeley, class of 2029. Undergraduate researcher in the Embodied Dexterity Group at Berkeley AI Research. I build ML systems end to end, from the model to the app someone actually uses.",
  // Shown when someone taps the goal, the end of the timeline. Keep it current.
  today:
    "Right now I'm at UC Berkeley studying EECS, researching touch sensing through fur in the Embodied Dexterity Group at BAIR, and building Capitan, a climbing route planner.",
  contact: {
    email: "26stanleyc@berkeley.edu",
    github: "https://github.com/26stanleyc",
    linkedin: "https://www.linkedin.com/in/stanley-chen-68a924299/",
    resume: "assets/stanley-chen-resume.pdf",
  },

  routes: [
    { id: "builds", name: "Builds", color: "var(--builds)", blurb: "Products and hackathon projects" },
    { id: "research", name: "Research", color: "var(--research)", blurb: "Papers and lab work" },
    { id: "code", name: "More code", color: "var(--code)", blurb: "Every other public repo" },
  ],

  players: [
    // Builds
    {
      id: "flowmaximize", route: "builds", x: 78, y: 104, size: 3.3,
      name: "flowmaximize", kind: "Chrome extension", when: "April 2026",
      summary: "A sidebar for YouTube that flags the hard words in a video's captions and defines them as they come up.",
      stack: ["TypeScript"],
      links: [{ label: "Code", href: "https://github.com/26stanleyc/flowmaximize" }],
    },
    {
      id: "neural-net", route: "builds", x: 44, y: 96, size: 3.3,
      name: "Neural net from scratch", short: "Neural net", kind: "Learning project", when: "August 2026",
      summary: "A configurable N-layer feed-forward network written from scratch in Java. It runs inference or trains itself with backpropagation.",
      stack: ["Java"],
      links: [{ label: "Code", href: "https://github.com/26stanleyc/Neural-Net-from-scratch" }],
    },
    {
      id: "sage", route: "builds", x: 18, y: 84, size: 3.6,
      name: "Sage.ai", kind: "Carbon-aware load shifting", when: "September 2026", tag: "HackHarvard",
      summary: "When every EV fleet and data center chases the same clean hours, they use up the clean power together. Sage schedules flexible loads across companies so they stop herding.",
      facts: [
        "ERCOT simulator of 283 fossil plants, within 7.7% of hourly CO₂ over 104 days",
        "Gradient-boosted load, wind and solar forecasts at 1.92% load MAPE",
      ],
      stack: ["FastAPI", "Next.js", "NumPy", "pandas", "scikit-learn"],
      links: [{ label: "Code", href: "https://github.com/26stanleyc/HackHarvard" }],
    },
    {
      id: "tagteam", route: "builds", x: 64, y: 80, size: 3.8,
      name: "TagTeam", kind: "Fraud defense for agentic payments", when: "October 2026", tag: "CalHacks",
      summary: "AI agents now pay each other over x402. TagTeam checks every payment with a team of specialist agents, then attacks itself to find its own blind spots.",
      facts: [
        "Caught 25% more phishing payments than XGBoost on 68K real Ethereum transactions, with zero false alarms",
        "A red-team arena of 24 attack niches: each specialist writes its own attacker, then rewrites its rules",
      ],
      stack: ["Python", "FastAPI", "uAgents", "XGBoost", "PostgreSQL", "x402"],
      links: [
        { label: "Live demo", href: "https://tagteam-theta.vercel.app" },
        { label: "Code", href: "https://github.com/26stanleyc/CalHacks" },
      ],
    },
    {
      id: "capitan", route: "builds", x: 36, y: 66, size: 3.8,
      name: "Capitan", kind: "Climbing route planner", when: "October 2026 to now", tag: "In progress",
      summary: "Point your phone at a climbing wall. Capitan finds the holds, sorts them into routes by color, and plans moves sized to your height and wingspan.",
      facts: [
        "Mask R-CNN fine-tuned from 19 labeled photos: 81.1 / 98.4 mask AP50 on 2 gyms it had never seen",
        "Grouping holds by chalk-corrected CIELAB color raised route accuracy from 37.5% to 62.5%",
        "Dijkstra beta planning, with hold depth from Depth Anything 3",
      ],
      stack: ["Expo", "React Native", "FastAPI", "PyTorch", "OpenCV"],
      links: [{ label: "Code", href: "https://github.com/26stanleyc/MDB-newbie" }],
    },
    {
      id: "memorylens", route: "builds", x: 24, y: 44, size: 3.4,
      name: "MemoryLens", kind: "GPU memory tier calculator", when: "November 2026",
      summary: "Estimates what adding an X-Mem memory tier to one inference serving pool is worth per year, including cost per million tokens and the break-even fee per GPU-hour.",
      stack: ["HTML", "JavaScript"],
      links: [
        { label: "Live page", href: "https://26stanleyc.github.io/Netpreme_calc/" },
        { label: "Code", href: "https://github.com/26stanleyc/Netpreme_calc" },
      ],
    },
    {
      id: "pilego", route: "builds", x: 58, y: 32, size: 4.2,
      name: "PileGo!", kind: "AI cross-listing for clothing resellers", when: "November 2026", tag: "1st place",
      summary: "Resellers list an item once. PileGo posts it to four marketplaces and pulls it down everywhere else the moment it sells.",
      facts: [
        "1st place at the Big Hack Game hackathon, about $11K in prizes",
        "$800 in revenue and 160K impressions in its first 4 days",
        "Claude agents drive a browser per seller through MCP to post listings; a Postgres job queue handles delisting",
      ],
      stack: ["React", "TypeScript", "Supabase", "Cloudflare Pages", "Claude agents", "MCP", "Steel.dev"],
      links: [{ label: "pilego.app", href: "https://pilego.app/" }],
    },

    // Research
    {
      id: "graphormer", route: "research", x: 60, y: 118, size: 3.8,
      name: "Graphormer++", kind: "Paper, IEEE FMLDS 2024", when: "2023 to 2024", tag: "Published",
      title: "Developing a Novel 3D Graphormer++ Model for Screening and Predicting Potential Oxide Electrocatalysts with Greater Accuracy and Computational Efficiency",
      summary: "A 3D graph transformer that screens oxide electrocatalysts without running a full simulation for each one.",
      facts: [
        "Pretrained and fine-tuned for 100K steps on OC20 using one T4 GPU",
        "Random Forest and GNN models predict atomic charges, cutting the main model's loss by about 3.5%",
        "Presented at FMLDS in Sydney; 2nd of 12 in category at Synopsys",
      ],
      stack: ["Python", "PyTorch", "GNNs"],
      links: [
        { label: "Paper", href: "https://ieeexplore.ieee.org/abstract/document/10874072" },
        { label: "Code", href: "https://github.com/26stanleyc/OC20Optimization" },
      ],
    },
    {
      id: "3mnet", route: "research", x: 30, y: 110, size: 3.8,
      name: "3MNet", kind: "Paper, AAIML 2026", when: "2024 to 2025", tag: "Published",
      title: "3MNet: A novel multi-omics deep ensemble model for melanoma survival analysis",
      summary: "Predicts survival for melanoma patients by combining RNA-seq, miRNA and mutation data.",
      facts: [
        "0.724 C-index, 6.5% above prior models",
        "446 patients; 19,062-gene profiles compressed to 256 dimensions, then fused with a transformer and a graph neural net",
        "Presented at AAIML in Tokyo",
      ],
      stack: ["Python", "PyTorch", "Transformers", "GNNs"],
      links: [
        { label: "Paper", href: "https://ieeexplore.ieee.org/abstract/document/11498124" },
        { label: "Code", href: "https://github.com/26stanleyc/Melanoma" },
      ],
    },
    {
      id: "fur", route: "research", x: 80, y: 58, size: 4,
      name: "Hearing touch through fur", short: "Fur touch", kind: "Embodied Dexterity Group, BAIR", when: "October 2026 to now", tag: "In progress",
      summary: "Working out where something touches a furry surface from sound alone, using a 16-microphone array under the fur.",
      facts: [
        "Real-time source localization with STFT plus MVDR, MUSIC and SRP-PHAT beamforming",
        "80% accuracy across 9 touch zones on a bare board, and 91 to 97% through 3 different furs (chance is 11%)",
      ],
      stack: ["Python", "NumPy", "Signal processing"],
      links: [],
    },

    // More code (listed below the pitch, not on it)
    { id: "oc20", route: "code", name: "OC20Optimization", kind: "Code for Graphormer++", when: "2024", stack: ["Python"], links: [{ label: "Code", href: "https://github.com/26stanleyc/OC20Optimization" }] },
    { id: "melanoma", route: "code", name: "Melanoma", kind: "Code for 3MNet", when: "2024", stack: ["Python"], links: [{ label: "Code", href: "https://github.com/26stanleyc/Melanoma" }] },
    { id: "summarizer", route: "code", name: "AI_paper_summarizer", kind: "Repository", when: "2025", stack: ["Python"], links: [{ label: "Code", href: "https://github.com/26stanleyc/AI_paper_summarizer" }] },
    { id: "educational", route: "code", name: "educational_app", kind: "Repository", when: "2026", stack: ["Python"], links: [{ label: "Code", href: "https://github.com/26stanleyc/educational_app" }] },
    { id: "mdb-mock", route: "code", name: "MDB_mock", kind: "Expo app", when: "2026", stack: ["TypeScript", "Expo"], links: [{ label: "Code", href: "https://github.com/26stanleyc/MDB_mock" }] },
    { id: "neetcode", route: "code", name: "neetcode-submissions", kind: "NeetCode.io solutions", when: "2026", stack: ["Python"], links: [{ label: "Code", href: "https://github.com/26stanleyc/neetcode-submissions" }] },
    { id: "this-site", route: "code", name: "personal_website", kind: "This site", when: "2026", stack: ["HTML", "CSS", "JavaScript"], links: [{ label: "Code", href: "https://github.com/26stanleyc/personal_website" }] },
  ],

  // The ball starts with the keeper and ends in the goal.
  keeper: { id: "keeper", x: 50, y: 130, size: 3.6, name: "Stanley Chen", short: "Me", kind: "In goal" },
  goal: { id: "goal", x: 50, y: 2, name: "Goal", kind: "Get in touch" },
};
