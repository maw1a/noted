import type { Config, Node } from "@go/noted";

export type State = {
  loading: boolean;

  sidebar: boolean;
  sidebar_tab: "files" | "grep" | "saved" | "plugins";

  dialog:
    | "cmd-palette"
    | "search-notespace"
    | "settings"
    | "settings-notespace"
    | null;

  root: string;
  config: Config | null;
  notespaces: Array<{ path: string; config: Config }>;

  rootNode: Node | null;
  tabs: Array<string>;
  active_tab: { path: string; content: string; defaultContent: string } | null;

  bookmarks: Array<string>;
};

export type SetState = {
  (partial: Partial<State>): void;
  <K extends keyof State>(key: K, value: State[K]): void;
};
