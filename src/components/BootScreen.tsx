import { useEffect, useState } from "react";

interface Props { onDone: () => void; }

export function BootScreen({ onDone }: Props) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const start = performance.now();
    const total = 2600;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setFading(true);
        setTimeout(onDone, 520);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className={"boot-screen" + (fading ? " fading" : "")}>
      <svg className="boot-apple" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.6 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.8 0-3.4 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.5.9 1.3 1.9 2.7 3.2 2.7 1.3 0 1.8-.8 3.3-.8 1.5 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.2-2.6 1-1.5 1.4-2.9 1.4-3-.1 0-2.6-1-2.6-4.3zM15.1 4.9C15.8 4 16.3 2.8 16.2 1.6c-1 .1-2.3.7-3 1.5-.7.7-1.3 1.9-1.1 3.1 1.1.1 2.3-.6 3-1.3z" />
      </svg>
      <div className="boot-bar"><div className="boot-bar-fill" style={{ width: `${progress * 100}%` }} /></div>
    </div>
  );
}
