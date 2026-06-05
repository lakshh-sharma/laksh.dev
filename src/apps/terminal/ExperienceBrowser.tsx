import { profile } from "../../data/profile";
import { EXPERIENCE_ICONS } from "../../data/experienceIcons";

// Experience UI rendered in laksh mode by `/experience`. Two levels:
//   list   — logo + company + position, no descriptions (↑↓ to move, ↵ to open)
//   detail — one experience: square picture on the left, bullets on the right
// Selection + open state live in Terminal so the keyboard (handled at the input)
// can drive them; clicking works too.
export function ExperienceBrowser({
  index,
  open,
  onIndex,
  onOpen,
  onClose,
}: {
  index: number;
  open: boolean;
  onIndex: (i: number) => void;
  onOpen: () => void;
  onClose: () => void;
}) {
  const exps = profile.experience;
  const n = exps.length;
  const i = ((index % n) + n) % n;
  const exp = exps[i];

  if (!open) {
    return (
      <div className="exp-browser" style={{ "--accent": exp.accent } as React.CSSProperties}>
        <div className="exp-list">
          {exps.map((e, k) => {
            const logo = EXPERIENCE_ICONS[e.id];
            return (
              <button
                key={e.id}
                className={"exp-row" + (k === i ? " on" : "")}
                style={{ "--accent": e.accent } as React.CSSProperties}
                onMouseDown={(ev) => { ev.preventDefault(); onIndex(k); onOpen(); }}
              >
                <span className="exp-logo-sm">
                  {logo ? <img src={logo} alt={e.org} draggable={false} /> : <span className="exp-glyph-sm">{e.glyph}</span>}
                </span>
                <span className="exp-row-text">
                  <span className="exp-row-org">{e.org}</span>
                  <span className="exp-row-role">{e.role}</span>
                </span>
                <span className="exp-row-go">›</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const logo = EXPERIENCE_ICONS[exp.id];
  return (
    <div className="exp-page" style={{ "--accent": exp.accent } as React.CSSProperties}>
      <button className="exp-back" onMouseDown={(ev) => { ev.preventDefault(); onClose(); }}>
        ‹ all experience
      </button>

      <div className="exp-page-body">
        <div className="exp-photo">
          {logo ? <img src={logo} alt={exp.org} draggable={false} /> : <span className="exp-glyph">{exp.glyph}</span>}
        </div>

        <div className="exp-desc">
          <div className="exp-desc-org">{exp.org}</div>
          <div className="exp-desc-role">{exp.role}</div>
          <div className="exp-desc-period">{exp.period}</div>
          <ul className="exp-bullets">
            {exp.bullets.map((b, k) => <li key={k}>{b}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
