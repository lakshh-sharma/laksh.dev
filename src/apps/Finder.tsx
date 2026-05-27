import { useOS } from "../os/store";
import { folderById } from "../data/desktop";

interface Props { folder?: string; }

function FileGlyph({ kind }: { kind: "md" | "txt" }) {
  return (
    <svg viewBox="0 0 40 48" width="42" height="50">
      <path d="M6 2 H26 L34 10 V46 H6 Z" fill="#f4f1ea" stroke="#cdc8bd" strokeWidth="1" />
      <path d="M26 2 V10 H34 Z" fill="#d8d3c8" />
      <text x="20" y="34" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#8a857c">
        {kind}
      </text>
    </svg>
  );
}

export default function Finder({ folder }: Props) {
  const { open } = useOS();
  const f = folder ? folderById(folder) : undefined;
  if (!f) return <div className="viewer"><div className="doc">Folder not found.</div></div>;

  return (
    <div className="viewer">
      <div className="doc" style={{ paddingTop: 22 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18 }}>
          {f.files.map((file) => (
            <div
              key={file.id}
              style={{ width: 96, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "default", padding: 8, borderRadius: 8 }}
              onDoubleClick={() => open("viewer", file.name, { title: file.name, body: file.body })}
              onMouseDown={(e) => { if (e.detail === 1) (e.currentTarget.style.background = "rgba(120,140,200,0.18)"); }}
              title="double-click to open"
            >
              <FileGlyph kind={file.kind} />
              <span style={{ fontSize: 12, color: "#e6e2da", textAlign: "center", wordBreak: "break-word" }}>{file.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
