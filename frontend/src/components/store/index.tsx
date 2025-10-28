import { createContext, useContext, ReactNode, useMemo } from "react";
import { useStoreState } from "./state";
import type { State, StoreContextType } from "./types";
import {
  getServices,
  type FileService,
  type NotespaceService,
} from "@/services";

const initialState: State = {
  loading: false,

  sidebar: true,
  sidebar_tab: "files",

  dialog: null,

  root: "",
  config: null,
  notespaces: [],

  rootNode: null,
  tabs: [],
  active_tab: null,

  bookmarks: [],
};

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = (): StoreContextType => {
  const ctx = useContext(StoreContext);
  if (ctx == null) throw new Error("useStore must be used in StoreProvider");

  return ctx;
};

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useStoreState(initialState);
  const services = useMemo(
    () =>
      getServices(state.root) as {
        notespace: NotespaceService;
        files: FileService;
      },
    [state.root],
  );

  return (
    <StoreContext.Provider value={{ state, setState, services }}>
      {children}
    </StoreContext.Provider>
  );
}
