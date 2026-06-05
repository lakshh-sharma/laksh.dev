import { useEffect, useRef, useState } from "react";
import { Shell, type Line } from "./terminal/shell";
import { ClaudeBoot } from "./terminal/ClaudeBoot";
import { ProjectCard } from "./terminal/ProjectCard";
import { ExperienceBrowser } from "./terminal/ExperienceBrowser";
import { profile } from "../data/profile";

type Item =
  | { kind: "prompt"; dir: string; cmd: string; mode: "shell" | "laksh" }
  | { kind: "out"; lines: Line[] }
  | { kind: "project"; id: string }
  | { kind: "experience" }
  | { kind: "boot" };

interface Tab {
  id: number;
  label: string;
  shell: Shell;
  items: Item[];
  input: string;
  booted: boolean;
  bootRunning: boolean;
  history: string[];
  histIdx: number;
  draft: string;
  expIndex: number;
  expOpen: boolean;
}

const HOST = "lakshsharma@Lakshs-MacBook-Pro";

const SLASH_CMDS: { name: string; hint: string }[] = [
  { name: "/about", hint: "who i am" },
  { name: "/projects", hint: "what i've built" },
  { name: "/experience", hint: "where i've worked" },
  { name: "/publications", hint: "papers" },
  { name: "/awards", hint: "competitions" },
  { name: "/stack", hint: "what i build with" },
  { name: "/contact", hint: "reach me" },
  { name: "/resume", hint: "download link" },
  { name: "/socials", hint: "github · x · linkedin" },
  { name: "/help", hint: "all commands" },
  { name: "/clear", hint: "wipe scrollback" },
  { name: "/exit", hint: "back to shell" },
];

function LineView({ line }: { line: Line }) {
  return (
    <div className="term-line">
      {line.length === 0 ? " " : line.map((seg, i) => (
        <span key={i} className={seg.c ? `seg-${seg.c}` : undefined}>{seg.t}</span>
      ))}
    </div>
  );
}

function newTab(id: number): Tab {
  return {
    id, label: "Terminal", shell: new Shell(), items: [], input: "",
    booted: false, bootRunning: false, history: [], histIdx: -1, draft: "", expIndex: 0, expOpen: false,
  };
}

