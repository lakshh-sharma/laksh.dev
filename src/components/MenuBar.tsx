import { useEffect, useState } from "react";
import { useOS } from "../os/store";
import type { AppId } from "../os/types";

const APP_NAME: Record<AppId, string> = {
  terminal: "Terminal", notes: "Notes", settings: "System Settings", finder: "Finder", viewer: "Preview",
};

function fmtClock(d: Date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let h = d.getHours(); const m = d.getMinutes(); const ap = h >= 12 ? "PM" : "AM";
  h = h % 12; if (h === 0) h = 12;
  const p = (n: number) => (n < 10 ? "0" + n : "" + n);
  return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}  ${h}:${p(m)} ${ap}`;
}

export function MenuBar() {
  const { state, settings } = useOS();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);

  const visible = state.windows.filter((w) => !w.minimized);
  const top = visible.sort((a, b) => b.z - a.z)[0];
  const appName = top ? APP_NAME[top.appId] : "Finder";

  return (
    <div className={"menubar" + (settings.theme === "light" ? " light" : "")}>
      <div className="mb-left">
        <svg className="apple" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.6 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.8 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.2 2.7 1.3 0 1.8-.8 3.3-.8 1.5 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.6-1-2.6-4.3zM15.1 4.9C15.8 4 16.3 2.8 16.2 1.6c-1 .1-2.3.7-3 1.5-.7.7-1.3 1.9-1.1 3.1 1.1.1 2.3-.6 3-1.3z" />
        </svg>
        <span className="mb-item bold">{appName}</span>
        <span className="mb-item">File</span>
        <span className="mb-item">Edit</span>
        <span className="mb-item">View</span>
        <span className="mb-item">Window</span>
        <span className="mb-item">Help</span>
      </div>
      <div className="mb-right">
        <span className="ic ic-battery" title="Battery 92%">
          <svg width="30" height="13" viewBox="0 0 30 13" fill="none">
            <rect x="0.6" y="0.6" width="25" height="11.8" rx="2.6" stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.1" />
            <rect x="26.6" y="4.3" width="2" height="4.4" rx="0.9" fill="currentColor" opacity="0.85" />
            <rect x="2.2" y="2.2" width="20.4" height="8.6" rx="1.4" fill="currentColor" opacity="0.92" />
          </svg>
        </span>
        <span className="ic ic-wifi" title="Wi-Fi">
          <svg width="18" height="13" viewBox="0 0 18 13" fill="currentColor">
            <path opacity="0.55" d="M9 1.6c3.05 0 5.85 1.08 8.04 2.88a.5.5 0 0 0 .67-.04l.93-.95a.5.5 0 0 0-.03-.74C16 .35 12.6-.9 9-.9S2 .35-.6 2.75a.5.5 0 0 0-.04.74l.93.95a.5.5 0 0 0 .67.04A12.5 12.5 0 0 1 9 1.6z" />
            <path opacity="0.78" d="M9 5.1a8.5 8.5 0 0 1 5.65 2.14.5.5 0 0 0 .67-.02l.94-.94a.5.5 0 0 0-.02-.74A11 11 0 0 0 9 2.7a11 11 0 0 0-7.24 2.84.5.5 0 0 0-.02.74l.94.94a.5.5 0 0 0 .67.02A8.5 8.5 0 0 1 9 5.1z" />
            <path d="M9 8.5a4.7 4.7 0 0 1 3.22 1.27.5.5 0 0 0 .67-.01l.95-.95a.5.5 0 0 0-.01-.73A7.2 7.2 0 0 0 9 6.1a7.2 7.2 0 0 0-4.83 1.98.5.5 0 0 0-.01.73l.95.95a.5.5 0 0 0 .67.01A4.7 4.7 0 0 1 9 8.5z" />
            <circle cx="9" cy="11.4" r="1.25" />
          </svg>
        </span>
        <span className="ic ic-search" title="Spotlight">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="6" cy="6" r="4.2" />
            <path d="M9.2 9.2 l3.4 3.4" strokeLinecap="round" />
          </svg>
        </span>
        <span className="ic ic-cc" title="Control Center">
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
            <path d="M2 3 H14" />
            <path d="M2 7 H14" />
            <path d="M2 11 H14" />
            <circle cx="5" cy="3" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="11" cy="7" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="6.5" cy="11" r="1.4" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <span className="clock">{fmtClock(now)}</span>
      </div>
    </div>
  );
}
