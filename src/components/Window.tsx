import { useRef } from "react";
import { useOS } from "../os/store";
import { APPS } from "../os/appRegistry";
import type { WindowState } from "../os/types";

const MIN_W = 380;
const MIN_H = 240;
const TOP_INSET = 28;   // menubar
const BOTTOM_INSET = 8; // little air above the dock
const DIRS = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
type Dir = (typeof DIRS)[number];

// Clamp so the window fully stays within the visible desktop area.
function clamp(x: number, y: number, w: number, h: number) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const maxW = Math.max(MIN_W, vw);
  const maxH = Math.max(MIN_H, vh - TOP_INSET - BOTTOM_INSET);
  const cw = Math.min(w, maxW);
  const ch = Math.min(h, maxH);
  const cx = Math.max(0, Math.min(x, vw - cw));
  const cy = Math.max(TOP_INSET, Math.min(y, vh - BOTTOM_INSET - ch));
  return { x: cx, y: cy, w: cw, h: ch };
}

export function Window({ win, active }: { win: WindowState; active: boolean }) {
  const { focus, close, minimize, toggleMax, move, resize } = useOS();
  const ref = useRef<HTMLDivElement>(null);
  const meta = APPS[win.appId];
  const App = meta.component;

  function startDrag(e: React.PointerEvent) {
    if (win.maximized) return;
    e.preventDefault();
    focus(win.id);
    const el = ref.current!;
    const startX = e.clientX, startY = e.clientY;
    const origX = win.x, origY = win.y;
    const onMove = (ev: PointerEvent) => {
      const c = clamp(origX + (ev.clientX - startX), origY + (ev.clientY - startY), win.w, win.h);
      el.style.left = c.x + "px";
      el.style.top = c.y + "px";
    };
    const onUp = (ev: PointerEvent) => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      const c = clamp(origX + (ev.clientX - startX), origY + (ev.clientY - startY), win.w, win.h);
      move(win.id, c.x, c.y);
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }

  function startResize(e: React.PointerEvent, dir: Dir) {
    e.preventDefault();
    e.stopPropagation();
    focus(win.id);
    const el = ref.current!;
    const sx = e.clientX, sy = e.clientY;
    const o = { x: win.x, y: win.y, w: win.w, h: win.h };
    const compute = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      let { x, y, w, h } = o;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      if (dir.includes("e")) w = Math.max(MIN_W, Math.min(o.w + dx, vw - o.x));
      if (dir.includes("s")) h = Math.max(MIN_H, Math.min(o.h + dy, vh - BOTTOM_INSET - o.y));
      if (dir.includes("w")) {
        w = Math.max(MIN_W, Math.min(o.w - dx, o.x + o.w));
        x = Math.max(0, o.x + (o.w - w));
      }
      if (dir.includes("n")) {
        h = Math.max(MIN_H, Math.min(o.h - dy, o.y + o.h - TOP_INSET));
        y = Math.max(TOP_INSET, o.y + (o.h - h));
      }
      return { x, y, w, h };
    };
    const onMove = (ev: PointerEvent) => {
      const { x, y, w, h } = compute(ev);
      el.style.left = x + "px"; el.style.top = y + "px";
      el.style.width = w + "px"; el.style.height = h + "px";
    };
    const onUp = (ev: PointerEvent) => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      resize(win.id, compute(ev));
    };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  }

  if (win.minimized) return null;

  return (
    <div
      ref={ref}
      className={"window" + (active ? "" : " inactive")}
      style={{ left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }}
      onPointerDown={() => focus(win.id)}
    >
      <div
        className={"titlebar " + (meta.titlebarClass ?? "")}
        onPointerDown={startDrag}
        onDoubleClick={() => toggleMax(win.id)}
      >
        <div className="lights" onPointerDown={(e) => e.stopPropagation()}>
          <span className="light red" onClick={() => close(win.id)}>
            <svg viewBox="0 0 8 8"><path d="M1 1 L7 7 M7 1 L1 7" stroke="#5a0000" strokeWidth="1.3" /></svg>
          </span>
          <span className="light yellow" onClick={() => minimize(win.id)}>
            <svg viewBox="0 0 8 8"><path d="M1 4 H7" stroke="#5a3a00" strokeWidth="1.3" /></svg>
          </span>
          <span className="light green" onClick={() => toggleMax(win.id)}>
            <svg viewBox="0 0 8 8"><path d="M2 2 H6 V6 H2 Z" stroke="#004a00" strokeWidth="1.1" fill="none" /></svg>
          </span>
        </div>
        <div className="win-title">
          {meta.star && <span className="star">✶</span>}
          {win.title}
        </div>
      </div>

      <div className="window-body">
        <App {...(win.props ?? {})} />
      </div>

      {!win.maximized &&
        DIRS.map((d) => (
          <div key={d} className={"rz rz-" + d} onPointerDown={(e) => startResize(e, d)} />
        ))}
    </div>
  );
}
