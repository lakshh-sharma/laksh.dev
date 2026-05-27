// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for everything about Laksh.
// Edit this file to update the whole site (terminal, notes, settings).
// Values are placeholders — swap in your real details.
// ─────────────────────────────────────────────────────────────

export const profile = {
  name: "Laksh Sharma",
  handle: "lakshsharma",
  role: "Founding Engineer",
  school: "CS @ UIUC",
  location: "SF-ish",
  tagline: "building tools that respect the user",
  email: "laksh [at] laksh.dev",
  calendar: "cal.com/lakshsharma",
  socials: {
    github: "@lakshsharma",
    x: "@laksh_dev",
    linkedin: "in/lakshsharma",
    site: "laksh.dev",
  },
  about: [
    "Founding engineer who likes small teams, fast feedback loops, and",
    "tools that get out of your way. CS @ UIUC; previously interned at a",
    "couple of YC companies. Off-keyboard: bouldering, ramen, beat-em-up",
    "animes, and late-night walks.",
  ],
  stack: {
    lang: ["TypeScript", "Rust", "Python", "Go"],
    infra: ["Postgres", "Redis", "Modal", "Fly.io", "Cloudflare"],
    ai: ["Claude", "OpenAI", "vLLM", "llama.cpp"],
    tools: ["Ghostty", "Neovim", "zsh", "tmux", "Raycast"],
  },
  projects: [
    {
      name: "stealth-mode",
      blurb: "agentic infra for SMB ops",
      detail: "TypeScript + Rust + Postgres + Modal. Shipping daily (47-day streak).",
      readme:
        "# stealth-mode\n\nAgentic infrastructure for small-business operations.\n\n- stack: TypeScript + Rust + Postgres + Modal\n- status: shipping daily, 47-day commit streak\n- focus: reliability, latency budgets, self-healing workflows",
    },
    {
      name: "retrycat",
      blurb: "drop-in retry / backoff for TS",
      detail: "1.2k ★ on GitHub. `npm i retrycat`.",
      readme:
        "# retrycat\n\nDrop-in retry / backoff for TypeScript.\n\n    npm i retrycat\n\n- 1.2k ★ on GitHub\n- jittered exponential backoff, typed policies, zero deps",
    },
    {
      name: "latency-lab",
      blurb: "LLM pipeline benchmarks",
      detail: "Notebook of token budgets, TTFT, and p99 traces.",
      readme:
        "# latency-lab\n\nA running notebook of LLM pipeline benchmarks.\n\n- token budgets, time-to-first-token, p99 traces\n- comparisons across providers and local models",
    },
    {
      name: "dotfiles",
      blurb: "zsh + nvim + ghostty config",
      detail: "stow-managed, portable across machines.",
      readme: "# dotfiles\n\nzsh + Neovim + Ghostty config, stow-managed.",
    },
  ],
  whatsNew: [
    { date: "2026-05", text: "eval harness for tool-use agents", note: "→ 14% lift" },
    { date: "2026-04", text: 'talk: "latency budgets in LLM pipelines"', note: "" },
    { date: "2026-02", text: "open-sourced retrycat", note: "· 1.2k ★" },
  ],
  // suggestions shown in the laksh prompt
  promptSuggestions: [
    "What are you working on right now?",
    "Walk me through your projects",
    "What's your tech stack?",
    "How do I get in touch?",
    "What are you looking for next?",
    "Tell me something fun about you",
  ],
};

export type Profile = typeof profile;
