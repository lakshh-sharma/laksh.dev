import { useOS } from "../os/store";
import type { AppId } from "../os/types";

import claudeIcon from "../assets/icons/claude.png";
import slackIcon from "../assets/icons/slack.png";
import chromeIcon from "../assets/icons/chrome.webp";
import settingsIcon from "../assets/icons/settings.webp";
import zoomIcon from "../assets/icons/zoom.svg";

// macOS-style SVG icons. Real PNGs are wired in only where they look good.
const SVG_ICONS: Record<string, JSX.Element> = {
  terminal: (
    <svg viewBox="0 0 64 64">
      <defs>
        <linearGradient id="dkTermBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3633" />
          <stop offset="1" stopColor="#15110e" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="13" fill="url(#dkTermBg)" />
      <rect x="3" y="3" width="58" height="14" rx="13" fill="rgba(255,255,255,0.06)" />
      <rect x="3" y="14" width="58" height="3" fill="rgba(0,0,0,0.4)" />
      <circle cx="11" cy="10" r="1.8" fill="#ff5f57" />
      <circle cx="17.5" cy="10" r="1.8" fill="#febc2e" />
      <circle cx="24" cy="10" r="1.8" fill="#28c840" />
      <path d="M14 28 L24 36 L14 44" stroke="#d8d4ce" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="28" y="42" width="22" height="3" rx="1.5" fill="#d8d4ce" />
      <rect x="3.5" y="3.5" width="57" height="57" rx="12.5" fill="none" stroke="rgba(255,255,255,0.10)" />
    </svg>
  ),
  finder: (
    <svg viewBox="0 0 64 64">
      <defs>
        <linearGradient id="dkFinderBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fc7ff" />
          <stop offset="1" stopColor="#3267d4" />
        </linearGradient>
        <linearGradient id="dkFinderFace" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e9f1ff" />
          <stop offset="1" stopColor="#bcd1f7" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="13" fill="url(#dkFinderBg)" />
      <path d="M32 8 a24 24 0 0 1 0 48 Z" fill="url(#dkFinderFace)" opacity="0.55" />
      <path d="M22 22 q-2 6 0 12" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M42 22 q2 6 0 12" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M22 42 q5 6 10 6 q5 0 10 -6" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="3.5" y="3.5" width="57" height="57" rx="12.5" fill="none" stroke="rgba(255,255,255,0.25)" />
    </svg>
  ),
  notes: (
    <svg viewBox="0 0 64 64">
      <defs>
        <linearGradient id="dkNotesBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff5b3" />
          <stop offset="1" stopColor="#ffd95a" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="13" fill="url(#dkNotesBg)" />
      <rect x="3" y="3" width="58" height="14" rx="13" fill="#f5c542" />
      <rect x="3" y="14" width="58" height="2" fill="rgba(0,0,0,0.10)" />
      <rect x="13" y="26" width="38" height="2.4" rx="1.2" fill="#c89a32" opacity="0.7" />
      <rect x="13" y="33" width="38" height="2.4" rx="1.2" fill="#c89a32" opacity="0.7" />
      <rect x="13" y="40" width="28" height="2.4" rx="1.2" fill="#c89a32" opacity="0.7" />
      <rect x="13" y="47" width="22" height="2.4" rx="1.2" fill="#c89a32" opacity="0.7" />
      <rect x="3.5" y="3.5" width="57" height="57" rx="12.5" fill="none" stroke="rgba(0,0,0,0.10)" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 64 64">
      <defs>
        <linearGradient id="dkSetBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b7bcc5" />
          <stop offset="1" stopColor="#5b626c" />
        </linearGradient>
        <radialGradient id="dkSetGear" cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#f4f4f6" />
          <stop offset="1" stopColor="#d0d2d8" />
        </radialGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="13" fill="url(#dkSetBg)" />
      <g transform="translate(32 32)">
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x="-3" y="-22" width="6" height="9" rx="2"
            fill="url(#dkSetGear)" transform={`rotate(${i * 30})`} />
        ))}
        <circle r="15" fill="url(#dkSetGear)" />
        <circle r="5" fill="#3b3f47" />
      </g>
      <rect x="3.5" y="3.5" width="57" height="57" rx="12.5" fill="none" stroke="rgba(255,255,255,0.15)" />
    </svg>
  ),
  trash: (
    <svg viewBox="0 0 64 64">
      <defs>
        <linearGradient id="dkTrashBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dde0e5" />
          <stop offset="1" stopColor="#a3a8b0" />
        </linearGradient>
      </defs>
      <rect x="3" y="3" width="58" height="58" rx="13" fill="url(#dkTrashBg)" />
      <rect x="20" y="14" width="24" height="3.6" rx="1.6" fill="#5b626c" />
      <rect x="27" y="10" width="10" height="3.6" rx="1.4" fill="#5b626c" />
      <path d="M19 20 H45 L42.5 50 a3 3 0 0 1 -3 2.8 H24.5 a3 3 0 0 1 -3 -2.8 Z" fill="#f3f5f8" stroke="#6b7079" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M27 26 V47" stroke="#9aa0a8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M32 26 V47" stroke="#9aa0a8" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M37 26 V47" stroke="#9aa0a8" strokeWidth="1.6" strokeLinecap="round" />
      <rect x="3.5" y="3.5" width="57" height="57" rx="12.5" fill="none" stroke="rgba(255,255,255,0.25)" />
    </svg>
  ),
};

