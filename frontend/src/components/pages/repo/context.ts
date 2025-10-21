import { createContext, Dispatch, SetStateAction, useContext } from "react";

export type Action = "new" | "clone" | "open";

export const RepoContext = createContext<
	[Action | null, Dispatch<SetStateAction<Action | null>>]
>(null!);

export const useRepoContext = () => useContext(RepoContext);
