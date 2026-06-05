// ─────────────────────────────────────────────────────────────
// Single source of truth — edit this file to update the whole site.
// ─────────────────────────────────────────────────────────────

export interface Project {
  id: string;          // slug — used for `/projects <id>` and the icon registry
  name: string;        // display name
  tagline: string;     // one-line hook shown under the title
  blurb: string;       // short // comment shown in the /projects list
  year?: string;       // optional year badge
  accent: string;      // card accent color (icon tile + tags)
  glyph: string;       // fallback monogram/emoji when no image is wired
  stack: string[];     // tech tags
  bullets: string[];   // the readable rundown, on the right of the card
  links?: { repo?: string; demo?: string; paper?: string };
  readme: string;      // markdown for the Finder / `cat README.md` view
}

export interface Experience {
  id: string;          // slug — used for the logo registry
  org: string;
  short: string;       // compact label for the experience picker tabs
  role: string;
  period: string;
  accent: string;      // card accent + fallback monogram color
  glyph: string;       // fallback monogram when no square logo is wired
  blurb: string;
  detail: string;      // one-paragraph summary (kept for other surfaces)
  bullets: string[];   // shown on the focused detail page
}

export const profile = {
  name: "Laksh Sharma",
  handle: "lakshh-sharma",
  role: "Founding Engineer @ Silicon Data",
  school: "Computer Engineering @ UIUC",
  location: "Champaign, IL",
  tagline: "benchmarks, infra, and tools that surface what's really happening",
  email: "lakshsharma.work@gmail.com",
  phone: "(217) 530-8185",
  calendar: "cal.com/lakshsharma",
  socials: {
    github: "@lakshh-sharma",
    x: "@laksh__sharma_",
    linkedin: "in/laksh-sharma-690b6a298",
    site: "laksh.dev",
  },

  about: [
    "Computer Engineering @ UIUC, graduating Dec 2026. I like infra problems",
    "with crisp success metrics — benchmarks that reveal hidden behavior,",
    "tools that get out of the way, products people actually use.",
    "",
    "Founding engineer at Silicon Data (GPU financial infrastructure).",
    "Co-President of OTCR Consulting. GPU systems research at UIUC NCSA.",
    "Off-keyboard: physics olympiads, late-night walks, ramen.",
  ],

  stack: {
    lang: ["TypeScript", "Python", "Swift", "C++", "CUDA", "SystemVerilog"],
    backend: ["FastAPI", "Postgres", "Redis", "BullMQ", "Playwright"],
    frontend: ["React", "SwiftUI", "Vite", "Tailwind"],
    ai: ["Claude", "Anthropic SDK"],
    tools: ["Node 20", "tmux", "Cursor", "Raycast"],
  },

  experience: [
    {
      id: "silicon-data",
      org: "Silicon Data",
      short: "Silicon Data",
      role: "Founding Engineer · Product Manager",
      period: "Jun 2025 — present",
      accent: "#c08a3e",
      glyph: "◢",
      blurb: "$4.7M seed · GPU financial infrastructure.",
      detail:
        "Built the cloud automation suite — provider-specific API adapters for 15+ GPU clouds (RunPod, TensorDock, Cudo, and more) behind one orchestrator that provisions instances, runs benchmarks, and tears them down automatically. Engineered SiliconMark, a self-scaling GPU benchmark that geometrically ramps matrix multiplications until sustained peak is captured — under 2% CV across 1,000+ runs on 11 providers. Building SiliconAudit, a node audit suite that stress-tests GPU compute and memory and flags faulty silicon via deterministic correctness checks. As PM: rebuilt Jira across US/India teams and shipped a pipeline that turns CEO client-call transcripts into structured pre-meeting insights.",
      bullets: [
        "Built the cloud automation suite: provider-specific API adapters for 15+ GPU clouds (RunPod, TensorDock, Cudo…) behind one orchestrator that provisions instances, runs benchmarks, and tears them down automatically.",
        "Engineered SiliconMark, a self-scaling GPU benchmark that geometrically ramps matrix multiplications until sustained peak is captured — under 2% CV across 1,000+ runs on 11 providers.",
        "Building SiliconAudit, a node audit suite that stress-tests GPU compute and memory and flags faulty silicon via deterministic correctness validation.",
        "As PM: rebuilt Jira across US and India teams and shipped a pipeline that turns CEO client-call transcripts into structured pre-meeting insights.",
      ],
    },
    {
      id: "otcr",
      org: "OTCR Consulting",
      short: "OTCR Consulting",
      role: "Executive Partner (Co-President)",
      period: "Jan 2026 — present",
      accent: "#5aa9e6",
      glyph: "◆",
      blurb: "50 members · 11 client engagements · 10x revenue.",
      detail:
        "Manage a 50-member consultancy and sourced 11 engagements spanning strategy, operations, and technology across Fortune 500 and growth-stage clients. Drove 10x revenue growth by rebuilding the staffing model, SOW process, and engagement quality controls from scratch.",
      bullets: [
        "Manage a 50-member consultancy and sourced 11 engagements spanning strategy, operations, and technology across Fortune 500 and growth-stage clients.",
        "Drove 10x revenue growth by rebuilding the staffing model, SOW process, and engagement quality controls from scratch.",
      ],
    },
    {
      id: "ncsa",
      org: "UIUC NCSA",
      short: "GPU Researcher",
      role: "GPU Researcher · Prof. Kindratenko",
      period: "Mar 2026 — present",
      accent: "#7bbf6a",
      glyph: "❖",
      blurb: "Goodput-optimal GPU partitioning for LLM inference.",
      detail:
        "Developing an analytical model that predicts the goodput-optimal prefill/decode SM-partition split for single-GPU LLM inference using NVIDIA Green Contexts (CUDA 12.4+). Targeting a closed-form predictor built from roofline quantities that transfers across GPU generations with no re-fitting.",
      bullets: [
        "Developing an analytical model that predicts the goodput-optimal prefill/decode SM-partition split for single-GPU LLM inference using NVIDIA Green Contexts (CUDA 12.4+).",
        "Targeting a closed-form predictor built from roofline quantities that transfers across GPU generations with no re-fitting.",
      ],
    },
  ] as Experience[],

  projects: [
    {
      id: "craiwl",
      name: "crAIwl",
      tagline: "an LLM-as-compiler web crawler",
      blurb: "describe what to extract; it compiles a deterministic crawler",
      accent: "#5aa9e6",
      glyph: "🕸",
      stack: ["TypeScript", "Node 20", "Postgres", "Redis", "BullMQ", "Playwright"],
      bullets: [
        "The model runs once to generate CSS/XPath extraction programs per site, then executes deterministically at ~50ms/page — no LLM in the hot path.",
        "Self-healing: when a site's markup shifts and selectors break, it regenerates just the broken extractors and keeps going.",
        "Job orchestration over BullMQ + Redis; results and templates persisted in Postgres.",
      ],
      links: { repo: "github.com/lakshh-sharma/crAIwl" },
      readme:
        "# crAIwl\n\nAn LLM-as-compiler web crawler. The model runs once to generate CSS/XPath extraction programs per site, then those programs execute deterministically at ~50ms/page — no model in the hot path.\n\n- self-healing: regenerates only the broken selectors when a site's markup changes\n- job orchestration on BullMQ + Redis, persistence in Postgres\n- stack: TypeScript, Node 20, Postgres, Redis, BullMQ, Playwright\n- github.com/lakshh-sharma/crAIwl",
    },
    {
      id: "forge",
      name: "Forge",
      tagline: "a menu-bar prompt rewriter, one hotkey",
      blurb: "rewrites any selected prompt into a technique-rich version",
      accent: "#e0894f",
      glyph: "⚒",
      stack: ["Swift", "SwiftUI", "Accessibility API", "Claude"],
      bullets: [
        "Rewrites any selected prompt into a structured, technique-rich version on a single hotkey.",
        "Local rules engine returns in ~50ms with no network call; an optional Claude pass swaps in asynchronously once it lands.",
        "Works in any app — reads and replaces the selection via the macOS Accessibility API.",
      ],
      links: { repo: "github.com/lakshh-sharma/Forge" },
      readme:
        "# Forge\n\nA macOS menu-bar app that rewrites any selected prompt into a structured, technique-rich version on a single hotkey.\n\n- local rules engine runs in ~50ms with no network call\n- optional Claude pass swaps in asynchronously once it returns\n- works across any text field via the macOS Accessibility API\n- stack: Swift, SwiftUI\n- github.com/lakshh-sharma/Forge",
    },
    {
      id: "fpga-cnn",
      name: "FPGA CNN Digit Classifier",
      tagline: "handwritten digits classified entirely in hardware",
      blurb: "real-time CNN inference on a Spartan-7, no CPU in the loop",
      year: "2026",
      accent: "#7bbf6a",
      glyph: "▦",
      stack: ["SystemVerilog", "Spartan-7", "USB HID"],
      bullets: [
        "Real-time handwritten-digit classifier on a Spartan-7 FPGA, written in SystemVerilog.",
        "CNN inference runs entirely in hardware — no CPU in the loop.",
        "USB mouse interface for drawing input, plus a chiptune audio engine for feedback.",
      ],
      readme:
        "# FPGA CNN Digit Classifier\n\nA real-time handwritten-digit classifier running entirely on a Spartan-7 FPGA in SystemVerilog.\n\n- CNN inference fully in hardware — no CPU in the loop\n- USB mouse interface for drawing input\n- chiptune audio engine for feedback\n- 2026",
    },
  ] as Project[],

  publications: [
    {
      title: "Did You Win the GPU Cloud Lottery? Benchmarking from TFLOPS to Tokens/$",
      authors: "Platon Slynko, Jay Lu, Jason Cornick, Laksh Sharma, et al.",
      venue: "GPGPU '26 @ ASPLOS · Pittsburgh, PA",
      role: "Co-author · presented in person · March 2026",
    },
  ],

  awards: [
    { year: "2022", title: "Team Captain — India National Team, IYPT", note: "1 of 5 selected nationally" },
    { year: "2024", title: "Selected — India National Team, IYPT", note: "" },
    { year: "2024", title: "Team Mentor — IYPT India", note: "" },
    { year: "2026", title: "Team Mentor — IYNT India", note: "" },
  ],

  whatsNew: [
    { date: "2026-04", text: "presented our GPU-cloud benchmarking paper @ ASPLOS", note: "Pittsburgh" },
    { date: "2026-03", text: "started GPU-partitioning research @ NCSA with Prof. Kindratenko", note: "" },
    { date: "2026-02", text: "shipped crAIwl — an LLM-as-compiler crawler", note: "" },
  ],

  promptSuggestions: [
    "What are you building at Silicon Data?",
    "Walk me through your projects",
    "Tell me about crAIwl",
    "What's the GPU research about?",
    "What's your tech stack?",
    "How do I get in touch?",
  ],
};

export type Profile = typeof profile;
