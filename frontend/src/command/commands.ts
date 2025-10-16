import { State } from "../components/store/types";
import { disableWhenDialog } from "./helpers";
import { ICommand } from "./types";

class Command implements ICommand {
	public label: string;
	public id: string;
	public shortcut: Array<string>;
	public handler: (state: State) => State;
	public isAvailable: boolean = true;
	public isVisible: boolean = true;

	constructor({
		id,
		label,
		shortcut,
		handler,
		isAvailable,
		isVisible,
	}: ICommand) {
		this.id = id;
		this.label = label;
		this.shortcut = shortcut;
		this.handler = handler;
		if (typeof isAvailable !== "undefined") this.isAvailable = isAvailable;
		if (typeof isVisible !== "undefined") this.isVisible = isVisible;
	}

	get keyCombination() {
		return this.shortcut.toSorted().join();
	}
}

export const editorCommandPalette = new Command({
	id: "editor.command.palette",
	label: "Command Palette",
	shortcut: ["Meta", "Shift", "P"],
	handler: (state) => ({
		...state,
		dialog: state.dialog === "cmd-palette" ? null : "cmd-palette",
	}),
	isVisible: false,
});

export const editorSidebarToggle = new Command({
	id: "editor.sidebar.toggle",
	label: "Toggle Sidebar",
	shortcut: ["Meta", "B"],
	handler: (state) =>
		disableWhenDialog(state, { ...state, sidebar: !state.sidebar }),
});

export const editorNotespaceFind = new Command({
	id: "editor.notespace.find",
	label: "Search Notespace",
	shortcut: ["Meta", "Shift", "F"],
	handler: (state) =>
		disableWhenDialog(state, { ...state, sidebar_tab: "grep" }),
});

export const editorNotespaceBookmark = new Command({
	id: "editor.notespace.bookmark",
	label: "Bookmark Note",
	shortcut: ["Meta", "D"],
	handler: (state) => {
		if (!state.active_tab) return state;
		const bmrks = new Set([...state.bookmarks]);
		if (bmrks.has(state.active_tab)) bmrks.delete(state.active_tab);
		else bmrks.add(state.active_tab);
		return disableWhenDialog(state, {
			...state,
			bookmarks: Array.from(bmrks),
		});
	},
});
