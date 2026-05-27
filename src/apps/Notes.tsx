import { useState } from "react";
import { profile } from "../data/profile";

interface Note { id: string; title: string; date: string; body: string; }

const NOTES: Note[] = [
  {
    id: "now",
    title: "/now",
    date: "May 2026",
    body:
      `What I'm focused on this month:\n\n` +
      `• ${profile.projects[0].name} — ${profile.projects[0].detail}\n` +
      `• Tightening the eval harness for tool-use agents (got a 14% lift last sprint).\n` +
      `• Writing more: a piece on latency budgets in LLM pipelines.\n\n` +
      `Reachable at ${profile.email}.`,
  },
  {
    id: "reading",
    title: "Reading list",
    date: "ongoing",
    body:
      `Books & papers in rotation:\n\n` +
      `• Designing Data-Intensive Applications — Kleppmann\n` +
      `• The Tail at Scale — Dean & Barroso\n` +
      `• A Philosophy of Software Design — Ousterhout\n` +
      `• Anything on retrieval + long-context evaluation.`,
  },
  {
    id: "principles",
    title: "Engineering principles",
    date: "pinned",
    body:
      `How I like to build:\n\n` +
      `1. Make it correct, then make it fast — but budget latency from day one.\n` +
      `2. Tools should get out of the user's way.\n` +
      `3. Small PRs, fast feedback, ship daily.\n` +
      `4. Logs and evals over vibes.\n` +
      `5. Delete more than you add.`,
  },
  {
    id: "uses",
    title: "/uses",
    date: "updated May 2026",
    body:
      `Daily drivers:\n\n` +
      `• Editor: Neovim (lazy.nvim)\n` +
      `• Terminal: Ghostty + tmux + zsh\n` +
      `• Languages: ${profile.stack.lang.join(", ")}\n` +
      `• Infra: ${profile.stack.infra.join(", ")}\n` +
      `• Launcher: Raycast`,
  },
];

export default function Notes() {
  const [active, setActive] = useState(NOTES[0].id);
  const note = NOTES.find((n) => n.id === active)!;
  return (
    <div className="notes">
      <div className="notes-side">
        <div className="grp">Laksh</div>
        {NOTES.map((n) => (
          <div
            key={n.id}
            className={"note-item" + (n.id === active ? " active" : "")}
            onMouseDown={() => setActive(n.id)}
          >
            <div className="t">{n.title}</div>
            <div className="s">{n.body.split("\n")[0]}</div>
          </div>
        ))}
      </div>
      <div className="notes-main">
        <h1>{note.title}</h1>
        <div className="meta">{note.date}</div>
        {note.body.split("\n\n").map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </div>
  );
}
