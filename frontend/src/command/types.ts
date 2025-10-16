import { State } from "../components/store/types";

export interface ICommand {
	label: string;
	id: string;
	shortcut: Array<string>;
	handler: (state: State) => State;
	isAvailable?: boolean;
	isVisible?: boolean;
}
