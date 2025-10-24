import type { State } from "@/components/store/types";

export const disableWhenDialog = (p: State, n: State) => {
	if (p.dialog || isInvalidDialogStateTransition(p, n)) return p;
	return n;
};

const isInvalidDialogStateTransition = (prv: State, nxt: State) => {
	const isInvalid =
		typeof prv.dialog === "string" &&
		typeof nxt.dialog === "string" &&
		prv.dialog !== nxt.dialog;
	return isInvalid;
};
