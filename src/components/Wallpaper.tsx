import { useOS } from "../os/store";
import type { Theme, WallpaperId } from "../os/types";
import wallpaperPhoto from "../assets/wallpaper.jpg";

export const WALLPAPERS: Record<WallpaperId, { name: string }> = {
  photo: { name: "Photo" },
  sequoia: { name: "Sequoia" },
  graphite: { name: "Graphite" },
  sunset: { name: "Sunset" },
  abyss: { name: "Abyss" },
};

// Layered radial gradients tuned to feel like Sonoma / Sequoia macOS wallpapers.
export function wallpaperCss(id: WallpaperId, theme: Theme): string {
  const dark = theme === "dark";
  switch (id) {
    case "photo":
      return `center / cover no-repeat url(${wallpaperPhoto})`;
    case "sequoia":
      return dark
        ? `radial-gradient(60% 50% at 20% 95%, rgba(196,108,196,0.55), transparent 60%),
           radial-gradient(75% 60% at 85% 100%, rgba(110,72,200,0.55), transparent 60%),
           radial-gradient(50% 45% at 80% 5%, rgba(255,120,160,0.30), transparent 60%),
           radial-gradient(55% 50% at 10% -5%, rgba(70,130,230,0.40), transparent 60%),
           linear-gradient(165deg, #0a0a1f 0%, #1b1240 35%, #3a1660 65%, #6a1d68 95%)`
        : `radial-gradient(120% 90% at 50% 115%, rgba(160,140,255,0.45), transparent 55%),
           radial-gradient(90% 70% at 12% -5%, rgba(120,180,255,0.5), transparent 55%),
           linear-gradient(160deg, #cfe0ff 0%, #d7c8ff 50%, #f0d0e0 100%)`;
    case "graphite":
      return `radial-gradient(100% 80% at 50% 0%, rgba(120,120,135,0.25), transparent 60%),
              radial-gradient(70% 60% at 80% 100%, rgba(60,70,90,0.40), transparent 60%),
              linear-gradient(170deg, #1a1c20 0%, #25282e 55%, #303338 100%)`;
    case "sunset":
      return `radial-gradient(70% 60% at 20% 100%, rgba(255,170,90,0.55), transparent 60%),
              radial-gradient(80% 60% at 90% 0%, rgba(255,80,120,0.45), transparent 55%),
              radial-gradient(60% 50% at 50% 50%, rgba(220,110,80,0.30), transparent 60%),
              linear-gradient(165deg, #2a1530 0%, #5a2440 40%, #a04340 75%, #d27a3e 100%)`;
    case "abyss":
      return `radial-gradient(90% 70% at 50% 110%, rgba(40,120,160,0.30), transparent 55%),
              radial-gradient(60% 50% at 15% 20%, rgba(70,130,200,0.18), transparent 60%),
              linear-gradient(180deg, #050a14 0%, #0a1828 55%, #0f2436 100%)`;
  }
}

export function Wallpaper() {
  const { settings } = useOS();
  return (
    <div className="wallpaper-stack">
      <div className="wallpaper" style={{ background: wallpaperCss(settings.wallpaper, settings.theme) }} />
      <div className="wallpaper-grain" />
    </div>
  );
}
