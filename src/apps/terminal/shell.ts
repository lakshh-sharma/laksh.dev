import { profile } from "../../data/profile";

// ── output model ──────────────────────────────────────────────
export type SegClass = "orange" | "blue" | "green" | "red" | "dim" | "yellow" | "dir" | "fg";
export interface Seg { t: string; c?: SegClass; }
export type Line = Seg[];

export interface RunResult {
  lines: Line[];
  clear?: boolean;
  boot?: boolean;
  bootMode?: boolean;
  project?: string;     // project id → Terminal renders a ProjectCard
  experience?: boolean; // → Terminal renders the ExperienceCards
}

const s = (t: string, c?: SegClass): Seg => ({ t, c });
const line = (...segs: Seg[]): Line => segs;
const text = (t: string, c?: SegClass): Line[] => t.split("\n").map((l) => [s(l, c)]);

// ── virtual filesystem ────────────────────────────────────────
type FSNode =
  | { type: "dir"; children: Record<string, FSNode> }
  | { type: "file"; content: string };

function buildFS(): FSNode {
  const projDirs: Record<string, FSNode> = {};
  for (const p of profile.projects) {
    projDirs[p.name] = { type: "dir", children: { "README.md": { type: "file", content: p.readme } } };
  }
  return {
    type: "dir",
    children: {
      "about.txt": { type: "file", content: profile.about.join("\n") },
      "stack.txt": {
        type: "file",
        content:
          `lang      ${profile.stack.lang.join(", ")}\n` +
          `backend   ${profile.stack.backend.join(", ")}\n` +
          `frontend  ${profile.stack.frontend.join(", ")}\n` +
          `ai        ${profile.stack.ai.join(", ")}\n` +
          `tools     ${profile.stack.tools.join(", ")}`,
      },
      "contact.txt": {
        type: "file",
        content:
          `email     ${profile.email}\n` +
          `calendar  ${profile.calendar}\n` +
          `github    ${profile.socials.github}\n` +
          `x         ${profile.socials.x}\n` +
          `linkedin  ${profile.socials.linkedin}\n\n` +
          `i read everything — replies usually within 24h.`,
      },
      "resume.pdf": { type: "file", content: `%PDF — run \`resume\` for the download link.` },
      projects: { type: "dir", children: projDirs },
    },
  };
}

// ── shell ─────────────────────────────────────────────────────
export class Shell {
  fs: FSNode;
  cwd: string[] = [];
  laksh = false;

  constructor() { this.fs = buildFS(); }

  private nodeAt(segs: string[]): FSNode | null {
    let n: FSNode = this.fs;
    for (const seg of segs) {
      if (n.type !== "dir" || !n.children[seg]) return null;
      n = n.children[seg];
    }
    return n;
  }

