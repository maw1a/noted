import { useState, useCallback } from "react";
import { State } from "./types";

export function createState() {
	const [state, setStateInternal] = useState<State>({
		loading: false,
		sidebar: true,
		dialog: null,
		root: "",
		config: null,
		notespaces: [],
	});

	const setState = useCallback((partial: Partial<State>): void => {
		setStateInternal((prevState) => ({ ...prevState, ...partial }));
	}, []);

	const setStateByKey = useCallback(
		<K extends keyof State>(key: K, value: State[K]): void => {
			setStateInternal((prevState) => ({ ...prevState, [key]: value }));
		},
		[],
	);

	function setStateCombined(partial: Partial<State>): void;
	function setStateCombined<K extends keyof State>(
		key: K,
		value: State[K],
	): void;
	function setStateCombined<K extends keyof State>(
		arg0: Partial<State> | K,
		arg1?: State[K],
	) {
		if (typeof arg1 === "undefined") {
			const partial = arg0 as Partial<State>;
			setState(partial);
		} else {
			const key = arg0 as K;
			setStateByKey(key, arg1);
		}
	}

	return [state, setStateCombined] as [State, typeof setStateCombined];
}