export default function Terminal() {
  const [tabs, setTabs] = useState<Tab[]>(() => [newTab(1)]);
  const [activeId, setActiveId] = useState<number>(1);
  const nextId = useRef(2);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const active = tabs.find((t) => t.id === activeId)!;

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active.items, active.input, activeId]);

  function updateActive(patch: Partial<Tab> | ((t: Tab) => Partial<Tab>)) {
    setTabs((prev) =>
      prev.map((t) => (t.id === activeId ? { ...t, ...(typeof patch === "function" ? patch(t) : patch) } : t))
    );
  }

  function addTab() {
    const id = nextId.current++;
    setTabs((prev) => [...prev, newTab(id)]);
    setActiveId(id);
  }

  function closeTab(id: number) {
    setTabs((prev) => {
      const next = prev.filter((t) => t.id !== id);
      if (next.length === 0) {
        const t = newTab(nextId.current++);
        setActiveId(t.id);
        return [t];
      }
      if (id === activeId) setActiveId(next[next.length - 1].id);
      return next;
    });
  }

  function pushOut(lines: Line[]) {
    updateActive((t) => ({ items: [...t.items, { kind: "out" as const, lines }] }));
  }

  function bootSequence() {
    updateActive({ bootRunning: true });
    const steps: Line[] = [
      [{ t: "↑ booting laksh — high effort", c: "dim" }],
      [{ t: "● ", c: "green" }, { t: "loading profile", c: "dim" }, { t: " (about, projects, stack)", c: "blue" }],
      [{ t: "● ", c: "green" }, { t: "mounting filesystem", c: "dim" }, { t: " ~/projects", c: "blue" }],
      [{ t: "✶ ", c: "orange" }, { t: "ready.", c: "dim" }],
    ];
    let i = 0;
    const tick = () => {
      if (i < steps.length) {
        pushOut([steps[i]]);
        i++;
        setTimeout(tick, 230);
      } else {
        setTabs((prev) =>
          prev.map((t) => {
            if (t.id !== activeId) return t;
            t.shell.laksh = true;
            return { ...t, items: [...t.items, { kind: "boot" as const }], booted: true, bootRunning: false };
          })
        );
      }
    };
    setTimeout(tick, 180);
  }

  function submit(raw: string) {
    const t = active;
    const cmd = raw;
    const mode: "shell" | "laksh" = t.shell.laksh ? "laksh" : "shell";
    updateActive((prev) => ({
      items: [...prev.items, { kind: "prompt" as const, dir: prev.shell.dirLabel(), cmd, mode }],
    }));
    const trimmed = cmd.trim();
    if (trimmed) {
      updateActive((prev) => ({
        history: [...prev.history, trimmed],
        histIdx: prev.history.length + 1,
      }));
    }

    const res = t.shell.run(cmd);
    if (res.clear) updateActive({ items: [] });
    if (res.boot) { bootSequence(); return; }
    if (res.project) updateActive((prev) => ({ items: [...prev.items, { kind: "project" as const, id: res.project! }] }));
    if (res.experience) updateActive((prev) => ({ items: [...prev.items, { kind: "experience" as const }], expIndex: 0, expOpen: false }));
    if (res.lines.length) pushOut(res.lines);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const t = active;

    // When the experience picker is the latest output and nothing is typed,
    // the keyboard drives it instead of the command line.
    const lastItem = t.items[t.items.length - 1];
    const expLive = lastItem?.kind === "experience" && t.input.trim() === "";
    if (expLive) {
      const n = profile.experience.length;
      if (!t.expOpen && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        const delta = e.key === "ArrowUp" ? -1 : 1;
        updateActive({ expIndex: (((t.expIndex + delta) % n) + n) % n });
        return;
      }
      if (!t.expOpen && e.key === "Enter") {
        e.preventDefault();
        updateActive({ expOpen: true });
        return;
      }
      if (t.expOpen && (e.key === "Escape" || e.key === "ArrowLeft" || e.key === "Backspace")) {
        e.preventDefault();
        updateActive({ expOpen: false });
        return;
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const v = t.input;
      updateActive({ input: "" });
      submit(v);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const c = t.shell.complete(t.input.replace(/^\s+/, ""));
      if (c) updateActive({ input: c });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!t.history.length) return;
      const newIdx = Math.max(0, t.histIdx - 1);
      const draft = t.histIdx === t.history.length ? t.input : t.draft;
      updateActive({ histIdx: newIdx, input: t.history[newIdx] ?? "", draft });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (t.histIdx >= t.history.length) return;
      const newIdx = t.histIdx + 1;
      updateActive({
        histIdx: newIdx,
        input: newIdx === t.history.length ? t.draft : t.history[newIdx] ?? "",
      });
    } else if ((e.key === "l" || e.key === "L") && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      updateActive({ items: [] });
    } else if (e.key === "t" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      addTab();
    } else if (e.key === "w" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      closeTab(activeId);
    }
  }

  const placeholder = active.booted
    ? 'Ask me anything — or type "/" for commands'
    : 'Type "laksh" to boot my profile · or "help"';

  const lastItem = active.items[active.items.length - 1];
  const expLive = lastItem?.kind === "experience" && active.input.trim() === "";
  const slashOpen = active.booted && active.input.startsWith("/");
  const slashMatches = slashOpen
    ? SLASH_CMDS.filter((c) => c.name.startsWith(active.input.split(/\s+/)[0]))
    : [];

  return (
    <div className="term" onMouseDown={() => inputRef.current?.focus()}>
      <div className="term-tabbar">
        {tabs.map((t, i) => (
          <div
            key={t.id}
            className={"term-tab" + (t.id === activeId ? " active" : "")}
            onMouseDown={(e) => { e.stopPropagation(); setActiveId(t.id); }}
          >
            <span className="star">✶</span>
            <span className="tab-label">{t.label}</span>
            <span className="kbd">⌘{i + 1}</span>
            <button
              className="tab-x"
              onMouseDown={(e) => { e.stopPropagation(); closeTab(t.id); }}
              aria-label="close tab"
            >×</button>
          </div>
        ))}
        <button
          className="term-tab plus"
          onMouseDown={(e) => { e.stopPropagation(); addTab(); }}
          aria-label="new tab"
        >+</button>
      </div>
      <div className="term-body" ref={bodyRef}>
        {!active.booted && (
          <>
            <div className="term-line seg-dim">Last login: {loginStamp()} on ttys00{active.id}</div>
            <div className="term-line"><span className="seg-dim">welcome — this terminal is interactive.</span></div>
            <div className="term-line">&nbsp;</div>
            <div className="term-cta">
              <div className="term-cta-row">
                <span className="term-cta-arrow">▶</span>
                <span className="term-cta-text">
                  type <span className="term-cta-key">laksh</span> to boot my profile
                </span>
              </div>
              <div className="term-cta-sub">or <span className="seg-orange">help</span> for shell commands</div>
            </div>
            <div className="term-line">&nbsp;</div>
          </>
        )}

        {active.items.map((it, idx) => {
          if (it.kind === "prompt")
            return (
              <div className="term-line term-prompt" key={idx}>
                {it.mode === "laksh" ? (
                  <span className="laksh-prompt"><span className="orange">›</span></span>
                ) : (
                  <>
                    <span className="u">{HOST}</span> <span className="d">{it.dir}</span><span className="p">%</span>
                  </>
                )}
                <span>{it.cmd}</span>
              </div>
            );
          if (it.kind === "boot") return <ClaudeBoot key={idx} />;
          if (it.kind === "project") {
            const p = profile.projects.find((x) => x.id === it.id);
            return p ? <ProjectCard key={idx} project={p} /> : null;
          }
          if (it.kind === "experience")
            return (
              <ExperienceBrowser
                key={idx}
                index={active.expIndex}
                open={active.expOpen}
                onIndex={(n) => updateActive({ expIndex: n })}
                onOpen={() => updateActive({ expOpen: true })}
                onClose={() => updateActive({ expOpen: false })}
              />
            );
          return <div key={idx}>{it.lines.map((l, i) => <LineView key={i} line={l} />)}</div>;
        })}
      </div>

      <div className={"term-input-wrap" + (active.booted ? " laksh" : "")}>
        {slashOpen && slashMatches.length > 0 && (
          <div className="term-slash-palette">
            {slashMatches.slice(0, 6).map((c) => (
              <div
                key={c.name}
                className={"slash-row" + (active.input === c.name ? " on" : "")}
                onMouseDown={(e) => { e.preventDefault(); updateActive({ input: c.name }); inputRef.current?.focus(); }}
              >
                <span className="slash-name">{c.name}</span>
                <span className="slash-hint">{c.hint}</span>
              </div>
            ))}
          </div>
        )}
        <div className="term-input-box">
          <span className="term-input-chev">{active.booted ? "›" : "❯"}</span>
          <input
            ref={inputRef}
            className="term-input"
            value={active.input}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            autoFocus
            disabled={active.bootRunning}
            onChange={(e) => updateActive({ input: e.target.value })}
            onKeyDown={onKeyDown}
          />
        </div>
        <div className="term-input-footer">
          <span className="hint-left">
            {expLive ? (active.expOpen ? <>
              <span className="seg-orange">esc</span> <span>to go back</span>
            </> : <>
              <span className="seg-orange">↑ ↓</span> <span>to navigate</span>
              <span className="sep">·</span>
              <span className="seg-orange">↵</span> <span>to open</span>
            </>) : active.booted ? <>
              <span className="dim">?</span> <span>for shortcuts</span>
              <span className="sep">·</span>
              <span className="dim">/</span> <span>for commands</span>
            </> : <>
              type <span className="seg-orange">laksh</span> to begin · <span className="seg-orange">help</span> for shell
            </>}
          </span>
          <span className="hint-right">
            <span className="dot" /> <span>{active.booted ? "laksh mode" : "shell"}</span>
            <span className="sep">·</span>
            <span className="seg-blue">/effort high</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function loginStamp() {
  const d = new Date(Date.now() - 4 * 60 * 1000);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const p = (n: number) => (n < 10 ? "0" + n : "" + n);
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}