interface DockItem {
  key: string;
  title: string;
  appId?: AppId;
  props?: Record<string, unknown>;
  decorative?: boolean;
  svg?: JSX.Element;
  img?: string;
  fit?: "tight" | "normal" | "loose" | "app";
}

const ITEMS: DockItem[] = [
  { key: "finder", title: "Finder", svg: SVG_ICONS.finder, appId: "finder", props: { folder: "about-me" } },
  { key: "terminal", title: "Terminal — laksh", svg: SVG_ICONS.terminal, appId: "terminal" },
  { key: "claude", title: "Claude", img: claudeIcon, decorative: true, fit: "tight" },
  { key: "chrome", title: "Chrome", img: chromeIcon, decorative: true, fit: "app" },
  { key: "notes", title: "Notes", svg: SVG_ICONS.notes, appId: "notes" },
  { key: "slack", title: "Slack", img: slackIcon, decorative: true },
  { key: "zoom", title: "Zoom", img: zoomIcon, decorative: true, fit: "app" },
  { key: "settings", title: "System Settings", img: settingsIcon, appId: "settings", fit: "app" },
];

export function Dock() {
  const { state, open, focus } = useOS();
  const isOpen = (id: AppId) => state.windows.some((w) => w.appId === id);

  return (
    <div className="dock-wrap">
      <div className="dock">
        {ITEMS.map((it) => {
          const open_ = !it.decorative && it.appId ? isOpen(it.appId) : false;
          return (
            <div
              key={it.key}
              className={"dock-item" + (it.decorative ? " decorative" : "")}
              onMouseDown={() => {
                if (it.decorative || !it.appId) return;
                const existing = state.windows.find((w) => w.appId === it.appId);
                if (existing && it.appId !== "finder") focus(existing.id);
                else open(it.appId, it.title, it.props, it.appId !== "finder");
              }}
            >
              {it.img ? (
                <span className={"icon-clip " + (it.fit ?? "normal")}>
                  <img src={it.img} alt={it.title} draggable={false} />
                </span>
              ) : it.svg}
              <span className="dock-tip">{it.title.replace(" — laksh", "")}</span>
              {open_ && <span className="run-dot" />}
            </div>
          );
        })}
        <div className="dock-sep" />
        <div className="dock-item">
          {SVG_ICONS.trash}
          <span className="dock-tip">Trash</span>
        </div>
      </div>
    </div>
  );
}
