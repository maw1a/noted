import React, { createContext, useContext, ReactNode } from "react";
import { useStoreState } from "./state";
import { State } from "./types";

const initialState: State = {
	loading: false,

	sidebar: true,
	sidebar_tab: "files",

	dialog: null,

	root: "",
	config: null,
	notespaces: [],

	tabs: [],
	active_tab: null,

	bookmarks: [],
};

type StoreContextType = ReturnType<typeof useStoreState>;

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = (): StoreContextType => {
	const ctx = useContext(StoreContext);
	if (ctx == null) throw new Error("useStore must be used in StoreProvider");

	return ctx;
};

export function StoreProvider({ children }: { children: ReactNode }) {
	const stateValue = useStoreState(initialState);

	return (
		<StoreContext.Provider value={stateValue}>{children}</StoreContext.Provider>
	);
}
