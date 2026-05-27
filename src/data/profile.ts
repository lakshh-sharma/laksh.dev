// ─────────────────────────────────────────────────────────────
// Single source of truth — edit this file to update the whole site.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Laksh Sharma",
  handle: "lakshh-sharma",
  role: "Software Engineer @ Silicon Data",
  school: "CS @ UIUC",
  location: "Champaign · NYC",
  tagline: "benchmarks, infra, and tools that surface what's really happening",
  email: "lakshsharma.work@gmail.com",
  calendar: "cal.com/lakshsharma",
  socials: {
    github: "@lakshh-sharma",
    x: "@laksh_sharma",
    linkedin: "in/lakshsharma",
    site: "laksh.dev",
  },

  about: [
    "CS @ UIUC. I like infra problems with crisp success metrics —",
    "benchmarks that reveal hidden behavior, tools that get out of the way,",
    "products people actually use.",
    "",
    "Currently building at Silicon Data (incoming full-time).",
    "Co-President of OTCR Consulting at UIUC. Off-keyboard: physics",
    "olympiads, late-night walks, ramen.",
  ],

  stack: {
    lang: ["TypeScript", "Python", "Swift", "C++"],
    backend: ["FastAPI", "Postgres", "SQLAlchemy"],
    frontend: ["React", "SwiftUI", "Vite", "Tailwind"],
    ai: ["Claude", "Anthropic SDK", "OpenAI"],
    tools: ["Cursor", "tmux", "zsh", "Raycast"],
  },

  experience: [
    {
      org: "Silicon Data",
      role: "Software Engineer",
      period: "2025 — present",
      blurb: "GPU performance + benchmarking infrastructure.",
      detail:
        "Built SiliconMark — a self-scaling GPU benchmark that uses geometric workload ramps to find hardware limits with no manual tuning. Validated across 1,000+ runs at under 2% variance; results show NVIDIA hardware averages 25% below advertised specs. Co-authored 'Did You Win the GPU Cloud Lottery?' (GPGPU 2026 @ ASPLOS).",
    },
    {
      org: "OTCR Consulting",
      role: "Executive Partner (Co-President)",
      period: "2024 — present",
      blurb: "60 members · 11 engagements/semester · 8% accept rate.",
      detail:
        "Oversee sourcing, staffing, client onboarding, and all club operations for the largest student consulting org at UIUC. Run finances and corporate affairs; pitch companies for paid engagements. Grew finances $3k → $20k. Founded the tech division from scratch — internal tooling adoption and technical consulting projects.",
    },
    {
      org: "International Young Physicists' Tournament",
      role: "Team Captain (India), Mentor",
      period: "2022 — 2026",
      blurb: "1 of 5 selected to represent India internationally — twice.",
      detail:
        "Captained India's national team at IYPT 2022; selected again in 2024. Mentored IYPT India 2024 and IYNT 2026 teams. IYPT is a research-based physics olympiad across 30+ countries built around experimental problem-solving and scientific debate.",
    },
  ],

  projects: [
    {
      name: "inari",
      blurb: "social investing without pooling capital",
      detail: "React + FastAPI. Native Alpaca/Tradier + SnapTrade for 6 more brokers.",
      url: "",
      readme:
        "# inari\n\nA social investing platform that lets friends create group funds and coordinate trades without pooling money — each member's capital stays in their own broker account.\n\n- stack: React + FastAPI + Postgres\n- prototype: Python/FastAPI CLI executing real coordinated paper trades\n- production: fund management, proposal-based trade flow, multi-broker portfolio dashboard\n- brokers: Alpaca and Tradier native; SnapTrade integration for Robinhood, Fidelity, Webull, Schwab, IBKR, E*Trade, Tastytrade",
    },
    {
      name: "forge",
      blurb: "mac menu-bar prompt rewriter, hotkey-driven",
      detail: "Swift/SwiftUI + Accessibility API. Local rules engine + optional Anthropic pass.",
      url: "github.com/lakshh-sharma/Forge",
      readme:
        "# forge\n\nMac menu-bar app that restructures any prompt into a technique-rich one on a single hotkey.\n\n- stack: Swift / SwiftUI\n- works across any text field via the macOS Accessibility API\n- pairs a local rules engine with an optional Anthropic API pass\n- github.com/lakshh-sharma/Forge",
    },
    {
      name: "crAIwl",
      blurb: "intelligent crawler — describe what to extract in english",
      detail: "TypeScript, 6-package monorepo. Writes and manages the crawler itself.",
      url: "github.com/lakshh-sharma/crAIwl",
      readme:
        "# crAIwl\n\nAn intelligent crawler that ingests any link, takes a plain-English description of what to extract, and automatically writes and manages the crawler itself. No code required from the user.\n\n- stack: TypeScript, 6-package monorepo\n- architecture splits so the extraction program is written once per template and reused across recurring workflows\n- github.com/lakshh-sharma/crAIwl",
    },
  ],

  publications: [
    {
      title: "Did You Win the GPU Cloud Lottery? Benchmarking from TFLOPS to Tokens/$",
      venue: "GPGPU 2026 @ ASPLOS, Pittsburgh",
      role: "Co-Author · presented in person",
    },
  ],

  awards: [
    { year: "2022", title: "Team Captain — India National Team, IYPT", note: "1 of 5 students selected to represent India" },
    { year: "2024", title: "Selected — India National Team, IYPT", note: "" },
    { year: "2024", title: "Team Mentor — IYPT India", note: "" },
    { year: "2026", title: "Team Mentor — IYNT India", note: "" },
  ],

  whatsNew: [
    { date: "2026-04", text: "presented GPU-cloud benchmarking paper @ ASPLOS", note: "Pittsburgh" },
    { date: "2026-03", text: "shipped React/FastAPI rewrite of inari", note: "8 brokers" },
    { date: "2026-01", text: "open-sourced forge — Mac prompt rewriter in Swift", note: "" },
  ],

  promptSuggestions: [
    "What are you working on right now?",
    "Walk me through your projects",
    "Tell me about your work at Silicon Data",
    "How did you grow OTCR Consulting?",
    "What's your tech stack?",
    "How do I get in touch?",
  ],
};

export type Profile = typeof profile;
