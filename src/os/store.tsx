import {
  createContext, useContext, useReducer, useCallback, useMemo, type ReactNode,
} from "react";
import type { AppId, OSState, Rect, Settings, Theme, WallpaperId, WindowState } from "./types";

const DEFAULT_SIZE: Record<AppId, { w: number; h: number }> = {
  terminal: { w: 880, h: 580 },
  notes: { w: 760, h: 520 },
  settings: { w: 720, h: 520 },
  viewer: { w: 620, h: 480 },
  finder: { w: 700, h: 460 },
};

type Action =
  | { type: "OPEN"; appId: AppId; title: string; props?: Record<string, unknown>; single?: boolean }
  | { type: "CLOSE"; id: string }
  | { type: "FOCUS"; id: string }
  | { type: "MINIMIZE"; id: string }
  | { type: "TOGGLE_MAX"; id: string; viewport: { w: number; h: number } }
  | { type: "MOVE"; id: string; x: number; y: number }
  | { type: "RESIZE"; id: string; rect: Rect }
  | { type: "SET_WALLPAPER"; wallpaper: WallpaperId }
  | { type: "SET_THEME"; theme: Theme };

const initial: OSState = {
  windows: [],
  nextZ: 1,
  seq: 1,
  settings: { wallpaper: "sequoia", theme: "dark" },
};

function reducer(state: OSState, a: Action): OSState {
  switch (a.type) {
    case "OPEN": {
      if (a.single) {
        const existing = state.windows.find((w) => w.appId === a.appId);
        if (existing) {
          return {
            ...state,
            nextZ: state.nextZ + 1,
            windows: state.windows.map((w) =>
              w.id === existing.id ? { ...w, z: state.nextZ + 1, minimized: false } : w
            ),
          };
        }
      }
      const size = DEFAULT_SIZE[a.appId];
      const n = state.windows.length;
      const id = `${a.appId}-${state.seq}`;
      const win: WindowState = {
        id, appId: a.appId, title: a.title,
        x: 120 + ((n * 32) % 260), y: 70 + ((n * 28) % 180),
        w: size.w, h: size.h, z: state.nextZ + 1,
        minimized: false, maximized: false, props: a.props,
      };
      return { ...state, windows: [...state.windows, win], nextZ: state.nextZ + 1, seq: state.seq + 1 };
    }
    case "CLOSE":
      return { ...state, windows: state.windows.filter((w) => w.id !== a.id) };
    case "FOCUS":
      return {
        ...state, nextZ: state.nextZ + 1,
        windows: state.windows.map((w) => (w.id === a.id ? { ...w, z: state.nextZ + 1, minimized: false } : w)),
      };
    case "MINIMIZE":
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, minimized: true } : w)) };
    case "TOGGLE_MAX":
      return {
        ...state, nextZ: state.nextZ + 1,
        windows: state.windows.map((w) => {
          if (w.id !== a.id) return w;
          if (w.maximized && w.prevRect) {
            return { ...w, ...w.prevRect, maximized: false, prevRect: undefined, z: state.nextZ + 1 };
          }
          return {
            ...w, maximized: true, z: state.nextZ + 1,
            prevRect: { x: w.x, y: w.y, w: w.w, h: w.h },
            x: 0, y: 28, w: a.viewport.w, h: a.viewport.h - 28,
          };
        }),
      };
    case "MOVE":
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, x: a.x, y: a.y } : w)) };
    case "RESIZE":
      return { ...state, windows: state.windows.map((w) => (w.id === a.id ? { ...w, ...a.rect } : w)) };
    case "SET_WALLPAPER":
      return { ...state, settings: { ...state.settings, wallpaper: a.wallpaper } };
    case "SET_THEME":
      return { ...state, settings: { ...state.settings, theme: a.theme } };
    default:
      return state;
  }
}

interface OSContextValue {
  state: OSState;
  open: (appId: AppId, title: string, props?: Record<string, unknown>, single?: boolean) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMax: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  resize: (id: string, rect: Rect) => void;
  setWallpaper: (w: WallpaperId) => void;
  setTheme: (t: Theme) => void;
  settings: Settings;
}

const OSContext = createContext<OSContextValue | null>(null);

export function OSProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const open = useCallback(
    (appId: AppId, title: string, props?: Record<string, unknown>, single?: boolean) =>
      dispatch({ type: "OPEN", appId, title, props, single }), []);
  const close = useCallback((id: string) => dispatch({ type: "CLOSE", id }), []);
  const focus = useCallback((id: string) => dispatch({ type: "FOCUS", id }), []);
  const minimize = useCallback((id: string) => dispatch({ type: "MINIMIZE", id }), []);
  const toggleMax = useCallback(
    (id: string) => dispatch({ type: "TOGGLE_MAX", id, viewport: { w: window.innerWidth, h: window.innerHeight } }), []);
  const move = useCallback((id: string, x: number, y: number) => dispatch({ type: "MOVE", id, x, y }), []);
  const resize = useCallback((id: string, rect: Rect) => dispatch({ type: "RESIZE", id, rect }), []);
  const setWallpaper = useCallback((w: WallpaperId) => dispatch({ type: "SET_WALLPAPER", wallpaper: w }), []);
  const setTheme = useCallback((t: Theme) => dispatch({ type: "SET_THEME", theme: t }), []);

  const value = useMemo<OSContextValue>(
    () => ({ state, open, close, focus, minimize, toggleMax, move, resize, setWallpaper, setTheme, settings: state.settings }),
    [state, open, close, focus, minimize, toggleMax, move, resize, setWallpaper, setTheme]
  );
  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
}

export function useOS() {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error("useOS must be used within OSProvider");
  return ctx;
}
