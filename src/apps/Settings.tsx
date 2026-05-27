import { useState } from "react";
import { useOS } from "../os/store";
import type { WallpaperId } from "../os/types";
import { profile } from "../data/profile";
import { WALLPAPERS, wallpaperCss } from "../components/Wallpaper";

const PANES = [
  { id: "wallpaper", label: "Wallpaper", icon: "🖼", color: "#3a86ff" },
  { id: "appearance", label: "Appearance", icon: "◐", color: "#8a8a8a" },
  { id: "about", label: "About This Mac", icon: "", color: "#5b8def" },
] as const;
type PaneId = (typeof PANES)[number]["id"];

export default function Settings() {
  const { settings, setWallpaper, setTheme } = useOS();
  const [pane, setPane] = useState<PaneId>("wallpaper");

  return (
    <div className="settings">
      <div className="settings-side">
        {PANES.map((p) => (
          <div
            key={p.id}
            className={"set-row" + (pane === p.id ? " active" : "")}
            onMouseDown={() => setPane(p.id)}
          >
            <span className="dot" style={{ background: p.color }}>{p.icon}</span>
            {p.label}
          </div>
        ))}
      </div>
      <div className="settings-main">
        {pane === "wallpaper" && (
          <>
            <h2>Wallpaper</h2>
            <div className="set-card">
              <h3>Desktop picture</h3>
              <div className="wp-grid">
                {(Object.keys(WALLPAPERS) as WallpaperId[]).map((id) => (
                  <div
                    key={id}
                    className={"wp-swatch" + (settings.wallpaper === id ? " sel" : "")}
                    style={{ background: wallpaperCss(id, settings.theme) }}
                    title={WALLPAPERS[id].name}
                    onMouseDown={() => setWallpaper(id)}
                  />
                ))}
              </div>
            </div>
          </>
        )}
        {pane === "appearance" && (
          <>
            <h2>Appearance</h2>
            <div className="set-card">
              <h3>Theme</h3>
              <div className="seg-toggle">
                <button className={settings.theme === "dark" ? "on" : ""} onMouseDown={() => setTheme("dark")}>Dark</button>
                <button className={settings.theme === "light" ? "on" : ""} onMouseDown={() => setTheme("light")}>Light</button>
              </div>
            </div>
          </>
        )}
        {pane === "about" && (
          <>
            <h2>About This Mac</h2>
            <div className="set-card">
              <h3>Overview</h3>
              <div className="kv"><span className="k">User</span><span className="v">{profile.name}</span></div>
              <div className="kv"><span className="k">Role</span><span className="v">{profile.role}</span></div>
              <div className="kv"><span className="k">Education</span><span className="v">{profile.school}</span></div>
              <div className="kv"><span className="k">Location</span><span className="v">{profile.location}</span></div>
              <div className="kv"><span className="k">Email</span><span className="v">{profile.email}</span></div>
              <div className="kv"><span className="k">Machine</span><span className="v">Lakshs-MacBook-Pro</span></div>
              <div className="kv"><span className="k">OS</span><span className="v">lakshOS 1.0 (Sukuna)</span></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
