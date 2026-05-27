export type AppId = "terminal" | "notes" | "settings" | "viewer" | "finder";

export interface Rect { x: number; y: number; w: number; h: number; }

export interface WindowState extends Rect {
  id: string;
  appId: AppId;
  title: string;
  z: number;
  minimized: boolean;
  maximized: boolean;
  prevRect?: Rect;
  props?: Record<string, unknown>;
}

export type WallpaperId = "sequoia" | "graphite" | "sunset" | "abyss";
export type Theme = "dark" | "light";

export interface Settings {
  wallpaper: WallpaperId;
  theme: Theme;
}

export interface OSState {
  windows: WindowState[];
  nextZ: number;
  seq: number;
  settings: Settings;
}
