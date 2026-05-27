import type { ComponentType } from "react";
import type { AppId } from "./types";
import Terminal from "../apps/Terminal";
import Notes from "../apps/Notes";
import Settings from "../apps/Settings";
import Finder from "../apps/Finder";
import FileViewer from "../apps/FileViewer";

export interface AppMeta {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  titlebarClass?: string;
  star?: boolean;
}

export const APPS: Record<AppId, AppMeta> = {
  terminal: { component: Terminal, titlebarClass: "app-terminal", star: true },
  notes: { component: Notes, titlebarClass: "app-notes" },
  settings: { component: Settings, titlebarClass: "app-settings" },
  finder: { component: Finder },
  viewer: { component: FileViewer },
};