  private resolve(arg?: string): string[] {
    if (!arg) return this.cwd.slice();
    if (arg === "~" || arg === "/") return [];
    let base: string[];
    let a = arg;
    if (a.startsWith("~/")) { base = []; a = a.slice(2); }
    else if (a.startsWith("/Users/lakshsharma")) { base = []; a = a.replace("/Users/lakshsharma", "").replace(/^\//, ""); }
    else if (a.startsWith("/")) { base = []; a = a.slice(1); }
    else base = this.cwd.slice();
    for (const part of a.split("/")) {
      if (part === "" || part === ".") continue;
      if (part === "..") { base.pop(); continue; }
      base.push(part);
    }
    return base;
  }

  dirLabel(): string { return this.cwd.length ? "~/" + this.cwd.join("/") : "~"; }

  complete(value: string): string | null {
    const parts = value.split(/\s+/);
    if (this.laksh) {
      // in laksh mode complete on slash-commands only
      const first = parts[0] ?? "";
      if (parts.length > 1) return null;
      if (first.startsWith("/")) {
        const stub = first.slice(1);
        const names = Object.keys(this.slashCommands);
        const comp = common(stub, names);
        return comp ? "/" + comp : null;
      }
      return null;
    }
    const commandNames = Object.keys(this.osCommands);
    if (parts.length <= 1) return common(parts[0] ?? "", commandNames);
    const last = parts[parts.length - 1];
    const slash = last.lastIndexOf("/");
    const dirPart = slash >= 0 ? last.slice(0, slash + 1) : "";
    const stub = slash >= 0 ? last.slice(slash + 1) : last;
    const node = this.nodeAt(this.resolve(dirPart || "."));
    if (!node || node.type !== "dir") return null;
    const comp = common(stub, Object.keys(node.children));
    if (comp == null) return null;
    parts[parts.length - 1] = dirPart + comp;
    return parts.join(" ");
  }

  // ── pre-laksh OS commands ──
  private osCommands: Record<string, (args: string[]) => RunResult> = {
    help: () => ({
      lines: [
        line(s("commands:", "dim")),
        line(s("  laksh", "orange"), s("    boot my profile (the good stuff)")),
        line(s("  ls", "blue"), s("  cd  pwd  cat  tree  clear  whoami  echo  date", "blue")),
        line(s("tip:", "dim"), s(" type "), s("laksh", "orange"), s(" then ask me anything.", "dim")),
      ],
    }),
    laksh: () => ({ lines: [], boot: true, bootMode: true, clear: true }),
    claude: () => ({ lines: text("did you mean `laksh`? :)", "dim") }),
    whoami: () => ({ lines: text(profile.handle) }),
    pwd: () => ({ lines: text("/Users/lakshsharma" + (this.cwd.length ? "/" + this.cwd.join("/") : "")) }),
    date: () => ({ lines: text(new Date().toString()) }),
    echo: (a) => ({ lines: text(a.join(" ")) }),
    clear: () => ({ lines: [], clear: true }),
    ls: (a) => {
      const target = a.find((x) => !x.startsWith("-"));
      const node = this.nodeAt(this.resolve(target));
      if (!node) return { lines: [line(s("ls: ", "red"), s((target ?? "") + ": no such file or directory"))] };
      if (node.type === "file") return { lines: text(target ?? "") };
      const names = Object.keys(node.children);
      if (!names.length) return { lines: [line(s("(empty)", "dim"))] };
      const segs: Seg[] = [];
      names.forEach((k, i) => {
        const child = node.children[k];
        segs.push(s(child.type === "dir" ? k + "/" : k, child.type === "dir" ? "dir" : "fg"));
        if (i < names.length - 1) segs.push(s("   "));
      });
      return { lines: [segs] };
    },
    cd: (a) => {
      const target = a[0];
      const segs = this.resolve(target);
      const node = this.nodeAt(segs);
      if (!node) return { lines: [line(s("cd: ", "red"), s((target ?? "") + ": no such file or directory"))] };
      if (node.type !== "dir") return { lines: [line(s("cd: ", "red"), s((target ?? "") + ": not a directory"))] };
      this.cwd = segs;
      return { lines: [] };
    },
    cat: (a) => ({ lines: this.cat(a) }),
    tree: () => {
      const out: Line[] = [line(s("~", "dir"))];
      const walk = (node: FSNode, prefix: string) => {
        if (node.type !== "dir") return;
        const keys = Object.keys(node.children);
        keys.forEach((k, i) => {
          const last = i === keys.length - 1;
          const child = node.children[k];
          out.push(line(s(prefix + (last ? "└── " : "├── "), "dim"),
            s(child.type === "dir" ? k + "/" : k, child.type === "dir" ? "dir" : "fg")));
          if (child.type === "dir") walk(child, prefix + (last ? "    " : "│   "));
        });
      };
      walk(this.fs, "");
      return { lines: out };
    },
  };

  // ── post-laksh slash commands (Claude-style) ──
  private slashCommands: Record<string, () => RunResult> = {
    help: () => ({
      lines: [
        line(s("slash commands:", "dim")),
        line(s("  /about", "orange"), s("         who i am, the short version")),
        line(s("  /projects", "orange"), s("      things i've built")),
        line(s("  /experience", "orange"), s("    where i've worked")),
        line(s("  /publications", "orange"), s("  papers")),
        line(s("  /awards", "orange"), s("        competitions and recognition")),
        line(s("  /stack", "orange"), s("         what i build with")),
        line(s("  /contact", "orange"), s("       how to reach me")),
        line(s("  /resume", "orange"), s("        download link")),
        line(s("  /socials", "orange"), s("       github · x · linkedin")),
        line(s("  /clear", "orange"), s("         wipe scrollback")),
        line(s("  /exit", "orange"), s("          back to plain shell")),
        line(s("or just type a question — i'll answer.", "dim")),
      ],
    }),
    about: () => ({ lines: [...profile.about.map((l) => [s(l)] as Line)] }),
    stack: () => ({
      lines: [
        line(s("lang      ", "dim"), s(profile.stack.lang.join(", "))),
        line(s("backend   ", "dim"), s(profile.stack.backend.join(", "))),
        line(s("frontend  ", "dim"), s(profile.stack.frontend.join(", "))),
        line(s("ai        ", "dim"), s(profile.stack.ai.join(", "))),
        line(s("tools     ", "dim"), s(profile.stack.tools.join(", "))),
      ],
    }),
    contact: () => ({
      lines: [
        line(s("email     ", "dim"), s(profile.email, "blue")),
        line(s("calendar  ", "dim"), s(profile.calendar, "blue")),
        line(s("github    ", "dim"), s(profile.socials.github, "blue")),
        line(s("x         ", "dim"), s(profile.socials.x, "blue")),
        line(s("linkedin  ", "dim"), s(profile.socials.linkedin, "blue")),
        line(s("i read everything — replies within 24h.", "dim")),
      ],
    }),
    socials: () => ({
      lines: [
        line(s("github    "), s(profile.socials.github, "blue")),
        line(s("x         "), s(profile.socials.x, "blue")),
        line(s("linkedin  "), s(profile.socials.linkedin, "blue")),
        line(s("site      "), s(profile.socials.site, "blue")),
      ],
    }),
    resume: () => ({
      lines: [line(s("download: "), s("https://" + profile.socials.site + "/cv.pdf", "blue"), s("  (placeholder)", "dim"))],
    }),
    projects: () => {
      const out: Line[] = [];
      const w = Math.max(...profile.projects.map((p) => p.name.length)) + 2;
      for (const p of profile.projects)
        out.push(line(s("  • "), s(p.name.padEnd(w), "dir"), s("// " + p.blurb, "dim")));
      out.push([s(" ")]);
      out.push(line(s("select one for the full card — type its name", "dim"), s(" (e.g. ", "dim"), s(profile.projects[0].id, "orange"), s(")", "dim")));
      return { lines: out };
    },
    experience: () => ({ lines: [], experience: true }),
    publications: () => {
      const out: Line[] = [];
      profile.publications.forEach((p) => {
        out.push(line(s("• "), s(p.title, "fg")));
        out.push(line(s("  " + p.authors, "dim")));
        out.push(line(s("  " + p.venue, "blue")));
        out.push(line(s("  " + p.role, "dim")));
      });
      return { lines: out };
    },
    awards: () => {
      const out: Line[] = [];
      profile.awards.forEach((a) => {
        const tail = a.note ? line(s(a.year + "  ", "dim"), s(a.title), s("  " + a.note, "dim"))
                            : line(s(a.year + "  ", "dim"), s(a.title));
        out.push(tail);
      });
      return { lines: out };
    },
    clear: () => ({ lines: [], clear: true }),
    exit: () => {
      this.laksh = false;
      return { lines: [line(s("← back to shell. type `laksh` to re-enter.", "dim"))] };
    },
  };

  private cat(args: string[]): Line[] {
    if (!args.length) return [line(s("cat: ", "red"), s("usage: cat <file>"))];
    const out: Line[] = [];
    for (const t of args) {
      const node = this.nodeAt(this.resolve(t));
      if (!node) { out.push(line(s("cat: ", "red"), s(t + ": no such file or directory"))); continue; }
      if (node.type === "dir") { out.push(line(s("cat: ", "red"), s(t + ": is a directory"))); continue; }
      out.push(...node.content.split("\n").map((l) => [s(l)]));
    }
    return out;
  }

  run(input: string): RunResult {
    const trimmed = input.trim();
    if (!trimmed) return { lines: [] };

    if (this.laksh) {
      // In laksh mode: slash commands or natural-language only. OS commands are gone.
      if (trimmed.startsWith("/")) {
        const [raw, ...rest] = trimmed.slice(1).split(/\s+/);
        const fn = this.slashCommands[raw];
        // Allow /projects <name> → render the rich card
        if (raw === "projects" && rest.length) {
          const p = findProject(rest.join(" "));
          if (p) return { lines: [], project: p.id };
        }
        if (fn) return fn();
        return {
          lines: [
            line(s("unknown command: ", "red"), s("/" + raw)),
            line(s("try ", "dim"), s("/help", "orange"), s(" for the list.", "dim")),
          ],
        };
      }
      // bare project name (e.g. "forge") → show its card
      const proj = findProject(trimmed);
      if (proj) return { lines: [], project: proj.id };

      // OS-command guard so people see *why* it doesn't work
      const guard = /^(ls|cd|pwd|cat|tree|whoami|echo|date|rm|mv|cp|grep|vim|sudo)\b/;
      if (guard.test(trimmed)) {
        return {
          lines: [
            line(s("shell commands are off in laksh mode.", "dim")),
            line(s("ask me a question, or try ", "dim"), s("/help", "orange"), s(".", "dim")),
          ],
        };
      }
      return { lines: answer(trimmed) };
    }

    const [raw, ...args] = trimmed.split(/\s+/);
    const aliases: Record<string, string> = { "?": "help", man: "help", h: "help", ll: "ls", la: "ls", dir: "ls" };
    const cmd = aliases[raw] ?? raw;
    const fn = this.osCommands[cmd];
    if (fn) return fn(args);
    return { lines: [line(s("zsh: ", "red"), s("command not found: " + raw + " "), s("— try ", "dim"), s("laksh", "orange"))] };
  }
}

// Match a project by id or display name, case-insensitively.
function findProject(q: string) {
  const t = q.trim().toLowerCase();
  return profile.projects.find((p) => p.id === t || p.name.toLowerCase() === t);
}

function common(prefix: string, names: string[]): string | null {
  const matches = names.filter((x) => x.startsWith(prefix));
  if (!matches.length) return null;
  if (matches.length === 1) return matches[0];
  let cp = matches[0];
  for (const m of matches) { let i = 0; while (i < cp.length && i < m.length && cp[i] === m[i]) i++; cp = cp.slice(0, i); }
  return cp.length > prefix.length ? cp : prefix;
}

// ── natural-language answers (laksh mode) ─────────────────────
function answer(q: string): Line[] {
  const t = q.toLowerCase();
  const reply = (lines: string[]): Line[] => lines.map((l) => [s(l)]);

  if (/(silicon ?data|gpu|bench|asplos|gpgpu|paper|silicon)/.test(t))
    return reply([
      "At Silicon Data I built SiliconMark — a self-scaling GPU benchmark that ramps",
      "workloads in geometric steps to find hardware limits with no manual tuning.",
      "Validated across 1,000+ runs at <2% variance. We co-authored a paper from it:",
      "'Did You Win the GPU Cloud Lottery?' — accepted at GPGPU 2026 @ ASPLOS.",
      "Run /publications for the full citation.",
    ]);
  if (/(otcr|consult|club|president|executive|partner)/.test(t))
    return reply([
      "Co-President (Executive Partner) at OTCR Consulting.",
      "Manage a 50-member consultancy and sourced 11 engagements across strategy,",
      "operations, and technology for Fortune 500 and growth-stage clients.",
      "Drove 10x revenue growth by rebuilding staffing, SOW, and quality controls.",
    ]);
  if (/(research|ncsa|kindratenko|green context|partition|prefill|decode|roofline|inference)/.test(t))
    return reply([
      "At UIUC NCSA I'm building an analytical model for the goodput-optimal",
      "prefill/decode SM-partition split for single-GPU LLM inference, using",
      "NVIDIA Green Contexts (CUDA 12.4+). The goal is a closed-form predictor",
      "from roofline quantities that transfers across GPU generations — no re-fitting.",
    ]);
  if (/(iypt|olympiad|physics|india|tournament)/.test(t))
    return reply([
      "Captained India's national team at IYPT 2022 — 1 of 5 selected.",
      "Selected again in 2024. Mentored IYPT India 2024 and IYNT 2026.",
      "IYPT is a research-based physics olympiad across 30+ countries, built",
      "around experimental problem-solving and scientific debate.",
    ]);
  if (/(work|building|right now|current|now)/.test(t))
    return reply([
      `Right now: ${profile.role}.`,
      "Building GPU benchmarking + automation infra at Silicon Data, GPU-partition",
      "research at NCSA, and side projects like crAIwl and forge.",
      "Run /projects for the rundown.",
    ]);
  if (/(fpga|verilog|spartan|digit|cnn|hardware|chiptune)/.test(t))
    return reply([
      "The FPGA CNN Digit Classifier runs handwritten-digit recognition entirely",
      "in hardware on a Spartan-7, written in SystemVerilog — no CPU in the loop.",
      "USB mouse interface for drawing input, plus a chiptune audio engine.",
      "Type `fpga-cnn` for the card.",
    ]);
  if (/(forge|prompt|swift|menu ?bar|hotkey)/.test(t))
    return reply([
      "Forge is a macOS menu-bar app that rewrites any selected prompt into a",
      "technique-rich version on a single hotkey. Local rules engine in ~50ms",
      "with no network call; optional Claude pass swaps in asynchronously.",
      "Type `forge` for the card · github.com/lakshh-sharma/Forge",
    ]);
  if (/(crawl|crawler|craiwl|scrape|extract|selector)/i.test(t))
    return reply([
      "crAIwl is an LLM-as-compiler crawler: the model generates CSS/XPath",
      "extraction programs once per site, then they run deterministically at",
      "~50ms/page and self-heal when selectors break. TS, Node 20, Postgres,",
      "Redis, BullMQ, Playwright. Type `craiwl` for the card.",
    ]);
  if (/(project|portfolio|made|built|side)/.test(t))
    return [
      [s("Here's what I'm building:")],
      ...profile.projects.map((p) => line(s("  • "), s(p.name, "dir"), s(" — " + p.blurb, "dim"))),
      [s("Type a name (e.g. "), s(profile.projects[0].id, "orange"), s(") for the full card.", "dim")],
    ];
  if (/(stack|tech|language|tool|framework)/.test(t))
    return reply([
      "Languages: " + profile.stack.lang.join(", "),
      "Backend: " + profile.stack.backend.join(", "),
      "Frontend: " + profile.stack.frontend.join(", "),
      "AI: " + profile.stack.ai.join(", "),
      "Run /stack for the full readout.",
    ]);
  if (/(contact|reach|email|touch|hire|talk)/.test(t))
    return [
      [s("Easiest: "), s(profile.email, "blue"), s(" or "), s(profile.calendar, "blue")],
      [s("Also on "), s(profile.socials.github, "blue"), s(" and "), s(profile.socials.x, "blue")],
    ];
  if (/(looking|next|want|seeking|opportunit|role|join)/.test(t))
    return reply([
      "I'm drawn to small teams shipping real products with fast feedback loops —",
      "especially anything where benchmarks, latency, and good tooling matter.",
      "If that's you: /contact.",
    ]);
  if (/(experience|work history|intern|job|prior|background|hist)/.test(t))
    return reply([
      `${profile.role}. Co-President of OTCR Consulting at UIUC.`,
      "Previously captained India's national IYPT team in 2022.",
      "Run /experience for the rundown.",
    ]);
  if (/(fun|hobby|else|about you|yourself|who)/.test(t))
    return reply([
      profile.name + " — " + profile.role + ", " + profile.school + ".",
      "Off-keyboard: physics olympiads, late-night walks, ramen.",
      "Run /about for the long version.",
    ]);
  return [
    [s("I can talk about my "), s("work", "blue"), s(", "), s("projects", "blue"), s(", "), s("stack", "blue"),
      s(", or how to "), s("contact", "blue"), s(" me.")],
    [s("Or run a slash command — try "), s("/help", "orange"), s(".", "dim")],
  ];
}
