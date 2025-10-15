import React, { createContext, useContext, ReactNode } from "react";
import { createState } from "./state";

type StoreContextType = ReturnType<typeof createState>;

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = (): StoreContextType => {
	const ctx = useContext(StoreContext);
	if (ctx == null) throw new Error("useStore must be used in StoreProvider");

	return ctx;
};

export function StoreProvider({ children }: { children: ReactNode }) {
	const stateValue = createState();

	return (
		<StoreContext.Provider value={stateValue}>{children}</StoreContext.Provider>
	);
}
