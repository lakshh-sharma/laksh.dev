import { useOS } from "../os/store";
import { Wallpaper } from "./Wallpaper";
import { MenuBar } from "./MenuBar";
import { Dock } from "./Dock";
import { DesktopIcons } from "./DesktopIcons";
import { Window } from "./Window";

export function Desktop() {
  const { state } = useOS();
  const visible = state.windows.filter((w) => !w.minimized);
  const topZ = visible.reduce((m, w) => Math.max(m, w.z), 0);

  return (
    <div className="os-root">
      <Wallpaper />
      <DesktopIcons />
      {state.windows.map((w) => (
        <Window key={w.id} win={w} active={w.z === topZ && !w.minimized} />
      ))}
      <MenuBar />
      <Dock />
    </div>
  );
}
