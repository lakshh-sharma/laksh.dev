import { useEffect, useRef, useState } from "react";
import { Desktop } from "./components/Desktop";
import { BootScreen } from "./components/BootScreen";
import { useOS } from "./os/store";

const BOOT_KEY = "laksh-booted-session";

export default function App() {
  const { open, state } = useOS();
  const started = useRef(false);
  const [phase, setPhase] = useState<"boot" | "desktop">(
    () => (sessionStorage.getItem(BOOT_KEY) ? "desktop" : "boot")
  );

  useEffect(() => {
    if (phase !== "desktop" || started.current) return;
    started.current = true;
    if (state.windows.length === 0) open("terminal", "Terminal — laksh", undefined, true);
  }, [phase, open, state.windows.length]);

  if (phase === "boot") {
    return (
      <BootScreen
        onDone={() => {
          sessionStorage.setItem(BOOT_KEY, "1");
          setPhase("desktop");
        }}
      />
    );
  }
  return <Desktop />;
}
