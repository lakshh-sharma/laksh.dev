import { profile } from "./profile";

export interface DeskFile { id: string; name: string; kind: "md" | "txt"; body: string; }
export interface DeskFolder { id: string; name: string; files: DeskFile[]; }

export const FOLDERS: DeskFolder[] = [
  {
    id: "about-me",
    name: "About Me",
    files: [
      {
        id: "readme",
        name: "README.md",
        kind: "md",
        body:
          `# ${profile.name}\n\n${profile.role} · ${profile.school}\n\n` +
          profile.about.join(" ") +
          `\n\nReach me: ${profile.email}`,
      },
      {
        id: "resume",
        name: "resume.txt",
        kind: "txt",
        body:
          `${profile.name}\n${profile.role} — ${profile.school}\n\n` +
          `EXPERIENCE\n  • ${profile.experience[0].role} @ ${profile.experience[0].org} (${profile.experience[0].period})\n  • ${profile.experience[1].role} — ${profile.experience[1].org}\n\n` +
          `SKILLS\n  ${profile.stack.lang.join(", ")}\n  ${profile.stack.backend.join(", ")}\n  ${profile.stack.frontend.join(", ")}\n\n` +
          `LINKS\n  ${profile.socials.github} · ${profile.socials.site}`,
      },
    ],
  },
  {
    id: "projects",
    name: "Projects",
    files: profile.projects.map((p) => ({
      id: p.name,
      name: `${p.name}.md`,
      kind: "md" as const,
      body: p.readme,
    })),
  },
  {
    id: "documents",
    name: "Documents",
    files: [
      {
        id: "todo",
        name: "todo.txt",
        kind: "txt",
        body: `[ ] ship stealth-mode v0.4\n[ ] write latency-budgets post\n[x] open-source retrycat\n[ ] reply to recruiter emails\n[ ] book climbing gym`,
      },
      {
        id: "ideas",
        name: "ideas.md",
        kind: "md",
        body: `# Half-baked ideas\n\n- local-first eval dashboard\n- a tiny tracing lib that's actually pleasant\n- ghostty theme generator\n- this very website (done!)`,
      },
    ],
  },
];

export function folderById(id: string) { return FOLDERS.find((f) => f.id === id); }
