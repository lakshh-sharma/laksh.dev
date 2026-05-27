import { useState } from "react";
import { useOS } from "../os/store";
import { FOLDERS } from "../data/desktop";

function FolderGlyph() {
  return (
    <svg viewBox="0 0 56 46">
      <defs>
        <linearGradient id="folderBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fa3df" />
          <stop offset="1" stopColor="#3a7ec0" />
        </linearGradient>
        <linearGradient id="folderFront" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ed0f6" />
          <stop offset="1" stopColor="#5d9ed8" />
        </linearGradient>
      </defs>
      <path d="M3 9 a3 3 0 0 1 3-3 H19 l5 5 H50 a3 3 0 0 1 3 3 V40 a3 3 0 0 1 -3 3 H6 a3 3 0 0 1 -3 -3 Z" fill="url(#folderBack)" />
      <path d="M3 15 H53 V40 a3 3 0 0 1 -3 3 H6 a3 3 0 0 1 -3 -3 Z" fill="url(#folderFront)" />
      <path d="M3 15 H53 V19 H3 Z" fill="#fff" opacity="0.22" />
    </svg>
  );
}

export function DesktopIcons() {
  const { open } = useOS();
  const [sel, setSel] = useState<string | null>(null);

  return (
    <div className="desktop-icons" onMouseDown={(e) => e.stopPropagation()}>
      {FOLDERS.map((f) => (
        <div
          key={f.id}
          className={"desk-icon" + (sel === f.id ? " sel" : "")}
          onMouseDown={() => setSel(f.id)}
          onDoubleClick={() => open("finder", f.name, { folder: f.id })}
          title="double-click to open"
        >
          <FolderGlyph />
          <span className="lbl">{f.name}</span>
        </div>
      ))}
    </div>
  );
}
