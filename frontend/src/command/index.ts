import { keySymbolMap } from "@/utils/constants/key-symbol-map";
import {
	editorCommandPalette,
	editorSidebarToggle,
	editorSettings,
	editorNotespaceFind,
	editorNotespaceFileNew,
	editorNotespaceFileOpen,
	editorNotespaceFileBookmark,
} from "./commands";

export const commands = {
	editorCommandPalette,
	editorSidebarToggle,
	editorSettings,
	editorNotespaceFind,
	editorNotespaceFileNew,
	editorNotespaceFileOpen,
	editorNotespaceFileBookmark,
};

export const commandList = Object.values(commands);

export const getCommandFromEvent = (e: KeyboardEvent) => {
	let keys: Array<string> = [];

	if (e.altKey) keys.push("Alt");
	if (e.ctrlKey) keys.push("Control");
	if (e.metaKey) keys.push("Meta");
	if (e.shiftKey) keys.push("Shift");
	if (e.key && e.key.length > 0) {
		if (e.key in keySymbolMap) keys.push(e.key);
		else keys.push(e.key.charAt(0).toUpperCase() + e.key.slice(1));
	}

	const keyCombination = keys.toSorted().join();

	const command = commandList.find(
		(cmd) => cmd.keyCombination === keyCombination,
	);

	return command;
};

export const getCommandFromId = (id: string) =>
	commandList.find((cmd) => cmd.id === id);
